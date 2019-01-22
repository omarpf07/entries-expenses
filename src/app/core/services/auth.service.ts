import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User } from '../models/user.models';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private router: Router, private aFDB: AngularFirestore) { }

  initAuthListener() {
    this.afAuth.authState.subscribe(fbUser => {
      console.log(fbUser);
    });
  }

  createUser(name: string, email: string, password: string) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(resp => {
      const user: User = {
        uid: resp.user.uid,
        name: name,
        email: resp.user.email
      };
      this.aFDB.doc(`${user.uid}/user`).set(user).then(() => {
        this.router.navigate(['/dashboard']);
      }).catch(err => Swal.fire('Register Error', err.message, 'error'));
    }).catch(err => Swal.fire('Register Error', err.message, 'error'));
  }

  logIn(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(resp => {
      this.router.navigate(['/dashboard']);
    }).catch(err => Swal.fire('Login Error', err.message, 'error'));
  }

  logOut() {
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut().catch(a => console.log(a)).catch(x => console.log(x));
  }

  isLoggedIn() {
    return this.afAuth.authState.pipe(map(fbUser => {
      if (fbUser === null) {
        this.router.navigate(['/login']);
      } return fbUser !== null;
    }));
  }

}
