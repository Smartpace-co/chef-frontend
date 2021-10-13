import { Component, OnInit } from '@angular/core';
import { sidemenuContents } from '@appcore/config/sidemenu.config';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  sideMenuContents: any;
  userRole: any;
  constructor() {}

  ngOnInit() {
    this.userRole = sessionStorage.getItem('user_role');
    this.checkSideMenuForUserRole();
  }
  /**
   * Sidemenu contents w.r.t user role
   */
  checkSideMenuForUserRole() {
    if (this.userRole === 'District' || this.userRole === 'Schools'){
      this.sideMenuContents = sidemenuContents;
    }

  }
}
