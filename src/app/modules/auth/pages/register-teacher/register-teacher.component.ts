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
  selector: 'app-register-teacher',
  templateUrl: './register-teacher.component.html',
  styleUrls: ['./register-teacher.component.scss']
})
export class RegisterTeacherComponent implements OnInit {
  @ViewChild('package') PackageModal: ElementRef;
  openModal;
  registerTeacherForm: FormGroup;
  dropdownTitle = "Select Package";
  dropdownDistrict = "Select District";
  dropdownSchool = "Select School";
  currentPackage;
  dropdownDistrictTitle = "District";
  roleID: any;
  packageId: number;
  token: string;
  queryParamObj;
  isParams = false;
  packageList = [];
  allPackages = [];
  districtList = [];
  schoolList = [];
  stripe: any;
  months: any;
  constructor(
    private authService: AuthService,
    private toast: ToasterService,
    private router: Router,
    private districtService: DistrictService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal
  ) {
    sessionStorage.removeItem("priceId")
    this.months = CustomRegex.months;
    if (this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams) {
      let queryString = Object.keys(this.activatedRoute.snapshot.queryParams)[0];
      if (queryString) {
        this.queryParamObj = this.authService.queryParamsToJSON(queryString);
        this.isParams = true;
      }
    }
    // this.roleID = this.activatedRoute.snapshot.queryParams && this.activatedRoute.snapshot.queryParams.role_id;
  }

  ngOnInit(): void {
    this.stripe = Stripe(environment.public_key);
    if (this.isParams) {
      this.roleID = parseInt(this.queryParamObj.role_id);
    } else {
      this.roleID = parseInt(localStorage.getItem('rolID'));
    }
    this.getPackageList();
    this.registerTeacherForm = new FormGroup({
      // district_id: new FormControl(""),
      // school_id: new FormControl(""),
      custom_district_name: new FormControl(""),
      custom_school_name: new FormControl(""),
      first_name: new FormControl("", [Validators.required, Validators.pattern(CustomRegex.namePatteren)]),
      last_name: new FormControl("", [Validators.required, Validators.pattern(CustomRegex.namePatteren)]),
      email: new FormControl("", [Validators.required,
      Validators.pattern(CustomRegex.emailPattern),
      this.validateEmail.bind(this),
      ]),
      phone_number: new FormControl("", [Validators.required,
      Validators.pattern(CustomRegex.phoneNumberPattern),
      // this.validPhoneNumberLength.bind(this),
      // Validators.minLength(11),
      this.validPhoneNumber.bind(this),
      ]),
      contact_person_name: new FormControl("", [Validators.required, Validators.pattern(CustomRegex.namePatteren)]),
      contact_person_number: new FormControl("", [
        Validators.pattern(CustomRegex.phoneNumberPattern),
        // this.validPhoneNumberLength.bind(this),
        // Validators.minLength(10)
      ]),
      contact_person_email: new FormControl("", [Validators.pattern(CustomRegex.emailPattern)]),
      package: new FormControl("", [Validators.required]),
      status: new FormControl(true, [Validators.required])
    })
    this.loadMasters();
  }


