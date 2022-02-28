import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { CustomRegex } from '@appcore/validators/custom-regex';
import { AuthService } from '@modules/auth/services/auth.service';
import { DistrictService } from '@modules/district/services/district.service';
@Component({
  selector: 'app-add-school',
  templateUrl: './add-school.component.html',
  styleUrls: ['./add-school.component.scss']
})
export class AddSchoolComponent implements OnInit {
  addSchoolForm: FormGroup;
  schoolAddress: string;
  principalAddress: string;
  schoolRole: any;
  districtRole: any;
  constructor(private router: Router,
    private toast: ToasterService, private authService: AuthService,private location:Location,
    private districtService: DistrictService) { }

  ngOnInit(): void {
    this.getAllRoles();
    this.getMasterRoles();
    this.addSchoolForm = new FormGroup({
      schoolName: new FormControl("", [Validators.required,Validators.pattern(CustomRegex.namePatteren), this.validateSchoolName.bind(this)]),
      adminAccountName: new FormControl("", [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]),
      pNumber: new FormControl("", [Validators.required, Validators.pattern(CustomRegex.phoneNumberPattern),
      this.validPhoneNumber.bind(this)]),
      schoolAddress: new FormControl("", []),
      email: new FormControl("", [Validators.required, Validators.pattern(CustomRegex.emailPattern), this.validateEmail.bind(this)]),
      principalName: new FormControl("", [Validators.required]),
      phoneNumber: new FormControl("", [Validators.pattern(CustomRegex.phoneNumberPattern)]),
      emailAddress: new FormControl("", [Validators.pattern(CustomRegex.emailPattern)]),
      staffAddress: new FormControl("", []),
      emergencyContact: new FormControl("", [Validators.required, Validators.pattern(CustomRegex.phoneNumberPattern)])
    });
  }
  get formControl() {
    return this.addSchoolForm.controls;
  }

  /**
   * to get role_id
   */
  getAllRoles(): void {
    this.authService.getAllMasterRoleDetails().subscribe(
      (response) => {
        if (response && response.data) {
          this.schoolRole = response.data.find(o => o.title.toLowerCase() === 'school');
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
            this.addSchoolForm.controls['email'].setErrors({ 'emailValidate': true });
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
      //   return { 'digitValidate': true }
      // }
      if (isValid && isValid.input) {
        this.districtService.contactValidator(control.value).subscribe(
          (data) => {
          },
          (error) => {
            console.log(error);
            this.addSchoolForm.controls['pNumber'].setErrors({ 'contactValidate': true });
          }
        );
      }
    }
  }

  // validContactNumber(control: AbstractControl): any {
  //   if (control && control.value) {
  //     if (control.value.length === 11 || control.value.length > 13) {
  //       return { 'phoneValidate': true }
  //     }
  //   }
  // }
  // validEmergencyPhoneNumber(control: AbstractControl): any {
  //   if (control && control.value) {
  //     if (control.value.length === 11 || control.value.length > 13) {
  //       return { 'contactDigitValidate': true }
  //     }
  //   }
  // }
  /**
   * to get district_id and role_id;
   */
  getMasterRoles(): void {
    this.authService.getAllMasterRoleDetails().subscribe(
      (response) => {
        if (response && response.data) {
          this.schoolRole = response.data.find(o => o.title.toLowerCase() === 'school');
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  /**
   * To check valid school Name
   *  
   */
  validateSchoolName(control: AbstractControl): any {
    if (control && control.value) {
      let isValid = control.value.match(CustomRegex.namePatteren);
      if (isValid && isValid.input) {
        this.districtService.schoolNameValidator(control.value).subscribe(
          (data) => {
          },
          (error) => {
            console.log(error);
            this.addSchoolForm.controls['schoolName'].setErrors({ 'schoolNameValidate': true });
          }
        );
      }
    }
  }

  sameAddress(): void {
    this.principalAddress = this.schoolAddress;
  }

  onCancel(): void {
    this.location.back();
    // this.router.navigate(['/district/district-schools']);
  }

  onSave(): void {
    this.districtRole = JSON.parse(localStorage.getItem('districtDetails'));
    if (this.addSchoolForm.invalid) {
      // return;
      this.toast.showToast('Please enter information for required fields', '', 'error');
    } else {

      
      let formData = this.addSchoolForm.value;
      if (this.schoolRole && this.districtRole) {
        let submission = {
          name: formData.schoolName,
          email: formData.email,
          phone_number: formData.pNumber,
          role_id: this.schoolRole.id,
          district_id: this.districtRole.id,
          admin_account_name: formData.adminAccountName,
          school_address: this.schoolAddress,
          contact_person_name: formData.principalName,
          contact_person_number: formData.phoneNumber,
          contact_person_email: formData.emailAddress,
          contact_person_address: this.principalAddress,
          emergency_contact_number: formData.emergencyContact,
          parent_id:this.districtRole.user_id,
          isSendPaymentLink:false
        };
        this.districtService.addSchoolDetails(submission).subscribe(
          (data) => {
            if (data) {
              this.toast.showToast(`${formData.schoolName} : School added successfully and We sent an email with a verification link to ${formData.email}`, '', 'success');
              this.onCancel();
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
}
