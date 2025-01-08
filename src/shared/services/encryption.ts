import CryptoJS from "crypto-js";

// You should store this key in your environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your-secret-key";

export const encryptData = (data: any): string => {
  try {
    // Convert the data to a JSON string
    const jsonString = JSON.stringify(data);
    // Encrypt the string
    const encrypted = CryptoJS.AES.encrypt(
      jsonString,
      ENCRYPTION_KEY
    ).toString();
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
};

export const decryptData = (encryptedData: string): any => {
  try {
    // Decrypt the data
    const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    // Convert the decrypted data back to its original form
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt data");
  }
};
