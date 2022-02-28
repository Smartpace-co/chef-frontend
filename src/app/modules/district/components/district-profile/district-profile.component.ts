import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  faEdit,
  faPencilAlt
} from '@fortawesome/free-solid-svg-icons';
import { DistrictService } from '@modules/district/services/district.service';
import { ToasterService } from '@appcore/services/toaster.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from '@appcore/validators/confirm-password.validator';
import { AuthService } from '@modules/auth/services/auth.service';
import * as _ from 'lodash';
import { CustomRegex } from '@appcore/validators/custom-regex';
@Component({
  selector: 'app-district-profile',
  templateUrl: './district-profile.component.html',
  styleUrls: ['./district-profile.component.scss']
})
export class DistrictProfileComponent implements OnInit {
  faEdit = faEdit;
  faPencil = faPencilAlt;
  closeModal;
  distModal;
  editModal;
  passwordModal;
  districtProfile: any;
  agentDetails: any;
  profilePic: string;
  districtDetails: any;
  districtAddress: any;
  distProfileForm: FormGroup;
  passwordForm: FormGroup;

  get formControl() {
    return this.distProfileForm.controls;
  }

  get formControls() {
    return this.passwordForm.controls;
  }

  constructor(private modalService: NgbModal,
    private toast: ToasterService,
    private fb: FormBuilder,
    private authService: AuthService,
    private districtService: DistrictService) {
    this.profilePic = './assets/images/user-profile.png'
  }

