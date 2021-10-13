import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@modules/auth/services/auth.service';
import { CustomRegex } from '@appcore/validators/custom-regex';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToasterService,
    private utiltiService: UtilityService
  ) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.pattern(CustomRegex.namePatteren)]),
      email: new FormControl('', [Validators.email, Validators.required, Validators.pattern(CustomRegex.emailPattern)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(CustomRegex.phoneNumberPattern), Validators.minLength(10)]),
      password: new FormControl('', [Validators.required]),
      schoolName: new FormControl('', [Validators.required, Validators.pattern(CustomRegex.schoolNamePattern)])
    });
  }

  get formControl() {
    return this.registerForm.controls;
  }

  /**
   * For user registration and its form validation
   */
  register() {
    if (this.registerForm.invalid) {
    } else {
      this.authService.register(this.registerForm.value).subscribe(
        (data) => {
          this.toast.showToast('Registration Successful', '', 'success');
          this.router.navigate(['/auth/login']);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  /**
   * Format the phone number into :(000)-000-0000 @param data
   */
  formatNumber(data) {
    this.registerForm.get('phoneNumber').setValue(this.utiltiService.formatPhoneNumber(data));
  }
}
