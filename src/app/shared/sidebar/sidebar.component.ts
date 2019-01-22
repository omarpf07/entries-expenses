import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  logOut() {
    this.auth.logOut();
  }

}
