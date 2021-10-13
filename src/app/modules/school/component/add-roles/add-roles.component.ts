import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import {
  faAngleLeft
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '@modules/auth/services/auth.service';
import { SchoolService } from '@modules/school/services/school.service';
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
  currentUser:any;
  rolesAccessList: any = [
    // {
    //   id: 1,
    //   title: "Profile",
    //   check: false
    // },
    // {
    //   id: 2,
    //   title: "Billing",
    //   check: false
    // },
    // {
    //   id: 3,
    //   title: "Classes",
    //   check: false
    // },
    // {
    //   id: 4,
    //   title: "Content",
    //   check: false
    // },
    // {
    //   id: 5,
    //   title: "Users",
    //   check: false
    // },
  ]
  constructor(private schoolService: SchoolService,
    private activatedRoute: ActivatedRoute,
    private toast: ToasterService, private router: Router) {
    this.roleID = this.activatedRoute.snapshot.queryParams && this.activatedRoute.snapshot.queryParams.id;
    this.isEdit = this.roleID ? true : false;
  }
  ngOnInit(): void {
    this.getAccessModules()

    this.addRolesForm = new FormGroup({
      roleName: new FormControl("", [Validators.required,Validators.pattern('^[a-zA-Z \-\']+')]),
      status: new FormControl('active', [Validators.required]),
    });
    if(this.isEdit){
      this.getRole();
    }
  }
  get formControl() {
    return this.addRolesForm.controls;
  }
  getRole(): void {
    this.schoolService.getRoleById(parseInt(this.roleID)).subscribe(
      (response) => {
         if (response && response.data) {
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
    if (this.isEdit) {
     this.schoolService.editRole(parseInt(this.roleID),submission,).subscribe(
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
      this.schoolService.addRole(submission).subscribe(
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

  onCancel(): void {
    this.router.navigate(['/school/admin-users-role']);
    this.resetForm();
  }

  resetForm() {
    this.accessList = [];
    this.addRolesForm.reset();
    this.addRolesForm.controls.status.setValue('active');
  }


  getAccessModules(){
    this.currentUser=JSON.parse(window.sessionStorage.getItem('currentUser'))
    this.schoolService.getAllAccessModules().subscribe(res=>{
      if(res && res.data.length>0){
        if(this.currentUser.role.title=='School')
        {
          const index = res.data.findIndex(x => x.title === "Schools");
          if (index !== undefined){
            res.data.splice(index, 1);
          } 
          const index1 = res.data.findIndex(x1 => x1.title === "Schools Reports");
          if (index1 !== undefined)
          {
            res.data.splice(index1, 1);
          } 
        }

        this.rolesAccessList=res.data;
       
      }

    })
  }

}
