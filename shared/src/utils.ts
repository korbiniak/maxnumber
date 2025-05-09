import { ALL_OPERATION_CARDS } from './constants';
import { Expression, Operation} from './types'


export function isExpressionValid(expr : Expression){

    if (expr.length == 0) return true;
    if (expr[0] == "*" || expr[0] == "/") return false;
    if (expr[expr.length - 1] in ALL_OPERATION_CARDS) return false;

    for (let nr_card = 1; nr_card < expr.length; nr_card++){
        if ((expr[nr_card] in ALL_OPERATION_CARDS) && (expr[nr_card - 1] in ALL_OPERATION_CARDS)) return false;
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
