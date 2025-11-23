/**
 * Network Utilities
 * Utilities for network operations
 */

import * as net from "net";
import * as os from "os";

/**
 * Checks if a port is available
 * @param port - Port number
 * @param host - Host (default: 'localhost')
 * @returns Promise resolving to true if available
 * @example
 * const available = await isPortAvailable(3000)
 */
export async function isPortAvailable(
  port: number,
  host: string = "localhost"
): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, host, () => {
      server.once("close", () => resolve(true));
      server.close();
    });
    server.on("error", () => resolve(false));
  });
}

/**
 * Gets local IP address
 * @returns Local IP address
 * @example
 * const ip = getLocalIP()
 */
export function getLocalIP(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
}

/**
 * Validates IP address
 * @param ip - IP address to validate
 * @returns True if valid IP
 * @example
 * const isValid = isValidIP('192.168.1.1')
 */
export function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * Finds an available port
 * @param startPort - Starting port number
 * @param maxPort - Maximum port number
 * @returns Promise with available port or null
 * @example
 * const port = await findAvailablePort(3000, 3100)
 */
export async function findAvailablePort(
  startPort: number,
  maxPort: number = startPort + 100
): Promise<number | null> {
  for (let port = startPort; port <= maxPort; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  return null;
}

/**
 * Validates URL format
 * @param url - URL to validate
 * @returns True if valid URL
 * @example
 * const isValid = isValidUrlFormat('https://example.com')
 */
export function isValidUrlFormat(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parses URL into components
 * @param url - URL to parse
 * @returns Parsed URL object
 * @example
 * const parsed = parseUrl('https://example.com/path?key=value')
 */
export function parseUrl(url: string): {
  protocol: string;
  host: string;
  pathname: string;
  search: string;
  hash: string;
} {
  const urlObj = new URL(url);
  return {
    protocol: urlObj.protocol,
    host: urlObj.host,
    pathname: urlObj.pathname,
    search: urlObj.search,
    hash: urlObj.hash,
  };
}
