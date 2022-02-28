import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faAngleDoubleRight, faCalendarAlt, faChevronRight, faExclamationTriangle, faCog, faList, faPencilAlt, faPlus, faSearch, faTh, faThLarge, faTimes, faTrashAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { environment } from '@environments/environment';
import { ToasterService } from '@appcore/services/toaster.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { StudentsService } from '@modules/teacher/services/students.service';
import { UtilityService } from '@appcore/services/utility.service';
import { SortByPipe } from '@shared/pipes/sort-by.pipe';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import { ClassesService } from '@modules/teacher/services/classes.service';
import { TranslationService } from '@appcore/services/translation.service';

import * as _ from 'lodash';
import { element } from 'protractor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-roster-group-tabs',
  templateUrl: './roster-group-tabs.component.html',
  styleUrls: ['./roster-group-tabs.component.scss']
})
export class RosterGroupTabsComponent implements OnInit {
  @ViewChild('proceedMembershipClassModal') proceedMembershipClassModal: ElementRef;
  PlusIcon = faPlus;
  times = faTimes;
  rightArrow = faChevronRight;
  downArrow = faChevronDown;
  exclamationTriangle = faExclamationTriangle;
  Cog = faCog;
  listview = false;
  closeModal1;
  TileView = faList;
  GridView = faTh;
  SearchIcon = faSearch;
  Calendar = faCalendarAlt;
  NextArrow = faAngleDoubleRight;
  trash = faTrashAlt;
  pencil = faPencilAlt;
  item;
  StudentList: any = [];
  studList: any;
  studentHeaders: any;
  profileInfo: any;
  active = 1;
  SortByIcon = '';
  selectedClassId: number;
  closeModal;
  editGroupModal;
  studentBtn = false;
  manageBtn = true;
  dropdownOptions = [];
  config = {
    // displayFn:(item: any) => { return item.menu; },
    search: true, //true/false for the search functionlity defaults to false,
    displayKey: "menu",
    height: '380px',
    searchPlaceholder: 'Search colour name', // label thats displayed in search input,
    searchOnKey: 'menu', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
  }
  localData = JSON.parse(window.sessionStorage.getItem('currentUser'));
  // manageGroupTitle = "Manage Groups";
  // manageGroupList = [
  //   {
  //     id: 1,
  //     icon: faPlus,
  //     menu: "Create a Group",
  //   },
  // ];
  StudentMenuTitle = 'All Students';

  StudentMenuList = [];
  ViewTitle = 'Tile View';
  ViewIcon = faThLarge;
  ViewList = [];

  SortByTitle = 'Sort by';
  SortByList = [];

