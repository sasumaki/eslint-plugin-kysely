module.exports = {
    meta: {
      type: "problem",
      docs: {
        description:
          "Ensures that columns are not selected ambiguously.",
      },
      fixable: "code",
      schema: [], // no options
    },
    create(context) {
      const sourceCode = context.sourceCode;
  
  
      return {
        ExpressionStatement(node) {
          evaluate(node.expression, sourceCode.getTokens(node));
        },
        // Add support for async/await queries
        AwaitExpression(node) {
          evaluate(node.argument, sourceCode.getTokens(node));
        }
      };
  
      function hasMethodsInChain(node, methodNames) {
        let current = node;
        let depth = 0;
        const maxDepth = 25;
  
        while (current && depth <= maxDepth) {
          if (
            current.type === "CallExpression" &&
            current.callee.type === "MemberExpression" &&
            methodNames.includes(current.callee.property.name)
          ) {
            return true;
          }
          if (current.callee && current.callee.object) {
            current = current.callee.object;
            depth += 1;
          } else {
            break;
          }
        }
  
        return false;
      }
  
      function evaluate(expression, nodes) {
        if (!expression || expression.type !== "CallExpression") {
          return true;
        }
        const hasSelectFrom = hasMethodsInChain(expression, ["selectFrom"]);
        const hasJoin = hasMethodsInChain(expression, ["innerJoin", "leftJoin", "rightJoin", "fullJoin"]);
        if (hasSelectFrom && hasJoin) {
          // Check select and where clause arguments
          let current = expression;
          while (current) {
            if (
              current.type === "CallExpression" &&
              current.callee.type === "MemberExpression"
            ) {
              const methodName = current.callee.property.name;
  
              if (methodName === "select") {
                const selectArgs = current.arguments[0];
                if (selectArgs && selectArgs.type === "ArrayExpression") {
                  selectArgs.elements.forEach(element => {
                    if (element.type === "Literal" && !element.value.includes(".")) {
                      context.report({
                        node: element,
                        message: "Column names must be fully qualified when using joins to avoid ambiguity",
                      });
                    }
                  });
                }
              } else if (methodName === "where" || methodName === "having") {
                const [columnArg] = current.arguments;
                if (columnArg && columnArg.type === "Literal" && current.arguments.length > 1 && !columnArg.value.includes(".")) {
                  context.report({
                    node: columnArg,
                    message: "Column names must be fully qualified when using joins to avoid ambiguity",
                  });
                }
              }
            }
            current = current.callee?.object;
          }
        }
      }
    },
  };
  