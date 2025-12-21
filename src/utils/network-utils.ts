/**
 * Network Utilities
 * Utilities for network operations
 */

import * as net from "net";
import * as os from "os";
import * as dns from "dns";
import { promisify } from "util";

const dnsLookup = promisify(dns.lookup);
const dnsResolve4 = promisify(dns.resolve4);
const dnsResolve6 = promisify(dns.resolve6);
const dnsReverse = promisify(dns.reverse);

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

// ============================================================================
// DNS Resolution
// ============================================================================

/**
 * Resolves a hostname to an IP address
 * @param hostname - Hostname to resolve
 * @param options - Resolution options
 * @returns Promise with IP address(es)
 * @example
 * const ip = await resolveDNS('example.com')
 */
export async function resolveDNS(
  hostname: string,
  options?: { family?: 4 | 6; all?: boolean }
): Promise<string | string[]> {
  try {
    if (options?.all) {
      const addresses = await dnsLookup(hostname, { all: true });
      return addresses.map((addr) => addr.address);
    }

    const result = await dnsLookup(hostname, {
      family: options?.family || 4,
    });
    return result.address;
  } catch (error) {
    throw new Error(`DNS resolution failed for ${hostname}: ${error}`);
  }
}

/**
 * Resolves a hostname to IPv4 addresses
 * @param hostname - Hostname to resolve
 * @returns Promise with IPv4 addresses
 * @example
 * const ips = await resolveIPv4('example.com')
 */
export async function resolveIPv4(hostname: string): Promise<string[]> {
  try {
    return await dnsResolve4(hostname);
  } catch (error) {
    throw new Error(`IPv4 resolution failed for ${hostname}: ${error}`);
  }
}

/**
 * Resolves a hostname to IPv6 addresses
 * @param hostname - Hostname to resolve
 * @returns Promise with IPv6 addresses
 * @example
 * const ips = await resolveIPv6('example.com')
 */
export async function resolveIPv6(hostname: string): Promise<string[]> {
  try {
    return await dnsResolve6(hostname);
  } catch (error) {
    throw new Error(`IPv6 resolution failed for ${hostname}: ${error}`);
  }
}

/**
 * Performs reverse DNS lookup (PTR record)
 * @param ip - IP address
 * @returns Promise with hostname(s)
 * @example
 * const hostnames = await reverseDNS('8.8.8.8')
 */
export async function reverseDNS(ip: string): Promise<string[]> {
  try {
    return await dnsReverse(ip);
  } catch (error) {
    throw new Error(`Reverse DNS lookup failed for ${ip}: ${error}`);
  }
}

// ============================================================================
// Network Interface Enumeration
// ============================================================================

/**
 * Network interface information
 */
export interface NetworkInterface {
  name: string;
  address: string;
  netmask: string;
  family: "IPv4" | "IPv6";
  mac: string;
  internal: boolean;
}

/**
 * Gets all network interfaces with detailed information
 * @returns Array of network interface information
 * @example
 * const interfaces = getNetworkInterfaces()
 */
export function getNetworkInterfaces(): NetworkInterface[] {
  const interfaces = os.networkInterfaces();
  const result: NetworkInterface[] = [];

  for (const [name, addrs] of Object.entries(interfaces)) {
    if (!addrs) continue;

    for (const addr of addrs) {
      result.push({
        name,
        address: addr.address,
        netmask: addr.netmask,
        family: addr.family === "IPv4" ? "IPv4" : "IPv6",
        mac: addr.mac,
        internal: addr.internal,
      });
    }
  }

  return result;
}

/**
 * Gets network interfaces by name
 * @param name - Interface name
 * @returns Array of network interface information
 * @example
 * const eth0 = getNetworkInterfaceByName('eth0')
 */
export function getNetworkInterfaceByName(
  name: string
): NetworkInterface[] {
  const interfaces = os.networkInterfaces();
  const iface = interfaces[name];
  if (!iface) return [];

  return iface.map((addr) => ({
    name,
    address: addr.address,
    netmask: addr.netmask,
    family: addr.family === "IPv4" ? "IPv4" : "IPv6",
    mac: addr.mac,
    internal: addr.internal,
  }));
}

// ============================================================================
// Network Latency Measurement
// ============================================================================

/**
 * Measures network latency to a host
 * @param host - Hostname or IP address
 * @param port - Port number (default: 80)
 * @param timeout - Timeout in milliseconds (default: 5000)
 * @returns Promise with latency in milliseconds
 * @example
 * const latency = await measureLatency('example.com', 80)
 */
export async function measureLatency(
  host: string,
  port: number = 80,
  timeout: number = 5000
): Promise<number> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const socket = net.createConnection({ host, port, timeout });

    socket.on("connect", () => {
      const latency = Date.now() - startTime;
      socket.destroy();
      resolve(latency);
    });

    socket.on("timeout", () => {
      socket.destroy();
      reject(new Error(`Connection timeout to ${host}:${port}`));
    });

    socket.on("error", (error) => {
      reject(new Error(`Connection error to ${host}:${port}: ${error.message}`));
    });
  });
}

/**
 * Measures network latency multiple times and returns statistics
 * @param host - Hostname or IP address
 * @param port - Port number (default: 80)
 * @param count - Number of measurements (default: 5)
 * @param timeout - Timeout per measurement in milliseconds (default: 5000)
 * @returns Promise with latency statistics
 * @example
 * const stats = await measureLatencyStats('example.com', 80, 10)
 */
