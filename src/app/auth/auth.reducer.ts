import * as fromAuth from './auth.actions';
import { User } from '../core/models/user.models';

export interface AuthState {
    user: User;
}

const initState: AuthState = {
    user: null
};

export function authReducer(state = initState, action: fromAuth.SetUserAction): AuthState {
    switch (action.type) {
        case fromAuth.SET_USER:
            return {
                user: { ...action.user }
            };
        default:
            return state;
    }
}
