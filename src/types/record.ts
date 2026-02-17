export interface IRecord {
  from_user_account_id: number;
  to_user_account_id?: number;
  date_action: string;
  type: string;
  amount: number;
  sub_category_code?: number;
  description: string;
}
