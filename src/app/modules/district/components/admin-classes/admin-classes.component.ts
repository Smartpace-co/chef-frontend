import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { DistrictService } from '@modules/district/services/district.service';
import { ToasterService } from '@appcore/services/toaster.service';
import { CustomRegex } from '@appcore/validators/custom-regex';
@Component({
  selector: 'app-admin-classes',
  templateUrl: './admin-classes.component.html',
  styleUrls: ['./admin-classes.component.scss']
})
export class AdminClassesComponent implements OnInit {
  @ViewChild('proceedMembershipClassModal') proceedMembershipClassModal: ElementRef;
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
  hidden:any
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
  classesListtitle = "All Classes";
  filterList = [
    {
      menu: 'All Classes'
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
  isLoadUser = false;
  classList = [];
  classHeadersList = [
    {
      "title": "Class Name",
      "data": "className"
    },
    {
      "title": "Teacher Name",
      "data": "teacherName"
    },
    {
      "title": "Grade",
      "data": "grade"
    },
    {
      "title": "Students",
      "data": "students",
      //  "isClickable": true
    },
    {
      "title": "Actions",
      "data": "actions",
      "isClickable": true
    }
  ]
  gradeTitle = 'Select the grade';
  gradeList = [];
  standardList = [];
  teacherList = [];
  allStudentList = [];
  schoolTitle = 'Select School';
  schoolIcon = '';
  schoolList = [];
  closeModal;
  filter = [];
  closeResult = '';
  selectedValue = [];
  selectedStandard = null
  selectedTeacherValue = [];
  selectedTeacher = null;
  selectedStudentValue = [];
  selectedStudent = null
  term: string;
  createClassForm: FormGroup;
  accessCodeForm: FormGroup;
  activateUserData: any
  closeModal1;
  sortBy;
  classStatus;
  constructor(
    private router: Router,
    private toast: ToasterService,
    private districtService: DistrictService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.activateUserData = JSON.parse(window.sessionStorage.getItem("currentUser"))
    this.getAllClassList();
    this.getSchoolList();
    this.getAllActiveTeachers(undefined,false);
    this.getAllGradeList();
    this.getStudentList(undefined,false);
    this.getAllLearningStandards();
    this.createClassForm = new FormGroup({
      school: new FormControl(''),
      teacherName: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required, this.validateClassName.bind(this)]),
      grade: new FormControl([], [Validators.required]),
      standards: new FormControl('', [Validators.required]),
      students: new FormControl('')
    });
    this.accessCodeForm = new FormGroup({
      teacher: new FormControl('', [Validators.required])
    });
  }
  get formControl() {
    return this.createClassForm.controls;
  }