export async function measureLatencyStats(
  host: string,
  port: number = 80,
  count: number = 5,
  timeout: number = 5000
): Promise<{
  min: number;
  max: number;
  avg: number;
  median: number;
  measurements: number[];
}> {
  const measurements: number[] = [];

  for (let i = 0; i < count; i++) {
    try {
      const latency = await measureLatency(host, port, timeout);
      measurements.push(latency);
      // Small delay between measurements
      if (i < count - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch {
      // Skip failed measurements
      continue;
    }
  }

  if (measurements.length === 0) {
    throw new Error(`All latency measurements failed for ${host}:${port}`);
  }

  measurements.sort((a, b) => a - b);
  const sum = measurements.reduce((acc, val) => acc + val, 0);
  const avg = sum / measurements.length;
  const median =
    measurements.length % 2 === 0
      ? (measurements[measurements.length / 2 - 1] +
          measurements[measurements.length / 2]) /
        2
      : measurements[Math.floor(measurements.length / 2)];

  return {
    min: measurements[0],
    max: measurements[measurements.length - 1],
    avg,
    median,
    measurements,
  };
}

// ============================================================================
// Bandwidth Testing
// ============================================================================

/**
 * Measures download bandwidth by downloading data from a URL
 * @param url - URL to download from
 * @param duration - Test duration in milliseconds (default: 5000)
 * @returns Promise with bandwidth in bytes per second
 * @example
 * const bandwidth = await measureDownloadBandwidth('https://example.com/file')
 */
export async function measureDownloadBandwidth(
  url: string,
  duration: number = 5000
): Promise<number> {
  const startTime = Date.now();
  let totalBytes = 0;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body is not readable");
    }

    const endTime = startTime + duration;

    while (Date.now() < endTime) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.length;
    }

    reader.cancel();

    const elapsed = Date.now() - startTime;
    return (totalBytes / elapsed) * 1000; // bytes per second
  } catch (error) {
    throw new Error(`Bandwidth test failed: ${error}`);
  }
}

/**
 * Measures upload bandwidth by uploading data to a URL
 * @param url - URL to upload to
 * @param dataSize - Size of data to upload in bytes (default: 1024 * 1024 = 1MB)
 * @returns Promise with bandwidth in bytes per second
 * @example
 * const bandwidth = await measureUploadBandwidth('https://example.com/upload')
 */
export async function measureUploadBandwidth(
  url: string,
  dataSize: number = 1024 * 1024
): Promise<number> {
  const startTime = Date.now();
  const testData = new Uint8Array(dataSize).fill(0);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: testData,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const elapsed = Date.now() - startTime;
    return (dataSize / elapsed) * 1000; // bytes per second
  } catch (error) {
    throw new Error(`Upload bandwidth test failed: ${error}`);
  }
}

/**
 * Formats bandwidth in human-readable format
 * @param bytesPerSecond - Bandwidth in bytes per second
 * @returns Formatted string (e.g., "1.5 MB/s")
 * @example
 * const formatted = formatBandwidth(1572864) // '1.5 MB/s'
 */
export function formatBandwidth(bytesPerSecond: number): string {
  const units = ["B/s", "KB/s", "MB/s", "GB/s", "TB/s"];
  let size = bytesPerSecond;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

// ============================================================================
// WebSocket Utilities
// ============================================================================

/**
 * WebSocket connection options
 */
export interface WebSocketOptions {
  protocols?: string | string[];
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * Creates a WebSocket connection with timeout and error handling
 * @param url - WebSocket URL
 * @param options - Connection options
 * @returns Promise with WebSocket instance
 * @example
 * const ws = await createWebSocket('ws://example.com/ws')
 */
export async function createWebSocket(
  url: string,
  options: WebSocketOptions = {}
): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    let timeoutId: NodeJS.Timeout | undefined;

    try {
      const ws = new WebSocket(url, options.protocols);

      if (options.timeout) {
        timeoutId = setTimeout(() => {
          ws.close();
          reject(new Error(`WebSocket connection timeout: ${url}`));
        }, options.timeout);
      }

      ws.onopen = () => {
        if (timeoutId) clearTimeout(timeoutId);
        resolve(ws);
      };

      ws.onerror = () => {
        if (timeoutId) clearTimeout(timeoutId);
        reject(new Error(`WebSocket connection error: ${url}`));
      };
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      reject(new Error(`Failed to create WebSocket: ${error}`));
    }
  });
}

/**
 * Sends a message through WebSocket and waits for response
 * @param ws - WebSocket instance
 * @param message - Message to send
 * @param timeout - Timeout in milliseconds (default: 5000)
 * @returns Promise with response message
 * @example
 * const response = await sendWebSocketMessage(ws, 'ping')
 */
export function sendWebSocketMessage(
  ws: WebSocket,
  message: string | ArrayBuffer | Blob,
  timeout: number = 5000
): Promise<string | ArrayBuffer> {
  return new Promise((resolve, reject) => {
    if (ws.readyState !== WebSocket.OPEN) {
      reject(new Error("WebSocket is not open"));
      return;
    }

    const timeoutId = setTimeout(() => {
      ws.removeEventListener("message", messageHandler);
      ws.removeEventListener("error", errorHandler);
      reject(new Error("WebSocket message timeout"));
    }, timeout);

    const messageHandler = (event: MessageEvent) => {
      clearTimeout(timeoutId);
      ws.removeEventListener("message", messageHandler);
      ws.removeEventListener("error", errorHandler);
      resolve(event.data);
    };

    const errorHandler = (error: Event) => {
      clearTimeout(timeoutId);
      ws.removeEventListener("message", messageHandler);
      ws.removeEventListener("error", errorHandler);
      reject(new Error(`WebSocket error: ${error}`));
    };

    ws.addEventListener("message", messageHandler);
    ws.addEventListener("error", errorHandler);
    ws.send(message);
  });
}
