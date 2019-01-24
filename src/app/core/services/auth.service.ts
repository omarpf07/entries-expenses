import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { User } from '../models/user.models';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { ActivateLoadingAction, DeactivateLoadingAction } from '../../shared/ui.actions';
import { SetUserAction } from '../../auth/auth.actions';
import { Subject } from 'rxjs/internal/Subject';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private afAuth: AngularFireAuth, private router: Router, private aFDB: AngularFirestore, private store: Store<AppState>) { }

  initAuthListener() {
    this.afAuth.authState.subscribe(fbUser => {
      if (fbUser) {
        this.aFDB.doc(`${fbUser.uid}/user`).valueChanges().pipe(takeUntil(this.destroy$)).subscribe((user: any) => {
          this.store.dispatch(new SetUserAction(new User(user.name, user.uid, user.email)));
        });
      } else {
        this.destroy$.next(true);
      }
    });
  }

  createUser(name: string, email: string, password: string) {
    this.store.dispatch(new ActivateLoadingAction());
    this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(resp => {
      const user: User = {
        uid: resp.user.uid,
        name: name,
        email: resp.user.email
      };
      this.aFDB.doc(`${user.uid}/user`).set(user).then(() => {
        this.store.dispatch(new DeactivateLoadingAction());
        this.router.navigate(['/dashboard']);
      }).catch(err => {
        this.store.dispatch(new DeactivateLoadingAction());
        Swal.fire('Register Error', err.message, 'error');
      });
    }).catch(err => {
      this.store.dispatch(new DeactivateLoadingAction());
      Swal.fire('Register Error', err.message, 'error');
    });
  }

  logIn(email: string, password: string) {
    this.store.dispatch(new ActivateLoadingAction());
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(resp => {
      this.store.dispatch(new DeactivateLoadingAction());
      this.router.navigate(['/dashboard']);
    }).catch(err => {
      this.store.dispatch(new DeactivateLoadingAction());
      Swal.fire('Login Error', err.message, 'error');
    });
  }

  logOut() {
    this.destroy$.next(true);
    this.afAuth.auth.signOut().catch(a => console.log(a)).catch(x => console.log(x));
    this.store.dispatch(new SetUserAction(null));
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return this.afAuth.authState.pipe(map(fbUser => {
      if (fbUser === null) {
        this.router.navigate(['/login']);
      } return fbUser !== null;
    }));
  }

}
