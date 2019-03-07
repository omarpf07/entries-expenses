import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Movements } from '../models/movements.models';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { filter, map, takeUntil } from 'rxjs/operators';
import { SetItemsAction } from '../../ingreso-egreso/movements.actions';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovementsService {

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private afDB: AngularFirestore, public auth: AuthService, private store: Store<AppState>) {
  }

  initMovementsListener() {
    this.store.select('user').pipe(filter(auth => auth.user !== null), takeUntil(this.destroy$))
      .subscribe(auth => this.movementsItems(auth.user.uid));
  }

  private movementsItems(uid: string) {
    this.afDB.collection(`${uid}/movements/items`).snapshotChanges().pipe(takeUntil(this.destroy$), map(docData => {
      return docData.map(doc => {
        return {
          uid: doc.payload.doc.id,
          ...doc.payload.doc.data()
        };
      });
    })).subscribe((collection: any[]) => {
      this.store.dispatch(new SetItemsAction(collection));
    });
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

  deleteMovement(uid: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You won't be able to revert this!`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.value) {
        this.afDB.doc(`${this.auth.getUser().uid}/movements/items/${uid}`).delete();
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
      } else {
        return;
      }
    });
  }

  endSubscriptions() {
    this.destroy$.next(true);
  }
}
