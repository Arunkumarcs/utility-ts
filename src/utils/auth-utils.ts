/**
 * Authentication Utilities
 * Utilities for authentication and authorization
 */

import { createHash, createHmac, randomBytes } from "crypto";

/**
 * Generates a random salt
 * @param length - Salt length (default: 16)
 * @returns Random salt string
 * @example
 * const salt = generateSalt(16)
 */
export function generateSalt(length: number = 16): string {
  return randomBytes(length).toString("hex");
}

/**
 * Creates a password hash
 * @param password - Password to hash
 * @param salt - Salt (optional)
 * @returns Hashed password
 * @example
 * const hash = hashPassword('password123', 'salt')
 */
export function hashPassword(password: string, salt?: string): string {
  const hash = createHash("sha256");
  if (salt) {
    hash.update(password + salt);
  } else {
    hash.update(password);
  }
  return hash.digest("hex");
}

/**
 * Verifies a password against a hash
 * @param password - Password to verify
 * @param hash - Stored hash
 * @param salt - Salt used (optional)
 * @returns True if password matches
 * @example
 * const isValid = verifyPassword('password123', storedHash, salt)
 */
export function verifyPassword(
  password: string,
  hash: string,
  salt?: string
): boolean {
  const computedHash = hashPassword(password, salt);
  return computedHash === hash;
}

/**
 * Creates a JWT-like token (simple implementation)
 * @param payload - Token payload
 * @param secret - Secret key
 * @returns Token string
 * @example
 * const token = createToken({ userId: 123 }, 'secret')
 */
export function createToken(
  payload: Record<string, any>,
  secret: string
): string {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
    "base64url"
  );
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );
  const signature = createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url");
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verifies a token
 * @param token - Token to verify
 * @param secret - Secret key
 * @returns Decoded payload or null if invalid
 * @example
 * const payload = verifyToken(token, 'secret')
 */
export function verifyToken(
  token: string,
  secret: string
): Record<string, any> | null {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split(".");
    const computedSignature = createHmac("sha256", secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest("base64url");

    if (computedSignature !== signature) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    );
    return payload;
  } catch {
    return null;
  }
}
