import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit, OnDestroy {
  public registerForm: FormGroup;
  public loading: boolean;
  public destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private auth: AuthService, private fb: FormBuilder, public store: Store<AppState>) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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
    this.auth.createUser(formValue.name, formValue.email, formValue.password);
  }
}
