import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';

import { AuthService } from './services/auth.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  showHeader: boolean = true;
  public assetPath = environment.assetUrl;

  constructor(private elementRef: ElementRef, private authService: AuthService) {}

  ngOnInit(): void {
    this.init();

    // lazyLoad for masterRoles
    if (!!!this.authService.currentUserValue) {
      this.authService.loadAllMasterRole();
    }
  }

  init() {
    if (this.elementRef && this.elementRef.nativeElement && this.elementRef.nativeElement.closest('body')) {
      this.elementRef.nativeElement.closest('body').className = 'default-bg-color';
    }
  }
}
