import { apiResponseI, apiResponseOptions } from '../interfaces/api-response.interface';

export const createApiResponse = <PayloadData = Record<string, unknown> | unknown[]>(
  payload: PayloadData,
  message = 'Success',
  code = 200,
  error = false
): apiResponseI<PayloadData> => {
  return { code, error, message, payload };
};

export const apiResponse = <PayloadData = Record<string, unknown>>(
  options: apiResponseOptions<PayloadData>
): apiResponseI<PayloadData> => {
  return {
    code: options.code ?? 200,
    error: options.error ?? false,
    message: options.message ?? 'Success',
    payload: options.payload ?? ({} as PayloadData),
  };
};

export const errorResponse = (message = 'Something went wrong', code = 500): apiResponseI<{}> => {
  return createApiResponse({}, message, code, true);
};
