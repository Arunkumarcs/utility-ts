/**
 * File System Utilities
 * Utilities for working with the file system
 */

import { promises as fs } from "fs";
import * as path from "path";

/**
 * Reads a file as string
 * @param filePath - Path to file
 * @param encoding - File encoding (default: 'utf8')
 * @returns File contents as string
 * @example
 * const content = await readFile('data.txt')
 */
export async function readFile(
  filePath: string,
  encoding: BufferEncoding = "utf8"
): Promise<string> {
  return fs.readFile(filePath, encoding);
}

/**
 * Writes a string to a file
 * @param filePath - Path to file
 * @param content - Content to write
 * @param encoding - File encoding (default: 'utf8')
 * @example
 * await writeFile('data.txt', 'Hello World')
 */
export async function writeFile(
  filePath: string,
  content: string,
  encoding: BufferEncoding = "utf8"
): Promise<void> {
  await fs.writeFile(filePath, content, encoding);
}

/**
 * Checks if a file or directory exists
 * @param filePath - Path to check
 * @returns True if exists
 * @example
 * const exists = await fileExists('data.txt')
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets file stats
 * @param filePath - Path to file
 * @returns File stats
 * @example
 * const stats = await getFileStats('data.txt')
 */
export async function getFileStats(
  filePath: string
): Promise<import("fs").Stats> {
  return fs.stat(filePath);
}

/**
 * Creates a directory (recursive)
 * @param dirPath - Directory path
 * @param recursive - Create parent directories (default: true)
 * @example
 * await createDirectory('/path/to/dir', true)
 */
export async function createDirectory(
  dirPath: string,
  recursive: boolean = true
): Promise<void> {
  await fs.mkdir(dirPath, { recursive });
}

/**
 * Reads directory contents
 * @param dirPath - Directory path
 * @returns Array of file/directory names
 * @example
 * const files = await readDirectory('/path/to/dir')
 */
export async function readDirectory(dirPath: string): Promise<string[]> {
  return fs.readdir(dirPath);
}

/**
 * Deletes a file
 * @param filePath - Path to file
 * @example
 * await deleteFile('data.txt')
 */
export async function deleteFile(filePath: string): Promise<void> {
  await fs.unlink(filePath);
}

/**
 * Deletes a directory (recursive)
 * @param dirPath - Directory path
 * @param recursive - Delete recursively (default: true)
 * @example
 * await deleteDirectory('/path/to/dir', true)
 */
export async function deleteDirectory(
  dirPath: string,
  recursive: boolean = true
): Promise<void> {
  if (recursive) {
    await fs.rm(dirPath, { recursive: true, force: true });
  } else {
    await fs.rmdir(dirPath);
  }
}

/**
 * Copies a file
 * @param src - Source file path
 * @param dest - Destination file path
 * @example
 * await copyFile('source.txt', 'dest.txt')
 */
export async function copyFile(src: string, dest: string): Promise<void> {
  await fs.copyFile(src, dest);
}

/**
 * Moves/renames a file or directory
 * @param src - Source path
 * @param dest - Destination path
 * @example
 * await moveFile('old.txt', 'new.txt')
 */
export async function moveFile(src: string, dest: string): Promise<void> {
  await fs.rename(src, dest);
}

/**
 * Reads a JSON file
 * @param filePath - Path to JSON file
 * @returns Parsed JSON object
 * @example
 * const data = await readJsonFile('config.json')
 */
export async function readJsonFile<T = any>(filePath: string): Promise<T> {
  const content = await readFile(filePath);
  return JSON.parse(content);
}

/**
 * Writes a JSON file
 * @param filePath - Path to JSON file
 * @param data - Data to write
 * @param indent - Indentation spaces (default: 2)
 * @example
 * await writeJsonFile('config.json', { key: 'value' }, 2)
 */
export async function writeJsonFile(
  filePath: string,
  data: any,
  indent: number = 2
): Promise<void> {
  const content = JSON.stringify(data, null, indent);
  await writeFile(filePath, content);
}

/**
 * Gets file extension
 * @param filePath - File path
 * @returns File extension (without dot)
 * @example
 * const ext = getFileExtension('file.txt') // 'txt'
 */
export function getFileExtension(filePath: string): string {
  return path.extname(filePath).slice(1);
}

/**
 * Gets file name without extension
 * @param filePath - File path
 * @returns File name without extension
 * @example
 * const name = getFileNameWithoutExtension('file.txt') // 'file'
 */
export function getFileNameWithoutExtension(filePath: string): string {
  return path.basename(filePath, path.extname(filePath));
}

/**
 * Gets file size in bytes
 * @param filePath - Path to file
 * @returns File size in bytes
 * @example
 * const size = await getFileSize('data.txt')
 */
export async function getFileSize(filePath: string): Promise<number> {
  const stats = await getFileStats(filePath);
  return stats.size;
}

/**
 * Checks if path is a directory
 * @param filePath - Path to check
 * @returns True if directory
 * @example
 * const isDir = await isDirectory('/path/to/dir')
 */
export async function isDirectory(filePath: string): Promise<boolean> {
  try {
    const stats = await getFileStats(filePath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Checks if path is a file
 * @param filePath - Path to check
 * @returns True if file
 * @example
 * const isFile = await isFile('data.txt')
 */
export async function isFile(filePath: string): Promise<boolean> {
  try {
    const stats = await getFileStats(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
}

/**
 * Reads a file synchronously
 * @param filePath - Path to file
 * @param encoding - File encoding (default: 'utf8')
 * @returns File contents as string
 * @example
 * const content = readFileSync('data.txt')
 */
export function readFileSync(
  filePath: string,
  encoding: BufferEncoding = "utf8"
): string {
  const fs = require("fs");
  return fs.readFileSync(filePath, encoding);
}

/**
 * Writes a string to a file synchronously
 * @param filePath - Path to file
 * @param content - Content to write
 * @param encoding - File encoding (default: 'utf8')
 * @example
 * writeFileSync('data.txt', 'Hello World')
 */
export function writeFileSync(
  filePath: string,
  content: string,
  encoding: BufferEncoding = "utf8"
): void {
  const fs = require("fs");
  fs.writeFileSync(filePath, content, encoding);
}

/**
 * Watches a file for changes
 * @param filePath - Path to file
 * @param callback - Callback function
 * @returns Watcher instance
 * @example
 * const watcher = watchFile('data.txt', (eventType, filename) => {
 *   console.log('File changed:', filename)
 * })
 */
export function watchFile(
  filePath: string,
  callback: (eventType: string, filename: string | null) => void
): import("fs").FSWatcher {
  const fs = require("fs");
  return fs.watch(filePath, callback);
}
