import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { CustomRegex } from '@appcore/validators/custom-regex';
import {
  faAngleLeft,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '@modules/auth/services/auth.service';
import { DistrictService } from '@modules/district/services/district.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.scss']
})
export class AddTeacherComponent implements OnInit {

  PlusIcon = faPlus;
  LeftArrow = faAngleLeft;
  addTeacherForm: FormGroup;
  schoolTitle = "Select School";
  genderTitle = "Select Gender";
  selectedFile: string;
  currentUser:any
  currentTeacher: any;
  genderList = [
    {
      id: "1",
      menu: "Male"
    },
    {
      id: "2",
      menu: "Female"
    },
    {
      id: "3",
      menu: "Other"
    }
  ];
  schoolList = [];
  teacherID: string;
  profileImage: string;
  isEdit = false;
  teacherRole: any;
  districtRole: any
  constructor(private router: Router,
    private toast: ToasterService, private authService: AuthService,
    private activatedRoute: ActivatedRoute, private districtService: DistrictService) {
    this.teacherID = this.activatedRoute.snapshot.queryParams && this.activatedRoute.snapshot.queryParams.id;
    this.isEdit = this.teacherID ? true : false;
  }
  ngOnInit(): void {
    if (this.isEdit) {
      this.getTeacher();
    }
    this.getAllSchools();
    this.getMasterRoles();
    this.addTeacherForm = new FormGroup({
      schoolName: new FormControl("", []),
      lastName: new FormControl("", [Validators.required]),
      firstName: new FormControl("", [Validators.required]),
      emailAddress: new FormControl("", [Validators.required, Validators.pattern(CustomRegex.emailPattern), this.validateEmail.bind(this)]),
      contactNumber: new FormControl("", [Validators.required, Validators.pattern(CustomRegex.phoneNumberPattern), Validators.minLength(10), this.validPhoneNumber.bind(this)]),
      gender: new FormControl("", []),
      status: new FormControl('active', [Validators.required]),
    });
  }
  get formControl() {
    return this.addTeacherForm.controls;
  }

