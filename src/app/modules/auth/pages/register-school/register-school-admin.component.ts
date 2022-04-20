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
  selector: 'app-register-school-admin',
  templateUrl: './register-school-admin.component.html',
  styleUrls: ['./register-school-admin.component.scss']
})
export class SchoolAdminComponent implements OnInit {
  @ViewChild('package') PackageModal: ElementRef;
  registerAdminForm: FormGroup;
  dropdownTitle = "Select Package";
  dropdownDistrictTitle = "District";
  districtList = []
  roleID: number;
  packageList = [];
  openModal;
  packageId: number;
  token: string;
  queryParamObj;
  isParams = false;
  allPackages = [];
  currentPackage;  
  stripe:any
  months:any;
  constructor(
    private authService: AuthService,
    private toast: ToasterService,
    private router: Router,
    private modalService: NgbModal,
    private districtService: DistrictService,
    private activatedRoute: ActivatedRoute
  ) {
    sessionStorage.removeItem("priceId");
    this.months=CustomRegex.months;
    if (this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams) {
      let queryString = Object.keys(this.activatedRoute.snapshot.queryParams)[0];
      if (queryString) {
        this.queryParamObj = this.authService.queryParamsToJSON(queryString);
        this.isParams = true;
      }
    }
  }

  ngOnInit(): void {
    this.stripe = Stripe(environment.public_key);
    if (this.isParams) {
      this.roleID = parseInt(this.queryParamObj.role_id);
    } else {
      this.roleID = parseInt(localStorage.getItem('rolID'));
    }
    this.getPackageList();
    this.registerAdminForm = new FormGroup({
      schoolName: new FormControl("", [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]),
      adminAccountName: new FormControl("", [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]),
      adminEmailAddress: new FormControl("", [Validators.required,
      Validators.pattern(CustomRegex.emailPattern),
      this.validateEmail.bind(this),
      ]),
      adminPhoneNumber: new FormControl("", [Validators.required, Validators.pattern(CustomRegex.phoneNumberPattern),
        // Validators.minLength(10),
        this.validPhoneNumber.bind(this),
      ]),
      contactPersonName: new FormControl("", [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]),
      contactPersonNumber: new FormControl("", [Validators.pattern(CustomRegex.phoneNumberPattern),
        //  Validators.minLength(10),
        // this.validPhoneNumberLength.bind(this)
      ]),
      contactPersonEmail: new FormControl("", [Validators.pattern(CustomRegex.emailPattern)]),
      package: new FormControl("", [Validators.required]),
      district: new FormControl("")
    });
    // this.loadMasters();
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
          this.authService.getAllPackageList(isPrivate, this.token, this.packageId,customElements,this.roleID).subscribe(
            (res) => {
              if (res && res.data) {
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
            }
          );
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // loadMasters(): void {
  //   this.authService.getAllDistrictDetails().subscribe(
  //     (response) => {
  //       this.districtList = _.map(response.data, item => {
  //         const obj = {
  //           id: item.id,
  //           menu: item.name
  //         }
  //         return obj;
  //       });
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }
  get formControl() {
    return this.registerAdminForm.controls;
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
          this.registerAdminForm.controls['adminEmailAddress'].setErrors({ 'emailValidate': true });
        }
      );
    }
  }

    /**
* To check valid phone number length
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
    if (control && control.value) {
      let isValid = control.value.match(CustomRegex.phoneNumberPattern);
      // if (isValid && (control.value.length < 10 || control.value.length === 11 || control.value.length > 13)) {
      //   return { 'contactPnumberValidate': true }
      // }
      if (isValid && isValid.input) {
        this.districtService.contactValidator(control.value).subscribe(
          (data) => {
          },
          (error) => {
            console.log(error);
            this.registerAdminForm.controls['adminPhoneNumber'].setErrors({ 'contactValidate': true });
          }
        );
      }
    }
  }

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
      }
    );
  }

  closePackageModal(): void {
    this.openModal.close();
  }

  // changeDistrict(event) {
  //    this.distID = event.target.value;
  //   this.registerAdminForm.get('district').setValue(parseInt(this.distID));

  // }

  onCheckBoxChange(value) {
    console.log(value);
    // this.checkBoxValue = !value;
    if (value) {
      this.registerAdminForm.get("contactPersonName").setValue(this.registerAdminForm.value.adminAccountName);
      this.registerAdminForm.get("contactPersonNumber").setValue(this.registerAdminForm.value.adminPhoneNumber);
      this.registerAdminForm.get("contactPersonEmail").setValue(this.registerAdminForm.value.adminEmailAddress);
    } else {
      this.registerAdminForm.get("contactPersonName").setValue("");
      this.registerAdminForm.get("contactPersonNumber").setValue("");
      this.registerAdminForm.get("contactPersonEmail").setValue("");
    }
  }

  /**
   * On submit registration details.
   */
  onSave(): void {
    var token;
    if (this.registerAdminForm.invalid) {
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
      let submission = {
        name: this.registerAdminForm.value.schoolName,
        email: this.registerAdminForm.value.adminEmailAddress,
        phone_number: this.registerAdminForm.value.adminPhoneNumber,
        role_id: this.roleID,
        // district_id: this.distID, by PS
        admin_account_name: this.registerAdminForm.value.adminAccountName,
        school_address: this.registerAdminForm.value.schoolAddress,
        contact_person_name: this.registerAdminForm.value.contactPersonName,
        contact_person_number: this.registerAdminForm.value.contactPersonNumber,
        contact_person_email: this.registerAdminForm.value.contactPersonEmail,
        contact_person_address: this.registerAdminForm.value.contactPersonName,
        emergency_contact_number: this.registerAdminForm.value.contactPersonNumber,
        package_id:this.registerAdminForm.value.package.id,
        customDistrictName:this.registerAdminForm.value.district
      };

      this.authService.registerSchoolAdmin(submission,this.token).subscribe(
        (dt:any) => {
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
    this.router.navigate(['/']);
  }
 
}
