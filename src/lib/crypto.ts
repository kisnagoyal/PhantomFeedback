import crypto from 'crypto';

// Encryption settings
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'base64'); // 32 bytes = 256 bits for AES-256
const IV_LENGTH = 16; // AES requires a 16-byte IV

// Function to encrypt a message
export function encryptMessage(message: string): string {
  // Generate a random 16-byte IV
  const iv = crypto.randomBytes(IV_LENGTH);

  // Type assertions to help TypeScript infer the correct types
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY as crypto.CipherKey, iv as crypto.BinaryLike);

  // Encrypt the message
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Return the IV concatenated with the encrypted data
  return iv.toString('hex') + ':' + encrypted;
}

// Function to decrypt a message
export function decryptMessage(encryptedMessage: string): string {
  const [ivHex, encrypted] = encryptedMessage.split(':');

  // Convert the IV from hex to a Buffer
  const iv = Buffer.from(ivHex, 'hex');

  // Type assertions to help TypeScript infer the correct types
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY as crypto.CipherKey, iv as crypto.BinaryLike);

  // Decrypt the message
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