  getAllSchools(): void {
    this.districtService.getSchools().subscribe(
      (response) => {
        if (response && response.data.rows) {
          this.schoolList = _.map(response.data.rows, item => {
            const obj = {
              id: item.school.id,
              menu: item.school.name
            }
            return obj;
          });
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  getTeacher(): void {
    this.districtService.getTeacherById(this.teacherID).subscribe(
      (response) => {
        if (response && response.data) {
          this.currentTeacher = response.data;
          if(this.currentTeacher.teacher && this.currentTeacher.teacher.school){
            this.addTeacherForm.get('schoolName').setValue(this.currentTeacher.teacher.school.name);
            this.schoolTitle = this.currentTeacher.teacher.school.name;
          }
          this.addTeacherForm.get('firstName').setValue(this.currentTeacher.teacher.first_name);
          this.addTeacherForm.get('lastName').setValue(this.currentTeacher.teacher.last_name);
          this.addTeacherForm.get('emailAddress').setValue(this.currentTeacher.email);
          this.addTeacherForm.get('contactNumber').setValue(this.currentTeacher.phone_number);
          this.addTeacherForm.get('status').setValue(this.currentTeacher.status === true ? 'active' : 'inactive');
          if (this.currentTeacher && this.currentTeacher.profile_image) {
            this.selectedFile = this.currentTeacher.profile_image.substring(this.currentTeacher.profile_image.lastIndexOf("-") + 1);
            this.profileImage = this.currentTeacher.profile_image;
          }
          if (this.currentTeacher.teacher && this.currentTeacher.teacher.gender) {
            this.addTeacherForm.get('gender').setValue(this.currentTeacher.teacher.gender);
            this.genderTitle = this.currentTeacher.teacher.gender.charAt(0).toUpperCase() + this.currentTeacher.teacher.gender.slice(1);
          }
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  /**
   * On school dropdown value change
   */
  changeSchool(event) {
    this.schoolTitle = event.menu;
    this.addTeacherForm.get('schoolName').setValue(event);
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
        if (this.isEdit && this.currentTeacher && this.currentTeacher.email === control.value) {
          emailID = undefined;
        }
        if (emailID) {
          this.districtService.emailValidator(control.value).subscribe(
            (data) => {
            },
            (error) => {
              console.log(error);
              this.addTeacherForm.controls['emailAddress'].setErrors({ 'emailValidate': true });
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
    if (control && control.value) {
      let isValid = control.value.match(CustomRegex.phoneNumberPattern);
      let contactNo = control.value;
      if (control.value && control.value.length === 11 || control.value.length > 13) {
        return { 'digitValidate': true }
      }
      if (isValid && isValid.input) {
        if (this.isEdit && this.currentTeacher && this.currentTeacher.phone_number === control.value) {
          contactNo = undefined;
        }
        if (contactNo) {
          this.districtService.contactValidator(contactNo).subscribe(
            (data) => {
            },
            (error) => {
              console.log(error);
              this.addTeacherForm.controls['contactNumber'].setErrors({ 'contactValidate': true });
            }
          );
        }
      }
    }
  }

  changeGender(event) {
    this.genderTitle = event.menu;
    this.addTeacherForm.get('gender').setValue(event);
  }

  /**
   * to get teacher role_id from master;
   */
  getMasterRoles(): void {
    this.authService.getAllMasterRoleDetails().subscribe(
      (response) => {
        if (response && response.data) {
          this.teacherRole = response.data.find(o => o.title.toLowerCase() === 'teacher');
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  onFileSelected(event) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0].name;
      this.districtService.uploadProfileImg(event.target.files).subscribe(
        (response) => {
          if (response && response.data[0]) {
            this.profileImage = response.data[0].mediaPath;
            if (this.profileImage) {
              this.toast.showToast('Image uploaded successfully.', '', 'success');
            }
          }
        },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/district/admin-teacher']);
  }
  isDisableSave(): any {
    if (this.addTeacherForm.invalid) {
      return true;
    } else if (this.isEdit && this.selectedFile) {
      return this.currentTeacher.profile_image || this.profileImage ? false : true;
    } else if (this.selectedFile) {
      return this.profileImage ? false : true;
    }
  }

  onSave(): void {
    if (!this.isEdit) {
      if (this.selectedFile && !this.profileImage) {
        this.toast.showToast('Please wait profile image is uploading', '', 'info');
        return;
      }
    }
    this.districtRole = JSON.parse(localStorage.getItem('districtDetails'));
    this.currentUser=JSON.parse(window.sessionStorage.getItem("currentUser"))
    const submission = {
      role_id: this.teacherRole.id,
      district_id: this.districtRole.id,
      school_id: this.addTeacherForm.value.schoolName && this.addTeacherForm.value.schoolName.id ? this.addTeacherForm.value.schoolName.id : undefined,
      first_name: this.addTeacherForm.value.firstName,
      last_name: this.addTeacherForm.value.lastName,
      email: this.addTeacherForm.value.emailAddress,
      profile_image: this.profileImage,
      phone_number: this.addTeacherForm.value.contactNumber,
      gender: this.addTeacherForm.value.gender.menu,
      parent_id:this.districtRole.user_id,
      status: this.addTeacherForm.value.status === 'active' ? true : false
    }
    if (this.addTeacherForm.invalid) {
      this.toast.showToast('Please enter information for required fields', '', 'error');
      // return;
    } else {
      if (this.isEdit) {
        this.districtService.editTeacherDetails(this.teacherID, submission).subscribe(
          (data) => {
            if (data) {
              this.toast.showToast(`${this.addTeacherForm.value.firstName}: updated successfully.`, '', 'success');
              this.onCancel();
            }
          },
          (error) => {
            console.log(error);
            this.toast.showToast(error.error.message, '', 'error');
          }
        );
      } else {
        if (this.teacherRole) {
          this.districtService.addTeacherDetails(submission).subscribe(
            (data) => {
              if (data) {
                this.toast.showToast(`${this.addTeacherForm.value.firstName} : added successfully and We sent an email with a verification link to ${this.addTeacherForm.value.emailAddress}`, '', 'success');
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
}
