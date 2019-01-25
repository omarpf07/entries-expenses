import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Movements } from '../core/models/movements.models';
import { MovementsService } from '../core/services/movements.service';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { ActivateLoadingAction, DeactivateLoadingAction } from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  public movementForm: FormGroup;
  public loading: boolean;
  public type = 'entry';
  public destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private fb: FormBuilder, private movementsService: MovementsService, private store: Store<AppState>) {
    this.store.select('ui').pipe(takeUntil(this.destroy$)).subscribe(ui => this.loading = ui.isLoading);
    this.movementForm = this.fb.group({
      description: ['', [Validators.required]],
      amount: [1, [Validators.required, Validators.min(1)]]
    });

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  onSubmit(value: any) {
    this.store.dispatch(new ActivateLoadingAction());
    this.movementForm.disable();
    this.movementsService.createMovement(new Movements(value.description, value.amount, this.type))
      .then(() => {
        this.store.dispatch(new DeactivateLoadingAction());
        this.movementForm.reset({ amount: 1 });
      }).catch(() => this.store.dispatch(new DeactivateLoadingAction()));
    this.movementForm.enable();
  }
}
