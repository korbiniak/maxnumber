import type { Expression, Operation, Card} from './types'


function isOperation(card: Card): card is Operation {
  return card === "+" || card === "-" || card === "*" || card === "/";
}


export function isExpressionValid(expr : Expression){

    if (expr.length == 0) return true;
    if (expr[0] == "*" || expr[0] == "/") return false;
    if (isOperation(expr[expr.length - 1])) return false;

    for (let nr_card = 1; nr_card < expr.length; nr_card++){
        if (isOperation(expr[nr_card-1]) && isOperation(expr[nr_card])) return false;
    }

    return true;

}


export function isExtensionOfExpression(expr1 : Expression, expr2 : Expression) : boolean{

    if (expr1.length + 1 != expr2.length) return false;

    let diff_occurs = false;

    for (let idx = 0; idx < expr2.length; idx++){

        if (diff_occurs){
            if (expr1[idx - 1] != expr2[idx]) return false;
        }
        else if (idx < expr1.length && expr1[idx] != expr2[idx]){
            diff_occurs = true;
        }
    }


    return true;


}

export function evaluateExpression(expr: Card[]): number {
  const tokens: (number | Operation)[] = [];
  let i = 0;

  while (i < expr.length) {
    let sign = 1;

    // Obsługa prefiksu - lub +
    if ((i === 0 || typeof expr[i - 1] !== "number") && (expr[i] === "-" || expr[i] === "+")) {
      sign = expr[i] === "-" ? -1 : 1;
      i++;
    }

    // Składanie liczby
    if (typeof expr[i] !== "number") {
      throw new Error(`Unexpected token: ${expr[i]}`);
    }

    let num = 0;
    while (i < expr.length && typeof expr[i] === "number") {
      num = num * 10 + (expr[i] as number);
      i++;
    }

    tokens.push(sign * num);

    // Operator
    if (i < expr.length) {
      if (typeof expr[i] !== "string") throw new Error(`Expected operator but got number`);
      tokens.push(expr[i] as Operation);
      i++;
    }
  }

  // 1st pass: handle * and /
  const stack: (number | Operation)[] = [];
  i = 0;
  while (i < tokens.length) {
    const tk = tokens[i];
    if (tk === "*" || tk === "/") {
      const prev = stack.pop() as number;
      const next = tokens[i + 1] as number;
      const res = tk === "*" ? prev * next : prev / next;
      stack.push(res);
      i += 2;
    } else {
      stack.push(tk);
      i++;
    }
  }

  // 2nd pass: handle + and -
  let result = stack[0] as number;
  i = 1;
  while (i < stack.length) {
    const op = stack[i] as Operation;
    const num = stack[i + 1] as number;
    if (op === "+") result += num;
    else result -= num;
    i += 2;
  }

  return result;
}
