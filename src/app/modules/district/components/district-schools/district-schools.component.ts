import { Component, OnInit } from '@angular/core';
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
  faEllipsisV
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '@modules/auth/services/auth.service';
import { DistrictService } from '@modules/district/services/district.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-district-schools',
  templateUrl: './district-schools.component.html',
  styleUrls: ['./district-schools.component.scss']
})
export class DistrictSchoolsComponent implements OnInit {
  gridview = true;
  listview = false;
  ViewIcon = faThLarge;
  PlusIcon = faPlus;
  rightArrow = faChevronRight;
  NextArrow = faAngleDoubleRight;
  exclamationTriangle = faExclamationTriangle;
  TileView = faList;
  GridView = faTh;
  SearchIcon = faSearch;
  faDots = faEllipsisV;
  ViewTitle = "Tile View";
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
  schoolListtitle = "All Schools";
  filterList = [
    {
      menu: 'All Schools'
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
  SortByGradeTitle = "Sort by Grade";
  SortByGradeList = [
    {
      id: '1',
      menu: 'Sort by Grade A',
      link: '',
      icon: ''
    },
    {
      id: '2',
      menu: 'Sort by Grade B',
      link: '',
      icon: ''
    }
  ];
  schoolList = [];
  term: string;
  isLoadUser = false;
  schoolHeadersList = [
    {
      "title": "Scool Name",
      "data": "name"
    },
    {
      "title": "Principal Name",
      "data": "principalname"
    },
    {
      "title": "Classes",
      "data": "clssess"
    },
    {
      "title": "Students",
      "data": "students",
      //  "isClickable": true
    }
  ]
  constructor(private districtService: DistrictService,
    private router: Router,
    private toast: ToasterService) { }

  ngOnInit(): void {
    this.getSchools();
  }

  editSchool(item: any, action?: any): void {
    this.router.navigate(['district/school-details'], { queryParams: { id: item.id, action } });
  }
  getSchools(filter?: any): void {
    this.districtService.getSchools(filter).subscribe(
      (response) => {
        if (response && response.data && response.data.rows) {
          this.schoolList = _.map(response.data.rows, item => {
            let obj = {
              id: item.id,
              name: item.school.name,
              principalname: item.school.contact_person_name,
              clssess:item.school.classes,
              students:item.school.students
            }
            return obj;
          });
          this.schoolList.forEach(element => {          
              element.profilePic = element.profile_image ? element.profile_image :"./assets/images/student-icon.svg"
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

  schoolFilter(item: any): void {
    this.schoolListtitle = item.menu;
    if (item && item.id) {
      this.getSchools(item.id);
    } else {
      this.getSchools();
    }
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
}
