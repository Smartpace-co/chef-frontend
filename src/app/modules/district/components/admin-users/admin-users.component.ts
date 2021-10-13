import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import {
  faChevronRight,
  faPlus,
  faList,
  faTh,
  faSearch,
  faSort,
  faAngleDoubleRight,
  faExclamationTriangle,
  faThLarge,
  faEllipsisV,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { DistrictService } from '@modules/district/services/district.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  gridview = false;
  listview = true;
  ViewIcon = faList;
  PlusIcon = faPlus;
  rightArrow = faChevronRight;
  NextArrow = faAngleDoubleRight;
  exclamationTriangle = faExclamationTriangle;
  TileView = faList;
  GridView = faTh;
  SearchIcon = faSearch;
  faDots = faEllipsisV;
  faImport = faDownload;
  isLoadUser = false;
  count: number;
  activeUser = [];
  ViewTitle = "List View";
  ViewList = [
    {
      id: '1',
      menu: 'Tile View',
      link: '',
      icon: faThLarge,
    },
    {
      id: '2',
      menu: 'List View',
      link: '',
      icon: faList
    }
  ];
  classesListtitle = "All Users";
  classesList = [
    {
      menu: 'All Users'
    },
    {
      id: '1',
      menu: 'Active'
    },
    {
      id: '0',
      menu: 'Inactive'
    }
  ];
  SortByIdTitle = "Sort by User ID";
  SortByIdList = [
    {
      id: '1',
      menu: 'Sort by User ID:None'
    },
    {
      id: '1',
      menu: 'Ascending',
      value: 'asc'
    },
    {
      id: '2',
      menu: 'Descending',
      value: 'desc'
    }
  ];
  userList = [];
  userHeaders = [
    {
      title: "Id",
      data: "userId"
    },
    {
      title: "First Name",
      data: "userFirstName"
    },
    {
      title: "last Name",
      data: "userLastName"
    },
    {
      title: "Email Id",
      data: "email"
    },
    {
      title: "phone number",
      data: "contactNumber"
    },
    {
      title: "Role",
      data: "role"
    },
    {
      title: "status",
      data: "status"
    }
  ];
  closeModal;
  term: string;
  closeResult = '';
  constructor(private router: Router,
    private toast: ToasterService,
    private districtService: DistrictService
  ) { }

  ngOnInit(): void {
    this.getAllUserList();
  }
  getAllUserList(filter?: any, sortBy?: string): void {
    this.userList = [];
    this.activeUser = [];
    this.districtService.getAllUser(filter, sortBy).subscribe(
      (response) => {
        if (response && response.data) {
          this.count = response.data.count;
          this.userList = _.map(response.data.rows, item => {
            if (item && item.status === true) {
              this.activeUser.push(item);
            }
            let obj = {
              userPhoto: item.profile_image,
              userFirstName: item.details.first_name,
              userLastName: item.details.last_name,
              userId: item.details.user_id,
              email: item.email,
              contactNumber: item.phone_number,
              status: item.status === true ? 'Active' : 'Inactive',
              role: item.role.title
            }
            return obj;
          });
          this.isLoadUser = true;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  changeView(event) {
    if (event.menu === 'Tile View') {
      this.ViewTitle = 'Tile View';
      this.gridview = true;
      this.listview = false;
      this.ViewIcon = faThLarge;
    } else {
      this.ViewTitle = 'List View';
      this.gridview = false;
      this.listview = true;
      this.ViewIcon = faList;
    }
  }
  // /**
  //  * On grade dropdown value change
  //  */
  // classChange(event) {
  //   this.GradeTitle = event.menu;
  // }

  addUser(): void {
    this.router.navigate(['/district/add-user']);
  }

  editUser(item: any): void {
    this.router.navigate(['/district/add-user'], { queryParams: { id: item.userId } });
  }

  importUser(): void {
    this.router.navigate(['/district/import-user'], { queryParams: { type: 'Users' } });
  }

  userFilter(item: any): void {
    this.getAllUserList(item.id);
    this.classesListtitle = item.menu;
  }
  userIdFilter(item: any): void {
    this.SortByIdTitle = item.menu;
    if (item && item.value) {
      this.getAllUserList(undefined, item.value);
    } else {
      this.getAllUserList();
    }
  }

}
