# eslint-plugin-kysely

eslint-plugin-kysely is a fork of eslint-plugin-kysely-rules.

ESLint plugin for enforcing safe database operations with Kysely. This plugin helps prevent common SQL-related issues and enforces best practices when working with Kysely.

## Features

- Enforces WHERE clauses to prevent accidental full table scans
- Ensures SELECT clauses are explicitly defined
- Prevents ambiguous column references in queries
- Additional rules for safe database operations

## Installation

```bash
npm install --save-dev eslint-plugin-kysely
```

## Configuration

### Basic Configuration

Add the plugin to your ESLint configuration:

```json
{
  "plugins": ["kysely"],
  "rules": {
    "kysely/enforce-where-clause": "error",
    "kysely/enforce-select-clause": "warn",
    "kysely/enforce-no-ambigious-columns": "error",
    "kysely/enforce-kysely-operators": "warn"
  }
}
```

### Recommended Configuration

For the best experience, you can use the recommended configuration which enables all rules with sensible defaults:

```json
{
  "extends": ["plugin:kysely/recommended"]
}
```

This is equivalent to:

```json
{
  "plugins": ["kysely"],
  "rules": {
    "kysely/enforce-where-clause": "error",
    "kysely/enforce-select-clause": "warn",
    "kysely/enforce-no-ambigious-columns": "error",
    "kysely/enforce-kysely-operators": "warn"
  }
}
```

## Available Rules

### enforce-where-clause

Prevents queries without WHERE clauses to avoid accidental full table scans.

```typescript
// ❌ Bad
db.selectFrom("users").selectAll();

// ✅ Good
db.selectFrom("users").where("id", "=", 1).selectAll();
```

### enforce-select-clause

Ensures that SELECT clauses are explicitly defined`.

```typescript
// ❌ Bad
db.selectFrom("users");

// ✅ Good
db.selectFrom("users").select(["id", "name", "email"]);
```

### enforce-no-ambigious-columns

Prevents ambiguous column references in JOIN queries.

```typescript
// ❌ Bad
db.selectFrom("users")
  .innerJoin("posts", "users.id", "posts.user_id")
  .select("id"); // Ambiguous: which table's id?

// ✅ Good
db.selectFrom("users")
  .innerJoin("posts", "users.id", "posts.user_id")
  .select(["users.id", "posts.id"]);
```

### enforce-kysely-operators

Enforces proper operator usage in Kysely queries, particularly for null comparisons and array operations.

```typescript
// ❌ Bad
db.selectFrom("users").where("deleted_at", "=", null);

db.selectFrom("users").where("status", "=", ["active", "pending"]);

// ✅ Good
db.selectFrom("users").where("deleted_at", "is", null);

db.selectFrom("users").where("status", "in", ["active", "pending"]);
```

The rule enforces:

- Using `is` and `is not` instead of `=` and `!=` when comparing with `null`
- Using `in` instead of `=` when comparing with arrays

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Author

sasumaki
