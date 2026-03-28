/**
 * Crypto Utilities
 * Utilities for cryptographic operations
 */

import {
  createHash,
  createHmac,
  randomBytes,
  pbkdf2,
  createCipheriv,
  createDecipheriv,
  scrypt,
  createSign,
  createVerify,
  generateKeyPair,
  X509Certificate,
} from "crypto";
import { promisify } from "util";

const pbkdf2Async = promisify(pbkdf2);
const scryptAsync = promisify(scrypt);

/**
 * Creates a hash of data
 * @param data - Data to hash
 * @param algorithm - Hash algorithm (default: 'sha256')
 * @returns Hash string
 * @example
 * const hash = createHash('data', 'sha256')
 */
export function createHashString(
  data: string,
  algorithm: string = "sha256"
): string {
  return createHash(algorithm).update(data).digest("hex");
}

/**
 * Creates an HMAC
 * @param data - Data to hash
 * @param secret - Secret key
 * @param algorithm - Hash algorithm (default: 'sha256')
 * @returns HMAC string
 * @example
 * const hmac = createHmacString('data', 'secret', 'sha256')
 */
export function createHmacString(
  data: string,
  secret: string,
  algorithm: string = "sha256"
): string {
  return createHmac(algorithm, secret).update(data).digest("hex");
}

/**
 * Generates random bytes
 * @param length - Number of bytes
 * @returns Random bytes as buffer
 * @example
 * const random = generateRandomBytes(32)
 */
export function generateRandomBytes(length: number): Buffer {
  return randomBytes(length);
}

/**
 * Generates random string
 * @param length - String length
 * @param encoding - Encoding (default: 'hex')
 * @returns Random string
 * @example
 * const random = generateRandomString(32)
 */
export function generateRandomString(
  length: number,
  encoding: BufferEncoding = "hex"
): string {
  return randomBytes(length).toString(encoding);
}

/**
 * Generates a random UUID v4
 * @returns UUID string
 * @example
 * const uuid = generateUUID()
 */
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Derives a key using PBKDF2
 * @param password - Password
 * @param salt - Salt
 * @param iterations - Number of iterations
 * @param keyLength - Key length in bytes
 * @param algorithm - Hash algorithm (default: 'sha256')
 * @returns Derived key
 * @example
 * const key = await deriveKey('password', 'salt', 10000, 32)
 */
export async function deriveKey(
  password: string,
  salt: string | Buffer,
  iterations: number,
  keyLength: number,
  algorithm: string = "sha256"
): Promise<Buffer> {
  return pbkdf2Async(password, salt, iterations, keyLength, algorithm);
}

/**
 * Compares two hashes in constant time
 * @param hash1 - First hash
 * @param hash2 - Second hash
 * @returns True if hashes are equal
 * @example
 * const equal = compareHashes(hash1, hash2)
 */
