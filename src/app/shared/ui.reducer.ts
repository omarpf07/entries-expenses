import * as fromUi from './ui.actions';

export interface State {
    isLoading: boolean;
}

const initState: State = {
    isLoading: false
};

export function uiReducer(state = initState, action: fromUi.actions): State {

    switch (action.type) {
        case fromUi.ACTIVATE_LOADING:
            return {
                isLoading: true
            };
        case fromUi.DEACTIVATE_LOADING:
            return {
                isLoading: false
            };
        default:
            return state;
    }
}
