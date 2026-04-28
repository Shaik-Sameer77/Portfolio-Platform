import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CryptoUtil } from '../utils/crypto.util.js';

@Injectable()
export class DecryptMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const isEncrypted = process.env.ISENCRYPTED_PAYLOAD !== 'false';

    if (isEncrypted && req.body && req.body.payload) {
      try {
        const decryptedBody = CryptoUtil.decrypt(req.body.payload);
        req.body = decryptedBody;
      } catch (error) {
        console.error('Error decrypting request payload:', error);
      }
    }
    
    next();
  }
}
