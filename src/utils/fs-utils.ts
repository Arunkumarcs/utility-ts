/**
 * File System Utilities
 * Utilities for working with the file system
 */

import { promises as fs } from "fs";
import * as path from "path";
import { tmpdir } from "os";
import { randomBytes } from "crypto";

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

/**
 * Copies a directory recursively
 * @param src - Source directory path
 * @param dest - Destination directory path
 * @param options - Copy options
 * @example
 * await copyDirectory('/path/to/src', '/path/to/dest')
 */
export async function copyDirectory(
  src: string,
  dest: string,
  options: { overwrite?: boolean } = {}
): Promise<void> {
  const { overwrite = true } = options;

  // Create destination directory
  await createDirectory(dest, true);

  // Read source directory
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath, options);
    } else {
      if (overwrite || !(await fileExists(destPath))) {
        await copyFile(srcPath, destPath);
      }
    }
  }
}

/**
 * Moves a directory recursively
 * @param src - Source directory path
 * @param dest - Destination directory path
 * @param options - Move options
 * @example
 * await moveDirectory('/path/to/src', '/path/to/dest')
 */
export async function moveDirectory(
  src: string,
  dest: string,
  options: { overwrite?: boolean } = {}
): Promise<void> {
  const { overwrite = true } = options;

  // Try to use rename first (fastest if on same filesystem)
  try {
    await fs.rename(src, dest);
    return;
  } catch {
    // If rename fails (cross-filesystem), fall back to copy + delete
  }

  // Copy directory recursively
  await copyDirectory(src, dest, options);

  // Delete source directory
  await deleteDirectory(src, true);
}

/**
 * Matches files using glob patterns (basic implementation)
 * @param pattern - Glob pattern (supports * and ** wildcards)
 * @param rootDir - Root directory to search (default: current directory)
 * @returns Array of matching file paths
 * @example
 * const files = await glob("*.ts", "./src")
 */
export async function glob(
  pattern: string,
  rootDir: string = process.cwd()
): Promise<string[]> {
  const results: string[] = [];

  // Convert glob pattern to regex
  const regexPattern = pattern
    .replace(/\./g, "\\.")
    .replace(/\*\*/g, "___DOUBLE_STAR___")
    .replace(/\*/g, "[^/]*")
    .replace(/___DOUBLE_STAR___/g, ".*");

  const regex = new RegExp(`^${regexPattern}$`);

  async function walk(dir: string, relativePath: string = ""): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(relativePath, entry.name);

      if (entry.isDirectory()) {
        // Check if pattern allows directory traversal
        if (pattern.includes("**")) {
          await walk(fullPath, relPath);
        }
      } else if (entry.isFile()) {
        // Check if file matches pattern
        if (regex.test(relPath) || regex.test(path.join(rootDir, relPath))) {
          results.push(fullPath);
        }
      }
    }
  }

  await walk(rootDir);
  return results;
}

/**
 * Changes file permissions (chmod)
 * @param filePath - Path to file or directory
 * @param mode - Permission mode (octal number or string like '755')
 * @example
 * await chmod('script.sh', 0o755)
 * await chmod('script.sh', '755')
 */
export async function chmod(
  filePath: string,
  mode: number | string
): Promise<void> {
  const modeNum = typeof mode === "string" ? parseInt(mode, 8) : mode;
  await fs.chmod(filePath, modeNum);
}

/**
 * Gets file permissions
 * @param filePath - Path to file or directory
 * @returns Permission mode as octal string
 * @example
 * const mode = await getFileMode('script.sh') // '755'
 */
export async function getFileMode(filePath: string): Promise<string> {
  const stats = await getFileStats(filePath);
  return (stats.mode & parseInt("777", 8)).toString(8);
}

/**
 * Creates a symbolic link
 * @param target - Target path
 * @param linkPath - Link path
 * @param type - Link type ('file', 'dir', or 'junction' on Windows)
 * @example
 * await createSymlink('/path/to/target', '/path/to/link', 'file')
 */
export async function createSymlink(
  target: string,
  linkPath: string,
  type: "file" | "dir" | "junction" = "file"
): Promise<void> {
  await fs.symlink(target, linkPath, type);
}

/**
 * Reads the target of a symbolic link
 * @param linkPath - Path to symbolic link
 * @returns Target path
 * @example
 * const target = await readSymlink('/path/to/link')
 */
export async function readSymlink(linkPath: string): Promise<string> {
  return fs.readlink(linkPath);
}

/**
 * Checks if a path is a symbolic link
 * @param filePath - Path to check
 * @returns True if path is a symbolic link
 * @example
 * const isLink = await isSymlink('/path/to/link')
 */
