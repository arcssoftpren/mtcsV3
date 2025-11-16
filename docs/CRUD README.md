# Crud Helper

A fluent MySQL CRUD helper class for Node.js using mysql2.

## Installation

Ensure you have mysql2 installed:

```bash
npm install mysql2
```

## Setup

Configure your database connection in `config/database.js`:

```javascript
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_user',
  password: 'your_password',
  database: 'your_database'
});

module.exports = { connection };
```

## Usage

### Basic Usage

```javascript
const Crud = require('./helper/crud');

// Create an instance for a table
const users = new Crud('users');

// Select all users
const allUsers = await users.get();

// Select specific columns
const userNames = await users.select('name', 'email').get();

// Insert a new user
const insertResult = await users.insert({ name: 'John Doe', email: 'john@example.com' });

// Update a user
const updateResult = await users.where('id', 1).update({ name: 'Jane Doe' });

// WHERE with operators
const inactiveUsers = await users.where('status!=', 'active').get();
const expensiveProducts = await users.where('price>', 100).get();
const usersLike = await users.where('name LIKE', '%john%').get();
```

### Chaining Methods

```javascript
const posts = new Crud('posts');

// Complex query with joins and conditions
const result = await posts
  .select('posts.title', 'users.name')
  .join('users', 'posts.user_id = users.id')
  .where('posts.status', 'published')
  .orderBy('posts.created_at', 'DESC')
  .limit(10)
  .get();
```

### WHERE with Operators

The `where` method supports various SQL operators by appending them to the column name:

```javascript
// Supported operators: =, !=, <>, >, <, >=, <=, LIKE, NOT LIKE, IN, NOT IN
const inactiveUsers = await users.where('status!=', 'active').get();
const expensiveProducts = await products.where('price>', 100).get();
const usersLike = await users.where('name LIKE', '%john%').get();
const notInList = await users.where('id NOT IN', [1,2,3]).get();
```

### WHERE IN

```javascript
const activeUsers = await users.whereIn('status', ['active', 'pending']).get();
```

### GROUP BY and ORDER BY

```javascript
const userCounts = await posts
  .select('user_id', 'COUNT(*) as post_count')
  .groupBy('user_id')
  .orderBy('post_count', 'DESC')
  .get();
```

## API Reference

### Constructor

- `new Crud(table)`: Creates a new Crud instance for the specified table.

### Query Building Methods

- `select(columns)`: Specify columns to select. Accepts string or array.
- `where(column, value)`: Add WHERE condition. Supports operators by appending to column (e.g., 'column!=') . Supported: =, !=, <>, >, <, >=, <=, LIKE, NOT LIKE, IN, NOT IN.
- `join(table, condition, type)`: Add JOIN clause. Type defaults to 'INNER'.
- `whereIn(column, values)`: Add WHERE IN condition.
- `orderBy(column, direction)`: Add ORDER BY. Direction 'ASC' or 'DESC'.
- `groupBy(column)`: Add GROUP BY.
- `limit(count, offset)`: Add LIMIT with optional offset.

### Execution Methods

- `get()`: Execute SELECT query and return results.
- `insert(data)`: Insert new record. Data is an object of column-value pairs.
- `update(data)`: Update records matching WHERE conditions.
- `delete()`: Delete records matching WHERE conditions.

### Utility Methods

- `reset()`: Reset the query builder state for reuse.

## Notes

- All methods return `this` for chaining except execution methods.
- Execution methods automatically reset the builder state.
- Ensure WHERE conditions are set before update/delete operations.
- Values are automatically escaped to prevent SQL injection.