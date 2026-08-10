import type {
  Account,
  AccountError,
  BudgetDigest,
  BudgetError,
  Category,
  CategoryDirection,
  CategoryError,
  MonthlyBudget,
  Result,
  Transaction,
  TransactionError,
  TransactionKind,
  TransitionError,
} from "./types.js";

export type CreateDraftTransactionInput = {
  kind: TransactionKind;
  amount: number;
  occurredOn: string;
  accountId: string;
  categoryId: string;
};

export type KakeiboLedger = {
  addAccount: (name: string) => Result<Account, AccountError>;
  addCategory: (
    name: string,
    direction: CategoryDirection,
  ) => Result<Category, CategoryError>;
  addDraftTransaction: (
    input: CreateDraftTransactionInput,
  ) => Result<Transaction, TransactionError>;
  confirmTransaction: (id: string) => Result<Transaction, TransitionError>;
  cancelTransaction: (id: string) => Result<Transaction, TransitionError>;
  setMonthlyBudget: (
    yearMonth: string,
    amount: number,
  ) => Result<MonthlyBudget, BudgetError>;
  getBudgetDigest: (yearMonth: string) => BudgetDigest;
  listAccounts: () => readonly Account[];
  listCategories: () => readonly Category[];
  listTransactions: () => readonly Transaction[];
  getMonthlyBudget: (yearMonth: string) => MonthlyBudget | null;
};

function newId(): string {
  return crypto.randomUUID();
}

function isPositiveAmount(amount: number): boolean {
  return typeof amount === "number" && Number.isFinite(amount) && amount > 0;
}

function yearMonthOf(occurredOn: string): string {
  return occurredOn.slice(0, 7);
}

/**
 * 個人向け家計簿デモの公開境界（インメモリ台帳）。
 * 決め事 D1–D11 の振る舞いをここで検証可能にする。
 */
export function createKakeiboLedger(): KakeiboLedger {
  const accounts = new Map<string, Account>();
  const categories = new Map<string, Category>();
  const transactions = new Map<string, Transaction>();
  const budgets = new Map<string, MonthlyBudget>();

  return {
    addAccount(name) {
      const trimmed = name.trim();
      if (trimmed.length === 0) {
        return { ok: false, error: "NAME_REQUIRED" };
      }
      const account: Account = { id: newId(), name: trimmed };
      accounts.set(account.id, account);
      return { ok: true, value: account };
    },

    addCategory(name, direction) {
      const trimmed = name.trim();
      if (trimmed.length === 0) {
        return { ok: false, error: "NAME_REQUIRED" };
      }
      const category: Category = { id: newId(), name: trimmed, direction };
      categories.set(category.id, category);
      return { ok: true, value: category };
    },

    addDraftTransaction(input) {
      if (!isPositiveAmount(input.amount)) {
        return { ok: false, error: "AMOUNT_INVALID" };
      }
      const occurredOn = input.occurredOn.trim();
      if (occurredOn.length === 0) {
        return { ok: false, error: "OCCURRED_ON_REQUIRED" };
      }
      const account = accounts.get(input.accountId);
      if (!account) {
        return { ok: false, error: "ACCOUNT_NOT_FOUND" };
      }
      const category = categories.get(input.categoryId);
      if (!category) {
        return { ok: false, error: "CATEGORY_NOT_FOUND" };
      }
      if (category.direction !== input.kind) {
        return { ok: false, error: "CATEGORY_DIRECTION_MISMATCH" };
      }
      const tx: Transaction = {
        id: newId(),
        kind: input.kind,
        amount: input.amount,
        occurredOn,
        accountId: account.id,
        categoryId: category.id,
        status: "draft",
      };
      transactions.set(tx.id, tx);
      return { ok: true, value: tx };
    },

    confirmTransaction(id) {
      const tx = transactions.get(id);
      if (!tx) {
        return { ok: false, error: "NOT_FOUND" };
      }
      if (tx.status !== "draft") {
        return { ok: false, error: "INVALID_TRANSITION" };
      }
      const next: Transaction = { ...tx, status: "confirmed" };
      transactions.set(id, next);
      return { ok: true, value: next };
    },

    cancelTransaction(id) {
      const tx = transactions.get(id);
      if (!tx) {
        return { ok: false, error: "NOT_FOUND" };
      }
      if (tx.status === "cancelled") {
        return { ok: false, error: "INVALID_TRANSITION" };
      }
      if (tx.status !== "draft" && tx.status !== "confirmed") {
        return { ok: false, error: "INVALID_TRANSITION" };
      }
      const next: Transaction = { ...tx, status: "cancelled" };
      transactions.set(id, next);
      return { ok: true, value: next };
    },

    setMonthlyBudget(yearMonth, amount) {
      const ym = yearMonth.trim();
      if (ym.length === 0) {
        return { ok: false, error: "YEAR_MONTH_REQUIRED" };
      }
      if (!isPositiveAmount(amount)) {
        return { ok: false, error: "AMOUNT_INVALID" };
      }
      const budget: MonthlyBudget = { yearMonth: ym, amount };
      budgets.set(ym, budget);
      return { ok: true, value: budget };
    },

    getBudgetDigest(yearMonth) {
      const budget = budgets.get(yearMonth);
      const spent = [...transactions.values()]
        .filter(
          (tx) =>
            tx.status === "confirmed" &&
            tx.kind === "expense" &&
            yearMonthOf(tx.occurredOn) === yearMonth,
        )
        .reduce((sum, tx) => sum + tx.amount, 0);

      if (!budget) {
        return { status: "未設定", spent, budgetAmount: null };
      }

      const ratio = spent / budget.amount;
      if (ratio < 0.8) {
        return { status: "余裕", spent, budgetAmount: budget.amount };
      }
      if (spent <= budget.amount) {
        return { status: "逼迫", spent, budgetAmount: budget.amount };
      }
      return { status: "超過", spent, budgetAmount: budget.amount };
    },

    listAccounts() {
      return [...accounts.values()];
    },

    listCategories() {
      return [...categories.values()];
    },

    listTransactions() {
      return [...transactions.values()];
    },

    getMonthlyBudget(yearMonth) {
      return budgets.get(yearMonth) ?? null;
    },
  };
}
