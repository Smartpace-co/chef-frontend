import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { ConfirmPasswordValidator } from '../../../../core/validators/confirm-password.validator';
import { ToasterService } from '@appcore/services/toaster.service';

@Component({
  selector: 'app-generate-password',
  templateUrl: './generate-password.component.html',
  styleUrls: ['./generate-password.component.scss']
})
export class GeneratePasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  token = '';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: ToasterService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.token = this.activatedRoute.snapshot.queryParams.token
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: ConfirmPasswordValidator('password', 'confirmPassword') })
  }
  get formControl() {
    return this.resetPasswordForm.controls;
  }

  onReset(): void {
    if (this.resetPasswordForm.invalid) {
      return;
    } else {
      this.authService.resetPassword(this.resetPasswordForm.value.confirmPassword, this.token).subscribe(
        (data) => {
          if (data) {
            this.toast.showToast(' Password generated successfully', '', 'success');
            this.router.navigate(['/']);
          }
        },
        (error) => {
          console.log(error);
          if (error.error.status === 401) {
            this.toast.showToast('Link for generate password is expired.', '', 'error');
          } else {
            this.toast.showToast(error.error.message, '', 'error');
          }
        }
      );
    }
  }
}