export function compareHashes(hash1: string, hash2: string): boolean {
  if (hash1.length !== hash2.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < hash1.length; i++) {
    result |= hash1.charCodeAt(i) ^ hash2.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Encodes string to base64
 * @param data - Data to encode
 * @returns Base64 string
 * @example
 * const encoded = encodeBase64('Hello World')
 */
export function encodeBase64(data: string): string {
  return Buffer.from(data).toString("base64");
}

/**
 * Decodes base64 string
 * @param data - Base64 string
 * @returns Decoded string
 * @example
 * const decoded = decodeBase64('SGVsbG8gV29ybGQ=')
 */
export function decodeBase64(data: string): string {
  return Buffer.from(data, "base64").toString("utf8");
}

/**
 * Creates a simple random token
 * @param length - Token length
 * @returns Random token
 * @example
 * const token = createRandomToken(32)
 */
export function createRandomToken(length: number = 32): string {
  return generateRandomString(length, "base64url");
}

// ============================================================================
// AES Encryption/Decryption
// ============================================================================

/**
 * AES encryption algorithm options
 */
export type AESAlgorithm = "aes-128-cbc" | "aes-192-cbc" | "aes-256-cbc" | "aes-128-gcm" | "aes-192-gcm" | "aes-256-gcm";

/**
 * Encrypts data using AES
 * @param data - Data to encrypt
 * @param key - Encryption key (must be appropriate length for algorithm)
 * @param algorithm - AES algorithm (default: 'aes-256-cbc')
 * @param iv - Initialization vector (auto-generated if not provided)
 * @returns Encrypted data with IV prepended (base64 encoded)
 * @example
 * const encrypted = encryptAES('secret data', 'my-32-byte-key-123456789012')
 */
export function encryptAES(
  data: string,
  key: string | Buffer,
  algorithm: AESAlgorithm = "aes-256-cbc",
  iv?: Buffer
): string {
  const keyBuffer = typeof key === "string" ? Buffer.from(key) : key;
  const ivBuffer = iv || randomBytes(16);

  // Validate key length
  const keyLengths: Record<AESAlgorithm, number> = {
    "aes-128-cbc": 16,
    "aes-192-cbc": 24,
    "aes-256-cbc": 32,
    "aes-128-gcm": 16,
    "aes-192-gcm": 24,
    "aes-256-gcm": 32,
  };

  if (keyBuffer.length !== keyLengths[algorithm]) {
    throw new Error(
      `Key length must be ${keyLengths[algorithm]} bytes for ${algorithm}`
    );
  }

  const cipher = createCipheriv(algorithm, keyBuffer, ivBuffer);
  let encrypted = cipher.update(data, "utf8", "base64");
  encrypted += cipher.final("base64");

  // Prepend IV to encrypted data
  return ivBuffer.toString("base64") + ":" + encrypted;
}

/**
 * Decrypts data using AES
 * @param encryptedData - Encrypted data with IV (base64 encoded, format: "iv:data")
 * @param key - Decryption key
 * @param algorithm - AES algorithm (default: 'aes-256-cbc')
 * @returns Decrypted data
 * @example
 * const decrypted = decryptAES(encrypted, 'my-32-byte-key-123456789012')
 */
export function decryptAES(
  encryptedData: string,
  key: string | Buffer,
  algorithm: AESAlgorithm = "aes-256-cbc"
): string {
  const keyBuffer = typeof key === "string" ? Buffer.from(key) : key;
  const [ivBase64, encrypted] = encryptedData.split(":");

  if (!ivBase64 || !encrypted) {
    throw new Error("Invalid encrypted data format. Expected 'iv:data'");
  }

  const ivBuffer = Buffer.from(ivBase64, "base64");

  // Validate key length
  const keyLengths: Record<AESAlgorithm, number> = {
    "aes-128-cbc": 16,
    "aes-192-cbc": 24,
    "aes-256-cbc": 32,
    "aes-128-gcm": 16,
    "aes-192-gcm": 24,
    "aes-256-gcm": 32,
  };

  if (keyBuffer.length !== keyLengths[algorithm]) {
    throw new Error(
      `Key length must be ${keyLengths[algorithm]} bytes for ${algorithm}`
    );
  }

  const decipher = createDecipheriv(algorithm, keyBuffer, ivBuffer);
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

// ============================================================================
// JWT Token Parsing
// ============================================================================

/**
 * JWT token parts
 */
export interface JWTPayload {
  header: Record<string, any>;
  payload: Record<string, any>;
  signature: string;
}

/**
 * Parses a JWT token without verification
 * @param token - JWT token string
 * @returns Parsed JWT parts
 * @example
 * const parsed = parseJWT('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
 */
export function parseJWT(token: string): JWTPayload {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT token format");
  }

  try {
    const header = JSON.parse(
      Buffer.from(parts[0], "base64url").toString("utf8")
    );
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8")
    );
    const signature = parts[2];

    return { header, payload, signature };
  } catch (error) {
    throw new Error(`Failed to parse JWT token: ${error}`);
  }
}

// ============================================================================
// Password Hashing (bcrypt-like API)
// ============================================================================

/**
 * Hashes a password using PBKDF2 (bcrypt-like API)
 * @param password - Password to hash
 * @param saltRounds - Number of salt rounds (default: 10)
 * @returns Hashed password with salt (format: "salt:hash:iterations")
 * @example
 * const hashed = await hashPassword('myPassword123')
 */
export async function hashPassword(
  password: string,
  saltRounds: number = 10
): Promise<string> {
  const salt = randomBytes(16);
  const iterations = Math.pow(2, saltRounds); // 2^10 = 1024, 2^12 = 4096, etc.
  const hash = await pbkdf2Async(
    password,
    salt,
    iterations,
    64,
    "sha256"
  );

  return `${salt.toString("base64")}:${hash.toString("base64")}:${iterations}`;
}

/**
 * Compares a password with a hash
 * @param password - Plain text password
 * @param hashedPassword - Hashed password (format: "salt:hash:iterations")
 * @returns True if password matches
 * @example
 * const matches = await comparePassword('myPassword123', hashedPassword)
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const [saltBase64, hashBase64, iterationsStr] = hashedPassword.split(":");
  if (!saltBase64 || !hashBase64 || !iterationsStr) {
    throw new Error("Invalid hashed password format");
  }

  const salt = Buffer.from(saltBase64, "base64");
  const iterations = parseInt(iterationsStr, 10);
  const hash = await pbkdf2Async(
    password,
    salt,
    iterations,
    64,
    "sha256"
  );

  return compareHashes(hash.toString("base64"), hashBase64);
}

// ============================================================================
// Key Derivation Improvements
// ============================================================================

/**
 * Derives a key using scrypt
 * @param password - Password
 * @param salt - Salt
 * @param keyLength - Key length in bytes (default: 64)
 * @returns Derived key
 * @example
 * const key = await deriveKeyScrypt('password', 'salt', 64)
 */
export async function deriveKeyScrypt(
  password: string,
  salt: string | Buffer,
  keyLength: number = 64
): Promise<Buffer> {
  const saltBuffer = typeof salt === "string" ? Buffer.from(salt) : salt;
  return (await scryptAsync(password, saltBuffer, keyLength)) as Buffer;
}

// ============================================================================
// Digital Signatures
// ============================================================================

/**
 * Signs data using RSA or ECDSA
 * @param data - Data to sign
 * @param privateKey - Private key (PEM format)
 * @param algorithm - Signature algorithm (default: 'RSA-SHA256')
 * @returns Signature (base64 encoded)
 * @example
 * const signature = signData('data to sign', privateKeyPEM, 'RSA-SHA256')
 */
export function signData(
  data: string | Buffer,
  privateKey: string | Buffer,
  algorithm: string = "RSA-SHA256"
): string {
  const sign = createSign(algorithm);
  sign.update(data);
  sign.end();

  const privateKeyBuffer =
    typeof privateKey === "string" ? privateKey : privateKey.toString();
  const signature = sign.sign(privateKeyBuffer, "base64");
  return signature;
}

/**
 * Verifies a digital signature
 * @param data - Original data
 * @param signature - Signature to verify (base64 encoded)
 * @param publicKey - Public key (PEM format)
 * @param algorithm - Signature algorithm (default: 'RSA-SHA256')
 * @returns True if signature is valid
 * @example
 * const isValid = verifySignature('data', signature, publicKeyPEM, 'RSA-SHA256')
 */
export function verifySignature(
  data: string | Buffer,
  signature: string,
  publicKey: string | Buffer,
  algorithm: string = "RSA-SHA256"
): boolean {
  const verify = createVerify(algorithm);
  verify.update(data);
  verify.end();

  const publicKeyBuffer =
    typeof publicKey === "string" ? publicKey : publicKey.toString();
  return verify.verify(publicKeyBuffer, signature, "base64");
}

// ============================================================================
// Certificate Validation
// ============================================================================

/**
 * Validates an X.509 certificate
 * @param certificate - Certificate in PEM format
 * @returns Certificate validation result
 * @example
 * const result = validateCertificate(certPEM)
 */
export function validateCertificate(certificate: string): {
  valid: boolean;
  subject?: string;
  issuer?: string;
  validFrom?: Date;
  validTo?: Date;
  error?: string;
} {
  try {
    const cert = new X509Certificate(certificate);
    const now = new Date();
    const validFrom = cert.validFrom ? new Date(cert.validFrom) : undefined;
    const validTo = cert.validTo ? new Date(cert.validTo) : undefined;

    const isExpired = validTo ? now > validTo : false;
    const isNotYetValid = validFrom ? now < validFrom : false;

    return {
      valid: !isExpired && !isNotYetValid,
      subject: cert.subject,
      issuer: cert.issuer,
      validFrom,
      validTo,
      error: isExpired
        ? "Certificate has expired"
        : isNotYetValid
        ? "Certificate is not yet valid"
        : undefined,
    };
  } catch (error: any) {
    return {
      valid: false,
      error: error?.message || "Invalid certificate format",
    };
  }
}

// ============================================================================
// Cipher/Decipher Stream Utilities
// ============================================================================

/**
 * Creates an encrypting cipher stream
 * @param key - Encryption key
 * @param algorithm - AES algorithm (default: 'aes-256-cbc')
 * @param iv - Initialization vector (auto-generated if not provided)
 * @returns Object with IV and cipher stream
 * @example
 * const { iv, cipher } = createEncryptStream(key, 'aes-256-cbc')
 */
export function createEncryptStream(
  key: string | Buffer,
  algorithm: AESAlgorithm = "aes-256-cbc",
  iv?: Buffer
): { iv: Buffer; cipher: NodeJS.ReadWriteStream } {
  const keyBuffer = typeof key === "string" ? Buffer.from(key) : key;
  const ivBuffer = iv || randomBytes(16);

  const cipher = createCipheriv(algorithm, keyBuffer, ivBuffer);

  return { iv: ivBuffer, cipher };
}

/**
 * Creates a decrypting decipher stream
 * @param key - Decryption key
 * @param algorithm - AES algorithm (default: 'aes-256-cbc')
 * @param iv - Initialization vector
 * @returns Decipher stream
 * @example
 * const decipher = createDecryptStream(key, 'aes-256-cbc', iv)
 */
export function createDecryptStream(
  key: string | Buffer,
  algorithm: AESAlgorithm = "aes-256-cbc",
  iv: Buffer
): NodeJS.ReadWriteStream {
  const keyBuffer = typeof key === "string" ? Buffer.from(key) : key;
  const decipher = createDecipheriv(algorithm, keyBuffer, iv);
  return decipher;
}

// ============================================================================
// Secure Random Number Generation Improvements
// ============================================================================

/**
 * Generates a cryptographically secure random integer
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns Random integer
 * @example
 * const random = generateSecureRandomInt(1, 100)
 */
export function generateSecureRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const maxValid = Math.floor(256 ** bytesNeeded / range) * range - 1;

  let randomValue: number;
  do {
    const randomBytes = generateRandomBytes(bytesNeeded);
    randomValue = 0;
    for (let i = 0; i < bytesNeeded; i++) {
      randomValue = randomValue * 256 + randomBytes[i];
    }
  } while (randomValue > maxValid);

  return min + (randomValue % range);
}

