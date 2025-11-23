/**
 * CLI Utilities
 * Utilities for command-line interface development
 */

export interface CliOption {
  name: string;
  alias?: string;
  description?: string;
  type?: "string" | "boolean" | "number" | "array";
  default?: any;
  required?: boolean;
}

export interface ParsedArgs {
  [key: string]: any;
  _: string[];
}

/**
 * Parses command-line arguments
 * @param args - Arguments array (default: process.argv.slice(2))
 * @param options - Option definitions
 * @returns Parsed arguments object
 * @example
 * const args = parseArgs(['--port', '3000', '--verbose'], [
 *   { name: 'port', type: 'number' },
 *   { name: 'verbose', type: 'boolean' }
 * ])
 */
export function parseArgs(
  args: string[] = process.argv.slice(2),
  options: CliOption[] = []
): ParsedArgs {
  const result: ParsedArgs = { _: [] };
  const optionMap = new Map<string, CliOption>();

  // Build option map
  options.forEach((opt) => {
    optionMap.set(opt.name, opt);
    if (opt.alias) {
      optionMap.set(opt.alias, opt);
    }
    // Set defaults
    if (opt.default !== undefined) {
      result[opt.name] = opt.default;
    }
  });

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const isLongFlag = arg.startsWith("--");
    const isShortFlag = arg.startsWith("-") && !isLongFlag;

    if (isLongFlag || isShortFlag) {
      const flagName = isLongFlag ? arg.slice(2) : arg.slice(1);
      const option = optionMap.get(flagName);

      if (option) {
        const type = option.type || "boolean";

        if (type === "boolean") {
          result[option.name] = true;
        } else if (type === "array") {
          if (!result[option.name]) {
            result[option.name] = [];
          }
          const nextArg = args[i + 1];
          if (nextArg && !nextArg.startsWith("-")) {
            result[option.name].push(nextArg);
            i++;
          }
        } else {
          const nextArg = args[i + 1];
          if (nextArg && !nextArg.startsWith("-")) {
            if (type === "number") {
              result[option.name] = Number(nextArg);
            } else {
              result[option.name] = nextArg;
            }
            i++;
          }
        }
      }
    } else {
      result._.push(arg);
    }
  }

  // Validate required options
  options.forEach((opt) => {
    if (opt.required && result[opt.name] === undefined) {
      throw new Error(`Required option --${opt.name} is missing`);
    }
  });

  return result;
}

/**
 * Generates help text from option definitions
 * @param options - Option definitions
 * @param programName - Program name
 * @param description - Program description
 * @returns Help text string
 * @example
 * const help = generateHelp(options, 'my-cli', 'My CLI tool')
 */
export function generateHelp(
  options: CliOption[],
  programName: string = "program",
  description?: string
): string {
  const lines: string[] = [];

  lines.push(`Usage: ${programName} [options]`);
  if (description) {
    lines.push("");
    lines.push(description);
  }

  if (options.length > 0) {
    lines.push("");
    lines.push("Options:");
    options.forEach((opt) => {
      const parts: string[] = [];
      if (opt.alias) {
        parts.push(`  -${opt.alias}, --${opt.name}`);
      } else {
        parts.push(`  --${opt.name}`);
      }

      if (opt.type && opt.type !== "boolean") {
        parts.push(`<${opt.type}>`);
      }

      const desc = opt.description || "";
      const required = opt.required ? " (required)" : "";
      const defaultValue =
        opt.default !== undefined ? ` (default: ${opt.default})` : "";

      lines.push(
        `${parts.join(" ").padEnd(30)} ${desc}${required}${defaultValue}`
      );
    });
  }

  return lines.join("\n");
}

/**
 * Creates a progress bar
 * @param total - Total number of items
 * @param width - Bar width (default: 40)
 * @returns Progress bar object
 * @example
 * const bar = createProgressBar(100)
 * bar.update(50) // 50%
 */
