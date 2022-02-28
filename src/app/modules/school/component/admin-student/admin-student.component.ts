import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
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
import { SchoolService } from '@modules/school/services/school.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
@Component({
  selector: 'app-admin-student',
  templateUrl: './admin-student.component.html',
  styleUrls: ['./admin-student.component.scss']
})
export class AdminStudentComponent implements OnInit {
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
  ViewTitle = "List View";
  allergenList;

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
  classesListtitle = "All Students";
  filterList = [
    {
      menu: 'All Students'
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
  
  studentList = [];
  userHeaders = [
    {
      title: "First Name",
      data: "userFirstName"
    },
    {
      title: "last Name",
      data: "userLastName"
    },
    {
      title: "Id",
      data: "userId"
    },
    {
      title: "Grade",
      data: "grade"
    },
    {
      title: "Gender",
      data: "gender"
    },
    {
      title: "DATE OF BIRTH",
      data: "dateOfBirth"
    },
    {
      title: "Email Id",
      data: "email"
    },
    {
      title: "Role",
      data: "role"
    },
    {
      title: "Allergies",
      data: "allergie"
    },
    
  ];
  GradeTitle = 'Select the grade';
  SortByGradeList = [
    {
      id: '1',
      menu: 'Sort by Grade:None'
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
  closeModal;
  term: string;
  isLoadUser = false;
  closeResult = '';
  createClassForm: FormGroup;
  sortByGrade;
  status;
  constructor(private router: Router,private utilityService:UtilityService, private toast: ToasterService,
    private schoolService: SchoolService) { }

  ngOnInit(): void {
    this.getStudentList();
  }

  /**
* API call to get all classes.
*/
  getStudentList(): void {
    this.schoolService.getAllStudents(this.status,this.sortByGrade).subscribe(
      (response) => {
        if (response && response.data && response.data.rows) {
          this.studentList = _.map(response.data.rows, item => {
            let allergy = [];

            _.map(item.allergens, allergen => {
              if (!_.isEmpty(allergen.allergen.allergenTitle)) {
                allergy.push(allergen.allergen.allergenTitle);
              }
            });
            if (allergy && allergy.length > 0) {
              this.allergenList = allergy.toString();
              this.allergenList = this.allergenList.replace(/,/g, ", ");
            }
            let obj = {
              userName: item.userName,
              userFirstName: item.firstName,
              userLastName: item.lastName,
              userId: item.id,
              email: item.contactPersonEmail,
              contactNumber: item.phone_number,
              status: item.status === true ? 'Active' : 'Inactive',
              grade: item.grade && item.grade.grade,
              gender:item.gender,
              dateOfBirth: this.utilityService.formatDate(item.dob, true),
              allergie:this.allergenList,
              role:"Student"
            }
            return obj;
          });
          this.studentList.forEach(element => {
            element.userPhoto = "./assets/images/student-icon.svg"
            // element.dots = "..."

            // element.dots = [
            //   'Info',
            //   'Students',
            //   'Reports'
            // ].join(',');
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
  /**
   * On grade dropdown value change
   */
  classChange(event) {
    this.GradeTitle = event.menu;
    this.createClassForm.get('grade').setValue(event);
  }

  studentFilter(item: any): void {
    this.classesListtitle = item.menu;
    this.status = item.id;
    this.getStudentList();
  }

  addStudent(item?: any): void {
    let studId = item && item.userId;
    if (studId) {
      this.router.navigate(['/school/add-student'], { queryParams: { id: studId } });
    } else {
      this.router.navigate(['/school/add-student']);
    }
  }
  onImportStudent(): void {
    this.router.navigate(['/school/import-user'], { queryParams: { type: 'Students' } });
  }

  gradeFilter(event) {
    this.SortByGradeTitle = event.menu;
    this.sortByGrade = event.value;
    this.getStudentList();
  }
}
