import { FormEvent, useMemo, useState } from "react";
import {
  createKakeiboLedger,
  type BudgetDigestStatus,
  type CategoryDirection,
  type KakeiboLedger,
  type TransactionKind,
} from "./domain";

type Page = "home" | "accounts" | "categories" | "budget" | "transactions";

function currentYearMonth(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function shiftYearMonth(yearMonth: string, delta: number): string {
  const [y, m] = yearMonth.split("-").map(Number);
  const date = new Date(y, m - 1 + delta, 1);
  return currentYearMonth(date);
}

function formatAmount(n: number): string {
  return new Intl.NumberFormat("ja-JP").format(n);
}

function progressWidth(status: BudgetDigestStatus, spent: number, budget: number | null): number {
  if (status === "未設定" || budget == null || budget <= 0) return 0;
  return Math.min(100, Math.round((spent / budget) * 100));
}

function errorMessage(code: string): string {
  switch (code) {
    case "NAME_REQUIRED":
      return "名称を入力してください（空白のみは不可）";
    case "AMOUNT_INVALID":
      return "金額は正の値である必要があります";
    case "OCCURRED_ON_REQUIRED":
      return "発生日を指定してください";
    case "ACCOUNT_NOT_FOUND":
      return "口座が見つかりません";
    case "CATEGORY_NOT_FOUND":
      return "カテゴリが見つかりません";
    case "CATEGORY_DIRECTION_MISMATCH":
      return "カテゴリの向きが取引の収入／支出と一致しません";
    case "INVALID_TRANSITION":
      return "その状態遷移はできません";
    case "NOT_FOUND":
      return "対象が見つかりません";
    case "YEAR_MONTH_REQUIRED":
      return "対象年月を指定してください";
    default:
      return code;
  }
}

export function App() {
  const [ledger] = useState<KakeiboLedger>(() => createKakeiboLedger());
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((n) => n + 1);

  const [page, setPage] = useState<Page>("home");
  const [yearMonth, setYearMonth] = useState(currentYearMonth);
  const [error, setError] = useState<string | null>(null);

  const [accountName, setAccountName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryDirection, setCategoryDirection] =
    useState<CategoryDirection>("expense");
  const [budgetAmount, setBudgetAmount] = useState("100000");

  const [txKind, setTxKind] = useState<TransactionKind>("expense");
  const [txAmount, setTxAmount] = useState("");
  const [txDate, setTxDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [txAccountId, setTxAccountId] = useState("");
  const [txCategoryId, setTxCategoryId] = useState("");

  void tick;

  const accounts = ledger.listAccounts();
  const categories = ledger.listCategories();
  const transactions = ledger.listTransactions();
  const digest = ledger.getBudgetDigest(yearMonth);
  const budget = ledger.getMonthlyBudget(yearMonth);

  const filteredCategories = useMemo(
    () => categories.filter((c) => c.direction === txKind),
    [categories, txKind],
  );

  const monthTransactions = useMemo(
    () =>
      transactions
        .filter((tx) => tx.occurredOn.startsWith(yearMonth))
        .slice()
        .sort((a, b) => b.occurredOn.localeCompare(a.occurredOn)),
    [transactions, yearMonth],
  );

  function onAddAccount(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const result = ledger.addAccount(accountName);
    if (!result.ok) {
      setError(errorMessage(result.error));
      return;
    }
    setAccountName("");
    refresh();
  }

  function onAddCategory(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const result = ledger.addCategory(categoryName, categoryDirection);
    if (!result.ok) {
      setError(errorMessage(result.error));
      return;
    }
    setCategoryName("");
    refresh();
  }

  function onSetBudget(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const amount = Number(budgetAmount);
    const result = ledger.setMonthlyBudget(yearMonth, amount);
    if (!result.ok) {
      setError(errorMessage(result.error));
      return;
    }
    refresh();
  }

  function onAddDraft(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const result = ledger.addDraftTransaction({
      kind: txKind,
      amount: Number(txAmount),
      occurredOn: txDate,
      accountId: txAccountId,
      categoryId: txCategoryId,
    });
    if (!result.ok) {
      setError(errorMessage(result.error));
      return;
    }
    setTxAmount("");
    refresh();
  }

  function onConfirm(id: string) {
    setError(null);
    const result = ledger.confirmTransaction(id);
    if (!result.ok) setError(errorMessage(result.error));
    refresh();
  }

  function onCancel(id: string) {
    setError(null);
    const result = ledger.cancelTransaction(id);
    if (!result.ok) setError(errorMessage(result.error));
    refresh();
  }

  const accountNameById = Object.fromEntries(accounts.map((a) => [a.id, a.name]));
  const categoryNameById = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const pct = progressWidth(digest.status, digest.spent, digest.budgetAmount);

  return (
    <div className="app">
      <header className="brand">
        <div>
          <h1>個人向け家計簿</h1>
          <p>デモ版 — 記録から月次予算の消化把握まで</p>
        </div>
      </header>

      <nav className="nav" aria-label="主要導線">
        <button
          type="button"
          aria-current={page === "home" ? "page" : undefined}
          onClick={() => setPage("home")}
        >
          月次サマリー
        </button>
        <button
          type="button"
          aria-current={page === "transactions" ? "page" : undefined}
          onClick={() => setPage("transactions")}
        >
          取引
        </button>
        <button
          type="button"
          aria-current={page === "accounts" ? "page" : undefined}
          onClick={() => setPage("accounts")}
        >
          口座
        </button>
        <button
          type="button"
          aria-current={page === "categories" ? "page" : undefined}
          onClick={() => setPage("categories")}
        >
          カテゴリ
        </button>
        <button
          type="button"
          aria-current={page === "budget" ? "page" : undefined}
          onClick={() => setPage("budget")}
        >
          月次予算
        </button>
      </nav>

      <section className="panel" aria-label="対象月">
        <div className="month-bar">
          <button
            type="button"
            aria-label="前月"
            onClick={() => setYearMonth((ym) => shiftYearMonth(ym, -1))}
          >
            ←
          </button>
          <div className="month-label" data-testid="target-month">
            {yearMonth.replace("-", "年")}月
          </div>
          <button
            type="button"
            aria-label="翌月"
            onClick={() => setYearMonth((ym) => shiftYearMonth(ym, 1))}
          >
            →
          </button>
        </div>
      </section>

      {error ? (
        <p className="alert" role="alert">
          {error}
        </p>
      ) : null}

      {(page === "home" || page === "budget") && (
        <section className="panel" aria-label="予算消化状態">
          <h2>予算消化</h2>
          <div className="digest">
            <div className="digest-meta">
              <span
                className="digest-status"
                data-status={digest.status}
                data-testid="budget-status"
              >
                {digest.status}
              </span>
              <span>
                支出実績 {formatAmount(digest.spent)} 円
                {digest.budgetAmount != null
                  ? ` / 予算 ${formatAmount(digest.budgetAmount)} 円`
                  : "（予算未設定）"}
              </span>
            </div>
            <div
              className="progress"
              data-status={digest.status}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              aria-label="予算消化進捗"
            >
              <span style={{ width: `${pct}%` }} />
            </div>
          </div>
        </section>
      )}

      {page === "home" && (
        <section className="panel" aria-label="対象月の取引一覧">
          <h2>取引一覧</h2>
          {monthTransactions.length === 0 ? (
            <p className="tx-meta">この月の取引はまだありません。</p>
          ) : (
            <ul className="list">
              {monthTransactions.map((tx) => (
                <li
                  key={tx.id}
                  className="tx"
                  data-kind={tx.kind}
                  data-status={tx.status}
                >
                  <div>{tx.occurredOn}</div>
                  <div>
                    <div>
                      {categoryNameById[tx.categoryId] ?? "—"}
                      <span className="badge">{tx.status === "draft" ? "下書き" : tx.status === "confirmed" ? "確定" : "取消"}</span>
                    </div>
                    <div className="tx-meta">
                      {accountNameById[tx.accountId] ?? "—"} ・{" "}
                      {tx.kind === "income" ? "収入" : "支出"}
                    </div>
                  </div>
                  <div className="tx-amount">
                    {tx.kind === "income" ? "+" : "−"}
                    {formatAmount(tx.amount)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {page === "accounts" && (
        <section className="panel">
          <h2>口座を用意する</h2>
          <form className="form-grid" onSubmit={onAddAccount}>
            <label>
              名称
              <input
                aria-label="口座名称"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="現金・銀行など"
              />
            </label>
            <button className="primary" type="submit">
              口座を登録
            </button>
          </form>
          <ul className="list" style={{ marginTop: "0.75rem" }}>
            {accounts.map((a) => (
              <li className="master-item" key={a.id}>
                <span>{a.name}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {page === "categories" && (
        <section className="panel">
          <h2>カテゴリを用意する</h2>
          <form className="form-grid" onSubmit={onAddCategory}>
            <label>
              名称
              <input
                aria-label="カテゴリ名称"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="食費・給与など"
              />
            </label>
            <label>
              向き
              <select
                aria-label="カテゴリ向き"
                value={categoryDirection}
                onChange={(e) =>
                  setCategoryDirection(e.target.value as CategoryDirection)
                }
              >
                <option value="expense">支出</option>
                <option value="income">収入</option>
              </select>
            </label>
            <button className="primary" type="submit">
              カテゴリを登録
            </button>
          </form>
          <ul className="list" style={{ marginTop: "0.75rem" }}>
            {categories.map((c) => (
              <li className="master-item" key={c.id}>
                <span>{c.name}</span>
                <span className="tx-meta">
                  {c.direction === "income" ? "収入" : "支出"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {page === "budget" && (
        <section className="panel">
          <h2>月次予算を設定する</h2>
          <form className="form-grid" onSubmit={onSetBudget}>
            <label>
              対象年月
              <input aria-label="対象年月" value={yearMonth} readOnly />
            </label>
            <label>
              金額（円）
              <input
                aria-label="月次予算金額"
                inputMode="numeric"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
              />
            </label>
            <button className="primary" type="submit">
              予算を保存
            </button>
          </form>
          {budget ? (
            <p className="tx-meta" style={{ marginTop: "0.75rem" }}>
              現在の設定: {yearMonth} / {formatAmount(budget.amount)} 円
            </p>
          ) : (
            <p className="tx-meta" style={{ marginTop: "0.75rem" }}>
              この月の予算は未設定です。
            </p>
          )}
        </section>
      )}

      {page === "transactions" && (
        <>
          <section className="panel">
            <h2>取引を下書き登録する</h2>
            <form className="form-grid" onSubmit={onAddDraft}>
              <label>
                収入／支出
                <select
                  aria-label="取引種別"
                  value={txKind}
                  onChange={(e) => {
                    setTxKind(e.target.value as TransactionKind);
                    setTxCategoryId("");
                  }}
                >
                  <option value="expense">支出</option>
                  <option value="income">収入</option>
                </select>
              </label>
              <label>
                金額
                <input
                  aria-label="取引金額"
                  inputMode="numeric"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                />
              </label>
              <label>
                発生日
                <input
                  aria-label="発生日"
                  type="date"
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                />
              </label>
              <label>
                口座
                <select
                  aria-label="口座"
                  value={txAccountId}
                  onChange={(e) => setTxAccountId(e.target.value)}
                  required
                >
                  <option value="">選択してください</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                カテゴリ
                <select
                  aria-label="カテゴリ"
                  value={txCategoryId}
                  onChange={(e) => setTxCategoryId(e.target.value)}
                  required
                >
                  <option value="">選択してください</option>
                  {filteredCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <button className="primary" type="submit">
                下書き登録
              </button>
            </form>
          </section>

          <section className="panel" aria-label="取引一覧と状態操作">
            <h2>取引の確定／取消</h2>
            {transactions.length === 0 ? (
              <p className="tx-meta">取引はまだありません。</p>
            ) : (
              <ul className="list">
                {transactions.map((tx) => (
                  <li
                    key={tx.id}
                    className="tx"
                    data-kind={tx.kind}
                    data-status={tx.status}
                  >
                    <div>{tx.occurredOn}</div>
                    <div>
                      <div>
                        {categoryNameById[tx.categoryId] ?? "—"}
                        <span className="badge">
                          {tx.status === "draft"
                            ? "下書き"
                            : tx.status === "confirmed"
                              ? "確定"
                              : "取消"}
                        </span>
                      </div>
                      <div className="tx-meta">
                        {accountNameById[tx.accountId] ?? "—"} ・{" "}
                        {tx.kind === "income" ? "収入" : "支出"}
                      </div>
                      <div className="row" style={{ marginTop: "0.35rem" }}>
                        <button
                          type="button"
                          disabled={tx.status !== "draft"}
                          onClick={() => onConfirm(tx.id)}
                        >
                          確定
                        </button>
                        <button
                          type="button"
                          disabled={tx.status === "cancelled"}
                          onClick={() => onCancel(tx.id)}
                        >
                          取消
                        </button>
                      </div>
                    </div>
                    <div className="tx-amount">
                      {tx.kind === "income" ? "+" : "−"}
                      {formatAmount(tx.amount)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
