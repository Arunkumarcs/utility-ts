/**
 * Math Utilities
 * Utilities for mathematical operations
 */

/**
 * Clamps a number between min and max
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 * @example
 * const clamped = clamp(15, 0, 10) // 10
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 * @param start - Start value
 * @param end - End value
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated value
 * @example
 * const value = lerp(0, 100, 0.5) // 50
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Maps a value from one range to another
 * @param value - Value to map
 * @param fromMin - Source range minimum
 * @param fromMax - Source range maximum
 * @param toMin - Target range minimum
 * @param toMax - Target range maximum
 * @returns Mapped value
 * @example
 * const mapped = mapRange(5, 0, 10, 0, 100) // 50
 */
export function mapRange(
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number {
  return ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin;
}

/**
 * Rounds a number to specified decimal places
 * @param value - Value to round
 * @param decimals - Number of decimal places
 * @returns Rounded value
 * @example
 * const rounded = round(3.14159, 2) // 3.14
 */
export function round(value: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Generates a random number between min and max
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random number
 * @example
 * const random = randomBetween(1, 10)
 */
export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generates a random integer between min and max (inclusive)
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random integer
 * @example
 * const random = randomIntBetween(1, 10)
 */
export function randomIntBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculates percentage
 * @param value - Value
 * @param total - Total value
 * @returns Percentage
 * @example
 * const percent = percentage(25, 100) // 25
 */
export function percentage(value: number, total: number): number {
  return total === 0 ? 0 : (value / total) * 100;
}

/**
 * Calculates value from percentage
 * @param percent - Percentage
 * @param total - Total value
 * @returns Value
 * @example
 * const value = fromPercentage(25, 100) // 25
 */
export function fromPercentage(percent: number, total: number): number {
  return (percent / 100) * total;
}

/**
 * Checks if number is even
 * @param value - Number to check
 * @returns True if even
 * @example
 * const isEven = isEven(4) // true
 */
export function isEven(value: number): boolean {
  return value % 2 === 0;
}

/**
 * Checks if number is odd
 * @param value - Number to check
 * @returns True if odd
 * @example
 * const isOdd = isOdd(3) // true
 */
export function isOdd(value: number): boolean {
  return value % 2 !== 0;
}

/**
 * Calculates factorial
 * @param n - Number
 * @returns Factorial
 * @example
 * const fact = factorial(5) // 120
 */
export function factorial(n: number): number {
  if (n < 0) {
    throw new Error("Factorial is not defined for negative numbers");
  }
  if (n === 0 || n === 1) {
    return 1;
  }
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Calculates greatest common divisor
 * @param a - First number
 * @param b - Second number
 * @returns GCD
 * @example
 * const gcd = greatestCommonDivisor(48, 18) // 6
 */
export function greatestCommonDivisor(a: number, b: number): number {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return Math.abs(a);
}

/**
 * Calculates least common multiple
 * @param a - First number
 * @param b - Second number
 * @returns LCM
 * @example
 * const lcm = leastCommonMultiple(4, 6) // 12
 */
export function leastCommonMultiple(a: number, b: number): number {
  return Math.abs(a * b) / greatestCommonDivisor(a, b);
}

/**
 * Converts degrees to radians
 * @param degrees - Degrees
 * @returns Radians
 * @example
 * const radians = degreesToRadians(180) // Math.PI
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Converts radians to degrees
 * @param radians - Radians
 * @returns Degrees
 * @example
 * const degrees = radiansToDegrees(Math.PI) // 180
 */
export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

// ============================================================================
// Statistical Functions
// ============================================================================

/**
 * Calculates the mean (average) of an array of numbers
 * @param numbers - Array of numbers
 * @returns Mean value
 * @example
 * const avg = mean([1, 2, 3, 4, 5]) // 3
 */
export function mean(numbers: number[]): number {
  if (numbers.length === 0) {
    return 0;
  }
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  return sum / numbers.length;
}

/**
 * Calculates the median of an array of numbers
 * @param numbers - Array of numbers
 * @returns Median value
 * @example
 * const med = median([1, 3, 2, 5, 4]) // 3
 */
export function median(numbers: number[]): number {
  if (numbers.length === 0) {
    return 0;
  }
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/**
 * Calculates the mode (most frequent value) of an array of numbers
 * @param numbers - Array of numbers
 * @returns Mode value(s) - array if multiple modes exist
 * @example
 * const mod = mode([1, 2, 2, 3, 3, 3]) // 3
 */
export function mode(numbers: number[]): number | number[] {
  if (numbers.length === 0) {
    return 0;
  }
  const frequency: Record<number, number> = {};
  let maxFreq = 0;

  for (const num of numbers) {
    frequency[num] = (frequency[num] || 0) + 1;
    maxFreq = Math.max(maxFreq, frequency[num]);
  }

  const modes = Object.keys(frequency)
    .map(Number)
    .filter((num) => frequency[num] === maxFreq);

  return modes.length === 1 ? modes[0] : modes;
}

/**
 * Calculates the variance of an array of numbers
 * @param numbers - Array of numbers
 * @param sample - Whether to calculate sample variance (default: false, population variance)
 * @returns Variance
 * @example
 * const var = variance([1, 2, 3, 4, 5]) // 2
 */
export function variance(numbers: number[], sample: boolean = false): number {
  if (numbers.length === 0) {
    return 0;
  }
  const avg = mean(numbers);
  const squaredDiffs = numbers.map((num) => Math.pow(num - avg, 2));
  const sum = squaredDiffs.reduce((acc, val) => acc + val, 0);
  const divisor = sample ? numbers.length - 1 : numbers.length;
  return divisor === 0 ? 0 : sum / divisor;
}

/**
 * Calculates the standard deviation of an array of numbers
 * @param numbers - Array of numbers
 * @param sample - Whether to calculate sample standard deviation (default: false)
 * @returns Standard deviation
 * @example
 * const std = standardDeviation([1, 2, 3, 4, 5]) // ~1.414
 */
export function standardDeviation(
  numbers: number[],
  sample: boolean = false
): number {
  return Math.sqrt(variance(numbers, sample));
}

// ============================================================================
// Financial Calculations
// ============================================================================

/**
 * Calculates compound interest
 * @param principal - Initial amount
 * @param rate - Annual interest rate (as decimal, e.g., 0.05 for 5%)
 * @param time - Time period in years
 * @param compoundingFrequency - Number of times interest compounds per year (default: 1)
 * @returns Final amount after compound interest
 * @example
 * const amount = compoundInterest(1000, 0.05, 10, 12) // ~1647.01
 */
export function compoundInterest(
  principal: number,
  rate: number,
  time: number,
  compoundingFrequency: number = 1
): number {
  return (
    principal * Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * time)
  );
}

/**
 * Calculates present value
 * @param futureValue - Future value
 * @param rate - Discount rate (as decimal)
 * @param time - Time period in years
 * @returns Present value
 * @example
 * const pv = presentValue(1000, 0.05, 10) // ~613.91
 */
export function presentValue(
  futureValue: number,
  rate: number,
  time: number
): number {
  return futureValue / Math.pow(1 + rate, time);
}

/**
 * Calculates future value
 * @param presentValue - Present value
 * @param rate - Interest rate (as decimal)
 * @param time - Time period in years
 * @returns Future value
 * @example
 * const fv = futureValue(1000, 0.05, 10) // ~1628.89
 */
export function futureValue(
  presentValue: number,
  rate: number,
  time: number
): number {
  return presentValue * Math.pow(1 + rate, time);
}

// ============================================================================
// Geometric Functions
// ============================================================================

/**
 * Calculates the distance between two points in 2D
 * @param x1 - X coordinate of first point
 * @param y1 - Y coordinate of first point
 * @param x2 - X coordinate of second point
 * @param y2 - Y coordinate of second point
 * @returns Distance
 * @example
 * const dist = distance2D(0, 0, 3, 4) // 5
 */
export function distance2D(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Calculates the distance between two points in 3D
 * @param x1 - X coordinate of first point
 * @param y1 - Y coordinate of first point
 * @param z1 - Z coordinate of first point
 * @param x2 - X coordinate of second point
 * @param y2 - Y coordinate of second point
 * @param z2 - Z coordinate of second point
 * @returns Distance
 * @example
 * const dist = distance3D(0, 0, 0, 3, 4, 5) // ~7.071
 */
export function distance3D(
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number
): number {
  return Math.sqrt(
    Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)
  );
}

/**
 * Calculates the area of a circle
 * @param radius - Radius of the circle
 * @returns Area
 * @example
 * const area = circleArea(5) // ~78.54
 */
export function circleArea(radius: number): number {
  return Math.PI * Math.pow(radius, 2);
}

/**
 * Calculates the circumference of a circle
 * @param radius - Radius of the circle
 * @returns Circumference
 * @example
 * const circ = circleCircumference(5) // ~31.416
 */
export function circleCircumference(radius: number): number {
  return 2 * Math.PI * radius;
}

/**
 * Calculates the area of a rectangle
 * @param width - Width
 * @param height - Height
 * @returns Area
 * @example
 * const area = rectangleArea(5, 10) // 50
 */
export function rectangleArea(width: number, height: number): number {
  return width * height;
}

/**
 * Calculates the area of a triangle
 * @param base - Base length
 * @param height - Height
 * @returns Area
 * @example
 * const area = triangleArea(5, 10) // 25
 */
export function triangleArea(base: number, height: number): number {
  return (base * height) / 2;
}

// ============================================================================
// Matrix Operations
// ============================================================================

/**
 * Type alias for a matrix (2D array of numbers)
 */
export type Matrix = number[][];

/**
 * Creates a matrix of specified dimensions filled with a value
 * @param rows - Number of rows
 * @param cols - Number of columns
 * @param fillValue - Value to fill (default: 0)
 * @returns Matrix
 * @example
 * const matrix = createMatrix(2, 3, 0) // [[0, 0, 0], [0, 0, 0]]
 */
export function createMatrix(
  rows: number,
  cols: number,
  fillValue: number = 0
): Matrix {
  return Array.from({ length: rows }, () => Array(cols).fill(fillValue));
}

/**
 * Creates an identity matrix
 * @param size - Size of the matrix (n x n)
 * @returns Identity matrix
 * @example
 * const identity = identityMatrix(3) // [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
 */
export function identityMatrix(size: number): Matrix {
  const matrix = createMatrix(size, size, 0);
  for (let i = 0; i < size; i++) {
    matrix[i][i] = 1;
  }
  return matrix;
}

/**
 * Adds two matrices
 * @param matrixA - First matrix
 * @param matrixB - Second matrix
 * @returns Sum matrix
 * @example
 * const sum = addMatrices([[1, 2], [3, 4]], [[5, 6], [7, 8]]) // [[6, 8], [10, 12]]
 */
export function addMatrices(matrixA: Matrix, matrixB: Matrix): Matrix {
  if (
    matrixA.length !== matrixB.length ||
    matrixA[0]?.length !== matrixB[0]?.length
  ) {
    throw new Error("Matrices must have the same dimensions");
  }

  return matrixA.map((row, i) =>
    row.map((val, j) => val + (matrixB[i]?.[j] ?? 0))
  );
}

/**
 * Subtracts two matrices
 * @param matrixA - First matrix
 * @param matrixB - Second matrix
 * @returns Difference matrix
 * @example
 * const diff = subtractMatrices([[5, 6], [7, 8]], [[1, 2], [3, 4]]) // [[4, 4], [4, 4]]
 */
export function subtractMatrices(matrixA: Matrix, matrixB: Matrix): Matrix {
  if (
    matrixA.length !== matrixB.length ||
    matrixA[0]?.length !== matrixB[0]?.length
  ) {
    throw new Error("Matrices must have the same dimensions");
  }

  return matrixA.map((row, i) =>
    row.map((val, j) => val - (matrixB[i]?.[j] ?? 0))
  );
}

/**
 * Multiplies two matrices
 * @param matrixA - First matrix
 * @param matrixB - Second matrix
 * @returns Product matrix
 * @example
 * const product = multiplyMatrices([[1, 2], [3, 4]], [[5, 6], [7, 8]]) // [[19, 22], [43, 50]]
 */
export function multiplyMatrices(matrixA: Matrix, matrixB: Matrix): Matrix {
  const aRows = matrixA.length;
  const aCols = matrixA[0]?.length ?? 0;
  const bRows = matrixB.length;
  const bCols = matrixB[0]?.length ?? 0;

  if (aCols !== bRows) {
    throw new Error(
      "Number of columns in first matrix must equal number of rows in second matrix"
    );
  }

  const result = createMatrix(aRows, bCols, 0);

  for (let i = 0; i < aRows; i++) {
    for (let j = 0; j < bCols; j++) {
      for (let k = 0; k < aCols; k++) {
        result[i][j] += (matrixA[i]?.[k] ?? 0) * (matrixB[k]?.[j] ?? 0);
      }
    }
  }

  return result;
}

/**
 * Multiplies a matrix by a scalar
 * @param matrix - Matrix
 * @param scalar - Scalar value
 * @returns Scaled matrix
 * @example
 * const scaled = scaleMatrix([[1, 2], [3, 4]], 2) // [[2, 4], [6, 8]]
 */
export function scaleMatrix(matrix: Matrix, scalar: number): Matrix {
  return matrix.map((row) => row.map((val) => val * scalar));
}

/**
 * Transposes a matrix
 * @param matrix - Matrix to transpose
 * @returns Transposed matrix
 * @example
 * const transposed = transposeMatrix([[1, 2], [3, 4]]) // [[1, 3], [2, 4]]
 */
export function transposeMatrix(matrix: Matrix): Matrix {
  if (matrix.length === 0) {
    return [];
  }
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const result = createMatrix(cols, rows, 0);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = matrix[i]?.[j] ?? 0;
    }
  }

  return result;
}

/**
 * Calculates the determinant of a 2x2 matrix
 * @param matrix - 2x2 matrix
 * @returns Determinant
 * @example
 * const det = determinant2x2([[1, 2], [3, 4]]) // -2
 */
export function determinant2x2(matrix: Matrix): number {
  if (matrix.length !== 2 || matrix[0]?.length !== 2) {
    throw new Error("Matrix must be 2x2");
  }
  return (matrix[0]?.[0] ?? 0) * (matrix[1]?.[1] ?? 0) - (matrix[0]?.[1] ?? 0) * (matrix[1]?.[0] ?? 0);
}

// ============================================================================
// Linear Algebra Helpers
// ============================================================================

/**
 * Calculates the dot product of two vectors
 * @param vectorA - First vector
 * @param vectorB - Second vector
 * @returns Dot product
 * @example
 * const dot = dotProduct([1, 2, 3], [4, 5, 6]) // 32
 */
export function dotProduct(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length) {
    throw new Error("Vectors must have the same length");
  }
  return vectorA.reduce((sum, val, i) => sum + val * (vectorB[i] ?? 0), 0);
}

