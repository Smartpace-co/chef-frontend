import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { CustomRegex } from '@appcore/validators/custom-regex';
import {
  faAngleLeft
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '@modules/auth/services/auth.service';
import { DistrictService } from '@modules/district/services/district.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  LeftArrow = faAngleLeft;
  addUserForm: FormGroup;
  userID: string;

  isEdit = false;
  roleTitle = "Select role"
  roleList = [];
  currentUser: any;
  currentLoggedUser: any;

  constructor(private router: Router,
    private toast: ToasterService,
    private authService: AuthService,
    private districtService: DistrictService,
    private activatedRoute: ActivatedRoute) {
    this.userID = this.activatedRoute.snapshot.queryParams && this.activatedRoute.snapshot.queryParams.id;
    this.isEdit = this.userID ? true : false;
  }
  ngOnInit(): void {
    if (this.isEdit) {
      this.getUserById();
    }
    this.getAllRoles();
    this.addUserForm = new FormGroup({
      role: new FormControl("", [Validators.required]),
      lastName: new FormControl("", [Validators.required, Validators.pattern(CustomRegex.namePatteren)]),
      firstName: new FormControl("", [Validators.required, Validators.pattern(CustomRegex.namePatteren)]),
      emailAddress: new FormControl("", [Validators.required, Validators.pattern(CustomRegex.emailPattern), this.validateEmail.bind(this)]),
      contactNumber: new FormControl("", [Validators.required, Validators.pattern(CustomRegex.phoneNumberPattern), Validators.minLength(10), this.validPhoneNumber.bind(this)]),
      status: new FormControl('active', [Validators.required]),
    });
  }
  get formControl() {
    return this.addUserForm.controls;
  }

  getUserById(): void {
    this.districtService.getUserById(this.userID).subscribe(
      (response) => {
        if (response && response.data) {
          this.currentUser = response.data;
          this.addUserForm.get('role').setValue(this.currentUser.role.title);
          this.roleTitle = this.currentUser.role.title;
          this.addUserForm.get('firstName').setValue(this.currentUser.details.first_name);
          this.addUserForm.get('lastName').setValue(this.currentUser.details.last_name);
          this.addUserForm.get('emailAddress').setValue(this.currentUser.email);
          this.addUserForm.get('contactNumber').setValue(this.currentUser.phone_number);
          this.addUserForm.get('status').setValue(this.currentUser.status === true ? 'active' : 'inactive');
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  getAllRoles(): void {
    this.authService.getAllRoleDetails(1).subscribe(
      (response) => {
        if (response && response.data.rows) {
          this.roleList = _.map(response.data.rows, item => {
            const obj = {
              id: item.id,
              menu: item.title
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


  /**
   * To check valid email
   *  
   */
  validateEmail(control: AbstractControl): any {
    if (control && control.value) {
      let isValid = control.value.match(CustomRegex.emailPattern);
      let emailID = control.value;
      if (isValid && isValid.input) {
        if (this.isEdit && this.currentUser && this.currentUser.email === control.value) {
          emailID = undefined;
        }
        if (emailID) {
          this.districtService.emailValidator(control.value).subscribe(
            (data) => {
            },
            (error) => {
              console.log(error);
              this.addUserForm.controls['emailAddress'].setErrors({ 'emailValidate': true });
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
      if (control.value.length === 11 || control.value.length > 13) {
        return { 'digitValidate': true }
      }
      if (isValid && isValid.input) {
        if (this.isEdit && this.currentUser && this.currentUser.phone_number === control.value) {
          contactNo = undefined;
        }
        if (contactNo) {
          this.districtService.contactValidator(control.value).subscribe(
            (data) => {
            },
            (error) => {
              console.log(error);
              this.addUserForm.controls['contactNumber'].setErrors({ 'contactValidate': true });
            }
          );
        }
      }
    }
  }

  /**
   * On user dropdown value change
   */
  changeRole(event) {
    this.roleTitle = event.menu;
    this.addUserForm.get('role').setValue(event);
  }

  onCancel(): void {
    this.router.navigate(['/district/admin-user']);
  }

  onSave(): void {
    this.currentLoggedUser=JSON.parse(localStorage.getItem('districtDetails'))
    const submission = {
      role_id: this.addUserForm.value.role.id,
      last_name: this.addUserForm.value.lastName,
      first_name: this.addUserForm.value.firstName,
      email: this.addUserForm.value.emailAddress,
      phone_number: this.addUserForm.value.contactNumber,
      parent_id:this.currentLoggedUser.user_id,
     status: this.addUserForm.value.status === 'active' ? true : false
    }
    if (this.addUserForm.invalid) {
      this.toast.showToast('Please enter information for required fields', '', 'error');
      // return;
    } else {
      if (this.isEdit) {
        this.districtService.editUserDetails(this.userID, submission).subscribe(
          (data) => {
            if (data) {
              this.toast.showToast(`${this.addUserForm.value.firstName}: updated successfully.`, '', 'success');
              this.onCancel();
            }
          },
          (error) => {
            console.log(error);
            this.toast.showToast(error.error.message, '', 'error');
          }
        );
      } else {
        this.districtService.addUserDetails(submission).subscribe(
          (data) => {
            if (data) {
              this.toast.showToast(`${this.addUserForm.value.firstName} : added successfully and We sent an email with a verification link to ${this.addUserForm.value.emailAddress}`, '', 'success');
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
