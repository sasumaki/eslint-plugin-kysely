# eslint-plugin-kysely

eslint-plugin-kysely is a fork of eslint-plugin-kysely-rules.

- added no-ambigious columns rule

## Usage

Add eslint-plugin-kysely-rules to your ESLint configuration:

```json
{
  "plugins": ["kysely-rules"],
  "rules": {
    "kysely-rules/enforce-where-clause": "error",
    "kysely-rules/enforce-select-clause": "warn",
    "kysely-rules/enforce-no-ambigious-columns": "error"
  }
}
```
