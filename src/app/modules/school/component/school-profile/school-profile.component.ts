import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  faEdit,
  faPencilAlt
} from '@fortawesome/free-solid-svg-icons';
import { SchoolService } from '@modules/school/services/school.service';
import { ToasterService } from '@appcore/services/toaster.service';

import { ConfirmPasswordValidator } from '@appcore/validators/confirm-password.validator';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@modules/auth/services/auth.service';
import { CustomRegex } from '@appcore/validators/custom-regex';
import * as _ from 'lodash';
@Component({
  selector: 'app-school-profile',
  templateUrl: './school-profile.component.html',
  styleUrls: ['./school-profile.component.scss']
})
export class SchoolProfileComponent implements OnInit {
  faEdit = faEdit;
  faPencil = faPencilAlt;
  closeModal;
  distModal;
  editModal;
  passwordModal;
  schoolProfile: any;
  agentDetails: any;
  profilePic:string;
  schoolDetails: any;
  schoolAddress: any;
  schoolProfileForm: FormGroup;
  passwordForm: FormGroup;
  currentUser: any;
  districtDetails: any;
  hideDistrictField = false;
  get formControl() {
    return this.schoolProfileForm.controls;
  }

  get formControls() {
    return this.passwordForm.controls;
  }

  constructor(private modalService: NgbModal,
    private toast: ToasterService,
    private fb: FormBuilder,
    private authService: AuthService,
    private schoolService: SchoolService) {
      this.profilePic = './assets/images/user-profile.png'
    }

