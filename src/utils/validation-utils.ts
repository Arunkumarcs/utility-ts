/**
 * Validation Utilities
 * Utilities for data validation
 */

/**
 * Validates email address
 * @param email - Email to validate
 * @returns True if valid email
 * @example
 * const isValid = isValidEmail('user@example.com')
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates URL
 * @param url - URL to validate
 * @returns True if valid URL
 * @example
 * const isValid = isValidUrl('https://example.com')
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates UUID
 * @param uuid - UUID to validate
 * @returns True if valid UUID
 * @example
 * const isValid = isValidUUID('550e8400-e29b-41d4-a716-446655440000')
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validates phone number (basic)
 * @param phone - Phone number to validate
 * @returns True if valid phone number
 * @example
 * const isValid = isValidPhone('+1234567890')
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
}

/**
 * Validates that value is not empty
 * @param value - Value to validate
 * @returns True if not empty
 * @example
 * const isValid = isNotEmpty('value')
 */
export function isNotEmpty(value: any): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === "object") {
    return Object.keys(value).length > 0;
  }
  return true;
}

/**
 * Validates that value is a number
 * @param value - Value to validate
 * @returns True if number
 * @example
 * const isValid = isNumber(123)
 */
export function isNumber(value: any): value is number {
  return typeof value === "number" && !isNaN(value);
}

/**
 * Validates that value is a string
 * @param value - Value to validate
 * @returns True if string
 * @example
 * const isValid = isString('text')
 */
export function isString(value: any): value is string {
  return typeof value === "string";
}

/**
 * Validates that value is an array
 * @param value - Value to validate
 * @returns True if array
 * @example
 * const isValid = isArray([1, 2, 3])
 */
export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

/**
 * Validates that value is an object
 * @param value - Value to validate
 * @returns True if object
 * @example
 * const isValid = isObject({ key: 'value' })
 */
export function isObject(value: any): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Validates that value is within a range
 * @param value - Value to validate
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns True if in range
 * @example
 * const isValid = isInRange(5, 1, 10)
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validates that string length is within range
 * @param value - String to validate
 * @param min - Minimum length
 * @param max - Maximum length
 * @returns True if length is in range
 * @example
 * const isValid = isLengthInRange('text', 1, 10)
 */
export function isLengthInRange(
  value: string,
  min: number,
  max: number
): boolean {
  return value.length >= min && value.length <= max;
}

/**
 * Validates required fields in an object
 * @param data - Object to validate
 * @param fields - Required field names
 * @returns Object with validation result
 * @example
 * const result = validateRequired({ name: 'John' }, ['name', 'email'])
 */
