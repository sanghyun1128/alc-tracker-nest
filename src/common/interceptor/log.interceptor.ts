import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
/**
 * LogInterceptor logs when a request and response are made.
 * - Request: [REQ] {method} {request path} - {current time}
 * - Response: [RES] {method} {request path} - {current time} {time taken ms}
 */
export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const requestTime = new Date();

    const request = context.switchToHttp().getRequest();

    const requestPath = request.originalUrl;
    const requestMethod = request.method;

    // [REQ] /alcohol/spirit?order__createdAt=DESC - 1/22/2025, 10:21:18 PM
    console.log(`[REQ] ${requestMethod} ${requestPath} - ${requestTime.toLocaleString('kr')}`);

    return next.handle().pipe(
      tap(() => {
        const responseTime = new Date();
        const timeTaken = responseTime.getTime() - requestTime.getTime();

        // [RES] /alcohol/spirit?order__createdAt=DESC - 1/22/2025, 10:21:18 PM 50ms
        console.log(
          `[RES] ${requestMethod} ${requestPath} - ${responseTime.toLocaleString('kr')} ${timeTaken}ms`,
        );
      }),
    );
  }
}
