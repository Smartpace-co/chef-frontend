import { Component, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '@modules/auth/services/auth.service';
@Component({
  selector: 'app-district',
  templateUrl: './district.component.html',
  styleUrls: ['./district.component.scss']
})
export class DistrictComponent implements OnInit {

  constructor(private authService: AuthService, private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    if (this.authService.getCurrentUserRole() === 'district') {
      if (this.elementRef && this.elementRef.nativeElement && this.elementRef.nativeElement.closest('body')) {
        this.elementRef.nativeElement.closest('body').className = 'district-body';
      }
    }
  }

}
