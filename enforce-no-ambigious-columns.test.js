const { RuleTester } = require("eslint");
const rule = require("./enforce-no-ambigious-columns");

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2017 },
});

ruleTester.run(
  "enforce-no-ambigious-columns", // rule name
  rule,
  {
    valid: [
      {
        code: "trx.selectFrom('name').innerJoin('table2', 'table2.id', 'name.id').select(['name.field']).where('name.something', '=', something).execute()",
      },
      {
        code: "trx.selectFrom('name').select(['field']).where('something', '=', something).execute()",
      },
    ],
    invalid: [
      {
        code: "trx.selectFrom('name').innerJoin('table2', 'table2.id', 'name.id').select(['field']).where('something', '=', something).execute()",
        errors: 2,
      },
      {
        code: "trx.selectFrom('name').innerJoin('table2', 'table2.id', 'name.id').select(['name.field']).where('something', '=', something).execute()",
        errors: 1,
      },
      {
        code: "trx.selectFrom('name').innerJoin('table2', 'table2.id', 'name.id').select(['field']).where('name.something', '=', something).execute()",
        errors: 1,
      }, 
      {
        code: `async function test() {
          await kysely.selectFrom("name")
            .leftJoin("table2", "table2.id", "name.id")
            .select(["id"])
            .where("ebin", "=", "lol")
            .execute()
        }`,
        errors: 2, // Both item_id and state are ambiguous
      },
    ],
  }
);

console.log("All tests passed!");
