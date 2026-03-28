/**
 * Database Utilities
 * Utilities for database operations
 */

/**
 * Escapes SQL string
 * @param str - String to escape
 * @returns Escaped string
 * @example
 * const escaped = escapeSQL("O'Brien") // "O''Brien"
 */
export function escapeSQL(str: string): string {
  return str.replace(/'/g, "''");
}

/**
 * Builds a WHERE clause from conditions
 * @param conditions - Conditions object
 * @param operator - Logical operator (default: 'AND')
 * @returns WHERE clause string
 * @example
 * const where = buildWhereClause({ name: 'John', age: 30 })
 */
export function buildWhereClause(
  conditions: Record<string, any>,
  operator: "AND" | "OR" = "AND"
): string {
  const clauses = Object.entries(conditions).map(([key, value]) => {
    if (typeof value === "string") {
      return `${key} = '${escapeSQL(value)}'`;
    }
    return `${key} = ${value}`;
  });
  return clauses.join(` ${operator} `);
}

/**
 * Builds an INSERT statement
 * @param table - Table name
 * @param data - Data object
 * @returns INSERT statement
 * @example
 * const sql = buildInsert('users', { name: 'John', age: 30 })
 */
export function buildInsert(table: string, data: Record<string, any>): string {
  const keys = Object.keys(data);
  const values = keys.map((key) => {
    const value = data[key];
    if (typeof value === "string") {
      return `'${escapeSQL(value)}'`;
    }
    return value;
  });
  return `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${values.join(
    ", "
  )})`;
}

/**
 * Builds an UPDATE statement
 * @param table - Table name
 * @param data - Data object
 * @param where - WHERE conditions
 * @returns UPDATE statement
 * @example
 * const sql = buildUpdate('users', { age: 31 }, { id: 1 })
 */
export function buildUpdate(
  table: string,
  data: Record<string, any>,
  where: Record<string, any>
): string {
  const sets = Object.entries(data).map(([key, value]) => {
    if (typeof value === "string") {
      return `${key} = '${escapeSQL(value)}'`;
    }
    return `${key} = ${value}`;
  });
  const whereClause = buildWhereClause(where);
  return `UPDATE ${table} SET ${sets.join(", ")} WHERE ${whereClause}`;
}

/**
 * Builds a SELECT statement
 * @param table - Table name
 * @param columns - Column names (default: '*')
 * @param where - WHERE conditions (optional)
 * @param options - Additional options
 * @returns SELECT statement
 * @example
 * const sql = buildSelect('users', ['name', 'age'], { age: 30 }, { limit: 10 })
 */
export function buildSelect(
  table: string,
  columns: string[] = ["*"],
  where?: Record<string, any>,
  options?: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    order?: "ASC" | "DESC";
  }
): string {
  let sql = `SELECT ${columns.join(", ")} FROM ${table}`;
  if (where) {
    sql += ` WHERE ${buildWhereClause(where)}`;
  }
  if (options?.orderBy) {
    sql += ` ORDER BY ${options.orderBy} ${options.order || "ASC"}`;
  }
  if (options?.limit) {
    sql += ` LIMIT ${options.limit}`;
  }
  if (options?.offset) {
    sql += ` OFFSET ${options.offset}`;
  }
  return sql;
}

/**
 * Paginates query results
 * @param items - Array of items
 * @param page - Page number (1-based)
 * @param pageSize - Items per page
 * @returns Paginated result
 * @example
 * const result = paginate(items, 1, 10)
 */
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
} {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    items: items.slice(start, end),
    page,
    pageSize,
    total: items.length,
    totalPages: Math.ceil(items.length / pageSize),
  };
}

/**
 * Builds a DELETE statement
 * @param table - Table name
 * @param where - WHERE conditions
 * @returns DELETE statement
 * @example
 * const sql = buildDelete('users', { id: 1 })
 */
export function buildDelete(table: string, where: Record<string, any>): string {
  const whereClause = buildWhereClause(where);
  return `DELETE FROM ${table} WHERE ${whereClause}`;
}

/**
 * Builds a JOIN clause
 * @param type - Join type (INNER, LEFT, RIGHT, FULL)
 * @param table - Table to join
 * @param on - Join condition
 * @returns JOIN clause
 * @example
 * const join = buildJoin('INNER', 'orders', 'users.id = orders.user_id')
 */
export function buildJoin(
  type: "INNER" | "LEFT" | "RIGHT" | "FULL",
  table: string,
  on: string
): string {
  return `${type} JOIN ${table} ON ${on}`;
}

/**
 * Escapes SQL identifier (table/column name)
 * @param identifier - Identifier to escape
 * @param quote - Quote character (default: backtick)
 * @returns Escaped identifier
 * @example
 * const escaped = escapeIdentifier('user name') // `user name`
 */
export function escapeIdentifier(
  identifier: string,
  quote: string = "`"
): string {
  return `${quote}${identifier.replace(
    new RegExp(quote, "g"),
    quote + quote
  )}${quote}`;
}

/**
 * Builds ORDER BY clause
 * @param columns - Array of column names with optional direction
 * @returns ORDER BY clause
 * @example
 * const orderBy = buildOrderBy([{ column: 'name', direction: 'ASC' }, { column: 'age', direction: 'DESC' }])
 */
export function buildOrderBy(
  columns: Array<{ column: string; direction?: "ASC" | "DESC" }>
): string {
  return columns
    .map(({ column, direction = "ASC" }) => `${column} ${direction}`)
    .join(", ");
}
