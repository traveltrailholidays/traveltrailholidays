export interface apiResponseI<PayloadData = Record<string, unknown> | unknown[]> {
  code: number;
  error: boolean;
  message: string;
  payload: PayloadData;
}

export interface apiResponseOptions<PayloadData> {
  code?: number;
  error?: boolean;
  message?: string;
  payload?: PayloadData;
}
