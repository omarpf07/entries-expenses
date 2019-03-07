import { Component, OnInit } from '@angular/core';
import { MovementsService } from '../core/services/movements.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  constructor(private movementsService: MovementsService) { }

  ngOnInit() {
    this.movementsService.initMovementsListener();
  }

}