  getToken(): void {
    this.authService.getGuestUserToken().subscribe(
      (response) => {
        this.token = response.data.guestToken;
        this.loadMasters();
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  /**
   * To Api call for district 
   *   
   */
  loadMasters(): void {
    this.authService.getAllDistrictDetails().subscribe(
      (response) => {
        // this.districtList = response["data"];
        if (response && response.data) {
          this.districtList = _.map(response.data, item => {
            let obj = {
              id: item.id,
              menu: item.name,
            }
            return obj;
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
     * To get all PackageList.
     */
  getPackageList(): void {
    let customFields = true;
    this.packageId = this.queryParamObj && this.queryParamObj.packageId ? parseInt(this.queryParamObj.packageId) : undefined;
    let isPrivate = this.packageId ? true : false;
    this.authService.getGuestUserToken().subscribe(
      (response) => {
        this.token = response.data.guestToken;
        if (this.token) {
          this.authService.getAllPackageList(isPrivate, this.token, this.packageId, customFields, this.roleID).subscribe(
            (res) => {
              if (res) {
                if (_.isArray(res.data)) {
                  this.allPackages = res.data;
                } else {
                  this.allPackages = [res.data];
                }
                if(isPrivate){
                  sessionStorage.setItem("priceId",res.data.priceId);
                }
                this.packageList = _.map(this.allPackages, item => {
                  let obj = {
                    id: item.id,
                    menu: item.packageTitle,
                    maxUser: item.maxUser,
                    priceId: item.priceId

                  }
                  return obj;
                });
                if (this.isParams) {
                  this.dropdownTitle = this.packageList[0]['menu'];
                  this.registerTeacherForm.get('package').setValue(this.packageList[0]);
                }
              }
            },
            (error) => {
              console.log(error);
            }
          );
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  get formControl() {
    return this.registerTeacherForm.controls;
  }
  /**
   * To check valid email
   *  
   */
  validateEmail(control: AbstractControl): any {
    let isValid = control.value.match(CustomRegex.emailPattern);
    if (isValid && isValid.input) {
      this.districtService.emailValidator(control.value).subscribe(
        (data) => {
        },
        (error) => {
          console.log(error);
          this.registerTeacherForm.controls['email'].setErrors({ 'emailValidate': true });
        }
      );
    }
  }

  /**
* To check valid phone number
*   
*/
  // validPhoneNumberLength(control: AbstractControl): any {
  //   let isValid = control.value.match(CustomRegex.phoneNumberPattern);
  //   if (control && control.value) {
  //     if (isValid && (control.value.length < 10 || control.value.length === 11 || control.value.length > 13)) {
  //       return { 'contactDigitValidate': true }
  //     }
  //   }
  // }


  /**
  * To check valid phone number
  *   
  */
  validPhoneNumber(control: AbstractControl): any {
    let isValid = control.value.match(CustomRegex.phoneNumberPattern);
    if (isValid && isValid.input) {
      this.districtService.contactValidator(control.value).subscribe(
        (data) => {

        },
        (error) => {
          console.log(error);
          this.registerTeacherForm.controls['phone_number'].setErrors({ 'contactValidate': true });
        }
      );
    }
  }

  /**
* On package_id dropdown value change
*/
  changePackage(event) {
    this.dropdownTitle = event.menu;
    sessionStorage.setItem("priceId", event.priceId)
    this.registerTeacherForm.get('package').setValue(event);
    if (event && event.menu) {
      this.openPackageModal(this.PackageModal);
    }
  }
  openPackageModal(modal: any): void {
    this.currentPackage = this.allPackages.find(o => o.id === this.registerTeacherForm.value.package.id);
    this.openModal = this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'package-modal' });
  }

  closePackageModal(): void {
    this.openModal.close();
  }
  /**
   * On district dropdown value change and call school list api
   */
  // changeDistrict(e) {
  //   console.log(e);
  //   const distID = e.id;
  //   this.dropdownDistrict = e.menu;
  //   this.registerTeacherForm.get('district_id').setValue(parseInt(distID));
  //   this.getSchools(distID);
  // }

  /**
   * On school dropdown value change.
   */
  // changeSchool(event) {
  //   const schid = event.id;
  //   this.dropdownSchool = event.menu;
  //   this.registerTeacherForm.get('school_id').setValue(parseInt(schid));
  // }

  onCheckBoxChange(value) {
    // this.checkBoxValue = !value;
    if (value) {
      this.registerTeacherForm.get("contact_person_name").setValue(this.registerTeacherForm.value.first_name + ' ' + this.registerTeacherForm.value.last_name);
      this.registerTeacherForm.get("contact_person_number").setValue(this.registerTeacherForm.value.phone_number);
      this.registerTeacherForm.get("contact_person_email").setValue(this.registerTeacherForm.value.email);
    } else {
      this.registerTeacherForm.get("contact_person_name").setValue("");
      this.registerTeacherForm.get("contact_person_number").setValue("");
      this.registerTeacherForm.get("contact_person_email").setValue("");
    }
  }

  getSchools(distID: any): void {
    this.authService.getAllDistrictSchoolDetails(1, this.token, parseInt(distID)).subscribe(
      (response) => {
        // this.schoolList = response["data"];
        if (response && response.data && response.data.rows) {
          this.schoolList = _.map(response.data.rows, item => {
            let obj = {
              id: item.school.id,
              menu: item.school.name
            }
            return obj;
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * On submit registration details.
   */
  onSave(): void {
    var token;
    if (this.registerTeacherForm.invalid) {
      return;
    } else {

      this.authService.getGuestUserToken().subscribe(
        (response) => {
          token = response["data"].guestToken;
        },
        (error) => {
          console.log(error);
        }
      );
      let omitArray = ['package'];
      // if (!this.registerTeacherForm.value.district_id) omitArray.push('district_id');
      // if (!this.registerTeacherForm.value.school_id) omitArray.push('school_id');
      if (!this.registerTeacherForm.value.custom_district_name) omitArray.push('custom_district_name');
      if (!this.registerTeacherForm.value.custom_school_name) omitArray.push('custom_school_name');
      if (!this.registerTeacherForm.value.contact_person_number) omitArray.push('contact_person_number');
      const submission = _.omit(this.registerTeacherForm.value, omitArray);
      submission['status'] = false;
      submission['package_id'] = this.registerTeacherForm.value.package.id;
      submission['role_id'] = parseInt(this.roleID);
      this.authService.registerTeacher(submission, this.token).subscribe(
        (dt) => {
          if (dt) {
            let stripeData = {
              subscribeId: dt.data.subscribeId,
              customerId: dt.data.teacher.customerId,
              priceId: sessionStorage.getItem("priceId")
            }
            this.authService.createStripePaymentSession(stripeData, this.token).subscribe((dt) => {
              sessionStorage.removeItem("priceId")
              setTimeout(() => {
                this.toast.showToast('Yay! You just successfully signed up for Chef Koochooloo! Check your email for next steps.', '', 'success');
                this.router.navigate(['/auth/login']);
              }, 1000);
             /*  this.stripe.redirectToCheckout({
                sessionId: dt.data,
              }) */
            })
            // this.toast.showToast('We sent an email with a verification link to ' + this.registerTeacherForm.value.email, '', 'success');
            // this.router.navigate(['/auth/sign-up']);
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

}
