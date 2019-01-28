import * as fromMovements from './movements.actions';
import { Movements } from '../core/models/movements.models';
import { actions } from './movements.actions';

export interface MovementsState {
    items: Movements[];
}

const initState: MovementsState = {
    items: []
};

export function movementsReducer(state = initState, action: fromMovements.actions): MovementsState {
    switch (action.type) {
        case fromMovements.SET_ITEMS:
            return {
                items: [...action.items.map(item => {
                    return {
                        ...item
                    };
                })]
            };
        case fromMovements.UNSET_ITEMS:
            return {
                items: []
            };
        default:
            return state;
    }
}