  ngOnInit(): void {
    this.currentUser = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.getUserProfile(this.currentUser.id);
    this.schoolProfileForm = new FormGroup({
      displayName: new FormControl('', [Validators.pattern('^[a-zA-Z \-\']+')]),
      district: new FormControl(''),
      schoolName: new FormControl('', [Validators.required,Validators.pattern('^[a-zA-Z \-\']+')]),
      schoolAddress: new FormControl(''),
      name: new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z \-\']+')]),
      emailAddress: new FormControl("", [Validators.pattern(CustomRegex.emailPattern)]),
      title: new FormControl('',[Validators.pattern('^[a-zA-Z \-\']+')]),
      contact: new FormControl("", [Validators.pattern(CustomRegex.phoneNumberPattern)]),
      gender: new FormControl('Male', []),
      schoolPhoneNumber: new FormControl("", [Validators.required, Validators.pattern(CustomRegex.phoneNumberPattern)]),

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
  }
  openChangePassModal(modal: any) {
    this.passwordModal = this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'dist-modal' });
  }

  closeEditModal() {
    this.editModal.close();
  }
  openEditModal(agent: any) {
    this.editModal = this.modalService.open(agent, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'dist-modal' });
    this.schoolProfileForm.get('displayName').setValue(this.schoolDetails.displayName);
    this.schoolProfileForm.get('schoolAddress').setValue(this.schoolDetails.schoolAddress);
    this.schoolProfileForm.get('schoolName').setValue(this.schoolDetails.schoolName);
    this.schoolProfileForm.get('schoolPhoneNumber').setValue(this.schoolDetails.schoolPhoneNumber);
    if(this.schoolDetails && this.schoolDetails.district){
      this.schoolProfileForm.get('district').setValue(this.schoolDetails.district);
    }
    this.schoolProfileForm.get('name').setValue(this.agentDetails.name);
    this.schoolProfileForm.get('title').setValue(this.agentDetails.title);
    this.schoolProfileForm.get('contact').setValue(this.agentDetails.phone);
    this.schoolProfileForm.get('emailAddress').setValue(this.agentDetails.email);
    this.schoolProfileForm.get('gender').setValue(this.agentDetails.gender) // === true ? 'male' : 'female');
  }

  getUserProfile(id): void {
    this.schoolService.getSchoolProfile(id).subscribe(
      (response) => {
        if (response && response.data) {
          let schoolData = response.data;
          if(schoolData.district_details === null){
            this.hideDistrictField = true;
            this.districtDetails = schoolData.school.customDistrictName;
          }else{
            this.districtDetails = schoolData.district_details.name;
          }
          let schoolObj = {
            schoolName: schoolData.school.name,
            displayName: schoolData.school.display_name,
            schoolAddress: schoolData.school.school_address,
            district:this.districtDetails,
            img: schoolData.school.school_image || this.profilePic,
            schoolPhoneNumber: schoolData.school.school_phone_no
          };
          let obj = {
            name: schoolData.school.contact_person_name,
            email: schoolData.school.contact_person_email,
            title: schoolData.school.contact_person_title,
            img: schoolData.school.contact_person_image || this.profilePic,
            gender: schoolData.school.contact_person_gender,
            phone: schoolData.school.contact_person_number
          };

          this.schoolDetails = schoolObj;
          this.agentDetails = obj;
          let headerData = {
            school: response.data.school.name,
            name: response.data.school.admin_account_name,
            img: response.data.profile_image
          }
          this.schoolService.setProfileObs(headerData);
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  /**
   * To check valid phone agent's number
   *   
   */
  // validPhoneNumber(control: AbstractControl): any {
  //   if (control && control.value) {
  //     if (control.value && control.value.length === 11 || control.value.length > 13) {
  //       return { 'digitValidate': true }
  //     }
  //   }
  // }

    /**
   * To check valid district's phone number
   *   
   */
  // validSchoolPhoneNumber(control: AbstractControl): any {
  //   if (control && control.value) {
  //     if (control.value && control.value.length === 11 || control.value.length > 13) {
  //       return { 'contactDigitValidate': true }
  //     }     
  //   }
  // }

  editProfileImage(event: any, user: string): void {
    if (event.target.files) {
      let file = event.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onload = (e: any) => {
        let img = new Image();
        if (user === 'district') {
          this.schoolDetails.img = img;
        } else {
          this.agentDetails.img = img;
        }
        this.uploadImage(event.target.files, user);
      }
    }
  }

  uploadImage(files: any, user: any): void {
    this.schoolService.uploadProfileImg(files).subscribe(
      (response) => {
        if (response && response.data[0]) {
          if (user === 'school') {
            this.schoolDetails.img = response.data[0].mediaPath;
            this.onUpdateSchoolProfile(user);
          } else {
            this.agentDetails.img = response.data[0].mediaPath;
            this.onUpdateSchoolProfile(user);
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
  onUpdateSchoolProfile(user?: any): void {
    let submission;
    if (user) {
      if (user === 'school') {
        submission = {
          school_image: this.schoolDetails.img,
        }
      } else {
        submission = {
          contact_person_image: this.agentDetails.img,
        }
      }
    } else {
      submission = {
        name: this.schoolProfileForm.value.schoolName,
        display_name: this.schoolProfileForm.value.displayName,
        school_address: this.schoolAddress,
        school_phone_no: this.schoolProfileForm.value.schoolPhoneNumber,
        contact_person_name: this.schoolProfileForm.value.name,
        contact_person_number: this.schoolProfileForm.value.contact,
        contact_person_email: this.schoolProfileForm.value.emailAddress,
        contact_person_gender: this.schoolProfileForm.value.gender,
       contact_person_title: this.schoolProfileForm.value.title
      }
      submission['customDistrictName'] = this.schoolProfileForm.value.district;
    }
    this.schoolService.updateSchoolProfile(submission,this.currentUser.id).subscribe(
      (data) => {
        if (data) {
          this.toast.showToast('Profile updated successfully', '', 'success');
          this.closeEditModal();
          this.getUserProfile(this.currentUser.id);
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      });
  }
  /**
   * API call to update password.
   */
  onUpdatePassword(): void {
    let submission = _.omit(this.passwordForm.value, ['confirm_password']);
    if (this.passwordForm.invalid) {
      return;
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

  validateEmail(control: AbstractControl): any {
    if(control && control.value){
      let isValid = control.value.match(CustomRegex.emailPattern);
      let emailID = control.value;
      if (isValid && isValid.input) {
        if (this.schoolDetails && this.schoolDetails.email === control.value) {
          emailID = undefined;
        }
        if (emailID) {
          this.schoolService.emailValidator(control.value).subscribe(
            (data) => {
            },
            (error) => {
              console.log(error);
              this.schoolProfileForm.controls['emailAddress'].setErrors({ 'emailValidate': true });
            }
          );
        }
      }
    }
  }
}