export async function isSymlink(filePath: string): Promise<boolean> {
  try {
    const stats = await fs.lstat(filePath);
    return stats.isSymbolicLink();
  } catch {
    return false;
  }
}

/**
 * Creates a temporary file
 * @param options - Options for temporary file creation
 * @returns Path to temporary file
 * @example
 * const tmpFile = await createTempFile({ prefix: 'my-', suffix: '.tmp' })
 */
export async function createTempFile(
  options: {
    prefix?: string;
    suffix?: string;
    dir?: string;
  } = {}
): Promise<string> {
  const { prefix = "tmp-", suffix = "", dir = tmpdir() } = options;

  // Generate unique filename
  const randomStr = randomBytes(6).toString("hex");
  const fileName = `${prefix}${randomStr}${suffix}`;
  const filePath = path.join(dir, fileName);

  // Create empty file
  await fs.writeFile(filePath, "");

  return filePath;
}

/**
 * Creates a temporary directory
 * @param options - Options for temporary directory creation
 * @returns Path to temporary directory
 * @example
 * const tmpDir = await createTempDirectory({ prefix: 'my-' })
 */
export async function createTempDirectory(
  options: {
    prefix?: string;
    dir?: string;
  } = {}
): Promise<string> {
  const { prefix = "tmp-", dir = tmpdir() } = options;

  // Generate unique directory name
  const randomStr = randomBytes(6).toString("hex");
  const dirName = `${prefix}${randomStr}`;
  const dirPath = path.join(dir, dirName);

  // Create directory
  await fs.mkdir(dirPath, { recursive: true });

  return dirPath;
}

/**
 * Watches a file with debouncing
 * @param filePath - Path to file
 * @param callback - Callback function
 * @param delayMs - Debounce delay in milliseconds (default: 300)
 * @returns Watcher instance with close method
 * @example
 * const watcher = watchFileDebounced('data.txt', () => {
 *   console.log('File changed (debounced)')
 * }, 500)
 */
export function watchFileDebounced(
  filePath: string,
  callback: (eventType: string, filename: string | null) => void,
  delayMs: number = 300
): import("fs").FSWatcher & { close: () => void } {
  const fs = require("fs");
  let timeoutId: NodeJS.Timeout | null = null;
  let lastEvent: { eventType: string; filename: string | null } | null = null;

  const watcher = fs.watch(
    filePath,
    (eventType: string, filename: string | null) => {
      lastEvent = { eventType, filename };

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        if (lastEvent) {
          callback(lastEvent.eventType, lastEvent.filename);
          lastEvent = null;
        }
      }, delayMs);
    }
  );

  const originalClose = watcher.close.bind(watcher);
  watcher.close = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    originalClose();
  };

  return watcher as import("fs").FSWatcher & { close: () => void };
}

/**
 * Watches a directory recursively for changes
 * @param dirPath - Path to directory
 * @param callback - Callback function
 * @param options - Watch options
 * @returns Watcher instances map
 * @example
 * const watchers = await watchDirectoryRecursive('/path/to/dir', (eventType, filename) => {
 *   console.log('File changed:', filename)
 * })
 */
export async function watchDirectoryRecursive(
  dirPath: string,
  callback: (
    eventType: string,
    filename: string | null,
    filePath: string
  ) => void,
  options: { recursive?: boolean; debounceMs?: number } = {}
): Promise<Map<string, import("fs").FSWatcher>> {
  const { recursive = true, debounceMs } = options;
  const watchers = new Map<string, import("fs").FSWatcher>();
  const fs = require("fs");

  async function watchDir(currentDir: string): Promise<void> {
    // Watch current directory
    const watcher = fs.watch(
      currentDir,
      { recursive: false },
      (eventType: string, filename: string | null) => {
        if (filename) {
          const filePath = path.join(currentDir, filename);
          callback(eventType, filename, filePath);

          // If it's a new directory and recursive is enabled, watch it too
          if (recursive && eventType === "rename") {
            isDirectory(filePath).then((isDir) => {
              if (isDir && !watchers.has(filePath)) {
                watchDir(filePath);
              }
            });
          }
        }
      }
    );

    watchers.set(currentDir, watcher);

    // Recursively watch subdirectories
    if (recursive) {
      try {
        const entries = await fs.readdir(currentDir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory()) {
            const subDir = path.join(currentDir, entry.name);
            if (!watchers.has(subDir)) {
              await watchDir(subDir);
            }
          }
        }
      } catch {
        // Ignore errors (e.g., permission denied)
      }
    }
  }

  await watchDir(dirPath);

  return watchers;
}