export function validateRequired(
  data: Record<string, any>,
  fields: string[]
): { valid: boolean; missing: string[] } {
  const missing = fields.filter((field) => !isNotEmpty(data[field]));
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Validates data against a schema (simple object schema)
 * @param data - Data to validate
 * @param schema - Validation schema
 * @returns Validation result
 * @example
 * const result = validateSchema({ age: 25 }, { age: (v) => v >= 18 })
 */
export function validateSchema(
  data: Record<string, any>,
  schema: Record<string, (value: any) => boolean>
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  for (const [key, validator] of Object.entries(schema)) {
    if (!validator(data[key])) {
      errors[key] = `Validation failed for ${key}`;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates credit card number (Luhn algorithm)
 * @param cardNumber - Credit card number
 * @returns True if valid
 * @example
 * const isValid = isValidCreditCard('4111111111111111')
 */
export function isValidCreditCard(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Validates postal code (basic)
 * @param postalCode - Postal code
 * @param country - Country code (optional)
 * @returns True if valid
 * @example
 * const isValid = isValidPostalCode('12345', 'US')
 */
export function isValidPostalCode(
  postalCode: string,
  country?: string
): boolean {
  const patterns: Record<string, RegExp> = {
    US: /^\d{5}(-\d{4})?$/,
    UK: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
    CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
  };

  if (country && patterns[country]) {
    return patterns[country].test(postalCode);
  }

  // Generic validation: alphanumeric, 3-10 characters
  return /^[A-Z0-9\s-]{3,10}$/i.test(postalCode);
}

/**
 * Validates that value matches a pattern
 * @param value - Value to validate
 * @param pattern - Regex pattern
 * @returns True if matches
 * @example
 * const isValid = matchesPattern('abc123', /^[a-z]+\d+$/)
 */
export function matchesPattern(value: string, pattern: RegExp): boolean {
  return pattern.test(value);
}

/**
 * Validates that value is a valid JSON string
 * @param value - Value to validate
 * @returns True if valid JSON
 * @example
 * const isValid = isValidJSON('{"key": "value"}')
 */
export function isValidJSON(value: string): boolean {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates IBAN (International Bank Account Number)
 * @param iban - IBAN to validate
 * @returns True if valid IBAN
 * @example
 * const isValid = isValidIBAN('GB82WEST12345698765432')
 */
export function isValidIBAN(iban: string): boolean {
  // Remove spaces and convert to uppercase
  const normalized = iban.replace(/\s/g, "").toUpperCase();

  // IBAN must be 15-34 characters
  if (normalized.length < 15 || normalized.length > 34) {
    return false;
  }

  // Must start with 2 letters (country code) followed by 2 digits (check digits)
  if (!/^[A-Z]{2}\d{2}/.test(normalized)) {
    return false;
  }

  // Move first 4 characters to end
  const rearranged = normalized.slice(4) + normalized.slice(0, 4);

  // Convert letters to numbers (A=10, B=11, ..., Z=35)
  const numeric = rearranged.replace(/[A-Z]/g, (char) => {
    return (char.charCodeAt(0) - 55).toString();
  });

  // Calculate mod 97
  let remainder = "";
  for (let i = 0; i < numeric.length; i++) {
    remainder = (remainder + numeric[i]).replace(/^0+/, "") || "0";
    if (remainder.length > 9) {
      remainder = (parseInt(remainder.slice(0, -9), 10) % 97) + remainder.slice(-9);
    }
  }
  remainder = (parseInt(remainder, 10) % 97).toString();

  return remainder === "1";
}

/**
 * Validates ISBN (International Standard Book Number)
 * Supports both ISBN-10 and ISBN-13
 * @param isbn - ISBN to validate
 * @returns True if valid ISBN
 * @example
 * const isValid = isValidISBN('978-0-306-40615-7')
 */
export function isValidISBN(isbn: string): boolean {
  // Remove hyphens and spaces
  const normalized = isbn.replace(/[-\s]/g, "");

  // ISBN-10: 10 digits, last can be X
  if (normalized.length === 10) {
    if (!/^[0-9]{9}[0-9X]$/i.test(normalized)) {
      return false;
    }

    let sum = 0;
    for (let i = 0; i < 10; i++) {
      const digit = normalized[i].toUpperCase() === "X" ? 10 : parseInt(normalized[i], 10);
      sum += digit * (10 - i);
    }

    return sum % 11 === 0;
  }

  // ISBN-13: 13 digits
  if (normalized.length === 13) {
    if (!/^[0-9]{13}$/.test(normalized)) {
      return false;
    }

    let sum = 0;
    for (let i = 0; i < 13; i++) {
      const digit = parseInt(normalized[i], 10);
      const multiplier = i % 2 === 0 ? 1 : 3;
      sum += digit * multiplier;
    }

    return sum % 10 === 0;
  }

  return false;
}

/**
 * Validates MAC address (Media Access Control address)
 * Supports common formats: XX:XX:XX:XX:XX:XX, XX-XX-XX-XX-XX-XX, XXXXXXXXXXXX
 * @param mac - MAC address to validate
 * @returns True if valid MAC address
 * @example
 * const isValid = isValidMAC('00:1B:44:11:3A:B7')
 */
export function isValidMAC(mac: string): boolean {
  // Common MAC address patterns
  const patterns = [
    /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, // XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX
    /^([0-9A-Fa-f]{4}[.]){2}([0-9A-Fa-f]{4})$/, // XXXX.XXXX.XXXX (Cisco format)
    /^[0-9A-Fa-f]{12}$/, // XXXXXXXXXXXX (no separators)
  ];

  return patterns.some((pattern) => pattern.test(mac));
}

/**
 * Validates domain name
 * @param domain - Domain to validate
 * @returns True if valid domain
 * @example
 * const isValid = isValidDomain('example.com')
 */
export function isValidDomain(domain: string): boolean {
  // Domain validation regex
  // - Must start and end with alphanumeric character
  // - Can contain hyphens but not at start/end
  // - TLD must be at least 2 characters
  // - Max length 253 characters (RFC 1035)
  if (domain.length > 253 || domain.length === 0) {
    return false;
  }

  const domainRegex =
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;

  return domainRegex.test(domain);
}

/**
 * Validates file extension
 * @param filename - Filename or extension to validate
 * @param allowedExtensions - Array of allowed extensions (with or without dot)
 * @returns True if extension is allowed
 * @example
 * const isValid = isValidFileExtension('document.pdf', ['.pdf', '.doc', '.docx'])
 */
export function isValidFileExtension(
  filename: string,
  allowedExtensions: string[]
): boolean {
  // Extract extension from filename
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1) {
    return false;
  }

  const extension = filename.slice(lastDot).toLowerCase();

  // Normalize allowed extensions (ensure they start with dot)
  const normalized = allowedExtensions.map((ext) =>
    ext.startsWith(".") ? ext.toLowerCase() : `.${ext.toLowerCase()}`
  );

  return normalized.includes(extension);
}

/**
 * Validates MIME type
 * @param mimeType - MIME type to validate
 * @returns True if valid MIME type
 * @example
 * const isValid = isValidMimeType('text/plain')
 */
export function isValidMimeType(mimeType: string): boolean {
  // MIME type pattern: type/subtype with optional parameters
  // Basic validation: type/subtype
  const mimeTypeRegex = /^[a-z][a-z0-9!#$&^_.-]*\/[a-z0-9!#$&^_.-]+(?:;.*)?$/i;

  if (!mimeTypeRegex.test(mimeType)) {
    return false;
  }

  // Split type and subtype
  const [type, subtypeWithParams] = mimeType.split("/");
  const subtype = subtypeWithParams?.split(";")[0];

  // Type and subtype must not be empty
  if (!type || !subtype) {
    return false;
  }

  // Type and subtype must be valid length (1-127 characters each)
  if (type.length > 127 || subtype.length > 127) {
    return false;
  }

  return true;
}

/**
 * Validates Base64 string
 * @param value - String to validate
 * @param allowPadding - Whether to allow padding (default: true)
 * @returns True if valid Base64
 * @example
 * const isValid = isValidBase64('SGVsbG8gV29ybGQ=')
 */
export function isValidBase64(value: string, allowPadding: boolean = true): boolean {
  if (typeof value !== "string" || value.length === 0) {
    return false;
  }

  // Base64 characters: A-Z, a-z, 0-9, +, /, and = for padding
  const base64Regex = allowPadding
    ? /^[A-Za-z0-9+/]*={0,2}$/
    : /^[A-Za-z0-9+/]+$/;

  if (!base64Regex.test(value)) {
    return false;
  }

  // Padding must be at the end and can only be 0, 1, or 2 '=' characters
  if (allowPadding) {
    const paddingIndex = value.indexOf("=");
    if (paddingIndex !== -1) {
      const padding = value.slice(paddingIndex);
      if (padding.length > 2 || !/^=+$/.test(padding)) {
        return false;
      }
      // Check that there are no characters after padding
      if (value.length !== paddingIndex + padding.length) {
        return false;
      }
    }
  }

  // Length must be multiple of 4 (when padding is considered)
  const lengthWithoutPadding = value.replace(/=+$/, "").length;
  if (lengthWithoutPadding % 4 !== 0 && lengthWithoutPadding > 0) {
    return false;
  }

  return true;
}

/**
 * Validates hexadecimal string
 * @param value - String to validate
 * @param allowPrefix - Whether to allow '0x' or '0X' prefix (default: true)
 * @returns True if valid hex string
 * @example
 * const isValid = isValidHex('0xFF00FF')
 */
export function isValidHex(value: string, allowPrefix: boolean = true): boolean {
  if (typeof value !== "string" || value.length === 0) {
    return false;
  }

  if (allowPrefix && (value.startsWith("0x") || value.startsWith("0X"))) {
    const hexPart = value.slice(2);
    return /^[0-9A-Fa-f]+$/.test(hexPart) && hexPart.length > 0;
  }

  return /^[0-9A-Fa-f]+$/.test(value);
}
