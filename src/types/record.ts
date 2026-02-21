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
  id: number;
  from_user_account_id: number;
  to_user_account_id: number | null;
  amount: number;
  description: string;
  created_at: string;
  type: RecordType;
  date_action: string;
  sub_category_code: string | null;
  sub_category_name?: string;
  from_user_account_name?: string;
  to_user_account_name?: string | null;
}

export interface IListRecordPayload {
  id?: number;
  from_user_account_id?: number;
  to_user_account_id?: number;
  type?: RecordType;
  date_action?: string;
  sub_category_code?: string;
  description?: string;
  order_by_name?: string;
  order_by_value?: "asc" | "desc";
  current?: number;
  limit?: number;
}
