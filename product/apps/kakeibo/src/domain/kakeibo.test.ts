import { describe, expect, it } from "vitest";
import { createKakeiboLedger } from "./kakeibo.js";

describe("口座・カテゴリ（D1–D3）", () => {
  it("名称付き口座を登録できる", () => {
    const ledger = createKakeiboLedger();
    const result = ledger.addAccount(" 現金 ");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe("現金");
    }
  });

  it("空（前後空白のみ）の口座名は拒否する", () => {
    const ledger = createKakeiboLedger();
    const result = ledger.addAccount("   ");
    expect(result).toEqual({ ok: false, error: "NAME_REQUIRED" });
  });

  it("名称と向き付きカテゴリを登録できる", () => {
    const ledger = createKakeiboLedger();
    const result = ledger.addCategory("食費", "expense");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toMatchObject({ name: "食費", direction: "expense" });
    }
  });

  it("空のカテゴリ名は拒否する", () => {
    const ledger = createKakeiboLedger();
    const result = ledger.addCategory("  ", "income");
    expect(result).toEqual({ ok: false, error: "NAME_REQUIRED" });
  });
});

describe("取引ライフサイクル（D4–D6）", () => {
  function seeded() {
    const ledger = createKakeiboLedger();
    const account = ledger.addAccount("銀行");
    const expense = ledger.addCategory("食費", "expense");
    const income = ledger.addCategory("給与", "income");
    if (!account.ok || !expense.ok || !income.ok) {
      throw new Error("seed failed");
    }
    return {
      ledger,
      accountId: account.value.id,
      expenseId: expense.value.id,
      incomeId: income.value.id,
    };
  }

  it("必須属性で下書き登録できる", () => {
    const { ledger, accountId, expenseId } = seeded();
    const result = ledger.addDraftTransaction({
      kind: "expense",
      amount: 1200,
      occurredOn: "2026-08-10",
      accountId,
      categoryId: expenseId,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.status).toBe("draft");
      expect(result.value.amount).toBe(1200);
    }
  });

  it("正でない金額・未登録口座・向き不一致は拒否する", () => {
    const { ledger, accountId, expenseId, incomeId } = seeded();
    expect(
      ledger.addDraftTransaction({
        kind: "expense",
        amount: 0,
        occurredOn: "2026-08-10",
        accountId,
        categoryId: expenseId,
      }),
    ).toEqual({ ok: false, error: "AMOUNT_INVALID" });

    expect(
      ledger.addDraftTransaction({
        kind: "expense",
        amount: 100,
        occurredOn: "2026-08-10",
        accountId: "missing",
        categoryId: expenseId,
      }),
    ).toEqual({ ok: false, error: "ACCOUNT_NOT_FOUND" });

    expect(
      ledger.addDraftTransaction({
        kind: "expense",
        amount: 100,
        occurredOn: "2026-08-10",
        accountId,
        categoryId: incomeId,
      }),
    ).toEqual({ ok: false, error: "CATEGORY_DIRECTION_MISMATCH" });
  });

  it("下書き→確定、下書き→取消、確定→取消のみ許可する", () => {
    const { ledger, accountId, expenseId } = seeded();
    const draft = ledger.addDraftTransaction({
      kind: "expense",
      amount: 500,
      occurredOn: "2026-08-01",
      accountId,
      categoryId: expenseId,
    });
    if (!draft.ok) throw new Error("draft failed");

    const confirmed = ledger.confirmTransaction(draft.value.id);
    expect(confirmed.ok).toBe(true);
    if (confirmed.ok) expect(confirmed.value.status).toBe("confirmed");

    expect(ledger.confirmTransaction(draft.value.id)).toEqual({
      ok: false,
      error: "INVALID_TRANSITION",
    });

    const cancelled = ledger.cancelTransaction(draft.value.id);
    expect(cancelled.ok).toBe(true);
    if (cancelled.ok) expect(cancelled.value.status).toBe("cancelled");

    expect(ledger.cancelTransaction(draft.value.id)).toEqual({
      ok: false,
      error: "INVALID_TRANSITION",
    });

    const draft2 = ledger.addDraftTransaction({
      kind: "expense",
      amount: 300,
      occurredOn: "2026-08-02",
      accountId,
      categoryId: expenseId,
    });
    if (!draft2.ok) throw new Error("draft2 failed");
    const cancelDraft = ledger.cancelTransaction(draft2.value.id);
    expect(cancelDraft.ok).toBe(true);
    if (cancelDraft.ok) expect(cancelDraft.value.status).toBe("cancelled");
  });

  it("確定のみが消化対象で、下書き・取消・収入は含めない", () => {
    const { ledger, accountId, expenseId, incomeId } = seeded();
    ledger.setMonthlyBudget("2026-08", 10000);

    const confirmedExpense = ledger.addDraftTransaction({
      kind: "expense",
      amount: 2000,
      occurredOn: "2026-08-05",
      accountId,
      categoryId: expenseId,
    });
    const draftExpense = ledger.addDraftTransaction({
      kind: "expense",
      amount: 9000,
      occurredOn: "2026-08-06",
      accountId,
      categoryId: expenseId,
    });
    const cancelledExpense = ledger.addDraftTransaction({
      kind: "expense",
      amount: 8000,
      occurredOn: "2026-08-07",
      accountId,
      categoryId: expenseId,
    });
    const income = ledger.addDraftTransaction({
      kind: "income",
      amount: 50000,
      occurredOn: "2026-08-01",
      accountId,
      categoryId: incomeId,
    });
    if (
      !confirmedExpense.ok ||
      !draftExpense.ok ||
      !cancelledExpense.ok ||
      !income.ok
    ) {
      throw new Error("seed txs failed");
    }
    ledger.confirmTransaction(confirmedExpense.value.id);
    ledger.confirmTransaction(income.value.id);
    ledger.cancelTransaction(cancelledExpense.value.id);

    const digest = ledger.getBudgetDigest("2026-08");
    expect(digest.spent).toBe(2000);
    expect(digest.status).toBe("余裕");
  });
});

