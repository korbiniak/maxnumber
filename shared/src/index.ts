import { ALL_OPERATION_CARDS } from './constants';
import { Expression, Operation} from './types'

export * from './types'
export * from './constants'
export * from './utils'




function isExpressionValid(expression : Expression){
    const expression_size = expression.length;

    if (expression_size == 0) return true;
    if (expression[0] == "*" || expression[0] == "/") return false;
    if (expression[expression_size - 1] in ALL_OPERATION_CARDS) return false;

    for (let nr_card = 1; nr_card < expression_size; nr_card++){
        if ((expression[nr_card] in ALL_OPERATION_CARDS) && (expression[nr_card - 1] in ALL_OPERATION_CARDS)) return false;
    }

    return true;

}