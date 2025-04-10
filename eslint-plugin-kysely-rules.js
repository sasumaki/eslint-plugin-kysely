const enforceWhereClauseRule = require("eslint-plugin-kysely/enforce-where-clause");
const enforceSelectClauseRule = require("eslint-plugin-kysely/enforce-select-clause");
const enforceNoAmbigiousColumnsRule = require("eslint-plugin-kysely/enforce-no-ambigious-columns");
const enforceKyselyOperatorsRule = require("eslint-plugin-kysely/enforce-kysely-operators");

const plugin = {
  rules: {
    "enforce-where-clause": enforceWhereClauseRule,
    "enforce-select-clause": enforceSelectClauseRule,
    "enforce-no-ambigious-columns": enforceNoAmbigiousColumnsRule,
    "enforce-kysely-operators": enforceKyselyOperatorsRule,
  },
  configs: {
    recommended: {
      plugins: ["kysely"],
      rules: {
        "kysely/enforce-where-clause": "error",
        "kysely/enforce-select-clause": "warn",
        "kysely/enforce-no-ambigious-columns": "error",
        "kysely/enforce-kysely-operators": "warn"
      }
    }
  }
};
module.exports = plugin;
