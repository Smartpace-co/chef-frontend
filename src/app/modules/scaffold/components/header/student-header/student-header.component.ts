import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '@modules/auth/services/auth.service';

@Component({
  selector: 'app-student-header',
  templateUrl: './student-header.component.html',
  styleUrls: ['./student-header.component.scss']
})
export class StudentHeaderComponent implements OnInit {
  public assetPath = environment.assetUrl;
  loggedIn = false;
  constructor(private elementRef: ElementRef, private router: Router, private authService: AuthService) {
    this.authService.currentUser.subscribe((data:any) => {
      if (data) {
        this.loggedIn = true;
        let roleName;
        if (data && data.role && data['parent_role']) {
          roleName = data['parent_role'].title.toLowerCase();
        } else if (data && data.role) {
          roleName = data.role['title'].toLowerCase();
        }
        if (roleName) {
          if (roleName === 'teacher' && data.isPaymentRemaining!=true) {
            this.router.navigate(['teacher/explore-lessons']);
          }
          else if (roleName === 'student'  && data.isPaymentRemaining!=true) {
            this.router.navigate(['student/student-landing']);
          } else if (roleName === 'district' && data.isPaymentRemaining!=true) {
            this.router.navigate(['district/dashboard']);
          }
        }
      } else {
        this.loggedIn = false;
      }
    });
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    if (this.elementRef && this.elementRef.nativeElement && this.elementRef.nativeElement.closest('body')) {
      this.elementRef.nativeElement.closest('body').className = 'default-bg-color';
    }
  }
  signIn() {
    this.router.navigate(['/auth/login']);
  }
  signUp() {
    this.router.navigate(['/auth/sign-up']);
  }
}
