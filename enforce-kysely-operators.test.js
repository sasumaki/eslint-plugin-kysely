const { RuleTester } = require("eslint");
const rule = require("./enforce-kysely-operators");

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2017 },
});

ruleTester.run(
  "enforce-kysely-operators", // rule name
  rule,
  {
    valid: [
      {
        code: "trx.selectFrom('name').select(['name.field']).where('name.something', 'is', null).execute()",
      },
      {
        code: "trx.selectFrom('name').select(['name.field']).where('name.something', 'is not', null).execute()",
      },
      {
        code: "trx.selectFrom('name').select(['name.field']).where('name.something', 'in', ['value1', 'value2']).execute()",
      },
      {
        code: "trx.selectFrom('name').select(['name.field']).where('name.something', 'not in', ['value1', 'value2']).execute()",
      },
    ],
    invalid: [
      {
        code: "trx.selectFrom('name').select(['name.field']).where('name.something', '=', null).execute()",
        errors: 1,
        output: "trx.selectFrom('name').select(['name.field']).where('name.something', 'is', null).execute()",
      },
      {
        code: "trx.selectFrom('name').select(['name.field']).where('name.something', '!=', null).execute()",
        errors: 1,
        output: "trx.selectFrom('name').select(['name.field']).where('name.something', 'is not', null).execute()",
      },
      {
        code: "trx.selectFrom('name').select(['name.field']).where('name.something', '=', ['value1', 'value2']).execute()",
        errors: 1,
        output: "trx.selectFrom('name').select(['name.field']).where('name.something', 'in', ['value1', 'value2']).execute()",
      },
      {
        code: "trx.selectFrom('name').select(['name.field']).where('name.something', '!=', ['value1', 'value2']).execute()",
        errors: 1,
        output: "trx.selectFrom('name').select(['name.field']).where('name.something', 'not in', ['value1', 'value2']).execute()",
      },
    ],
  }
);

console.log("All tests passed!");
