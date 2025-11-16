const connection = require("../config/database").connection;

/**
 * A fluent interface for building and executing MySQL CRUD operations.
 * Supports SELECT, INSERT, UPDATE, DELETE with chaining methods for WHERE, JOIN, ORDER BY, etc.
 */
class Crud {
  /**
   * Creates a new Crud instance for a specific table.
   * @param {string} table - The name of the database table.
   */
  constructor(table) {
    this.table = table;
    this.whereArray = [];
    this.joinArray = [];
    this.whereQuery = "";
    this.orderByQuery = "";
    this.joinQuery = "";
    this.groupByQuery = "";
    this.whereInQuery = "";
    this.limitQuery = "";
    this.selectArray = [];
  }

  /**
   * Specifies columns to select. Defaults to '*' if not called.
   * @param {string|string[]} columns - Column names to select.
   * @returns {Crud} This instance for chaining.
   */
  select(columns = "*") {
    this.selectArray.push(columns);
    return this;
  }

  /**
   * Adds a WHERE condition. Supports operators by appending them to the column name (e.g., 'column!=').
   * Supported operators: =, !=, <>, >, <, >=, <=, LIKE, NOT LIKE, IN, NOT IN.
   * @param {string} column - The column name, optionally with operator.
   * @param {*} value - The value to match.
   * @returns {Crud} This instance for chaining.
   */
  where(column, value) {
    const match = column.match(
      /^(.+?)(=|!=|<>|>|<|>=|<=|LIKE|NOT LIKE|IN|NOT IN)$/i
    );
    let operator = "=";
    if (match) {
      column = match[1];
      operator = match[2];
    }
    this.whereArray.push({ column, operator, value });
    return this;
  }

  /**
   * Adds a JOIN clause.
   * @param {string} table - The table to join.
   * @param {string} condition - The join condition (e.g., 'users.id = posts.user_id').
   * @param {string} type - The join type ('INNER', 'LEFT', 'RIGHT', 'FULL'). Defaults to 'INNER'.
   * @returns {Crud} This instance for chaining.
   */
  join(table, condition, type = "INNER") {
    this.joinArray.push({ table, condition, type });
    return this;
  }

  /**
   * Adds a WHERE IN condition.
   * @param {string} column - The column name.
   * @param {Array} values - Array of values to match.
   * @returns {Crud} This instance for chaining.
   */
  whereIn(column, values) {
    this.whereInQuery = `WHERE ${column} IN (${values.join(", ")})`;
    return this;
  }

  /**
   * Adds an ORDER BY clause.
   * @param {string} column - The column to order by.
   * @param {string} direction - 'ASC' or 'DESC'. Defaults to 'ASC'.
   * @returns {Crud} This instance for chaining.
   */
  orderBy(column, direction = "ASC") {
    this.orderByQuery = `ORDER BY ${column} ${direction}`;
    return this;
  }

  /**
   * Adds a GROUP BY clause.
   * @param {string} column - The column to group by.
   * @returns {Crud} This instance for chaining.
   */
  groupBy(column) {
    this.groupByQuery = `GROUP BY ${column}`;
    return this;
  }

  /**
   * Adds a LIMIT clause.
   * @param {number} count - Number of records to limit.
   * @param {number} offset - Offset for pagination. Defaults to 0.
   * @returns {Crud} This instance for chaining.
   */
  limit(count, offset = 0) {
    this.limitQuery = `LIMIT ${count} OFFSET ${offset}`;
    return this;
  }

  /**
   * Executes the SELECT query and returns the results.
   * @returns {Promise<Array>} Array of result rows.
   */
  async get() {
    try {
      const query = this.buildQuery();
      const [rows] = await connection.promise().query(query);
      this.reset();
      return rows;
    } catch (error) {
      this.reset();
      throw error;
    }
  }

