import { Action } from '@ngrx/store';
import { Movements } from '../core/models/movements.models';

export const SET_ITEMS = '[Movements] Set Items';
export const UNSET_ITEMS = '[Movements] Unset Items';

export class SetItemsAction implements Action {
    readonly type = SET_ITEMS;

    constructor(public items: Movements[]) { }
}

export class UnsetItemsAction implements Action {
    readonly type = UNSET_ITEMS;
}

export type actions = SetItemsAction | UnsetItemsAction;

