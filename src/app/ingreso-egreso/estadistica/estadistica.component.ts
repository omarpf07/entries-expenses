import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Movements } from '../../core/models/movements.models';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: []
})
export class EstadisticaComponent implements OnInit, OnDestroy {

  public entries: number;
  public expenses: number;
  public entriesAmount: number;
  public expensesAmount: number;
  public doughnutChartLabels: Label[] = ['Entries', 'Expenses'];
  public doughnutChartData: any[] = [];
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.select('movements').pipe(takeUntil(this.destroy$)).subscribe(movements => this.countMovements(movements.items));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  countMovements(items: Movements[]) {
    this.entries = 0;
    this.expenses = 0;
    this.entriesAmount = 0;
    this.expensesAmount = 0;
    items.forEach(item => {
      if (item.type === 'entry') {
        this.entriesAmount++;
        this.entries += item.amount;

      } else {
        this.expensesAmount++;
        this.expenses += item.amount;
      }
    });
    this.doughnutChartData = [this.entries, this.expenses];
  }

}
