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
  selector: 'app-add-roles',
  templateUrl: './add-roles.component.html',
  styleUrls: ['./add-roles.component.scss']
})
export class AddRolesComponent implements OnInit {
  LeftArrow = faAngleLeft;
  addRolesForm: FormGroup;
  accessList = [];
  roleID: string;
  isEdit = false;
  formDataToUpdate: any;
  rolesAccessList: any = []
  currentRole: any;
  constructor(private districtService: DistrictService,
    private activatedRoute: ActivatedRoute,
    private toast: ToasterService, private router: Router) {
    this.roleID = this.activatedRoute.snapshot.queryParams && this.activatedRoute.snapshot.queryParams.id;
    this.isEdit = this.roleID ? true : false;
  }
  ngOnInit(): void {
    this.getAccessModules()
    if (this.isEdit) {
      this.getRole();
    }
    this.addRolesForm = new FormGroup({
      roleName: new FormControl("", [Validators.required, this.roleNameValidator.bind(this)]),
      status: new FormControl('active', [Validators.required]),
    });
  }
  get formControl() {
    return this.addRolesForm.controls;
  }
  getRole(): void {
    this.districtService.getRoleById(parseInt(this.roleID)).subscribe(
      (response) => {
        if (response && response.data) {
          this.currentRole = response.data;
          let obj = response.data;
          this.addRolesForm.get('roleName').setValue(obj.title);
          this.addRolesForm.get('status').setValue(obj.status === true ? 'active' : 'inactive');
          let temp = _.map(this.rolesAccessList, item => {
            _.forEach(obj.access_modules, i => {
              if (i.id === item.id) {
                item.check = true;
                this.accessList.push(i.id);
              }
            })
            return item;
          });
          this.rolesAccessList = temp;
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
  roleNameValidator(control: AbstractControl): any {
    if (control && control.value) {
      let isValid = control.value.match(CustomRegex.schoolNamePattern);
      let contactNo = control.value;
      if (isValid && isValid.input) {
        if (this.isEdit && this.currentRole && this.currentRole.title === control.value) {
          contactNo = undefined;
        }
        if (contactNo) {
          this.districtService.roleNameValidator(control.value).subscribe(
            (data) => {
            },
            (error) => {
              console.log(error);
              this.addRolesForm.controls['roleName'].setErrors({ 'roleNameValidate': true });
            }
          );
        }
      }
    }
  }

  /**
   * To get access
   */
   onAccessClick(ev: any, item: any): void {
    if (item && ev.target.checked === true) {
      if (this.accessList.indexOf(item) === -1) {  
        this.accessList.push(item.id);        
      }
    } else {
      this.accessList = this.accessList.filter(function (obj) {
        return obj !== item.id;
      }); 
    }
  }

  /**
   * To add role details.
   */
  onSave(): void {
    const submission = {
      title: this.addRolesForm.value.roleName,
      module_ids: this.accessList,
      status: this.addRolesForm.value.status === 'active' ? true : false
    }
    if (this.addRolesForm.invalid) {
      this.toast.showToast('Please enter information for required fields', '', 'error');
      // return;
    } else {
      if (this.isEdit) {
        this.districtService.editRole(parseInt(this.roleID), submission,).subscribe(
          (data) => {
            if (data) {
              this.toast.showToast(`${this.addRolesForm.value.roleName}: updated successfully.`, '', 'success');
              this.onCancel();
            }
          },
          (error) => {
            console.log(error);
            this.toast.showToast(error.error.message, '', 'error');
          }
        );
      } else {
        this.districtService.addRole(submission).subscribe(
          (data) => {
            if (data) {
              this.toast.showToast(`${this.addRolesForm.value.roleName} : added successfully.`, '', 'success');
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

  onCancel(): void {
    this.router.navigate(['/district/admin-users-role']);
    this.resetForm();
  }

  resetForm() {
    this.accessList = [];
    this.addRolesForm.reset();
    this.addRolesForm.controls.status.setValue('active');
  }

  getAccessModules(){
    this.districtService.getAllAccessModules().subscribe(res=>{
      if(res.data){
        this.rolesAccessList=res.data
      }

    })
  }


}
