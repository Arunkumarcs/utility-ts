/**
 * Buffer Utilities
 * Utilities for working with Node.js buffers
 */

/**
 * Converts buffer to string
 * @param buffer - Buffer to convert
 * @param encoding - Encoding (default: 'utf8')
 * @returns String representation
 * @example
 * const str = bufferToString(buffer, 'utf8')
 */
export function bufferToString(
  buffer: Buffer,
  encoding: BufferEncoding = "utf8"
): string {
  return buffer.toString(encoding);
}

/**
 * Converts string to buffer
 * @param str - String to convert
 * @param encoding - Encoding (default: 'utf8')
 * @returns Buffer
 * @example
 * const buffer = stringToBuffer('Hello', 'utf8')
 */
export function stringToBuffer(
  str: string,
  encoding: BufferEncoding = "utf8"
): Buffer {
  return Buffer.from(str, encoding);
}

/**
 * Converts buffer to base64 string
 * @param buffer - Buffer to convert
 * @returns Base64 string
 * @example
 * const base64 = bufferToBase64(buffer)
 */
export function bufferToBase64(buffer: Buffer): string {
  return buffer.toString("base64");
}

/**
 * Converts base64 string to buffer
 * @param base64 - Base64 string
 * @returns Buffer
 * @example
 * const buffer = base64ToBuffer('SGVsbG8=')
 */
export function base64ToBuffer(base64: string): Buffer {
  return Buffer.from(base64, "base64");
}

/**
 * Converts buffer to hex string
 * @param buffer - Buffer to convert
 * @returns Hex string
 * @example
 * const hex = bufferToHex(buffer)
 */
export function bufferToHex(buffer: Buffer): string {
  return buffer.toString("hex");
}

/**
 * Converts hex string to buffer
 * @param hex - Hex string
 * @returns Buffer
 * @example
 * const buffer = hexToBuffer('48656c6c6f')
 */
export function hexToBuffer(hex: string): Buffer {
  return Buffer.from(hex, "hex");
}

/**
 * Concatenates multiple buffers
 * @param buffers - Buffers to concatenate
 * @returns Concatenated buffer
 * @example
 * const combined = concatBuffers(buffer1, buffer2, buffer3)
 */
export function concatBuffers(...buffers: Buffer[]): Buffer {
  return Buffer.concat(buffers);
}

/**
 * Compares two buffers
 * @param buffer1 - First buffer
 * @param buffer2 - Second buffer
 * @returns True if buffers are equal
 * @example
 * const equal = compareBuffers(buffer1, buffer2)
 */
export function compareBuffers(buffer1: Buffer, buffer2: Buffer): boolean {
  return buffer1.equals(buffer2);
}

/**
 * Gets buffer length
 * @param buffer - Buffer
 * @returns Length in bytes
 * @example
 * const length = getBufferLength(buffer)
 */
export function getBufferLength(buffer: Buffer): number {
  return buffer.length;
}

/**
 * Creates a buffer from array of numbers
 * @param array - Array of byte values (0-255)
 * @returns Buffer
 * @example
 * const buffer = bufferFromArray([72, 101, 108, 108, 111])
 */
export function bufferFromArray(array: number[]): Buffer {
  return Buffer.from(array);
}

/**
 * Converts buffer to array of numbers
 * @param buffer - Buffer to convert
 * @returns Array of byte values
 * @example
 * const array = bufferToArray(buffer) // [72, 101, 108, 108, 111]
 */
export function bufferToArray(buffer: Buffer): number[] {
  return Array.from(buffer);
}

/**
 * Slices a buffer
 * @param buffer - Buffer to slice
 * @param start - Start index
 * @param end - End index (optional)
 * @returns Sliced buffer
 * @example
 * const slice = sliceBuffer(buffer, 0, 10)
 */
export function sliceBuffer(
  buffer: Buffer,
  start: number,
  end?: number
): Buffer {
  return buffer.slice(start, end);
}

/**
 * Checks if value is a buffer
 * @param value - Value to check
 * @returns True if value is a buffer
 * @example
 * const isBuf = isBuffer(value)
 */
export function isBuffer(value: any): value is Buffer {
  return Buffer.isBuffer(value);
}

/**
 * Creates an empty buffer of specified size
 * @param size - Size in bytes
 * @returns Empty buffer
 * @example
 * const buffer = createEmptyBuffer(1024)
 */
export function createEmptyBuffer(size: number): Buffer {
  return Buffer.alloc(size);
}

/**
 * Creates an uninitialized buffer of specified size
 * @param size - Size in bytes
 * @returns Uninitialized buffer
 * @example
 * const buffer = createUninitializedBuffer(1024)
 */
export function createUninitializedBuffer(size: number): Buffer {
  return Buffer.allocUnsafe(size);
}

/**
 * Fills buffer with a value
 * @param buffer - Buffer to fill
 * @param value - Fill value (number or string)
 * @param start - Start index (optional)
 * @param end - End index (optional)
 * @returns Filled buffer
 * @example
 * const filled = fillBuffer(buffer, 0, 0, 100)
 */
export function fillBuffer(
  buffer: Buffer,
  value: number | string,
  start?: number,
  end?: number
): Buffer {
  return buffer.fill(value, start, end);
}