/**
 * Generates a cryptographically secure random float
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (exclusive)
 * @returns Random float
 * @example
 * const random = generateSecureRandomFloat(0, 1)
 */
export function generateSecureRandomFloat(min: number, max: number): number {
  const randomBytes = generateRandomBytes(4);
  const randomUint32 =
    (randomBytes[0] << 24) |
    (randomBytes[1] << 16) |
    (randomBytes[2] << 8) |
    randomBytes[3];
  const randomFloat = randomUint32 / (0xffffffff + 1);
  return min + randomFloat * (max - min);
}

// ============================================================================
// Key Pair Generation
// ============================================================================

/**
 * RSA key pair options
 */
export interface RSAKeyPairOptions {
  modulusLength: 2048 | 3072 | 4096;
  publicKeyEncoding?: {
    type: "spki";
    format: "pem";
  };
  privateKeyEncoding?: {
    type: "pkcs8";
    format: "pem";
    cipher?: string;
    passphrase?: string;
  };
}

/**
 * ECDSA key pair options
 */
export interface ECDSAKeyPairOptions {
  namedCurve: "prime256v1" | "secp384r1" | "secp521r1";
  publicKeyEncoding?: {
    type: "spki";
    format: "pem";
  };
  privateKeyEncoding?: {
    type: "pkcs8";
    format: "pem";
    cipher?: string;
    passphrase?: string;
  };
}

