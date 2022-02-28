import { HttpUrlEncodingCodec } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { CustomRegex } from '@appcore/validators/custom-regex';
import { environment } from '@environments/environment';
import { AuthService } from '@modules/auth/services/auth.service';
import { DistrictService } from '@modules/district/services/district.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
declare var Stripe;

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.scss']
})
export class RegisterAdminComponent implements OnInit {
  @ViewChild('package') PackageModal: ElementRef;
  openModal;
  registerAdminForm: FormGroup;
  dropdownTitle = "Select Package";
  roleID: number;
  packageId: number;
  token: string;
  queryParamObj;
  isParams = false;
  packageList = [];
  allPackages = [];
  currentPackage;
  months:any
  stripe:any
  constructor(
    private authService: AuthService,
    private toast: ToasterService,
    private router: Router,
    private modalService: NgbModal,
    private actRoute: ActivatedRoute,
    private districtService: DistrictService,
    //  private modalService: NgbModal,
  ) {
    this.months=CustomRegex.months;
    if (this.actRoute.snapshot && this.actRoute.snapshot.queryParams) {
      let queryString = Object.keys(this.actRoute.snapshot.queryParams)[0];
      if (queryString) {
        this.queryParamObj = this.authService.queryParamsToJSON(queryString);
        this.isParams = true;
      }
    }
  }