/**
 * Calculates the cross product of two 3D vectors
 * @param vectorA - First vector [x, y, z]
 * @param vectorB - Second vector [x, y, z]
 * @returns Cross product vector
 * @example
 * const cross = crossProduct([1, 0, 0], [0, 1, 0]) // [0, 0, 1]
 */
export function crossProduct(
  vectorA: [number, number, number],
  vectorB: [number, number, number]
): [number, number, number] {
  return [
    vectorA[1] * vectorB[2] - vectorA[2] * vectorB[1],
    vectorA[2] * vectorB[0] - vectorA[0] * vectorB[2],
    vectorA[0] * vectorB[1] - vectorA[1] * vectorB[0],
  ];
}

/**
 * Calculates the magnitude (length) of a vector
 * @param vector - Vector
 * @returns Magnitude
 * @example
 * const mag = vectorMagnitude([3, 4]) // 5
 */
export function vectorMagnitude(vector: number[]): number {
  return Math.sqrt(vector.reduce((sum, val) => sum + Math.pow(val, 2), 0));
}

/**
 * Normalizes a vector (unit vector)
 * @param vector - Vector to normalize
 * @returns Normalized vector
 * @example
 * const normalized = normalizeVector([3, 4]) // [0.6, 0.8]
 */
export function normalizeVector(vector: number[]): number[] {
  const mag = vectorMagnitude(vector);
  if (mag === 0) {
    return vector.map(() => 0);
  }
  return vector.map((val) => val / mag);
}

// ============================================================================
// Number Formatting
// ============================================================================

/**
 * Formats a number as currency
 * @param amount - Amount to format
 * @param locale - Locale string (default: 'en-US')
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string
 * @example
 * const formatted = formatCurrency(1234.56) // '$1,234.56'
 */
export function formatCurrency(
  amount: number,
  locale: string = "en-US",
  currency: string = "USD"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Formats a number as percentage
 * @param value - Value to format (0-1 or 0-100)
 * @param decimals - Number of decimal places (default: 2)
 * @param asDecimal - Whether value is already a decimal (default: true)
 * @returns Formatted percentage string
 * @example
 * const formatted = formatPercentage(0.1234) // '12.34%'
 */
export function formatPercentage(
  value: number,
  decimals: number = 2,
  asDecimal: boolean = true
): string {
  const percentageValue = asDecimal ? value * 100 : value;
  return `${round(percentageValue, decimals)}%`;
}

/**
 * Formats a number with thousand separators
 * @param value - Number to format
 * @param locale - Locale string (default: 'en-US')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string
 * @example
 * const formatted = formatNumber(1234567.89) // '1,234,567.89'
 */
export function formatNumber(
  value: number,
  locale: string = "en-US",
  decimals: number = 2
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
