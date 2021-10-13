import { Component, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '@modules/auth/services/auth.service';
@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss']
})
export class SchoolComponent implements OnInit {

  constructor(private authService: AuthService, private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    if (this.authService.getCurrentUserRole() === 'school') {
      if (this.elementRef && this.elementRef.nativeElement && this.elementRef.nativeElement.closest('body')) {
        this.elementRef.nativeElement.closest('body').className = 'district-body';
      }
    }
  }

}
