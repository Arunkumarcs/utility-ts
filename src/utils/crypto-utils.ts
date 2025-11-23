/**
 * Crypto Utilities
 * Utilities for cryptographic operations
 */

import { createHash, createHmac, randomBytes, pbkdf2 } from "crypto";
import { promisify } from "util";

const pbkdf2Async = promisify(pbkdf2);

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
