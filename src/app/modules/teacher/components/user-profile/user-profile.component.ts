import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  faEdit,
  faPencilAlt
} from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import { ToasterService } from '@appcore/services/toaster.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from '@appcore/validators/confirm-password.validator';
import { AuthService } from '@modules/auth/services/auth.service';
import { TeacherService } from '@modules/teacher/services/teacher.service'
import { CustomRegex } from '@appcore/validators/custom-regex';
import { DistrictService } from '@modules/district/services/district.service';

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
  teacherid: any;
  schoolid: number;

  constructor(private modalService: NgbModal,
    private toast: ToasterService,
    private fb: FormBuilder,
    private authService: AuthService,
    private teacherService: TeacherService,
    private districtService: DistrictService,
  ) { this.profilePic = './assets/images/user-profile.png' }

  ngOnInit(): void {
    this.currentUser = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.teacherid = this.currentUser.id;
    this.getUserProfile(this.teacherid);
    this.editProfileForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.pattern(CustomRegex.namePatteren)]),
      lastname: new FormControl('', [Validators.required, Validators.pattern(CustomRegex.namePatteren)]),
      emailAddress: new FormControl('', [Validators.required,
      Validators.pattern(CustomRegex.emailPattern),
      ]),
      schoolName: new FormControl('', []),
      address: new FormControl([], []),
      contact: new FormControl('', [Validators.required,
        Validators.pattern(CustomRegex.phoneNumberPattern),
        Validators.minLength(10),
        ]),
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
      this.teacherService.uploadProfileImg(event.target.files).subscribe(
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
    this.editProfileForm.get('firstname').setValue(this.userDetails.firstname);
    this.editProfileForm.get('lastname').setValue(this.userDetails.lastname)
    this.editProfileForm.get('address').setValue(this.userDetails.address);
    this.editProfileForm.get('schoolName').setValue(this.userDetails.school);
    this.editProfileForm.get('contact').setValue(this.userDetails.phone);
    this.editProfileForm.get('emailAddress').setValue(this.userDetails.email);
  }

  onUpdateProfile(img?: any): void {
    if (img) {
      let submission = {
        profile_image: this.userDetails.img
      };
      this.updateProfile(this.teacherid, submission);
    } else {
      if (this.editProfileForm.invalid) {
        return;
      } else {
        let submission = {
          // school_id: this.schoolid,
          email: this.editProfileForm.value.emailAddress,
          phone_number: this.editProfileForm.value.contact,
          profile_image: this.userDetails.img,
          first_name: this.editProfileForm.value.firstname,
          last_name: this.editProfileForm.value.lastname,
          address: this.editProfileForm.value.address,
          gender: this.editProfileForm.value.gender,
        }
        if (this.schoolid) submission["school_id"] = this.schoolid;

        this.updateProfile(this.teacherid, submission);
      }
    }
  }
  updateProfile(id, submission): void {
    this.teacherService.updateTeacherProfile(id, submission).subscribe(
      (data) => {
        if (data) {
          this.toast.showToast('Profile updated successfully', '', 'success');
          if (this.editModal)
            this.closeEditModal();
          this.getUserProfile(this.teacherid);
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  getUserProfile(id: any): void {
    this.teacherService.getTeacherProfile(id).subscribe(
      (response) => {
        if (response && response.data) {
          let userData = response.data;
          this.schoolid = userData.teacher.school ? userData.teacher.school.id : "";
          let obj = {
            firstname: userData.teacher.first_name,
            lastname: userData.teacher.last_name,
            address: userData.teacher.school ? userData.teacher.school.school_address : " ",
            img: userData.profile_image || this.profilePic,
            school: userData.teacher.school ? userData.teacher.school.name : "",
            gender: userData.teacher.gender ? userData.teacher.gender : "",
            phone: userData.phone_number,
            email: userData.email
          }
          this.userDetails = obj;
          console.log(this.userDetails);
          this.teacherService.setProfileObs(this.userDetails);
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
}