describe("月次予算と消化状態（D8–D10）", () => {
  it("正の金額で設定でき、再設定は上書き、不正金額は拒否", () => {
    const ledger = createKakeiboLedger();
    expect(ledger.setMonthlyBudget("2026-08", 10000).ok).toBe(true);
    const overwritten = ledger.setMonthlyBudget("2026-08", 20000);
    expect(overwritten.ok).toBe(true);
    if (overwritten.ok) expect(overwritten.value.amount).toBe(20000);
    expect(ledger.setMonthlyBudget("2026-08", 0)).toEqual({
      ok: false,
      error: "AMOUNT_INVALID",
    });
  });

  it("余裕・逼迫・超過・未設定を閾値どおり返す", () => {
    const ledger = createKakeiboLedger();
    const account = ledger.addAccount("現金");
    const expense = ledger.addCategory("食費", "expense");
    if (!account.ok || !expense.ok) throw new Error("seed failed");

    expect(ledger.getBudgetDigest("2026-08").status).toBe("未設定");

    ledger.setMonthlyBudget("2026-08", 10000);

    const addConfirmed = (amount: number, day: string) => {
      const draft = ledger.addDraftTransaction({
        kind: "expense",
        amount,
        occurredOn: day,
        accountId: account.value.id,
        categoryId: expense.value.id,
      });
      if (!draft.ok) throw new Error("draft failed");
      ledger.confirmTransaction(draft.value.id);
    };

    expect(ledger.getBudgetDigest("2026-08").status).toBe("余裕");

    addConfirmed(7999, "2026-08-01");
    expect(ledger.getBudgetDigest("2026-08").status).toBe("余裕");

    addConfirmed(1, "2026-08-02");
    expect(ledger.getBudgetDigest("2026-08")).toMatchObject({
      status: "逼迫",
      spent: 8000,
    });

    addConfirmed(2000, "2026-08-03");
    expect(ledger.getBudgetDigest("2026-08")).toMatchObject({
      status: "逼迫",
      spent: 10000,
    });

    addConfirmed(1, "2026-08-04");
    expect(ledger.getBudgetDigest("2026-08")).toMatchObject({
      status: "超過",
      spent: 10001,
    });
  });
});
