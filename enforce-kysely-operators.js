module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Prevents using equality operators (=, !=) with null in Kysely queries. Use 'is' and 'is not' instead. Also converts = to 'in' and != to 'not in' when comparing with arrays.",
    },
    fixable: "code",
    schema: [], // no options
  },
  create(context) {
    const sourceCode = context.sourceCode;

    if (!/selectFrom|updateTable|deleteFrom/.test(sourceCode.text)) {
      // Skip if no Kysely queries are present
      return {};
    }

    return {
      CallExpression(node) {
        if (
          node.callee.type === "MemberExpression" &&
          node.callee.property.name === "where" &&
          node.arguments.length >= 3
        ) {
          const [, operator, value] = node.arguments;
          
          // Check if using = or != operator
          if (operator.type === "Literal" && (operator.value === "=" || operator.value === "!=")) {
            // Handle null comparisons
            if (value.type === "Literal" && value.value === null) {
              const suggestedOperator = operator.value === "=" ? "is" : "is not";
              context.report({
                node,
                message: `Use '${suggestedOperator}' instead of '${operator.value}' when comparing with null in Kysely queries.`,
                fix: (fixer) => {
                  return fixer.replaceText(operator, `'${suggestedOperator}'`);
                },
              });
            }
            // Handle array comparisons
            else if (value.type === "ArrayExpression") {
              const suggestedOperator = operator.value === "=" ? "in" : "not in";
              context.report({
                node,
                message: `Use '${suggestedOperator}' instead of '${operator.value}' when comparing with an array in Kysely queries.`,
                fix: (fixer) => {
                  return fixer.replaceText(operator, `'${suggestedOperator}'`);
                },
              });
            }
          }
        }
      },
    };
  },
};
