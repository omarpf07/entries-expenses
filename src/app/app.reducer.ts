import { ActionReducerMap } from '@ngrx/store';
import * as fromUi from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';
import * as fromMovements from '../../src/app/ingreso-egreso/movements.reducer';
export interface AppState {
    ui: fromUi.State;
    user: fromAuth.AuthState;
    movements: fromMovements.MovementsState;
}

export const appReducers: ActionReducerMap<AppState> = {
    ui: fromUi.uiReducer,
    user: fromAuth.authReducer,
    movements: fromMovements.movementsReducer
};
