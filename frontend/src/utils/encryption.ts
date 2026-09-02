import CryptoJS from 'crypto-js';

const getSecretKey = () => process.env.NEXT_PUBLIC_CRYPTO_SECRET || 'default_secret_key';

export const encryptData = (data: any): string => {
  if (data === undefined || data === null) return data;
  const jsonStr = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonStr, getSecretKey()).toString();
};

export const decryptData = (ciphertext: string): any => {
  if (!ciphertext) return ciphertext;
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, getSecretKey());
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedStr) return null;
    return JSON.parse(decryptedStr);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};
