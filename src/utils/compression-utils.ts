/**
 * Compression Utilities
 * Utilities for data compression
 */

import * as zlib from "zlib";
import { promisify } from "util";
import { Transform } from "stream";

const gzipAsync = promisify(zlib.gzip);
const gunzipAsync = promisify(zlib.gunzip);
const deflateAsync = promisify(zlib.deflate);
const inflateAsync = promisify(zlib.inflate);
const brotliCompressAsync = promisify(zlib.brotliCompress);
const brotliDecompressAsync = promisify(zlib.brotliDecompress);

/**
 * Compresses data using gzip
 * @param data - Data to compress (string or buffer)
 * @returns Compressed buffer
 * @example
 * const compressed = await compressGzip('Hello World')
 */
export async function compressGzip(data: string | Buffer): Promise<Buffer> {
  const buffer = typeof data === "string" ? Buffer.from(data) : data;
  return gzipAsync(buffer);
}

/**
 * Decompresses gzip data
 * @param data - Compressed buffer
 * @returns Decompressed buffer
 * @example
 * const decompressed = await decompressGzip(compressed)
 */
export async function decompressGzip(data: Buffer): Promise<Buffer> {
  return gunzipAsync(data);
}

/**
 * Compresses data using deflate
 * @param data - Data to compress
 * @returns Compressed buffer
 * @example
 * const compressed = await compressDeflate('Hello World')
 */
export async function compressDeflate(data: string | Buffer): Promise<Buffer> {
  const buffer = typeof data === "string" ? Buffer.from(data) : data;
  return deflateAsync(buffer);
}

/**
 * Decompresses deflate data
 * @param data - Compressed buffer
 * @returns Decompressed buffer
 * @example
 * const decompressed = await decompressDeflate(compressed)
 */
export async function decompressDeflate(data: Buffer): Promise<Buffer> {
  return inflateAsync(data);
}

// ============================================================================
// Brotli Compression
// ============================================================================

/**
 * Compresses data using Brotli
 * @param data - Data to compress (string or buffer)
 * @param options - Compression options
 * @returns Compressed buffer
 * @example
 * const compressed = await compressBrotli('Hello World')
 */
export async function compressBrotli(
  data: string | Buffer,
  options?: zlib.BrotliOptions
): Promise<Buffer> {
  const buffer = typeof data === "string" ? Buffer.from(data) : data;
  return brotliCompressAsync(buffer, options);
}

/**
 * Decompresses Brotli data
 * @param data - Compressed buffer
 * @param options - Decompression options
 * @returns Decompressed buffer
 * @example
 * const decompressed = await decompressBrotli(compressed)
 */
export async function decompressBrotli(
  data: Buffer,
  options?: zlib.BrotliOptions
): Promise<Buffer> {
  return brotliDecompressAsync(data, options);
}

// ============================================================================
// Compression Ratio Calculation
// ============================================================================

/**
 * Calculates compression ratio
 * @param originalSize - Original data size in bytes
 * @param compressedSize - Compressed data size in bytes
 * @returns Compression ratio (0-1, where 1 = no compression, 0 = perfect compression)
 * @example
 * const ratio = calculateCompressionRatio(1000, 500) // 0.5
 */
export function calculateCompressionRatio(
  originalSize: number,
  compressedSize: number
): number {
  if (originalSize === 0) return 0;
  return compressedSize / originalSize;
}

/**
 * Calculates compression percentage
 * @param originalSize - Original data size in bytes
 * @param compressedSize - Compressed data size in bytes
 * @returns Compression percentage (0-100, where 100 = no compression, 0 = perfect compression)
 * @example
 * const percent = calculateCompressionPercentage(1000, 500) // 50
 */
export function calculateCompressionPercentage(
  originalSize: number,
  compressedSize: number
): number {
  return calculateCompressionRatio(originalSize, compressedSize) * 100;
}

/**
 * Calculates space saved by compression
 * @param originalSize - Original data size in bytes
 * @param compressedSize - Compressed data size in bytes
 * @returns Space saved in bytes
 * @example
 * const saved = calculateSpaceSaved(1000, 500) // 500
 */
export function calculateSpaceSaved(
  originalSize: number,
  compressedSize: number
): number {
  return originalSize - compressedSize;
}

// ============================================================================
// Streaming Compression
// ============================================================================

/**
 * Creates a gzip compression stream
 * @param options - Compression options
 * @returns Transform stream for compression
 * @example
 * const compressStream = createGzipStream()
 * readableStream.pipe(compressStream).pipe(writableStream)
 */
export function createGzipStream(options?: zlib.ZlibOptions): Transform {
  return zlib.createGzip(options);
}

