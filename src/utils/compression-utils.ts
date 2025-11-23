/**
 * Compression Utilities
 * Utilities for data compression
 */

import * as zlib from "zlib";
import { promisify } from "util";

const gzipAsync = promisify(zlib.gzip);
const gunzipAsync = promisify(zlib.gunzip);
const deflateAsync = promisify(zlib.deflate);
const inflateAsync = promisify(zlib.inflate);

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
