import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faPlus,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '@modules/auth/services/auth.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-admin-user-roles',
  templateUrl: './admin-user-roles.component.html',
  styleUrls: ['./admin-user-roles.component.scss']
})
export class AdminUserRolesComponent implements OnInit {
  listview = true;
  PlusIcon = faPlus;
  isLoad = false;
  roleList = [];
  accessList=[];
  exclamationTriangle = faExclamationTriangle;
  userList = [
    {
      id: 1,
      role: "Administrator",
      limitedAccess: "Profile, Billing Information",
      fullAccess: "Classes, Content, Users",
      status: "Active"
    },
    {
      id: 2,
      role: "Teacher",
      limitedAccess: "-",
      fullAccess: "Classes, Content, Users",
      status: "Inactive"
    },
    {
      id: 3,
      role: "Student",
      limitedAccess: "-",
      fullAccess: "-",
      status: "Active"
    },
    {
      id: 4,
      role: "Staff",
      limitedAccess: "-",
      fullAccess: "Classes, Content, Users",
      status: "Inactive"
    },
  ];
  userHeaders = [
    {
      title: "Role",
      data: "title"
    },
    {
      title: "Access",
      data: "access"
    },
    {
      title: "Status",
      data: "status"
    }
  ];
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.getAllRole();
  }

  getAllRole(): void {
    this.authService.getAllRoleDetails().subscribe(
      (res) => {
        if (res && res.data && res.data.rows) {
          this.roleList = _.map(res.data.rows, item => {
            this.accessList=[];
            
           _.map(item.access_modules,module =>{
             
             this.accessList.push(module.title)
           });
           let obj = {
            id: item.id,
            title: item.title,
            access:  this.accessList,
            status: item.status === true ? 'Active' : 'Inactive',
          }
          return obj;
          });
        }
        this.isLoad = true;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addEditRole(data?: any): void {
    this.router.navigate(['/school/add-roles'], { queryParams: { id: data && data.id ? data.id : null } });
  }
}
