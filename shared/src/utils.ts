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

function apply(a: number, op: Operation, b: number): number {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return a / b;
  }
}

export function evaluateExpression(expr: Expression): number {
  if (expr.length === 0) return 0;

  let curNum: number | null    = null;
  let result: number | null    = null;
  let pendingOp: Operation | null = null;

  const flush = () => {
    if (curNum === null) return;

    if (result === null) {
      // Jeśli mamy już pendingOp, traktujemy to jak 0 <op> curNum
      if (pendingOp !== null) {
        result = apply(0, pendingOp, curNum);
      } else {
        result = curNum;
      }
    } else if (pendingOp !== null) {
      result = apply(result, pendingOp, curNum);
    }

    curNum = null;
  };

  for (const token of expr) {
    if (typeof token === "number") {
      curNum = (curNum ?? 0) * 10 + token;
    } else {
      // spotkaliśmy operator
      flush();
      pendingOp = token;
    }
  }

  flush();
  return result ?? 0;
}
