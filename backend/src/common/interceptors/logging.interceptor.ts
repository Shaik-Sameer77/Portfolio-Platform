import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiLogService } from '../../modules/api-log/api-log.service.js';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private apiLogService: ApiLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (body) => {
          const response = context.switchToHttp().getResponse();
          const duration = Date.now() - startTime;
          
          // Don't log the logs endpoint itself to avoid infinite loops/noise
          if (url.includes('/api-logs')) return;

          this.apiLogService.createLog({
            method,
            url,
            statusCode: response.statusCode,
            duration,
            ip,
            userAgent,
            requestBody: JSON.stringify(request.body),
            responseBody: JSON.stringify(body),
          }).catch(err => console.error('Failed to create API log:', err));
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.apiLogService.createLog({
            method,
            url,
            statusCode: error.status || 500,
            duration,
            ip,
            userAgent,
            requestBody: JSON.stringify(request.body),
            responseBody: JSON.stringify(error.response || error.message),
          }).catch(err => console.error('Failed to create API log (error case):', err));
        },
      }),
    );
  }
}
