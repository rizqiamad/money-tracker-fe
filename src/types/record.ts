export interface IRecord {
  from_user_account_id: number;
  to_user_account_id?: number;
  date_action: string;
  type: string;
  amount: number;
  sub_category_code?: number;
  description: string;
}

export type RecordType = "expense" | "income" | "transfer";

export interface IListRecord {
  record_id: number;
  amount: number;
  description: string;
  type: RecordType;
  date_action: string;
  sub_category_name?: string;
  ms_category_name?: string;
  from_user_account_code?: string;
  to_user_account_code?: string | null;
}

export interface IListRecordPayload {
  id?: number;
  from_user_account_id?: number;
  to_user_account_id?: number;
  type?: RecordType;
  date_action?: string;
  sub_category_code?: string;
  description?: string;
  search?: string;
  order_by_name?: string;
  order_by_value?: "asc" | "desc";
  current?: number;
  limit?: number;
}

interface IInExSummary {
  ms_category_code: string;
  ms_category_name: string;
  amount: number;
}

interface IDateSummary {
  date_action: string;
  income: number;
  expense: number;
}

export interface ISummaryRecord {
  income_summary: IInExSummary[];
  expense_summary: IInExSummary[];
  date_summary: IDateSummary[];
}
