import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Movements } from '../../core/models/movements.models';
import { ActivateLoadingAction } from 'src/app/shared/ui.actions';
import { DeactivateLoadingAction } from '../../shared/ui.actions';
import { MovementsService } from '../../core/services/movements.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  public items: Movements[];
  public loaded: boolean;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store<AppState>, private movementsService: MovementsService) { }

  ngOnInit() {
    this.store.select('ui').pipe(takeUntil(this.destroy$)).subscribe(ui => {
      this.loaded = ui.isLoading;
    });
    this.store.dispatch(new ActivateLoadingAction());
    this.store.select('movements').pipe(takeUntil(this.destroy$)).subscribe(movement => {
      this.items = movement.items;
    }, err => console.log(err), () => this.store.dispatch(new DeactivateLoadingAction()));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  deleteItem(uid: string) {
    console.log(uid);
    this.movementsService.deleteMovement(uid);
  }

}
