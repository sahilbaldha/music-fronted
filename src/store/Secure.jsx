import CryptoJS from 'crypto-js'; // Library for encryption/decryption on frontend

const SECRET_KEY = import.meta.env.VITE_ENCRYPT_SECRET // Same key as server

// Decrypt function: takes encryptedData (iv:encryptedHex)
export function decryptData(encryptedData) {
  const [ivHex, encryptedHex] = encryptedData.split(':'); // Split IV and content

  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY); // Convert key string to WordArray
  const iv = CryptoJS.enc.Hex.parse(ivHex); // Convert IV from hex to WordArray
  const encrypted = CryptoJS.enc.Hex.parse(encryptedHex); // Convert encrypted part

  // Combine into Base64 string for AES decryption
  const encryptedBase64 = CryptoJS.enc.Base64.stringify(encrypted);

  // Decrypt using AES-256-CBC
  const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  // Return parsed JSON object
  return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
}
