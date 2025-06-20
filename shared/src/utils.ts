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
  // 1) First, parse consecutive Digit cards into actual numbers:
  const tokens: (number | Operation)[] = [];
  let currentNum: number | null = null;

  for (const token of expr) {
    if (typeof token === "number") {
      // build multi‑digit number
      currentNum = (currentNum ?? 0) * 10 + token;
    } else {
      // push finished number, then operator
      if (currentNum === null) throw new Error("Operator without preceding number");
      tokens.push(currentNum);
      tokens.push(token);
      currentNum = null;
    }
  }
  if (currentNum === null) return 0;   // empty or ends with operator
  tokens.push(currentNum);

  // 2) First pass: handle * and /
  const stack: (number | Operation)[] = [];
  let i = 0;
  while (i < tokens.length) {
    const tk = tokens[i];
    if (tk === "*" || tk === "/") {
      const op = tk as Operation;
      const prevNum = stack.pop() as number;
      const nextNum = tokens[i + 1] as number;
      const computed = op === "*" ? prevNum * nextNum : prevNum / nextNum;
      stack.push(computed);
      i += 2;  // skip the number we just consumed
    } else {
      stack.push(tk);
      i += 1;
    }
  }

  // 3) Second pass: handle + and -
  let result = stack[0] as number;
  i = 1;
  while (i < stack.length) {
    const op = stack[i] as Operation;
    const num = stack[i + 1] as number;
    if (op === "+") result += num;
    else if (op === "-") result -= num;
    // (+/* should have been handled already)
    i += 2;
  }

  return result;
}
