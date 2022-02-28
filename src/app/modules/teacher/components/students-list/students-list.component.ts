import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { environment } from '@environments/environment';
import { ToasterService } from '@appcore/services/toaster.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
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
  faCalendar,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import { StudentsService } from '@modules/teacher/services/students.service';
import { UtilityService } from '@appcore/services/utility.service';
import { SortByPipe } from '@shared/pipes/sort-by.pipe';
import { TeacherService } from '@modules/teacher/services/teacher.service';
@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent implements OnInit {
  gridview = false;
  PlusIcon = faPlus;
  rightArrow = faChevronRight;
  NextArrow = faAngleDoubleRight;
  exclamationTriangle = faExclamationTriangle;
  SortByIcon = '';
  listview = false;
  TileView = faList;
  GridView = faTh;
  SearchIcon = faSearch;
  Calendar = faCalendarAlt;
  StudentList: any;
  studentHeaders: any;
  profileInfo: any;
  active = 1;
  closeModal;
  localData = JSON.parse(window.sessionStorage.getItem('currentUser'));
  StudentMenuTitle = 'All Students';

  studentID = [];
  StudentMenuList = [
    {
      id: '1',
      menu: 'Green Group Students',
      link: '',
      icon: ''
    },
    {
      id: '2',
      menu: 'Red Group Students',
      link: '',
      icon: ''
    },
    {
      id: '3',
      menu: 'Yellow Group Students',
      link: '',
      icon: ''
    }
  ];

  ViewTitle = 'Tile View';
  ViewIcon = faThLarge;
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

  SortByTitle = 'Sort by';
  colorTitle = 'Select Color';
  SortByList = [
    {
      id: '1',
      menu: 'Sort by Student ID',
      link: '',
      icon: ''
    },
    {
      id: '2',
      menu: 'Sort by Student Name',
      link: '',
      icon: ''
    }
  ];
  term: string;
  closeResult = '';
  colorList:any;
  studIndex: any;
  createClass: FormGroup;
  selectedClassId:number;
  colorvalue:any;
  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToasterService,
    private modalService: NgbModal,
    private studentsService: StudentsService,
    private utilityService: UtilityService,
    private sortBy: SortByPipe,
    private teacherService : TeacherService
  ) { }
  searchStudent: FormGroup;
  groupForm: FormGroup;
  
  
  ngOnInit(): void {
    this.searchStudent = new FormGroup({
      search: new FormControl('', [Validators.required])
    });

    this.createClass = new FormGroup({
      groupColorId: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      studentIds : new FormArray([],[]),
      status: new FormControl(true, [Validators.required])
    });
    this.gridview = true;
    this.selectedClassId = this.teacherService.getSelectedClassId();
    this.getStudentData();
    
  }

  /**
   * Navigate to Create new student form
   *  */
  AddStudent() {
    this.router.navigate(['/teacher/add-student']);
  }

  getStudentData() {
    this.teacherService.getStudentData(this.selectedClassId).subscribe((data: any) => 
    {

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
          "data": ""
        },
        {
          "title": "Actions",
          "data": "actions",
          "isClickable": true
        }
      ];

      // console.log(this.StudentList.length);

    },
    (error) => {
      console.log(error);
      this.toast.showToast(error.error.message, '', 'error');
    });
  }

  filterStudentData(searchParam) {
    if(isNaN(searchParam) && searchParam.length < 3) return;
    this.studentsService.filterStudentData(searchParam).subscribe((data: any) => {
      if(data.data.count == 0) {
        // this.toast.showToast('No data found', '', 'error');
      } else {
        this.StudentList = data.data.rows;
      }
      

    },
    (error) => {
      console.log(error);
      this.toast.showToast(error.error.message, '', 'error');
    });
  }


  getColorList(){
    this.teacherService.getColorList().subscribe((response)=>{
      // this.colorList = response.data;
      if (response && response.data && response.data) {
        this.colorList = _.map(response.data, item => {
          let obj = {
            id: item.id,
            menu: item.colorName,
            colorCode :item.hexCode
          }
          return obj;
        });
      }
    },
    (error) => {
      console.log(error);
      this.toast.showToast(error.error.message, '', 'error');
    });

  }

  getStudentList(id){
    this.teacherService.getClassGroup(id).subscribe((response)=>{
     this.StudentList = response.data.class_students;
     for(let i=0;i<this.StudentList.length;i++){
       this.StudentList[i]["checked"] = false;
     }
    },
    (error) => {
      console.log(error);
      this.toast.showToast(error.error.message, '', 'error');
    });

  }
  onColorChange(event) {
    this.createClass.get('groupColorId').setValue(event.id);
    this.colorvalue = event.colorCode;
  }
  addGroup() {
    if (this.createClass.invalid) {
      this.toast.showToast('Please enter information for required fields', '', 'error');
      return;
    } else {
      let obj = {};
      obj["classId"] = this.selectedClassId;
      obj["groupColorId"] = this.createClass.value.groupColorId;
      obj["title"] = this.createClass.value.title;
      obj["studentIds"] = this.studentID;
      obj["status"] = this.createClass.value.status;
      this.teacherService.postNewGroup(obj).subscribe(
        (data) => {
          this.toast.showToast('New Group Created Successfully', '', 'success');
          this.closeOpenModal();
        },
        (error) => {
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
    }
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

  datachange(data) {
    this.StudentList = data;
  }

  onStudentChange(i,event){
    if(event.currentTarget.checked){
      this.studentID.push(this.StudentList[i]["id"]);
    }else{
      let idx = this.studentID.findIndex(ele => ele == this.StudentList[i]["id"]);
      if(idx >= 0){
        this.studentID.splice(idx,1);
      }
    }
    //  console.log("studentid",this.studentID)
  }
  /**
   *
   * @param content get Student info respective of student id
   */
  getStudentInfo(student) {
    this.StudentList.forEach((element, index) => {

      if (element.studentId == student.studentId) {
        if (!Array.isArray(element.studentName)) {
          element.studentName = element.firstName + ' ' + element.lastName;
        }
        this.profileInfo = element;

        this.studIndex = index;
      }
    });
    // console.log(this.profileInfo)
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

  onUploadStudent() {
    this.router.navigate(['/teacher/import-student/']);
  }

  /**
   * Edit student information
   */
  editStudentInfo(studentData) {
    this.router.navigate(['/teacher/edit-student/', studentData.studentId]);
    this.modalService.dismissAll();
  }

  openAddGroup(content) {
    this.getColorList();
    this.getStudentList(this.selectedClassId);
    
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });

  }
  /**
   * Open a modal for respective action of class @param content
   */
  open(content, student) {
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

  /**
   * Close student info modal
   */
  closeOpenModal() {
    this.closeModal.close();
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
}
