import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CryptoUtil } from '../utils/crypto.util.js';

@Injectable()
export class EncryptInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isEncrypted = process.env.ISENCRYPTED_PAYLOAD !== 'false';

    return next.handle().pipe(
      map((data) => {
        if (!isEncrypted) {
          return data;
        }
        
        // Don't encrypt if data is undefined/null or it's a stream/buffer
        if (data === undefined || data === null) {
          return data;
        }

        const encrypted = CryptoUtil.encrypt(data);
        return { result: encrypted };
      }),
    );
  }
}