  /**
   * Builds the SELECT query string from the chained methods.
   * @returns {string} The SQL query string.
   */
  buildQuery() {
    if (this.joinArray.length > 0) {
      this.joinQuery = this.joinArray
        .map(
          ({ table, condition, type }) =>
            `${type} JOIN ${table} ON ${condition}`
        )
        .join(" ");
    } else {
      this.joinQuery = "";
    }
    if (this.whereArray.length > 0) {
      const whereConditions = this.whereArray
        .map(
          ({ column, operator, value }) =>
            `${column} ${operator} ${connection.escape(value)}`
        )
        .join(" AND ");
      this.whereQuery = `WHERE ${whereConditions}`;
    } else {
      this.whereQuery = "";
    }
    if (this.whereInQuery) {
      if (this.whereQuery) {
        this.whereQuery += ` AND ${this.whereInQuery.replace("WHERE ", "")}`;
      } else {
        this.whereQuery = this.whereInQuery;
      }
    }
    const selectColumns = this.selectArray.join(", ") || "*";
    const query =
      `SELECT ${selectColumns} FROM ${this.table} ${this.joinQuery} ${this.whereQuery} ${this.groupByQuery} ${this.orderByQuery} ${this.limitQuery}`
        .trim()
        .replace(/\s+/g, " ");
    return query;
  }

  /**
   * Inserts a new record into the table.
   * @param {Object} data - Object with column-value pairs to insert.
   * @returns {Promise<Object>} The insert result.
   */
  async insert(data) {
    try {
      const [result] = await connection
        .promise()
        .query(`INSERT INTO ${this.table} SET ?`, data);
      this.reset();
      return result;
    } catch (error) {
      this.reset();
      throw error;
    }
  }

  /**
   * Updates records matching the WHERE conditions.
   * @param {Object} data - Object with column-value pairs to update.
   * @returns {Promise<Object>} The update result.
   */
  async update(data) {
    try {
      const query = this.buildUpdateQuery(data);
      const [result] = await connection.promise().query(query);
      this.reset();
      return result;
    } catch (error) {
      this.reset();
      throw error;
    }
  }

  /**
   * Builds the UPDATE query string.
   * @param {Object} data - Data to update.
   * @returns {string} The SQL UPDATE query.
   */
  buildUpdateQuery(data) {
    if (this.whereArray.length === 0) {
      throw new Error(
        "Update operation requires at least one WHERE condition."
      );
    }
    const setClause = Object.keys(data)
      .map((key) => `${key} = ${connection.escape(data[key])}`)
      .join(", ");
    const whereClause = this.whereArray
      .map(
        ({ column, operator, value }) =>
          `${column} ${operator} ${connection.escape(value)}`
      )
      .join(" AND ");
    return `UPDATE ${this.table} SET ${setClause} WHERE ${whereClause}`;
  }

  /**
   * Deletes records matching the WHERE conditions.
   * @returns {Promise<Object>} The delete result.
   */
  async delete() {
    try {
      if (this.whereArray.length === 0) {
        throw new Error(
          "Delete operation requires at least one WHERE condition."
        );
      }
      const whereClause = this.whereArray
        .map(
          ({ column, operator, value }) =>
            `${column} ${operator} ${connection.escape(value)}`
        )
        .join(" AND ");
      const query = `DELETE FROM ${this.table} WHERE ${whereClause}`;
      const [result] = await connection.promise().query(query);
      this.reset();
      return result;
    } catch (error) {
      this.reset();
      throw error;
    }
  }

  /**
   * Resets the query builder state for reuse.
   * @returns {Crud} This instance for chaining.
   */
  reset() {
    this.whereArray = [];
    this.joinArray = [];
    this.whereQuery = "";
    this.orderByQuery = "";
    this.joinQuery = "";
    this.groupByQuery = "";
    this.whereInQuery = "";
    this.limitQuery = "";
    this.selectArray = [];
    return this;
  }

  insertBatch(dataArray) {
    return Promise.all(dataArray.map((data) => this.insert(data)));
  }
}

module.exports = Crud;
