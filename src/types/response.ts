export interface IResponse<T> {
  status: number;
  message: string;
  current?: number;
  total?: number;
  data: T;
}
