import { Component, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '@modules/auth/services/auth.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  constructor(private authService: AuthService, private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    if (this.authService.getCurrentUserRole() === 'student') {
      if (this.elementRef && this.elementRef.nativeElement && this.elementRef.nativeElement.closest('body')) {
        this.elementRef.nativeElement.closest('body').className = 'student-bg-color';
      }
    }
  }
}
