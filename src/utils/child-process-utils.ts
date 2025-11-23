/**
 * Child Process Utilities
 * Utilities for working with child processes
 */

import {
  spawn,
  exec,
  execFile,
  ChildProcess,
  ExecOptions,
  SpawnOptions,
} from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);

/**
 * Executes a shell command and returns the result
 * @param command - Command to execute
 * @param options - Execution options
 * @returns Promise with stdout and stderr
 * @example
 * const { stdout, stderr } = await executeCommand('ls -la')
 */
export async function executeCommand(
  command: string,
  options?: ExecOptions
): Promise<{ stdout: string; stderr: string }> {
  const result = await execAsync(command, options);
  return {
    stdout:
      typeof result.stdout === "string"
        ? result.stdout
        : result.stdout.toString(),
    stderr:
      typeof result.stderr === "string"
        ? result.stderr
        : result.stderr.toString(),
  };
}

/**
 * Executes a file with arguments
 * @param file - File path to execute
 * @param args - Command line arguments
 * @param options - Execution options
 * @returns Promise with stdout and stderr
 * @example
 * const { stdout } = await executeFile('/usr/bin/node', ['--version'])
 */
export async function executeFile(
  file: string,
  args?: string[],
  options?: ExecOptions
): Promise<{ stdout: string; stderr: string }> {
  const result = await execFileAsync(file, args, options);
  return {
    stdout:
      typeof result.stdout === "string"
        ? result.stdout
        : result.stdout.toString(),
    stderr:
      typeof result.stderr === "string"
        ? result.stderr
        : result.stderr.toString(),
  };
}

/**
 * Spawns a child process
 * @param command - Command to spawn
 * @param args - Command arguments
 * @param options - Spawn options
 * @returns Child process instance
 * @example
 * const process = spawnProcess('node', ['script.js'], { stdio: 'inherit' })
 */
export function spawnProcess(
  command: string,
  args: string[] = [],
  options?: SpawnOptions
): ChildProcess {
  return spawn(command, args || [], options || {});
}

/**
 * Executes a command and returns stdout as string
 * @param command - Command to execute
 * @param options - Execution options
 * @returns Promise with stdout string
 * @example
 * const output = await getCommandOutput('echo "Hello"')
 */
export async function getCommandOutput(
  command: string,
  options?: ExecOptions
): Promise<string> {
  const { stdout } = await executeCommand(command, options);
  return stdout.trim();
}

/**
 * Executes a command and returns the exit code
 * @param command - Command to execute
 * @param options - Execution options
 * @returns Promise with exit code
 * @example
 * const code = await getExitCode('test -f file.txt')
 */
export async function getExitCode(
  command: string,
  options?: ExecOptions
): Promise<number> {
  try {
    await executeCommand(command, options);
    return 0;
  } catch (error: any) {
    return error.code || 1;
  }
}

/**
 * Checks if a command exists
 * @param command - Command to check
 * @returns Promise resolving to true if command exists
 * @example
 * const exists = await commandExists('node')
 */
export async function commandExists(command: string): Promise<boolean> {
  const platform = process.platform;
  const checkCommand =
    platform === "win32" ? `where ${command}` : `which ${command}`;

  try {
    await executeCommand(checkCommand);
    return true;
  } catch {
    return false;
  }
}

/**
 * Executes a command with timeout
 * @param command - Command to execute
 * @param timeoutMs - Timeout in milliseconds
 * @param options - Execution options
 * @returns Promise with stdout and stderr
 * @example
 * const result = await executeWithTimeout('long-running-command', 5000)
 */
export async function executeWithTimeout(
  command: string,
  timeoutMs: number,
  options?: ExecOptions
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const execOptions: ExecOptions = {
      ...options,
      encoding: "utf8" as BufferEncoding,
    };
    const child = exec(command, execOptions, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        const stdoutStr =
          typeof stdout === "string" ? stdout : stdout?.toString() || "";
        const stderrStr =
          typeof stderr === "string" ? stderr : stderr?.toString() || "";
        resolve({
          stdout: stdoutStr,
          stderr: stderrStr,
        });
      }
    });

    const timeout = setTimeout(() => {
      child.kill();
      reject(new Error(`Command timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    child.on("exit", () => {
      clearTimeout(timeout);
    });
  });
}

/**
 * Streams command output line by line
 * @param command - Command to execute
 * @param onLine - Callback for each line
 * @param options - Execution options
 * @returns Promise that resolves when command completes
 * @example
 * await streamCommandOutput('tail -f log.txt', (line) => console.log(line))
 */
export async function streamCommandOutput(
  command: string,
  onLine: (line: string) => void,
  options?: ExecOptions
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = exec(command, options);

    if (child.stdout) {
      child.stdout.on("data", (data: Buffer) => {
        const lines = data.toString().split("\n");
        lines.forEach((line) => {
          if (line.trim()) {
            onLine(line.trim());
          }
        });
      });
    }

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command exited with code ${code}`));
      }
    });

    child.on("error", reject);
  });
}
