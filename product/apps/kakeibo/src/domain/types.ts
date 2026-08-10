export type Account = {
  id: string;
  name: string;
};

export type CategoryDirection = "income" | "expense";

export type Category = {
  id: string;
  name: string;
  direction: CategoryDirection;
};

export type TransactionKind = "income" | "expense";

export type TransactionStatus = "draft" | "confirmed" | "cancelled";

export type Transaction = {
  id: string;
  kind: TransactionKind;
  amount: number;
  occurredOn: string;
  accountId: string;
  categoryId: string;
  status: TransactionStatus;
};

export type MonthlyBudget = {
  yearMonth: string;
  amount: number;
};

export type BudgetDigestStatus = "余裕" | "逼迫" | "超過" | "未設定";

export type BudgetDigest = {
  status: BudgetDigestStatus;
  spent: number;
  budgetAmount: number | null;
};

export type Ok<T> = { ok: true; value: T };
export type Err<E extends string> = { ok: false; error: E };
export type Result<T, E extends string> = Ok<T> | Err<E>;

export type AccountError = "NAME_REQUIRED";
export type CategoryError = "NAME_REQUIRED";
export type TransactionError =
  | "AMOUNT_INVALID"
  | "OCCURRED_ON_REQUIRED"
  | "ACCOUNT_NOT_FOUND"
  | "CATEGORY_NOT_FOUND"
  | "CATEGORY_DIRECTION_MISMATCH";
export type TransitionError = "NOT_FOUND" | "INVALID_TRANSITION";
export type BudgetError = "AMOUNT_INVALID" | "YEAR_MONTH_REQUIRED";