  ngOnInit(): void {
    this.stripe = Stripe(environment.public_key);
    if (this.isParams) {
      this.roleID = parseInt(this.queryParamObj.paramRoleID);
    } else {
      this.roleID = parseInt(localStorage.getItem('rolID'));
    }
    this.getPackageList();
    this.registerAdminForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      admin_account_name: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required,
      Validators.pattern(CustomRegex.emailPattern),
      this.validateEmail.bind(this),
      ]),
      phone_number: new FormControl("", [Validators.required,
      Validators.pattern(CustomRegex.phoneNumberPattern),
      // Validators.minLength(10),
      this.validPhoneNumber.bind(this),
      ]),
      contact_person_name: new FormControl("", [Validators.required]),
      contact_person_no: new FormControl("", [Validators.pattern(CustomRegex.phoneNumberPattern)]),
      contact_person_email: new FormControl("", [Validators.pattern(CustomRegex.emailPattern)]),
      package: new FormControl("", [Validators.required]),
      // status: new FormControl('active', [Validators.required])
    });
  }
  get formControl() {
    return this.registerAdminForm.controls;
  }
  /**
   * To get all PackageList.
   */
  getPackageList(): void {
    this.packageId = this.queryParamObj && this.queryParamObj.packageId ? parseInt(this.queryParamObj.packageId) : undefined;
    let isPrivate = this.packageId ? true : false;
    this.authService.getGuestUserToken().subscribe(
      (response) => {
        this.token = response.data.guestToken;
        if (this.token) {
          this.authService.getAllPackageList(isPrivate, this.token, this.packageId,undefined,this.roleID).subscribe(
            (res) => {
              if (res && res.data) {
                if (_.isArray(res.data)) {
                  this.allPackages = res.data;
                } else {
                  this.allPackages = [res.data];
                }
                this.packageList = _.map(this.allPackages, item => {
                  let obj = {
                    id: item.id,
                    menu: item.packageTitle,
                    maxUser:item.maxUser,
                    priceId:item.priceId

                  }
                  return obj;
                });
                if (this.isParams) {
                  this.dropdownTitle = this.packageList[0]['menu'];
                  this.registerAdminForm.get('package').setValue(this.packageList[0]);
                }
              }
            },
            (error) => {
              console.log(error);
              this.toast.showToast(error.error.message, '', 'error');
            }
          );
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  /**
   * To check valid email
   *  
   */
  validateEmail(control: AbstractControl): any {
    if (control && control.value) {
      let isValid = control.value.match(CustomRegex.emailPattern);
      if (isValid && isValid.input) {
        this.districtService.emailValidator(control.value).subscribe(
          (data) => {
          },
          (error) => {
            console.log(error);
            this.registerAdminForm.controls['email'].setErrors({ 'emailValidate': true });
          }
        );
      }
    }
  }

  /**
   * To check valid phone number
   *   
   */
  validPhoneNumber(control: AbstractControl): any {
    if (control && control.value) {
      let isValid = control.value.match(CustomRegex.phoneNumberPattern);
      // if (control.value && control.value.length === 11 || control.value.length > 13) {
      //   return { 'contactDigitValidate': true }
      // }
      if (isValid && isValid.input) {
        this.districtService.contactValidator(control.value).subscribe(
          (data) => {
          },
          (error) => {
            console.log(error);
            this.registerAdminForm.controls['phone_number'].setErrors({ 'contactValidate': true });
          }
        );
      }
    }
  }

  /**
 * To check valid phone number for contact person.
 *   
 */
  // validContactPersonNumber(control: AbstractControl): any {
  //   if (control.value && control.value.length === 11 || control.value.length > 13) {
  //     return { 'digitValidate': true }
  //   }
  // }

  /**
   * On package dropdown value change
   */
  changePackage(event) {
    this.dropdownTitle = event.menu;
    sessionStorage.setItem("priceId",event.priceId)
    this.registerAdminForm.get('package').setValue(event);
    if (event && event.menu) {
      this.getPackageModalById(event.id,);
    }
  }
  /**
    * To get Package by id.
    */
  getPackageModalById(id?: any): void {
    let isPrivate = this.packageId ? true : false;
    this.authService.getAllPackageList(isPrivate, this.token, id,undefined,this.roleID).subscribe(
      (res) => {
        if (res && res.data) {
          this.currentPackage = res.data;
          this.openModal = this.modalService.open(this.PackageModal, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'package-modal' });
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  onCheckBoxChange(value) {
    if (value) {
      this.registerAdminForm.get("contact_person_name").setValue(this.registerAdminForm.value.admin_account_name);
      this.registerAdminForm.get("contact_person_no").setValue(this.registerAdminForm.value.phone_number);
      this.registerAdminForm.get("contact_person_email").setValue(this.registerAdminForm.value.email);
    } else {
      this.registerAdminForm.get("contact_person_name").setValue("");
      this.registerAdminForm.get("contact_person_no").setValue("");
      this.registerAdminForm.get("contact_person_email").setValue("");
    }
  }

  closePackageModal(): void {
    this.openModal.close();
  }

  /**
   * On submit registration details.
   */
  onSave(): void {
    if (this.registerAdminForm.invalid) {
      return;
    } else {
      const submission = _.omit(this.registerAdminForm.value, ['package']);
      submission['status'] = false;
      submission['package_id'] = this.registerAdminForm.value.package.id;
      submission['role_id'] = this.roleID;
      this.authService.registerDistrictAdmin(submission,this.token).subscribe(
        (dt: any) => {
          if (dt) {
            
                let stripeData = {
                  subscribeId: dt.data.subscribeId,
                  customerId: dt.data.customerId,
                  priceId: sessionStorage.getItem("priceId")
                }
  
                this.authService.createStripePaymentSession(stripeData,this.token).subscribe((dt) => {
                  sessionStorage.removeItem("priceId")
                  setTimeout(() => {
                    this.toast.showToast('Yay! You just successfully signed up for Chef Koochooloo! Check your email for next steps.', '', 'success');
                    this.router.navigate(['/auth/login']);
                  }, 1000);
                 /*  this.stripe.redirectToCheckout({
                    sessionId: dt.data,
                  }) */
                  })
            // this.toast.showToast('We sent an email with a verification link to ' + this.registerAdminForm.value.adminEmailAddress, '', 'success');
            // this.router.navigate(['/']);
          }
        },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/auth/sign-up']);
  }

  /* openStripePaymentModal() {
    this.districtService.addPayment().subscribe((dt)=>{
      this.stripe.redirectToCheckout({
        sessionId: dt.id,
      });
    })
  } */

  /* closeOpenModal() {
    this.paymentModal.close();
  } */
}
