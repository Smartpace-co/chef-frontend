import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CustomRegex } from '@appcore/validators/custom-regex';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { StudentService } from '@modules/student/services/student.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;

  public assetPath = environment.assetUrl;
  constructor(private router: Router,
    private studentService: StudentService,
    private authService: AuthService,
    private toast: ToasterService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
    });
  }

  get formControl() {
    return this.forgotPasswordForm.controls;
  }

  /**
   *  This function will send reset link for forgot password to entered emailId
   */
  sendResetLink() {
    if (this.forgotPasswordForm.invalid) {
      return;
    } else {
      let isNotStudentLogin = this.forgotPasswordForm.value.email.match(CustomRegex.emailPattern);
      let loginType = isNotStudentLogin ? 'other' : 'student';
      this.authService.forgotPassword(this.forgotPasswordForm.value, loginType).subscribe(
        (data) => {
          if (data) {
            if (isNotStudentLogin) {
              this.toast.showToast('We sent an email with a verification link to ' + this.forgotPasswordForm.value.email, '', 'success');
            } else {
              this.toast.showToast('We sent an email with a verification link.', '', 'success');
            }
            this.router.navigate(['/']);
          }
        },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
    }
  }
}
