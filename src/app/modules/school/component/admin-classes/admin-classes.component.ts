import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClassesService } from '@modules/teacher/services/classes.service';
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
import { SchoolService } from '@modules/school/services/school.service';
import { ToasterService } from '@appcore/services/toaster.service';
import { CustomRegex } from '@appcore/validators/custom-regex';
import { AuthService } from '@modules/auth/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
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
  closeModal1;
  id:any
  hidden:any;
  ViewTitle = this.translate.instant('table-search-filter-container.view.tile-view');

  ViewList = [
    {
      id: '1',
      menu: this.translate.instant('table-search-filter-container.view.tile-view'),
      link: '',
      icon: faThLarge,
    },
    {
      id: '2',
      menu: this.translate.instant('table-search-filter-container.view.list-view'),
      link: '',
      icon: faList
    }
  ];;
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
      "title": "Student",
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
  studentList = []
  closeModal;
  closeResult = '';
  selectedValue = [];
  selectedStandard = null
  selectedStudent = null
  selectedTeacherValue = [];
  selectedStudentValue = [];
  membershipUserId: any;
  membershipUserRoleId: any;
  studentCount:any;
  selectedTeacher = null;
  term: string;
  createClassForm: FormGroup;
  accessCodeForm: FormGroup;
  activateUserData: any;
  schoolDetails: any;
  sortBy;
  classStatus;
  subjectList = [];
  selectedSubjectValue = [];
  selectedSubject = null;
  constructor(
    private router: Router,
    private toast: ToasterService,
    private schoolService: SchoolService,
    private authService : AuthService,
    private modalService: NgbModal,
    private translate : TranslateService,
    private classService : ClassesService
  ) { }

  ngOnInit(): void {
    this.activateUserData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.getAllClassList();
    this.getAllActiveTeachers();
    this.getAllGradeList();
    this.getAllLearningStandards();
    this.getStudentList();
    this.getSubjectList();
    this.createClassForm = new FormGroup({
      teacherName: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required, this.validateClassName.bind(this)]),
      grade: new FormControl([], [Validators.required]),
      standards: new FormControl(''),
      subjects: new FormControl('', [Validators.required]),
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
    this.schoolService.getSchoolDetailsByUserId(this.activateUserData.id).subscribe(
      (response) => {
        if (response && response.data) {
          this.schoolDetails = response.data[0];
          this.schoolService.getAllClasses(this.classStatus, this.schoolDetails.id, this.sortBy).subscribe(
            (response) => {
              if (response && response.data && response.data.rows) {
                this.classList = _.map(response.data.rows, item => {
                  let obj = {
                    displayCode: `CK00000${item.id}`,
                    classId: item.id,
                    className: item.title,
                    teacherName: item && item.class_teachers ? `${item.class_teachers[0].first_name} ${item.class_teachers[0].last_name}` : 'teacher',
                    grade: item.grade.grade,
                    students: item.class_students.length,
                    profilePic: "./assets/images/student-icon.svg"
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
      });
  }

  /**
   * To check valid class Name
   *  
   */
  validateClassName(control: AbstractControl): any {
    if (control && control.value) {
      let isValid = control.value.match(CustomRegex.schoolNamePattern);
      if (isValid && isValid.input) {
        this.schoolService.classNameValidator(control.value).subscribe(
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
    if (event.menu === this.translate.instant('table-search-filter-container.view.tile-view')) {
      this.ViewTitle = this.translate.instant('table-search-filter-container.view.tile-view');
      this.listview = false;
      this.gridview = true;
      this.ViewIcon = faThLarge;
    } else {
      this.ViewTitle =this.translate.instant('table-search-filter-container.view.list-view');
      this.gridview = false;
      this.listview = true;
      this.ViewIcon = faList;
    }
  }
  open(content) {
    if (this.activateUserData) {
      if(this.activateUserData.parentId)
      {
        this.membershipUserId=this.activateUserData.parentId

        this.schoolService.getUserDetailsByID(this.activateUserData.parentId).subscribe((parentDetailsResponse) => {
          if(parentDetailsResponse.data)
          {
            this.membershipUserRoleId=parentDetailsResponse.data.role.id
            this.schoolService.verifyMaxUserCountClass(this.membershipUserId, this.membershipUserRoleId).subscribe((res) => {
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
              this.toast.showToast(error.error.message, '', 'error');
            });
          }
        });
      }
      else
      {
        this.membershipUserId=this.activateUserData.id
        this.membershipUserRoleId=this.activateUserData.role.id
        this.schoolService.verifyMaxUserCountClass(this.membershipUserId, this.membershipUserRoleId).subscribe((res) => {
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
 
  }
  openAccessModal(content)
  {
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'access-code-modal' });
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

  closeOpenModal() {
    this.closeModal.close();
    this.resetForm();
  }

  resetForm() {
    this.gradeTitle = 'Select the grade';
    this.createClassForm.reset();
    this.selectedTeacher = null;
    this.selectedStandard = null;
    this.selectedValue = [];
    this.selectedTeacherValue = [];
    this.selectedSubjectValue = [];
    this.selectedSubject = null;
  }
  editClass(item: any, action?: any): void {
    this.router.navigate(['/school/class-details'], { queryParams: { id: item.classId, action } });
  }
 
  

  onSave(): void {
    if (this.createClassForm.invalid) {
      // return;
      this.toast.showToast('Please enter information for required fields', '', 'error');
    } else {
      let teacher = [];
      let student = [];
      let studentList = [];
      _.forEach(this.selectedTeacherValue, item => {
        teacher.push(item.item_id);
      });
      _.forEach(this.selectedStudentValue, item => {
        student.push(item.item_id);
      });
      _.forEach(this.selectedValue, item => {
        studentList.push(item.item_id);
      });

      let formData = this.createClassForm.value;

      if (this.activateUserData.parentId) {
        this.id = this.activateUserData.parentId

      }
      else {
        this.id = this.activateUserData.id;

      }

      this.schoolService.getSchoolDetailsByUserId(this.activateUserData.id).subscribe(
        (response) => {
          if (response && response.data) {
            this.schoolDetails = response.data[0];
            let submission = {
              title: formData.title,
              parent_id: this.id,
              district_id: this.schoolDetails.district_id,
              school_id: this.schoolDetails.id,
              grade_id: formData.grade.id,
              assigned_teacher_ids: teacher,
              assigned_standard_subject_group_ids : formData.subjects,
              assigned_standard_ids: studentList,
              number_of_students: 0,//TODO need to remove                                                  
              assigned_student_ids: student//TODO need to remove
            };
            this.schoolService.addClassDetails(submission).subscribe(
              (data) => {
                if (data) {
                  this.toast.showToast(`${formData.title} : Class added successfully.`, '', 'success');
                  this.resetForm();
                  this.getAllClassList();
                }
              },
              (error) => {
                console.log(error);
                this.toast.showToast(error.error.message, '', 'error');
              }
            );
          }
        },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
    }
  }
  getAllActiveTeachers(): void {
    this.schoolService.getSchoolDetailsByUserId(this.activateUserData.id).subscribe(
      (schoolResponse) => {
        if (schoolResponse && schoolResponse.data) {
          this.schoolDetails = schoolResponse.data[0];
          this.schoolService.getAllTeacher(1,this.schoolDetails.id).subscribe(
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
      });
  }

  getAllGradeList(): void {
    this.schoolService.getGradeList().subscribe(
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
    this.schoolService.getLearningStandardList().subscribe(
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
  getStudentList(): void {
    this.schoolService.getAllStudents(1).subscribe(
      (response) => {
        if (response && response.data && response.data.rows) {
          this.studentList = _.map(response.data.rows, item => {
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
  getSubjectList() {
    this.classService.getSubjectList().subscribe((response: any) => {
      if (response && response.data) {
        this.subjectList = _.map(response.data, item => {
          let obj = {
            item_id: item.id,
         item_text: item.subjectTitle,
        }
        
        return obj;
      });
      }
    }, (error) => {
      console.log(error);
      this.toast.showToast(error.error.message, '', 'error');
      
    });
  }

  onSelectSubject(item) {
    this.selectedSubjectValue.push(item);
    this.selectedSubject = this.selectedSubjectValue;
    this.createClassForm.get('subjects').setValue(this.selectedSubject.map(obj => obj.item_id));
  }

  onDeSelectSubject(index) {
    this.selectedSubjectValue = [];
    this.selectedSubject = this.selectedSubject.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
    this.selectedSubjectValue = this.selectedSubject;
  /*   this.selectedSubject.splice(index, 1);
    this.selectedValue = this.selectedSubject; */
    this.createClassForm.get('subjects').setValue(this.selectedSubject.map(obj => obj.item_id));
  }

  onSelectAllSubject(item) {
    this.selectedSubjectValue = [];
    this.selectedSubjectValue = item;
    this.selectedSubject = this.selectedSubjectValue;

    // assign selected subjects id to array
    this.createClassForm.get('subjects').setValue(this.selectedSubject.map(obj => obj.item_id));
  }

  onDeselectAllSubject(item) {
    this.selectedSubjectValue = item;
    this.createClassForm.get('subjects').setValue('');
  }

  onSelectStandrd(item) {
    this.selectedValue.push(item);
    this.selectedStandard = this.selectedValue;
    this.createClassForm.get('standards').setValue(this.selectedStandard);
  }

  onDeSelectStandard(index) {
    this.selectedValue = [];
    this.selectedStandard = this.selectedStandard.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
    this.selectedValue = this.selectedStandard;

  }
  onSelectAllStandard(item) {
    this.selectedValue = [];
    this.selectedValue = item;
    this.selectedStandard = this.selectedValue;
    this.createClassForm.get('standards').setValue(this.selectedStandard);
  }

  onDeselectAllStandard(item) {
    this.selectedValue = item;
  }

  onSelectTeacher(item) {
    this.selectedTeacherValue.push(item);
    this.selectedTeacher = this.selectedTeacherValue;
    this.createClassForm.get('teacherName').setValue(this.selectedTeacher);
  }
  onSelectStudent(item) {
    this.selectedStudentValue.push(item);
    this.selectedStudent = this.selectedStudentValue;
    this.createClassForm.get('students').setValue(this.selectedStudent);

  }
  onDeSelectTeacher(index) {
    this.selectedTeacherValue = [];
    this.selectedTeacher = this.selectedTeacher.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
    this.selectedTeacherValue = this.selectedTeacher;

  }
  onDeSelectStudent(index) {
    this.selectedStudentValue = [];
    this.selectedStudent = this.selectedStudent.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
    this.selectedStudentValue = this.selectedStudent;

  }
  onSelectAllTeacher(item) {
    this.selectedTeacherValue = [];
    this.selectedTeacherValue = item;
    this.selectedTeacher = this.selectedTeacherValue;
    this.createClassForm.get('teacherName').setValue(this.selectedTeacher);
  }
  onSelectAllStudent(item) {
    this.selectedStudentValue = [];
    this.selectedStudentValue = item;
    this.selectedStudent = this.selectedStudentValue;
    this.createClassForm.get('students').setValue(this.selectedStudent);
  }

  onDeselectAllTeacher(item) {
    this.selectedTeacherValue = item;
  }
  onDeselectAllStudent(item) {
    this.selectedStudentValue = item;
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

  onProceed() {
    this.closePopup();
    this.router.navigate(['/school/edit-membership']);

  }
  closePopup(): void {
    this.closeModal1.close();
  }

}