  /**
 * API call to get all classes.
 */
  getAllClassList(): void {
    this.districtService.getAllClasses(this.classStatus, this.sortBy).subscribe(
      (response) => {
        if (response && response.data && response.data.rows) {
          this.classList = _.map(response.data.rows, item => {
            let obj = {
              displayCode:`CK00000${item.id}`,
              classId: item.id,
              className: item.title,
              teacherName: item && !_.isEmpty(item.class_teachers) ? `${item.class_teachers[0].first_name} ${item.class_teachers[0].last_name}` : '',
              grade: item.grade.grade,
              students: item.class_students.length
            }
            return obj;
          });
          this.classList.forEach(element => {
              element.actions = [
                'Info',
                'Students',
                'Reports'
              ]
            element.profilePic = "./assets/images/student-icon.svg"
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

  /**
   * To check valid class Name
   *  
   */
  validateClassName(control: AbstractControl): any {
    if (control && control.value) {
      let isValid = control.value.match(CustomRegex.schoolNamePattern);
      if (isValid && isValid.input) {
        this.districtService.classNameValidator(control.value).subscribe(
          (data) => {
          },
          (error) => {
            console.log(error);
            this.createClassForm.controls['title'].setErrors({ 'classNameValidate': true });
          }
        );
      }
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
  open(content) {
    if (this.activateUserData) {
      this.districtService.verifyMaxUserCountClass(this.activateUserData.id, this.activateUserData.role.id).subscribe((res) => {
        if(res.status==200)
        {
            this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true,windowClass: 'create-class-modal' }).result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
              if(result === 'Save'){
                this.onSave();
              }else{
                this.resetForm();
              }
            }, (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
              this.resetForm();
            });
        }
      },
      (error) => {
        this.closeModal1 = this.modalService.open(this.proceedMembershipClassModal, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'proceed-membership-class-modal' });
      });
    }
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
  openAccessModal(content)
  {
      this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'access-code-modal' });
  }

  resetForm() {
    this.gradeTitle = 'Select the grade';
    this.schoolTitle = 'Select school';
    this.createClassForm.reset();
    this.selectedTeacher = null;
    this.selectedStandard = null;
    this.selectedStudent = null;
    this.selectedStudentValue = [];
    this.selectedValue = [];
    this.selectedTeacherValue = [];
    this.getStudentList(undefined,false);
    this.getAllActiveTeachers(undefined,false);
  }
  editClass(item: any, action?: any): void {
    this.router.navigate(['/district/class-details'], { queryParams: { id: item.classId, action : action || item.action } });
  }

  onSave(): void {
    this.activateUserData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    if (this.createClassForm.invalid) {
      // return;
      this.toast.showToast('Please enter information for required fields', '', 'error');
    } else {
      let teacher = [];
      let stdList = [];
      let students = [];
      _.forEach(this.selectedTeacherValue, item => {
        teacher.push(item.item_id);
      });
      _.forEach(this.selectedValue, item => {
        stdList.push(item.item_id);
      });
      _.forEach(this.selectedStudentValue, item => {
        students.push(item.item_id);
      });
      let formData = this.createClassForm.value;
      let submission = {
        title: formData.title,
        parent_id: this.activateUserData.id,
        district_id: JSON.parse(localStorage.getItem('districtDetails')).id,
        grade_id: formData.grade.id,
        school_id: formData.school.id,
        assigned_teacher_ids: teacher,
        assigned_standard_ids: stdList,
        assigned_student_ids: students
      };
      this.districtService.addClassDetails(submission).subscribe(
        (data) => {
          if (data) {
            this.toast.showToast(`${formData.title} : Class added successfully.`, '', 'success');
            this.resetForm();
            this.getAllClassList();
          }
        }, (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
    }
  }

  getAllActiveTeachers(schoolId?: any,existInSchool?:boolean): void {
    this.districtService.getAllTeacher(1,schoolId,undefined,existInSchool).subscribe(
      (response) => {
        if (response && response.data && response.data.rows) {
          this.teacherList = _.map(response.data.rows, item => {
            let obj = {
              item_id: item.teacher.id,
              item_text: `${item.teacher.first_name} ${item.teacher.last_name}`
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
  getSchoolList(): void {
    this.districtService.getSchools(1).subscribe(
      (response) => {
        if (response && response.data && response.data.rows) {
          this.schoolList = _.map(response.data.rows, item => {
            let obj = {
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
  getAllGradeList(): void {
    this.districtService.getGradeList().subscribe(
      (response) => {
        if (response && response.data) {
          this.gradeList = _.map(response.data, item => {
            let obj = {
              id: item.id,
              menu: item.grade
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

  getAllLearningStandards(): void {
    this.districtService.getLearningStandardList().subscribe(
      (response) => {
        if (response && response.data) {
          this.standardList = _.map(response.data, item => {
            let obj = {
              item_id: item.id,
              item_text: item.standardTitle
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
   * To get student list.
   *
   */
  getStudentList(sId?:any,existInSchool?:any): void {
    this.districtService.getAllStudents(1,undefined,undefined,sId,existInSchool).subscribe(
      (response) => {
        if (response && response.data && response.data.rows) {
          this.allStudentList = _.map(response.data.rows, item => {
            let obj = {
              item_id: item.id,
              item_text: `${item.firstName} ${item.lastName}`
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
   * On grade dropdown value change
   */
  gradeChange(event) {
    this.gradeTitle = event.menu;
    this.createClassForm.get('grade').setValue(event);
  }

  onSelectStandrd(item) {
    this.selectedValue.push(item);
    this.selectedStandard = this.selectedValue;
    this.createClassForm.get('standards').setValue(this.selectedStandard);
  }

  onDeSelectStandard(index) {
    this.selectedValue = [];
    // this.selectedStandard.splice(index, 1);
    this.selectedStandard = this.selectedStandard.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
    this.selectedValue = this.selectedStandard;
    this.createClassForm.get('standards').setValue(this.selectedStandard);
  }
  onSelectAllStandard(item) {
    this.selectedValue = [];
    this.selectedValue = item;
    this.selectedStandard = this.selectedValue;
    this.createClassForm.get('standards').setValue(this.selectedStandard);
  }

  onDeselectAllStandard(item) {
    this.selectedValue = item;
    this.createClassForm.get('standards').setValue(this.selectedValue);
  }

  onSelectTeacher(item) {
    this.selectedTeacherValue.push(item);
    this.selectedTeacher = this.selectedTeacherValue;
    this.createClassForm.get('teacherName').setValue(this.selectedTeacher);
  }

  onDeSelectTeacher(index) {
    this.selectedTeacherValue = [];
    // this.selectedTeacher.splice(index, 1);
    this.selectedTeacher = this.selectedTeacher.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
    this.selectedTeacherValue = this.selectedTeacher;
    this.createClassForm.get('teacherName').setValue(this.selectedTeacher);

  }
  onSelectAllTeacher(item) {
    this.selectedTeacherValue = [];
    this.selectedTeacherValue = item;
    this.selectedTeacher = this.selectedTeacherValue;
    this.createClassForm.get('teacherName').setValue(this.selectedTeacher);
  }

  onDeselectAllTeacher(item) {
    this.selectedTeacherValue = item;
    this.createClassForm.get('teacherName').setValue(this.selectedTeacherValue);
  }

  onSelectStudent(item) {
    this.selectedStudentValue.push(item);
    this.selectedStudent = this.selectedStudentValue;
    this.createClassForm.get('students').setValue(this.selectedStudent);
  }

  onDeSelectStudent(index) {
    this.selectedStudentValue = [];
    // this.selectedStudent.splice(index, 1);
    this.selectedStudent = this.selectedStudent.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
    this.selectedStudentValue = this.selectedStudent;
    this.createClassForm.get('students').setValue(this.selectedStudent);

  }
  onSelectAllStudent(item) {
    this.selectedStudentValue = [];
    this.selectedStudentValue = item;
    this.selectedStudent = this.selectedStudentValue;
    this.createClassForm.get('students').setValue(this.selectedStudent);
  }

  onDeselectAllStudent(item) {
    this.selectedStudentValue = item;
    this.createClassForm.get('students').setValue(this.selectedStudentValue);
  }

  classFilter(item: any): void {
    this.classesListtitle = item.menu;
    this.classStatus = item.id ? item.id : undefined;
    this.getAllClassList();
  }
  gradeFilter(event) {
    this.SortByGradeTitle = event.menu;
    this.sortBy = event.value ? event.value : undefined;
    this.getAllClassList();
  }
  schoolChange(event) {
    this.schoolTitle = event.menu;
    this.createClassForm.get('school').setValue(event);
    if (event && event.id) {
      this.getAllActiveTeachers(event.id);
      this.getStudentList(event.id);
      this.selectedTeacher = null;
      this.selectedStandard = null;
      this.selectedStudent = null;
      this.selectedStudentValue = [];
      this.selectedValue = [];
      this.selectedTeacherValue = [];
    }
  }
  onProceed() {
    this.closePopup();
    this.router.navigate(['/district/edit-membership']);

  }
  closePopup(): void {
    this.closeModal1.close();
  }
}
