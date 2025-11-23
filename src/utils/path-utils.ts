/**
 * Path Utilities
 * Utilities for working with file paths
 */

import * as path from "path";

/**
 * Joins path segments
 * @param segments - Path segments
 * @returns Joined path
 * @example
 * const fullPath = joinPath('dir', 'subdir', 'file.txt')
 */
export function joinPath(...segments: string[]): string {
  return path.join(...segments);
}

/**
 * Normalizes a path
 * @param filePath - Path to normalize
 * @returns Normalized path
 * @example
 * const normalized = normalizePath('dir/../subdir/./file.txt')
 */
export function normalizePath(filePath: string): string {
  return path.normalize(filePath);
}

/**
 * Resolves a path to absolute path
 * @param filePath - Path to resolve
 * @returns Absolute path
 * @example
 * const absolute = resolvePath('./file.txt')
 */
export function resolvePath(filePath: string): string {
  return path.resolve(filePath);
}

/**
 * Gets directory name from path
 * @param filePath - File path
 * @returns Directory name
 * @example
 * const dir = getDirectoryName('/path/to/file.txt') // '/path/to'
 */
export function getDirectoryName(filePath: string): string {
  return path.dirname(filePath);
}

/**
 * Gets file name from path
 * @param filePath - File path
 * @returns File name
 * @example
 * const name = getFileName('/path/to/file.txt') // 'file.txt'
 */
export function getFileName(filePath: string): string {
  return path.basename(filePath);
}

/**
 * Gets file extension from path
 * @param filePath - File path
 * @returns File extension (with dot)
 * @example
 * const ext = getExtension('/path/to/file.txt') // '.txt'
 */
export function getExtension(filePath: string): string {
  return path.extname(filePath);
}

/**
 * Checks if path is absolute
 * @param filePath - Path to check
 * @returns True if absolute
 * @example
 * const isAbs = isAbsolute('/path/to/file') // true
 */
export function isAbsolute(filePath: string): boolean {
  return path.isAbsolute(filePath);
}

/**
 * Gets relative path from one path to another
 * @param from - Source path
 * @param to - Target path
 * @returns Relative path
 * @example
 * const relative = getRelativePath('/a/b', '/a/c') // '../c'
 */
export function getRelativePath(from: string, to: string): string {
  return path.relative(from, to);
}

/**
 * Parses a path into components
 * @param filePath - Path to parse
 * @returns Parsed path object
 * @example
 * const parsed = parsePath('/path/to/file.txt')
 */
export function parsePath(filePath: string): path.ParsedPath {
  return path.parse(filePath);
}

/**
 * Formats a parsed path object back to string
 * @param pathObject - Parsed path object
 * @returns Formatted path string
 * @example
 * const pathStr = formatPath({ root: '/', dir: '/path/to', base: 'file.txt' })
 */
export function formatPath(pathObject: path.ParsedPath): string {
  return path.format(pathObject);
}

/**
 * Gets the platform-specific path separator
 * @returns Path separator
 * @example
 * const sep = getPathSeparator() // '/' on Unix, '\' on Windows
 */
export function getPathSeparator(): string {
  return path.sep;
}

/**
 * Gets the platform-specific delimiter
 * @returns Path delimiter
 * @example
 * const delim = getPathDelimiter() // ':' on Unix, ';' on Windows
 */
export function getPathDelimiter(): string {
  return path.delimiter;
}
