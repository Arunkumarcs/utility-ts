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
  const phoneRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
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
