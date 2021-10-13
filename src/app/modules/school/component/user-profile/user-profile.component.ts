import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faEdit,
  faPencilAlt
} from '@fortawesome/free-solid-svg-icons';
import {SchoolService } from '@modules/school/services/school.service';
import * as _ from 'lodash';
import { ToasterService } from '@appcore/services/toaster.service';
import { AbstractControl,FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from '@appcore/validators/confirm-password.validator';
import { AuthService } from '@modules/auth/services/auth.service';
import { CustomRegex } from '@appcore/validators/custom-regex';

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
  userProfile: any;
  sessionData: any;
  currentUser: any;
  address: any;
  loggedInUser = [];
  editProfileForm: FormGroup;
  passwordForm: FormGroup;

  constructor(private modalService: NgbModal,
    private toast: ToasterService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private schoolService: SchoolService) {
    this.profilePic = './assets/images/user-profile.png'
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(window.sessionStorage.getItem('currentUser'));
     if(this.currentUser.parent_role)
    {
      this.getSchoolUserProfile()
    }
    else
    {
      this.getUserProfile(this.currentUser.id);
    }
    this.editProfileForm = new FormGroup({
      name: new FormControl('', [Validators.required,Validators.pattern('^[a-zA-Z \-\']+')]),
      emailAddress: new FormControl('', [Validators.required, Validators.pattern(CustomRegex.emailPattern), this.validateEmail.bind(this)]),
      school: new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z \-\']+')]),
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
      this.schoolService.uploadProfileImg(event.target.files).subscribe(
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
  }
  openChangePassModal(modal: any) {
    this.passwordModal = this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'dist-modal' });
  }
  editProfileDetails(form: any): any {
    this.editModal = this.modalService.open(form, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'dist-modal' });
    this.editProfileForm.get('gender').setValue(this.userDetails.gender);
    this.editProfileForm.get('name').setValue(this.userDetails.name);
    this.editProfileForm.get('address').setValue(this.userDetails.address)
    this.editProfileForm.get('school').setValue(this.userDetails.school);
    this.editProfileForm.get('contact').setValue(this.userDetails.phone);
    this.editProfileForm.get('emailAddress').setValue(this.userDetails.email);
  }
  
  onUpdateProfile(img?: any): void {
    if (!this.currentUser.parent_role) {
    if (img) {
      let submission = {
        profile_image: this.userDetails.img
      };
      this.updateProfile(submission);
    } else {
      if (this.editProfileForm.invalid) {
        return;
      } else {
        let submission = {
          name: this.editProfileForm.value.school,
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
  else
  {
    if (img) {
      let submission = {
        profile_image: this.userDetails.img
      };
      this.updateSchoolUserProfile(submission);
    } else {
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
        this.updateSchoolUserProfile(submission);
      }
    }
  }
}
  updateProfile(submission): void {
    this.schoolService.updateSchoolProfile(submission,this.currentUser.id).subscribe(
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
          this.getUserProfile(this.currentUser.id);
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  updateSchoolUserProfile(submission): void {
    this.schoolService.updateSchoolUserProfile(submission).subscribe(
      (data) => {
        if (data) {
          this.toast.showToast('Profile updated successfully', '', 'success');
          if (this.editModal)
            this.closeEditModal();
            if(this.currentUser.parent_role)
            {
              this.getSchoolUserProfile()
            }
            else{
               this.getUserProfile(this.currentUser.id);
            }
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  getUserProfile(id): void {
    this.schoolService.getSchoolProfile(id).subscribe(
      (response) => {
        if (response && response.data) {
          let userData = response.data;
          let obj = {
            name: userData.school.admin_account_name,
            address: userData.school.admin_address,
            img: userData.profile_image || this.profilePic,
            school: userData.school.name,
            gender: userData.school.admin_gender,
            phone: userData.phone_number,
            email: userData.email
          }
          this.userDetails = obj;
          this.authService.setuserlang();
          this.schoolService.setProfileObs(this.userDetails);
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  getSchoolUserProfile(): void {
    this.schoolService.getSchoolUserProfile().subscribe(
      (response) => {
        if(response && response.data){
        this.schoolService.getSchoolDetailsByUserId(response.data.createdBy).subscribe(
          (res) => {
          let userData = res.data[0];
          let obj = {
            name: response.data.schoolDetails.first_name,
            school: userData.name,
            address: response.data.schoolDetails.address,
            img: response.data.profile_image || this.profilePic,
            gender: response.data.schoolDetails.gender,
            phone: response.data.phone_number,
            email: response.data.email

          };
          this.userDetails = obj;
          this.authService.setuserlang();
          this.schoolService.setProfileObs(this.userDetails);

      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
        }
    });
    

  }

  /**
   * API call to change password
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
            this.schoolService.emailValidator(control.value).subscribe(
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
      if (control.value.length === 10 && isValid && isValid.input) {
        if (this.userDetails && this.userDetails.phone === control.value) {
          contactNo = undefined;
        }
        if (contactNo) {
          this.schoolService.contactValidator(contactNo).subscribe(
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
  
}
