import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.CRYPTO_SECRET || 'default_secret_key';

export class CryptoUtil {
  static encrypt(data: any): string {
    if (data === undefined || data === null) return data;
    const jsonStr = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonStr, SECRET_KEY).toString();
  }

  static decrypt(ciphertext: string): any {
    if (!ciphertext) return ciphertext;
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
      const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
      if (!decryptedStr) return null;
      return JSON.parse(decryptedStr);
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }
}