/**
 * Creates a gzip decompression stream
 * @param options - Decompression options
 * @returns Transform stream for decompression
 * @example
 * const decompressStream = createGunzipStream()
 * readableStream.pipe(decompressStream).pipe(writableStream)
 */
export function createGunzipStream(options?: zlib.ZlibOptions): Transform {
  return zlib.createGunzip(options);
}

/**
 * Creates a deflate compression stream
 * @param options - Compression options
 * @returns Transform stream for compression
 * @example
 * const compressStream = createDeflateStream()
 */
export function createDeflateStream(options?: zlib.ZlibOptions): Transform {
  return zlib.createDeflate(options);
}

/**
 * Creates a deflate decompression stream
 * @param options - Decompression options
 * @returns Transform stream for decompression
 * @example
 * const decompressStream = createInflateStream()
 */
export function createInflateStream(options?: zlib.ZlibOptions): Transform {
  return zlib.createInflate(options);
}

/**
 * Creates a Brotli compression stream
 * @param options - Compression options
 * @returns Transform stream for compression
 * @example
 * const compressStream = createBrotliCompressStream()
 */
export function createBrotliCompressStream(
  options?: zlib.BrotliOptions
): Transform {
  return zlib.createBrotliCompress(options);
}

/**
 * Creates a Brotli decompression stream
 * @param options - Decompression options
 * @returns Transform stream for decompression
 * @example
 * const decompressStream = createBrotliDecompressStream()
 */
export function createBrotliDecompressStream(
  options?: zlib.BrotliOptions
): Transform {
  return zlib.createBrotliDecompress(options);
}

// ============================================================================
// Compression Format Detection
// ============================================================================

/**
 * Compression format types
 */
export type CompressionFormat = "gzip" | "deflate" | "brotli" | "unknown";

/**
 * Detects compression format from buffer
 * @param data - Compressed buffer
 * @returns Detected compression format
 * @example
 * const format = detectCompressionFormat(buffer) // 'gzip'
 */
export function detectCompressionFormat(data: Buffer): CompressionFormat {
  if (data.length < 2) {
    return "unknown";
  }

  // Gzip magic number: 1F 8B
  if (data[0] === 0x1f && data[1] === 0x8b) {
    return "gzip";
  }

  // Zlib (deflate) magic number: 78 9C, 78 01, 78 DA, 78 5E
  if (data[0] === 0x78) {
    const secondByte = data[1];
    if (
      secondByte === 0x9c ||
      secondByte === 0x01 ||
      secondByte === 0xda ||
      secondByte === 0x5e
    ) {
      return "deflate";
    }
  }

  // Brotli: Check for common Brotli header patterns
  // Brotli streams typically start with specific byte patterns
  // This is a simplified check - full detection would require parsing
  if (data.length >= 4) {
    // Brotli can start with various patterns, but common ones include:
    // - 81 16 03 00 (common Brotli header)
    // - Other patterns based on window size and mode
    // For simplicity, we check if it's not gzip/deflate and has Brotli-like structure
    // Note: This is not 100% accurate, but covers common cases
    const possibleBrotli =
      data[0] === 0x81 || (data[0] >= 0x80 && data[0] <= 0xbf); // Common Brotli range
    if (possibleBrotli && data[0] !== 0x1f && data[0] !== 0x78) {
      return "brotli";
    }
  }

  return "unknown";
}

/**
 * Decompresses data based on detected format
 * @param data - Compressed buffer
 * @returns Decompressed buffer
 * @example
 * const decompressed = await decompressAuto(buffer)
 */
export async function decompressAuto(data: Buffer): Promise<Buffer> {
  const format = detectCompressionFormat(data);

  switch (format) {
    case "gzip":
      return decompressGzip(data);
    case "deflate":
      return decompressDeflate(data);
    case "brotli":
      return decompressBrotli(data);
    default:
      throw new Error(
        `Unknown compression format. Detected: ${format}. Cannot decompress.`
      );
  }
}

/**
 * Creates a decompression stream based on detected format
 * @param data - Compressed buffer (first few bytes for detection)
 * @returns Transform stream for decompression
 * @example
 * const decompressStream = createAutoDecompressStream(buffer)
 */
export function createAutoDecompressStream(data: Buffer): Transform {
  const format = detectCompressionFormat(data);

  switch (format) {
    case "gzip":
      return createGunzipStream();
    case "deflate":
      return createInflateStream();
    case "brotli":
      return createBrotliDecompressStream();
    default:
      throw new Error(
        `Unknown compression format. Detected: ${format}. Cannot create decompression stream.`
      );
  }
}
