const enforceWhereClauseRule = require("eslint-plugin-kysely/enforce-where-clause");
const enforceSelectClauseRule = require("eslint-plugin-kysely/enforce-select-clause");
const enforceNoAmbigiousColumnsRule = require("eslint-plugin-kysely/enforce-no-ambigious-columns");

const plugin = {
  rules: {
    "enforce-where-clause": enforceWhereClauseRule,
    "enforce-select-clause": enforceSelectClauseRule,
    "enforce-no-ambigious-columns": enforceNoAmbigiousColumnsRule,
  },
};
module.exports = plugin;
