import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Movements } from '../models/movements.models';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MovementsService {

  constructor(private afDB: AngularFirestore, public auth: AuthService) {
  }

  createMovement(movement: Movements) {
    return this.afDB.doc(`${this.auth.getUser().uid}/movements`).collection('items').add({ ...movement }).then(() => {
      Swal.fire({
        type: 'success',
        title: 'The movement has been created successfully!',
        showConfirmButton: false,
        timer: 2000
      });
    }).catch(err => {
      Swal.fire('Error', err.message, 'error');
    });
  }
}