  term: string;
  closeResult = '';
  studIndex: any;
  gridview: boolean;
  createClass: FormGroup;
  colorList: any;
  colorvalue: any;
  groupColorId: number;
  studentID = [];
  rosterGroup = [];
  currentUser: any;
  groupStudentList = [];
  groupId: number;
  date: Date = new Date();
  classLabel = 'create';
  groupItem: any;
  showCriteria = true;
  items = [];
  allergens: any;
  medicalCondition: any;
  journalInfo = [];
  filterStudentList = [];
  studentModalSubscription: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToasterService,
    private modalService: NgbModal,
    private classService: ClassesService,
    private studentsService: StudentsService,
    private teacherService: TeacherService,
    private utilityService: UtilityService,
    private sortBy: SortByPipe,
    private translate: TranslationService
  ) {
  }
  searchStudent: FormGroup;

  ngOnInit(): void {
    this.searchStudent = new FormGroup({
      search: new FormControl('', [Validators.required])
    });

    this.createClass = new FormGroup({
      groupColorId: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      studentIds: new FormArray([], []),
      status: new FormControl(true, [Validators.required])
    });
    this.gridview = true;
    this.selectedClassId = this.teacherService.getSelectedClassId();
    // console.log("selected classid",this.selectedClassId);

    this.getStudentData();
    this.getRoasterGroup();
    this.getGroupMenuList();

    this.currentUser = JSON.parse(window.sessionStorage.getItem("currentUser"))
    if (this.currentUser.parentId) this.getParentRoleId(this.currentUser.parentId);

    this.ViewTitle = this.translate.getStringFromKey('table-search-filter-container.view.tile-view');
    this.ViewList = [
      {
        id: '1',
        menu: this.translate.getStringFromKey('table-search-filter-container.view.tile-view'),
        link: '',
        icon: faThLarge
      },
      {
        id: '2',
        menu: this.translate.getStringFromKey('table-search-filter-container.view.list-view'),
        link: '',
        icon: faList
      }
    ];

    this.SortByTitle = this.translate.getStringFromKey('table-search-filter-container.sort-by-list.sort-by');
    this.SortByList = [
      {
        id: '1',
        menu: this.translate.getStringFromKey('table-search-filter-container.sort-by-list.sort-by-student-id'),
        link: '',
        icon: ''
      },
      {
        id: '2',
        menu: this.translate.getStringFromKey('table-search-filter-container.sort-by-list.sort-by-student-name'),
        link: '',
        icon: ''
      }
    ];

    this.StudentMenuTitle = this.translate.getStringFromKey('teacher.roster.student-menu-title');
  }

  getParentRoleId(parentId) {
    this.teacherService.getParentRoleId(parentId).subscribe((res: any) => {
      if (res.status == 200) {
        this.currentUser.id = this.currentUser.parentId;
        this.currentUser.role.id = res.data.roleId;
      }
    },
      (error) => {
        this.closeModal1 = this.modalService.open(this.proceedMembershipClassModal, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'proceed-membership-class-modal' });
      });
  }

  /**
   * Navigate to Create new student form
   *  */
  AddStudent() {
    if (this.currentUser.parentId) {
      this.router.navigate(['/teacher/add-student']);
    }
    else {
      this.studentsService.verifyMaxStudent(this.currentUser.id, this.currentUser.role.id).subscribe(res => {
        if (res.status == 200) {
          this.router.navigate(['/teacher/add-student']);
        }
      },
        (error) => {

          this.closeModal1 = this.modalService.open(this.proceedMembershipClassModal, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'proceed-membership-class-modal' });
        });
    }
  }

  getStudentData() {
    this.teacherService.getStudentData(this.selectedClassId).subscribe((data: any) => {
      this.StudentList = data.data.class_students;
      this.studentHeaders = [
        {
          "title": "Student Id",
          "data": "id"
        },
        {
          "title": "Student Name",
          "data": "firstName"
        },
        {
          "title": "Student Group",
          "data": "groupName"
        },
        // {
        //   "title": "Actions",
        //   "data": "actions",
        //   "isClickable": true
        // }
      ];

      this.StudentList.forEach((element) => {
        if (element.groupStudents !== null) {
          element.colorName = element.groupStudents.classGroup.groupColor.colorName;
          element.hexCode = element.groupStudents.classGroup.groupColor.hexCode;
          element.classGroupId = element.groupStudents.classGroupId;
          element.groupName = element.groupStudents.classGroup.title;
        } else {
          element.colorName = '';
          element.hexCode = '';
          element.classGroupId = 0;
          element.groupName = '';
        }
      })

      this.filterStudentList = [];
      this.filterStudentList = _.cloneDeep(this.StudentList);
    },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      });
  }

  getRoasterGroup() {
    this.teacherService.getAllGroupList(this.selectedClassId).subscribe((data: any) => {
      this.rosterGroup = data.data.rows;

      this.rosterGroup.forEach((element) => {
        if (element.studentList.length === 0) {
          element.students = "";
        } else {
          element.students = element.studentList.map(x => x.firstName).join(",");
        }
      });
    },
      (error) => {
        // console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      });
  }

  getGroupMenuList() {
    this.teacherService.getAllGroupMenus(this.selectedClassId).subscribe((data: any) => {
      this.StudentMenuList = data.data;
      var obj = {};
      obj["id"] = 0;
      obj["menu"] = "All Group Student";
      this.StudentMenuList.forEach((element) => {
        element.menu = element.groupColor.colorName + " " + this.translate.getStringFromKey('teacher.roster.group-students');
      })
      this.StudentMenuList.push(obj);
    },
      (error) => {
        // console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      });
  }


  filterStudentData(searchParam) {
    if (isNaN(searchParam) && searchParam.length < 3) return;
    this.studentsService.filterStudentData(searchParam).subscribe((data: any) => {
      // console.log(data);
      if (data.data.count == 0) {
        // this.toast.showToast('No data found', '', 'error');
      } else {
        this.StudentList = data.data.rows;
      }
    },
      (error) => {
        // console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      });
  }
  /**
   * change view of student data
   */

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

  sortData(event) {
    if (event.menu === 'Sort by Student ID') {
      this.StudentList = this.sortBy.transform(this.StudentList, 'asc', 'id');
    } else if (event.menu === 'Sort by Student Name') {
      this.StudentList = this.sortBy.transform(this.StudentList, 'asc', 'firstName');
    }
  }


  sortGroupData(event) {
    if (event.id === 0) {
      this.StudentList = this.filterStudentList;
    } else {
      this.StudentList = this.filterStudentList.filter((ele) => ele.classGroupId === event.id);
    }
  }

  datachange(data) {
    this.StudentList = data;
  }

  onStudentChange(i, event) {
    if (event.currentTarget.checked) {
      this.studentID.push(this.StudentList[i]["id"]);
    } else {
      let idx = this.studentID.findIndex(ele => ele == this.StudentList[i]["id"]);
      if (idx >= 0) {
        this.studentID.splice(idx, 1);
      }
    }
    //  console.log("studentid",this.studentID)
  }
  /**
   *
   * @param content get Student info respective of student id
   */
  getStudentInfo(student) {
    this.teacherService.getStudentDetails(student.id).subscribe((data: any) => {
      // console.log("student data", data);
      this.profileInfo = data.data
      this.allergens = this.profileInfo.allergens.map(x => x.allergenTitle).join(",");
      this.medicalCondition = this.profileInfo.medicalConditions.map(x => x.title).join(",");
      this.getJournalInfo(student.id);
      // console.log("student Info", this.profileInfo);
    },
      (error) => {
        // console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      });
    // this.StudentList.forEach((element, index) => {
    //   if (element.studentId == student.studentId) {
    //     if (!Array.isArray(element.studentName)) {
    //       element.studentName = element.studentName.split(',');
    //     }
    //     this.profileInfo = element;
    //     this.studIndex = index;
    //   }
    // });

  }

  getJournalInfo(id) {
    this.teacherService.getStudentJournalDetails(id).subscribe((data: any) => {
      this.journalInfo = data.data;
    },
      (error) => {
        this.toast.showToast(error.error.message, '', 'error');
      });
  }
  /**
   * get next student information
   */

  getNextStudentInfo() {
    let data = this.StudentList[this.studIndex + 1];
    if (!Array.isArray(data.studentName)) {
      data.studentName = data.studentName.split(',');
    }
    this.profileInfo = data;
    this.studIndex++;
  }

  getColorList() {
    this.teacherService.getColorList().subscribe((response) => {
      if (response && response.data && response.data) {
        this.colorList = _.map(response.data, item => {
          let obj = {
            id: item.id,
            menu: item.colorName,
            colorCode: item.hexCode
          }
          return obj;
        });

        this.dropdownOptions = this.colorList;

        let colorData = this.colorList.filter(obj => obj.colorCode == '#EE204D')[0];

        this.createClass.get('groupColorId').setValue(colorData.id);
        this.groupColorId = colorData.id;
        this.colorvalue = colorData.colorCode;
      }
    },
      (error) => {
        this.toast.showToast(error.error.message, '', 'error');
      });

  }

  getStudentList(id) {
    this.teacherService.getClassGroup(id).subscribe((response) => {
      this.StudentList = response.data.class_students;
      this.StudentList.map(res => {
        this.groupItem.studentList.map(stu => {
          if (res.id === stu.id && this.classLabel === "edit") {
            res.checked = true;
          }

        })
      })
    },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      });

  }

  deleteGroup(id) {

    this.teacherService.removeClassGroup(id).subscribe((data: any) => {
      this.toast.showToast('Group Deleted Successful', '', 'success');
      this.closeOpenModal();
      this.getRoasterGroup();
      this.getGroupMenuList();
    },
      (error) => {
        this.toast.showToast(error.error.message, '', 'error');
      });
  }
  /**
   * Edit student information
   */
  editStudentInfo(studentData) {
    this.router.navigate(['/teacher/edit-student/', studentData.id]);
    this.modalService.dismissAll();
  }

  onUploadStudent() {
    this.router.navigate(['/teacher/import-student/']);
  }
  /**
   * Open a modal for respective action of class @param content
   */
  open(content, student) {

    this.profileInfo = student;
    this.getStudentInfo(student);
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });

    /*   this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      ); */
  }

  openGroupModal(content) {
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  openStudentList(content, item) {
    this.groupStudentList = item.groupStudents;
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  editGroupModel(content, item) {
    this.classLabel = "edit";
    this.groupItem = item;
    this.groupId = item.id;
    this.groupColorId = item.groupColorId;
    this.createClass.get('groupColorId').setValue(item.groupColorId);
    this.colorvalue = item.groupColor.hexCode;
    this.createClass.get('title').setValue(item.title);
    this.getColorList();
    this.getStudentList(item.classId);
    this.createClass.get('status').setValue(item.status);
    this.editGroupModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });

  }

  openDeleteModel(content, item) {
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
    this.groupId = item.id;
  }

  onColorChange(event) {
    this.createClass.get('groupColorId').setValue(event.id);
    this.colorvalue = event.colorCode;
  }

  colorAndTitleConflict(obj) {
    delete obj["studentIds"];
    delete obj["status"];
    this.teacherService.validateColorAndTitle(obj).subscribe(
      (data) => {
        if (data.status === 200) {
          obj["studentIds"] = this.studentID;
          obj["status"] = this.createClass.value.status;
          this.teacherService.postNewGroup(obj).subscribe(
            (data) => {
              this.toast.showToast('New Group Created Successfully', '', 'success');
              this.closeOpenModal();
              this.getRoasterGroup();
              this.getGroupMenuList();
              // this.ngOnInit();
            },
            (error) => {
              this.toast.showToast(error.error.message, '', 'error');
            }
          );
        }
      },
      (error) => {
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  selectionChanged(event) {
    this.createClass.get('groupColorId').setValue(event.value.menu);
    this.groupColorId = event.value.id;
    this.colorvalue = event.value.colorCode;
  }

  addGroup() {
    if (this.createClass.invalid) {
      this.toast.showToast('Please enter information for required fields', '', 'error');
      return;
    } else {
      // this.colorAndTitleConflict(obj);
      let obj = {};
      obj["classId"] = this.selectedClassId;
      obj["groupColorId"] = this.groupColorId;
      obj["title"] = this.createClass.value.title;
      obj["studentIds"] = this.studentID;
      obj["status"] = this.createClass.value.status;
      if (this.classLabel === "create") {
        this.colorAndTitleConflict(obj);
        // this.teacherService.postNewGroup(obj).subscribe(
        //   (data) => {
        //     this.toast.showToast('New Group Created Successfully', '', 'success');
        //     this.closeOpenModal();
        //     this.ngOnInit();
        //   },
        //   (error) => {
        //     this.toast.showToast(error.error.message, '', 'error');
        //   }
        // );
      } else if (this.classLabel === "edit") {
        this.teacherService.updateClassGroup(this.groupId, obj).subscribe(
          (data) => {
            this.toast.showToast('Group Updated Successfully', '', 'success');
            this.closeEditOpenModal();
            this.getRoasterGroup();
            this.getGroupMenuList();
            this.resetForm();
            this.classLabel = 'create';
          },
          (error) => {
            this.toast.showToast(error.error.message, '', 'error');
          });
      }
    }
  }

  resetForm() {
    this.classLabel = 'create';
    this.createClass.controls.groupColorId.setValue('');
    this.colorvalue = "#EE204D";
    this.createClass.controls.title.setValue('');
    // this.createClass.controls.studentIds.setValue('');
    this.createClass.controls.status.setValue(true);
  }

  openAddGroup(content) {
    this.studentID = [];
    this.resetForm();
    this.getColorList();
    this.getStudentList(this.selectedClassId);
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }
  /**
   * Close student info modal
   */
  closeOpenModal() {
    this.closeModal.close();
  }

  closeEditOpenModal() {
    this.editGroupModal.close();
  }

  studentClick() {
    this.studentBtn = true;
    this.manageBtn = false;
    this.showCriteria = true;
  }

  groupClick() {
    this.studentBtn = false;
    this.manageBtn = true;
    this.showCriteria = false;
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onProceed() {
    this.closePopup();
    this.router.navigate(['/teacher/edit-membership']);

  }
  closePopup(): void {
    this.closeModal1.close();
  }



  // rosterGroup = [
  //   {
  //     Id: '1',
  //     startdate: '04/09/2020',
  //     total: '5',
  //     groupColor: "Red",
  //   },
  //   {
  //     Id: '2',
  //     startdate: '04/02/2020',
  //     total: '10',
  //     groupColor: "Yellow",
  //   },
  //   {
  //     Id: '3',
  //     startdate: '04/02/2020',
  //     total: '5',
  //     groupColor: "Green",
  //   },
  // ];

  //   studentList = [
  //     {
  //        Id: "1",
  //        studentPhoto: "./assets/images/student.png",
  //        studentName: "Samuel, Aaron",
  //        studentId: "36273",
  //        studentGroup: "Red",
  //     },
  //     {
  //        Id: "2",
  //        studentPhoto: "./assets/images/student.png",
  //        studentName: "Ruaz, Kevin",
  //        studentId: "36272",
  //        studentGroup: "Green",
  //     },
  //     { 
  //        Id: "3",
  //        studentPhoto: "./assets/images/student.png",
  //        studentName: "Keil, Exie",
  //        studentId: "36271",
  //        studentGroup: "Yellow",
  //     },
  //     {
  //        Id: "4",
  //        studentPhoto: "./assets/images/student.png",
  //        studentName: "Samuel, Aaron",
  //        studentId: "36274",
  //        studentGroup: "Red",
  //     }
  //  ];



  // open(content) {
  //   this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true ,windowClass: 'manageGroup'});
  // }
  // closeOpenModal(){

  // }
}
