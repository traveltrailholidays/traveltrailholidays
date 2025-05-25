import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { apiResponseI } from '../interfaces/api-response.interface';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';

@Injectable()
export class apiResposneInterceptor<T> implements NestInterceptor<T, apiResponseI<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<apiResponseI<T>> {
        return next.handle().pipe(
            map(data => {
                // If response is already in the apiResponseI format, return it as is
                // AND set the HTTP status code from the response data
                if (data &&
                    'code' in data &&
                    'error' in data &&
                    'message' in data &&
                    'payload' in data) {

                    // Set the HTTP status code from the custom response
                    const response = context.switchToHttp().getResponse();
                    response.status(200);

                    return data;
                }

                // Otherwise, convert to apiResponseI format
                const statusCode = 200;
                return {
                    code: statusCode,
                    error: statusCode >= 400,
                    message: 'Success',
                    payload: data,
                };
            }),
        );
    }
}