/**
 * Generated key pair
 */
export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

/**
 * Generates an RSA key pair
 * @param options - RSA key pair options
 * @returns Promise with key pair
 * @example
 * const keyPair = await generateRSAKeyPair({ modulusLength: 2048 })
 */
export async function generateRSAKeyPair(
  options: RSAKeyPairOptions = { modulusLength: 2048 }
): Promise<KeyPair> {
  return new Promise((resolve, reject) => {
    generateKeyPair(
      "rsa",
      {
        modulusLength: options.modulusLength,
        publicKeyEncoding: options.publicKeyEncoding || {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: options.privateKeyEncoding || {
          type: "pkcs8",
          format: "pem",
        },
      },
      (err, publicKey, privateKey) => {
        if (err) {
          reject(err);
        } else {
          resolve({ publicKey, privateKey });
        }
      }
    );
  });
}

/**
 * Generates an ECDSA key pair
 * @param options - ECDSA key pair options
 * @returns Promise with key pair
 * @example
 * const keyPair = await generateECDSAKeyPair({ namedCurve: 'prime256v1' })
 */
export async function generateECDSAKeyPair(
  options: ECDSAKeyPairOptions = { namedCurve: "prime256v1" }
): Promise<KeyPair> {
  return new Promise((resolve, reject) => {
    generateKeyPair(
      "ec",
      {
        namedCurve: options.namedCurve,
        publicKeyEncoding: options.publicKeyEncoding || {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: options.privateKeyEncoding || {
          type: "pkcs8",
          format: "pem",
        },
      },
      (err, publicKey, privateKey) => {
        if (err) {
          reject(err);
        } else {
          resolve({ publicKey, privateKey });
        }
      }
    );
  });
}

// ============================================================================
// Certificate Generation Helpers
// ============================================================================

/**
 * Extracts public key from a certificate
 * @param certificate - Certificate in PEM format
 * @returns Public key in PEM format
 * @example
 * const publicKey = extractPublicKeyFromCertificate(certPEM)
 */
export function extractPublicKeyFromCertificate(certificate: string): string {
  try {
    const cert = new X509Certificate(certificate);
    return cert.publicKey.export({ type: "spki", format: "pem" }) as string;
  } catch (error: any) {
    throw new Error(`Failed to extract public key: ${error?.message}`);
  }
}

/**
 * Gets certificate information
 * @param certificate - Certificate in PEM format
 * @returns Certificate information
 * @example
 * const info = getCertificateInfo(certPEM)
 */
export function getCertificateInfo(certificate: string): {
  subject: string;
  issuer: string;
  validFrom: Date;
  validTo: Date;
  serialNumber: string;
  fingerprint: string;
} {
  try {
    const cert = new X509Certificate(certificate);
    return {
      subject: cert.subject,
      issuer: cert.issuer,
      validFrom: new Date(cert.validFrom),
      validTo: new Date(cert.validTo),
      serialNumber: cert.serialNumber,
      fingerprint: cert.fingerprint,
    };
  } catch (error: any) {
    throw new Error(`Failed to get certificate info: ${error?.message}`);
  }
}