  ngOnInit(): void {
    this.getUserProfile();
    this.distProfileForm = new FormGroup({
      displayName: new FormControl('', []),
      districtName: new FormControl('', [Validators.required]),
      phone: new FormControl("", [Validators.required, Validators.pattern(CustomRegex.phoneNumberPattern),
      this.validPhoneDistNumber.bind(this)]),
      districtAddress: new FormControl('', []),
      name: new FormControl('', [Validators.required]),
      emailAddress: new FormControl("", [Validators.pattern(CustomRegex.emailPattern)]),
      title: new FormControl('', []),
      contact: new FormControl("", [Validators.pattern(CustomRegex.phoneNumberPattern)]),
      gender: new FormControl('Male', [])
    });

    this.passwordForm = this.fb.group({
      current_password: new FormControl('', [Validators.required]),
      new_password: new FormControl('', [Validators.required]),
      confirm_password: new FormControl('', [Validators.required])
    }, { validator: ConfirmPasswordValidator('new_password', 'confirm_password') })

  }
  open(content) {
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'dist-modal' });
  }
  closeOpenModal() {
    this.closeModal.close();
  }

  closeChangePassModal() {
    this.passwordModal.close();
    this.resetForm();
  }
  openChangePassModal(modal: any) {
    this.passwordModal = this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'dist-modal' });
  }

  closeEditModal() {
    this.editModal.close();
  }
  openEditModal(agent: any) {
    this.editModal = this.modalService.open(agent, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'dist-modal' });
    this.distProfileForm.get('displayName').setValue(this.districtDetails.displayName);
    this.distProfileForm.get('districtAddress').setValue(this.districtDetails.districtAddress);
    this.districtAddress = this.districtDetails.districtAddress;
    this.distProfileForm.get('districtName').setValue(this.districtDetails.districtName);
    this.distProfileForm.get('phone').setValue(this.districtDetails.phone);

    this.distProfileForm.get('name').setValue(this.agentDetails.name);
    this.distProfileForm.get('title').setValue(this.agentDetails.title);
    this.distProfileForm.get('contact').setValue(this.agentDetails.phone);
    this.distProfileForm.get('emailAddress').setValue(this.agentDetails.email);
    this.distProfileForm.get('gender').setValue(_.isEmpty(this.agentDetails.gender) || null || undefined ? 'Male' : this.agentDetails.gender);
  }

  getUserProfile(): void {
    this.districtService.getDistrictProfile().subscribe(
      (response) => {
        if (response && response.data) {
          let districtData = response.data;
          let distObj = {
            districtName: districtData.district_admin.name,
            displayName: districtData.district_admin.display_name,
            districtAddress: districtData.district_admin.district_address,
            img: districtData.district_admin.district_image || this.profilePic,
            phone: districtData.district_admin.district_phone_no
          };
          let obj = {
            name: districtData.district_admin.contact_person_name,
            email: districtData.district_admin.contact_person_email,
            title: districtData.district_admin.contact_person_title,
            img: districtData.district_admin.contact_person_image || this.profilePic,
            gender: districtData.district_admin.contact_person_gender,
            phone: districtData.district_admin.contact_person_no
          };
          this.districtDetails = distObj;
          this.agentDetails = obj;
          let headerData = {
            district: response.data.district_admin.name,
            name: response.data.district_admin.admin_account_name,
            img: response.data.profile_image
          }
          this.districtService.setProfileObs(headerData);
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  editProfileImage(event: any, user: string): void {
    if (event.target.files) {
      let file = event.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onload = (e: any) => {
        let img = new Image();
        if (user === 'district') {
          this.districtDetails.img = img;
        } else {
          this.agentDetails.img = img;
        }
        this.uploadImage(event.target.files, user);
      }
    }
  }

  uploadImage(files: any, user: any): void {
    this.districtService.uploadProfileImg(files).subscribe(
      (response) => {
        if (response && response.data[0]) {
          if (user === 'district') {
            this.districtDetails.img = response.data[0].mediaPath;
            this.onUpdateDistProfile(user);
          } else {
            this.agentDetails.img = response.data[0].mediaPath;
            this.onUpdateDistProfile(user);
          }
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      });
  }

  /**
   * API call to update district/agent  profile detials.
   */
  onUpdateDistProfile(user?: any): void {
    let submission;
    if (user) {
      if (user === 'district') {
        submission = {
          district_image: this.districtDetails.img,
        }
      } else {
        submission = {
          contact_person_image: this.agentDetails.img,
        }
      }
    } else {
      if (this.distProfileForm.invalid) {
        this.toast.showToast('Please enter information for required fields', '', 'error');
      } else {
        submission = {
          name: this.distProfileForm.value.districtName,
          display_name: this.distProfileForm.value.displayName,
          district_address: this.districtAddress,
          district_phone_no: this.distProfileForm.value.phone,
          contact_person_name: this.distProfileForm.value.name,
          contact_person_no: this.distProfileForm.value.contact,
          contact_person_email: this.distProfileForm.value.emailAddress,
          contact_person_gender: this.distProfileForm.value.gender,
          contact_person_title: this.distProfileForm.value.title,
          isSendPaymentLink: false
        }
      }
    }
    if (!_.isEmpty(submission)) {
      this.districtService.updateDistrictProfile(submission).subscribe(
        (data) => {
          if (data) {
            this.toast.showToast('Profile updated successfully', '', 'success');
            this.closeEditModal();
            this.getUserProfile();
          }
        },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        });
    }
  }
  /**
   * API call to update password.
   */
  onUpdatePassword(): void {
    let submission = _.omit(this.passwordForm.value, ['confirm_password']);
    if (this.passwordForm.invalid) {
      this.toast.showToast('Please enter information for required fields', '', 'error');
    } else {
      this.authService.changePassword(submission).subscribe(
        (data) => {
          if (data) {
            this.toast.showToast(' Password changed successfully', '', 'success');
            this.closeChangePassModal();
            this.closeOpenModal();
          }
        },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
    }
  }

  /**
  * To check valid email
  *  
  */
  validateEmail(control: AbstractControl): any {
    if (control && control.value) {
      let isValid = control.value.match(CustomRegex.emailPattern);
      let emailID = control.value;
      if (isValid && isValid.input) {
        if (this.agentDetails && this.agentDetails.email === control.value) {
          emailID = undefined;
        }
        if (emailID) {
          this.districtService.emailValidator(control.value).subscribe(
            (data) => {
            },
            (error) => {
              console.log(error);
              this.distProfileForm.controls['emailAddress'].setErrors({ 'emailValidate': true });
            }
          );
        }
      }
    }
  }

  /**
   * To check valid phone agent's number
   *   
   */
  // validPhoneNumber(control: AbstractControl): any {
  //   if (control && control.value) {
  //     let isValid = control.value.match(CustomRegex.phoneNumberPattern);
  //     let contactNo = control.value;
  //     if (control.value && control.value.length === 11 || control.value.length > 13) {
  //       return { 'digitValidate': true }
  //     }
  //   }
  // }

  /**
   * To check valid district's phone number
   *   
   */
  validPhoneDistNumber(control: AbstractControl): any {
    if (control && control.value) {
      let isValid = control.value.match(CustomRegex.phoneNumberPattern);
      let contactNo = control.value;
      // if (control.value && control.value.length === 11 || control.value.length > 13) {
      //   return { 'contactDigitValidate': true }
      // }
      if (isValid && isValid.input) {
        if (this.districtDetails && this.districtDetails.phone === control.value) {
          contactNo = undefined;
        }
        if (contactNo) {
          this.districtService.contactValidator(contactNo).subscribe(
            (data) => {
            },
            (error) => {
              console.log(error);
              this.distProfileForm.controls['phone'].setErrors({ 'phoneValidate': true });
            }
          );
        }
      }
    }
  }

  resetForm(): void {
    this.passwordForm.reset();
  }
}