export function createProgressBar(
  total: number,
  width: number = 40
): {
  update: (current: number) => void;
  finish: () => void;
} {
  let current = 0;

  const render = () => {
    const percentage = Math.min((current / total) * 100, 100);
    const filled = Math.round((width * current) / total);
    const empty = width - filled;
    const bar = "█".repeat(filled) + "░".repeat(empty);
    process.stdout.write(`\r[${bar}] ${percentage.toFixed(1)}%`);
  };

  return {
    update: (value: number) => {
      current = value;
      render();
    },
    finish: () => {
      current = total;
      render();
      process.stdout.write("\n");
    },
  };
}

/**
 * Creates a spinner for loading states
 * @param message - Spinner message
 * @returns Spinner object
 * @example
 * const spinner = createSpinner('Loading...')
 * spinner.start()
 * // ... do work
 * spinner.stop()
 */
export function createSpinner(message: string = "Loading..."): {
  start: () => void;
  stop: () => void;
  update: (msg: string) => void;
} {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let interval: NodeJS.Timeout | null = null;
  let frameIndex = 0;
  let currentMessage = message;

  const render = () => {
    process.stdout.write(`\r${frames[frameIndex]} ${currentMessage}`);
    frameIndex = (frameIndex + 1) % frames.length;
  };

  return {
    start: () => {
      interval = setInterval(render, 100);
    },
    stop: () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      process.stdout.write("\r" + " ".repeat(50) + "\r");
    },
    update: (msg: string) => {
      currentMessage = msg;
    },
  };
}

/**
 * Formats a table for CLI output
 * @param data - Array of objects or arrays
 * @param headers - Optional headers
 * @returns Formatted table string
 * @example
 * const table = formatTable([{ name: 'John', age: 30 }], ['name', 'age'])
 */
export function formatTable(
  data: Array<Record<string, any> | any[]>,
  headers?: string[]
): string {
  if (data.length === 0) {
    return "";
  }

  const isArrayData = Array.isArray(data[0]);
  const keys = headers || (isArrayData ? [] : Object.keys(data[0]));

  if (isArrayData && !headers) {
    // Use indices as headers
    const maxLength = Math.max(...data.map((row) => (row as any[]).length));
    for (let i = 0; i < maxLength; i++) {
      keys.push(`Column ${i + 1}`);
    }
  }

  // Calculate column widths
  const widths = keys.map((key, idx) => {
    const headerWidth = key.length;
    const dataWidth = Math.max(
      ...data.map((row) => {
        const value = isArrayData
          ? (row as any[])[idx]
          : (row as Record<string, any>)[key];
        return String(value || "").length;
      })
    );
    return Math.max(headerWidth, dataWidth);
  });

  // Build table
  const lines: string[] = [];

  // Header
  const headerRow = keys.map((key, idx) => key.padEnd(widths[idx])).join(" | ");
  lines.push(headerRow);
  lines.push("-".repeat(headerRow.length));

  // Data rows
  data.forEach((row) => {
    const dataRow = keys
      .map((key, idx) => {
        const value = isArrayData
          ? (row as any[])[idx]
          : (row as Record<string, any>)[key];
        return String(value || "").padEnd(widths[idx]);
      })
      .join(" | ");
    lines.push(dataRow);
  });

  return lines.join("\n");
}

/**
 * Colors for CLI output (ANSI codes)
 */
export const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

/**
 * Colors text for CLI output
 * @param text - Text to color
 * @param color - Color name
 * @returns Colored text
 * @example
 * console.log(colorText('Error', 'red'))
 */
export function colorText(text: string, color: keyof typeof colors): string {
  return `${colors[color]}${text}${colors.reset}`;
}

/**
 * Prompts user for input (simple version)
 * @param question - Question to ask
 * @returns Promise with user input
 * @example
 * const answer = await prompt('Enter your name: ')
 */
export function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.once("data", (data) => {
      resolve(data.toString().trim());
    });
  });
}
