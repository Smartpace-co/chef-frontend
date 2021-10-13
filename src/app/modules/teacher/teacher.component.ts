import { Component, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '@modules/auth/services/auth.service';
import { TeacherService } from './services/teacher.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {


  hideteacherHeader = true;

  constructor(private elementRef: ElementRef, private authService: AuthService,public teacherService:TeacherService) { }

  ngOnInit(): void {
    this.init();
  }


  init() {
    if (this.authService.getCurrentUserRole() === 'teacher') {
      if (this.elementRef && this.elementRef.nativeElement && this.elementRef.nativeElement.closest('body')) {
        this.elementRef.nativeElement.closest('body').className = 'default-bg-color';
      }
    }
  }
}
