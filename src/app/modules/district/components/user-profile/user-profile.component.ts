import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  faEdit,
  faPencilAlt
} from '@fortawesome/free-solid-svg-icons';
import { DistrictService } from '@modules/district/services/district.service';
import * as _ from 'lodash';
import { ToasterService } from '@appcore/services/toaster.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from '@appcore/validators/confirm-password.validator';
import { AuthService } from '@modules/auth/services/auth.service';
import { CustomRegex } from '@appcore/validators/custom-regex';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  faEdit = faEdit;
  faPencil = faPencilAlt;
  closeModal;
  editModal;
  passwordModal;
  userDetails: any;
  userImg: string;
  profilePic: string;
  userName: any;
  agentProfile: any;
  sessionData: any;
  currentUser: any;
  address: any;
  loggedInUser = [];
  editProfileForm: FormGroup;
  passwordForm: FormGroup;

  constructor(private modalService: NgbModal,
    private toast: ToasterService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private districtService: DistrictService) {
    this.profilePic = './assets/images/user-profile.png'
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(window.sessionStorage.getItem('currentUser'));
    if(this.currentUser.parent_role)
    {
      this.getDistrictUserProfile()
    }
    else
    {
      this.getUserProfile();
    }
    this.editProfileForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      emailAddress: new FormControl("", [Validators.required, Validators.pattern(CustomRegex.emailPattern), this.validateEmail.bind(this)]),
      distName: new FormControl('', [Validators.required]),
      address: new FormControl([], []),
      contact: new FormControl("", [Validators.required, Validators.pattern(CustomRegex.phoneNumberPattern),
      Validators.minLength(10), this.validPhoneNumber.bind(this)]),
      gender: new FormControl('Male', [])
    });
    this.passwordForm = this.fb.group({
      current_password: new FormControl('', [Validators.required]),
      new_password: new FormControl('', [Validators.required]),
      confirm_password: new FormControl('', [Validators.required])
    }, { validator: ConfirmPasswordValidator('new_password', 'confirm_password') })
  }

  editProfileImage(event: any): void {
    if (event.target.files) {
      let file = event.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onload = (e: any) => {
        let img = new Image();
        this.userDetails.img = img;
      }
      this.districtService.uploadProfileImg(event.target.files).subscribe(
        (response) => {
          if (response && response.data[0]) {
            this.userDetails.img = response.data[0].mediaPath;
            this.onUpdateProfile(this.userDetails.img);
          }
        },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        });
    }
  }

  open(content) {
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'dist-modal' });
  }
  get formControls() {
    return this.passwordForm.controls;
  }
  get formControl() {
    return this.editProfileForm.controls;
  }
  closeOpenModal() {
    this.closeModal.close();
  }
  closeEditModal() {
    this.editModal.close();
  }
  closeChangePassModal() {
    this.passwordModal.close();
    this.resetForm();
  }
  openChangePassModal(modal: any) {
    this.passwordModal = this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'dist-modal' });
  }
  editProfileDetails(form: any): any {
    this.editModal = this.modalService.open(form, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'dist-modal' });
    this.editProfileForm.get('gender').setValue(_.isEmpty(this.userDetails.gender) || null || undefined ? 'Male':this.userDetails.gender);
    this.editProfileForm.get('name').setValue(this.userDetails.name);
    this.editProfileForm.get('address').setValue(this.userDetails.address);
    this.address = this.userDetails.address;
    this.editProfileForm.get('distName').setValue(this.userDetails.district);
    this.editProfileForm.get('contact').setValue(this.userDetails.phone);
    this.editProfileForm.get('emailAddress').setValue(this.userDetails.email);
  }

  onUpdateProfile(img?: any): void {
    if (!this.currentUser.parent_role) {
      if(img){
      let submission = {
        profile_image: this.userDetails.img
      };
      this.updateProfile(submission);
    } else {
      if (this.editProfileForm.invalid) {
        return;
      } else {
        let submission = {
          name: this.editProfileForm.value.distName,
          email: this.editProfileForm.value.emailAddress,
          phone_number: this.editProfileForm.value.contact,
          profile_image: this.userDetails.img,
          admin_account_name: this.editProfileForm.value.name,
          admin_address: this.address,
          admin_gender: this.editProfileForm.value.gender,
        }
        this.updateProfile(submission);
      }
    }
  }
  else{
    if(img){
      let submission = {
        profile_image: this.userDetails.img
      };
      this.updateDistrictUserProfile(this.currentUser.id,submission);
    }
      else {
        if (this.editProfileForm.invalid) {
          return;
        } else {
          let submission = {
            first_name: this.editProfileForm.value.name,
            email: this.editProfileForm.value.emailAddress,
            phone_number: this.editProfileForm.value.contact,
            profile_image: this.userDetails.img,
            address: this.address,
            gender: this.editProfileForm.value.gender,
          }
          this.updateDistrictUserProfile(this.currentUser.id,submission);
        }
      }
  }
  }
  updateProfile(submission): void {
    this.districtService.updateDistrictProfile(submission).subscribe(
      (data) => {
        if (data) {
          if(data.data.isEmailChanged){
            sessionStorage.removeItem("currentUser")
            this.authService.logoutUser().subscribe(
             (data) => {
               if (data) {
                 this.toast.showToast('Logout Successful', '', 'success');
               }
             },
             (error) => {
               console.log(error);
             }
           );
          }
          this.toast.showToast('Profile updated successfully', '', 'success');
          if (this.editModal)
            this.closeEditModal();
            if(this.currentUser.parent_role)
            {
              this.getDistrictUserProfile()
            }
            else{
               this.getUserProfile();
            }
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  updateDistrictUserProfile(id:any,submission:any): void {
    this.districtService.updateDistrictUserProfile(submission).subscribe(
      (data) => {
        if (data) {
          this.toast.showToast('Profile updated successfully', '', 'success');
          if (this.editModal)
            this.closeEditModal();
            if(this.currentUser.parent_role)
            {
              this.getDistrictUserProfile()
            }
            else{
               this.getUserProfile();
            }
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  getUserProfile(): void {
    this.districtService.getDistrictProfile().subscribe(
      (response) => {
        if (response && response.data) {
          let userData = response.data;
          let obj = {
            name: userData.district_admin.admin_account_name,
            address: userData.district_admin.admin_address,
            img: userData.profile_image || this.profilePic,
            district: userData.district_admin.name,
            gender: userData.district_admin.admin_gender,
            phone: userData.phone_number,
            email: userData.email
          }
          this.userDetails = obj;
          this.districtService.setProfileObs(this.userDetails);
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  /**
   * API call to change password
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
    if(control && control.value){
      let isValid = control.value.match(CustomRegex.emailPattern);
      let emailID = control.value;
      if (isValid && isValid.input) {
        if (this.userDetails && this.userDetails.email === control.value) {
          emailID = undefined;
        }
        if (emailID) {
          this.districtService.emailValidator(control.value).subscribe(
            (data) => {
            },
            (error) => {
              console.log(error);
              this.editProfileForm.controls['emailAddress'].setErrors({ 'emailValidate': true });
            }
          );
        }
      }
    }
  }

  /**
   * To check valid phone number
   *   
   */
  validPhoneNumber(control: AbstractControl): any {
    if(control && control.value){
      let isValid = control.value.match(CustomRegex.phoneNumberPattern);
      let contactNo = control.value;
      if (control.value && control.value.length === 11 || control.value.length > 13) {
        return { 'digitValidate': true }
      }
      if (isValid && isValid.input) {
        if (this.userDetails && this.userDetails.phone === control.value) {
          contactNo = undefined;
        }
        if (contactNo) {
          this.districtService.contactValidator(contactNo).subscribe(
            (data) => {
            },
            (error) => {
              console.log(error);
              this.editProfileForm.controls['contact'].setErrors({ 'contactValidate': true });
            }
          );
        }
      }
    }
  }

  resetForm(): void {
    this.passwordForm.reset();
  }
  getDistrictUserProfile(): void {
  
    this.districtService.getDistrictUserProfile().subscribe(
      (response) => {
        if(response && response.data){
        this.districtService.getDistrictAdminProfile(response.data.createdBy).subscribe(
          (res) => {
          let districtData = res.data;
          let distObj = {
            name: response.data.details.first_name,
            district: districtData.district_admin.name,
            address:  response.data.details.address,
            img: response.data.profile_image || this.profilePic,
            phone: response.data.phone_number,
            gender: response.data.details.gender,
            email: response.data.email
          };
          this.userDetails = distObj;
          districtData.role = {...response.data.role}
          this.authService.setuserlang();
        
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
        }
    });
    
  }

}
