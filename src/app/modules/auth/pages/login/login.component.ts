import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomRegex } from '@appcore/validators/custom-regex';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { ToasterService } from '@appcore/services/toaster.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { StudentService } from '@modules/student/services/student.service';
declare var Stripe;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('paymentModal') paymentMdl: ElementRef;
  loginForm: FormGroup;
  guidForm: FormGroup;
  public assetPath = environment.assetUrl;
  closeModal;
  stripe: any
  stripeData: any;
  countryTitle = "Select Your Country"
  countryList = [
    {
      id: "1",
      menu: "India"
    },
    {
      id: "2",
      menu: "Australia"
    },
    {
      id: "3",
      menu: "Italy"
    },
    {
      id: "4",
      menu: "Spain"
    }
  ]
  paymentModal: any;
  constructor(private router: Router, private studentService: StudentService, private authService: AuthService, private toast: ToasterService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.stripe = Stripe(environment.public_key);

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      rememberMe: new FormControl(false, [Validators.required])
    });
    this.guidForm = new FormGroup({
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      selectRole: new FormControl('', [Validators.required]),
      distName: new FormControl('', [Validators.required]),
      selectCountry: new FormControl('', [Validators.required]),
      numberOfStudent: new FormControl('', [Validators.required]),
      commentAndNotes: new FormControl('', [Validators.required]),
    });
  }

  get formControl() {
    return this.loginForm.controls;
  }

  /**
   * function call for login and its validation
   */
  login() {
    if (this.loginForm.invalid) {
      return;
    } else {
      let isNotStudentLogin = this.loginForm.value.email.match(CustomRegex.emailPattern);
      let loginType = isNotStudentLogin ? 'other' : 'student';
      this.authService.login(this.loginForm.value, loginType).subscribe(
        (data) => {
          let roleName;

          if (data && data.role) {
            roleName = data.role.title.toLowerCase();
          }

          if (data.is_trial_period_end && data.isPaymentRemaining) {
            if (data.parentId) {
              this.toast.showToast('Contact your admin', '', 'error');
            }
             if (!data.parentId) {
              this.showPaymentRequest(data);
            }

          }
          else{
            if (!data.parent_role) {
              if (roleName) {
                if (roleName === 'teacher') {
                  this.toast.showToast('Login Successful', '', 'success');
                  this.router.navigate(['teacher/dashboard']);
                }
  
                else if (roleName === 'student') {
                  this.toast.showToast('Login Successful', '', 'success');
                  this.router.navigate(['student/student-landing']);
                } else if (roleName === 'district') {
                  this.toast.showToast('Login Successful', '', 'success');
                  this.router.navigate(['district/dashboard']);
                } else if (roleName === 'school') {
                  this.toast.showToast('Login Successful', '', 'success');
                  this.router.navigate(['school/dashboard'])
                }
              
            }
              else {
                this.toast.showToast('Not a valid user', '', 'warning');
              }
            }
            else {
              if (data.parent_role && data.isPaymentRemaining != true) {
                if (data.parent_role.title === "District") {
                  this.toast.showToast('Login Successful', '', 'success');
                  this.router.navigate(['district/dashboard']);
                }
                else if (data.parent_role.title === "School") {
                  this.toast.showToast('Login Successful', '', 'success');
                  this.router.navigate(['school/dashboard'])
                }
              }
              else {
                this.toast.showToast('Contact your admin', '', 'error');
  
              }
            }
          }


        },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
    }
  }
  open(content) {
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'guide-modal' });
  }
  closeOpenModal() {

  }

  /**
   * Show warning popup for payement
   */

  showPaymentRequest(data) {
    this.stripeData = {
      subscribeId: data.subscribeId,
      customerId: data.customerId,
      priceId: data.priceId
    }
    this.paymentModal = this.modalService.open(this.paymentMdl, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'guide-modal' });
  }

  /**
   * Redirect to checkout page
   */

  checkout() {
    this.authService.createStripePaymentSession(this.stripeData, '').subscribe((dt) => {
      this.stripe.redirectToCheckout({
        sessionId: dt.data,
      })
    })
  }
}
