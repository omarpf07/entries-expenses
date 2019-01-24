import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup;
  public loading: boolean;
  public destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private auth: AuthService, private fb: FormBuilder, private store: Store<AppState>) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.store.select('ui').pipe(takeUntil(this.destroy$)).subscribe(ui => this.loading = ui.isLoading);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit(formValue: any) {
    this.auth.logIn(formValue.email, formValue.password);
  }
}
