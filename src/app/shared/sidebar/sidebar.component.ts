import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {

  public userName: string;
  public destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private auth: AuthService, private store: Store<AppState>) { }

  ngOnInit() {
    this.store.select('user').pipe(takeUntil(this.destroy$),
      filter(user => user.user !== null)).subscribe(u => this.userName = u.user.name);
  }

  logOut() {
    this.auth.logOut();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

}
