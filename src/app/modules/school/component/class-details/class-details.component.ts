import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  faAngleLeft,
  faEdit,
  faList,
  faThLarge,
  faSearch,
  faExclamationTriangle,
  faChevronRight,
  faAngleDoubleRight,
  faPlus,
  faTimes,
  faCog,
  faArchive,
  faTrash,

} from '@fortawesome/free-solid-svg-icons';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SchoolService } from '@modules/school/services/school.service';
import { ToasterService } from '@appcore/services/toaster.service';
import { CustomRegex } from '@appcore/validators/custom-regex';
import * as _ from 'lodash';
import { stubTrue } from 'lodash';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.scss']
})
export class ClassDetailsComponent implements OnInit {
  LeftArrow = faAngleLeft;
  faEdit = faEdit;
  TileView = faList;
  ViewIcon = faThLarge;
  SearchIcon = faSearch;
  exclamationTriangle = faExclamationTriangle;
  rightArrow = faChevronRight;
  NextArrow = faAngleDoubleRight;
  PlusIcon = faPlus;
  timesIcon = faTimes;
  active = 1;
  gridView = true;
  listView = false;
  SettingIconMain = faCog;
  SettingTitle = 'More Actions';
  activateUserData: any;
  schoolDetails: any;
  classOwner: string;
  contactPersonName: string;
  val = false;
  isLoadUser = false;
  classesListtitle = "All Students";
  term: string;
  selectedAllergenValue=[];
  selectedAllergen=null;
  allergenList=[];
  studentDetails;
  currentClassStudents;
  profileModal;
  schoolInfoDetails:any;
  planList:any;
  standardsProficiencyList = [];
  inactiveStudents:any;
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
  SettingList = [
    {
      id: '1',
      menu: 'Class Setting',
      value: 'class_setting',
      icon: faCog
    },
    {
      id: '2',
      menu: 'Edit Class',
      value: 'edit',
      icon: faEdit
    },
    {
      id: '3',
      menu: 'Archive Class',
      value: 'archive',
      icon: faArchive
    },
    {
      id: '4',
      menu: 'Delete Class',
      value: 'delete',
      icon: faTrash
    }
  ];
  usersTitle = "Enter users";
  isLoadClass = false;
  usersList = [
    {
      id: "1",
      menu: "4"
    },
    {
      id: "2",
      menu: "5"
    },
    {
      id: "3",
      menu: "6"
    },
    {
      id: "4",
      menu: "7"
    }
  ]
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
  studentSearchListTitle = "All Students";
  studentSearchList = [
    {
      id: '1',
      menu: 'student 1',
      link: '',
      icon: ''
    },
    {
      id: '2',
      menu: 'student 2',
      link: '',
      icon: ''
    }
  ];
  SortByIdTitle = "Sort by Student ID";
  SortByIdList = [
    {
      id: '1',
      menu: 'Sort by Student ID:None'
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
  studentList = [];
  //   {
  //     district: "District 1",
  //     school: "School 2",
  //     class: "Class 2",
  //     studentPhoto: "./assets/imaegs/student-icon.svg",
  //     studentName: "Samuel, Aaron",
  //     studentId: "36273",
  //     studentGroup: "Red",
  //     actions: [
  //       "Profile",
  //       "Reports"
  //     ],
  //     studentDob: "22/10/1995",
  //     gender: "Male",
  //     grade: "Grade 1",
  //     email: "samual.aron@xyzschools.net",
  //     ethnicity: "Ethnicity 1",
  //     guardian: "Guardian 1",
  //     username: "sam@13",
  //     contactName: "Danial",
  //     contactRelationship: "Relationship 1",
  //     contactEmail: "dan@gmail.com",
  //     contactNumber: "1234567890",
  //     interests: "Cooking",
  //     medicalCondition: "Condition 1",
  //     allergies: "Allergies - Gluten, Latex ",
  //     status: "active"
  //   },
  //   {
  //     district: "District 1",
  //     school: "School 2",
  //     class: "Class 2",
  //     studentPhoto: "./assets/images/student-icon.svg",
  //     studentName: "Ruaz, Kevin",
  //     studentId: "36272",
  //     studentGroup: "Green",
  //     actions: [
  //       "Profile",
  //       "Reports"
  //     ],
  //     studentDob: "22/10/1993",
  //     gender: "Male",
  //     grade: "Grade 2",
  //     email: "ruaz.kevin@xyzschools.net",
  //     ethnicity: "Ethnicity 2",
  //     guardian: "Guardian 2",
  //     username: "kevin@13",
  //     contactName: "Danial",
  //     contactRelationship: "Father",
  //     contactEmail: "dan@gmail.com",
  //     contactNumber: "1234567890",
  //     interests: "Cooking, Singing",
  //     medicalCondition: "Condition 1",
  //     allergies: "Allergies - Gluten, Latex",
  //     status: "inactive"
  //   },
  //   {
  //     district: "District 1",
  //     school: "School 2",
  //     class: "Class 2",
  //     studentPhoto: "./assets/images/student-icon.svg",
  //     studentName: "Keil, Exie",
  //     studentId: "36271",
  //     studentGroup: "Yellow",
  //     actions: [
  //       "Profile",
  //       "Reports"
  //     ],
  //     studentDob: "2/10/1995",
  //     gender: "Male",
  //     grade: "Grade 3",
  //     email: "keil.exie@xyzschools.net",
  //     ethnicity: "Ethnicity 3",
  //     guardian: "Guardian 1",
  //     username: "Keil@12",
  //     contactName: "Danial",
  //     contactRelationship: "Father",
  //     contactEmail: "dan@gmail.com",
  //     contactNumber: "1234567890",
  //     interests: "Magic, Scientific Experiments",
  //     medicalCondition: "Condition 1",
  //     allergies: "Allergies - Gluten, Latex",
  //     status: "active"
  //   },
  //   {
  //     district: "District 1",
  //     school: "School 2",
  //     class: "Class 2",
  //     studentPhoto: "./assets/images/student-icon.svg",
  //     studentName: "Samuel, Aaron",
  //     studentId: "36274",
  //     studentGroup: "Red",
  //     actions: [
  //       "Profile",
  //       "Reports"
  //     ],
  //     studentDob: "22/1/1995",
  //     gender: "Male",
  //     grade: "Grade 3",
  //     email: "samual.aron@xyzschools.net",
  //     ethnicity: "Ethnicity 3",
  //     guardian: "Guardian 3",
  //     username: "sram21",
  //     contactName: "Danial",
  //     contactRelationship: "Father",
  //     contactEmail: "dan@gmail.com",
  //     contactNumber: "1234567890",
  //     interests: "Cooking, Magic, Scientific Experiments",
  //     medicalCondition: "Condition 3",
  //     allergies: "Allergies - Gluten, Latex",
  //     status: "active"
  //   }
  // ];
  studentHeaders = [
    {
      title: "Student Id",
      data: "studentId"
    },
    {
      title: "Student Name",
      data: "studentName"
    },
    {
      title: "Allergies",
      data: "allergies"
    },
    {
      title: "Actions",
      data: "actions",
      isClickable: true
    }
  ];
  settingsList = [];
  // settingsList = [
  //   {
  //     id: "1",
  //     settings: "Show performance report in student dashboard for parents",
  //     checked: false
  //   },
  //   {
  //     id: "2",
  //     settings: "Allow lessons exploration to students ",
  //     checked: false
  //   },
  //   {
  //     id: "3",
  //     settings: "Passport for students",
  //     checked: false
  //   }
  //   ,

  // ]
  @ViewChild('archive') archiveModal: ElementRef;
  @ViewChild('delete') deleteModal: ElementRef;
  @ViewChild('editClass') editClsModal: ElementRef;
  @ViewChild('profile') ProfileModal: ElementRef;

  allergies = [];
  closeModal;
  editClassModal;
  classID: any;
  hrs:any
  currentClass: any;
  selectedValue = [];
  selectedStandard = null
  selectedTeacherValue = [];
  selectedTeacher = null;
  selectedStudentValue = [];
  selectedStudent = null;
  standardList = [];
  teacherList = [];
  gradeTitle = 'Select the grade';
  gradeList = [];
  stdList = [];
  studList = [];
  standards: string;
  teachers: string;
  students: string;
  userForm: FormGroup;
  addStudentForm: FormGroup;
  deleteClassForm: FormGroup;
  editClassForm: FormGroup;
  selectedClass = null;
  newStudents=0
  mins=0;
  tabTitle:string;
  constructor(
    private modalService: NgbModal,
    private schoolService: SchoolService,
    private toast: ToasterService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.classID = this.activatedRoute.snapshot.queryParams && this.activatedRoute.snapshot.queryParams.id;
    this.tabTitle = this.activatedRoute.snapshot.queryParams && this.activatedRoute.snapshot.queryParams.action ? this.activatedRoute.snapshot.queryParams.action : 'Info';
  }

  ngOnInit(): void {
    this.activateUserData = JSON.parse(window.sessionStorage.getItem('currentUser'));

    if (this.classID) {
      this.getClassDetails();
      this.getSchoolDetails();
      this.getAllGradeList();
      this.getAllLearningStandards();
      this.getStudentList();
       this.getClassSettingByClassId();
       this.studentRefresh();
       this.getStandardProficiencyPercentage();
      //this.getStudentsByClassId();
    }
    this.editClassForm = new FormGroup({
      teacherName: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required, this.validateClassName.bind(this)]),
      grade: new FormControl([], [Validators.required]),
      standards: new FormControl('', [Validators.required]),
      student: new FormControl('')

    });
    this.userForm = new FormGroup({

    });
    this.addStudentForm = new FormGroup({
      studentName: new FormControl(''),
      allergies: new FormControl('')
    });
    this.deleteClassForm = new FormGroup({
      delete: new FormControl('', [Validators.required])
    });

  }
  get formControl() {
    return this.editClassForm.controls;
  }

  changeView(event) {
    if (event.menu === 'Tile View') {
      this.ViewTitle = 'Tile View';
      this.gridView = true;
      this.listView = false;
      this.ViewIcon = faThLarge;
    } else {
      this.ViewTitle = 'List View';
      this.gridView = false;
      this.listView = true;
      this.ViewIcon = faList;
    }
  }
  open(content) {
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'add-student--modal' });

  }
  closeOpenModal() {
    this.closeModal.close();
  }

  addAllergy() {
    if (this.addStudentForm.controls['allergies'].value != "") {
      this.allergies.push(this.addStudentForm.controls['allergies'].value);
      this.addStudentForm.value.allergies = this.allergies;
    }
  }
  removeAllergy(index) {
    this.allergies.splice(index, 1);
    this.addStudentForm.value.allergies = this.allergies;
  }
  openEditClassModal(modal: any): void {
    this.editClassModal = this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'add-student--modal' });
    this.editClassForm.get('title').setValue(this.currentClass.title);

    this.editClassForm.get('teacherName').setValue(this.currentClass.class_teachers);
    this.selectedTeacher = _.map(this.currentClass.class_teachers, item => {
      let obj = {
        item_id: item.id,
        item_text: `${item.first_name} ${item.last_name}`
      }
      return obj;
    });
    this.editClassForm.get('student').setValue(this.currentClass.class_students);
    this.selectedStudent = _.map(this.currentClass.class_students, item => {
      let obj = {
        item_id: item.id,
        item_text: `${item.firstName} ${item.lastName}`
      }
      return obj;
    });
    this.selectedTeacherValue = this.selectedTeacher;
    this.selectedStudentValue = this.selectedStudent;

    this.editClassForm.get('grade').setValue(this.currentClass.grade.grade);
    this.gradeTitle = this.currentClass.grade.grade;

    this.editClassForm.get('standards').setValue(this.currentClass.class_standards);
    this.selectedStandard = _.map(this.currentClass.class_standards, item => {
      let obj = {
        item_id: item.id,
        item_text: item.standardTitle
      }
      return obj;
    });
    this.selectedValue = this.selectedStandard;
  }

  closeEditClassModal(): void {
    this.editClassModal.close();
    this.getClassDetails();
  }

  getClassDetails() {
    let teachArr = [];
    let studArr = [];

    this.schoolService.getClassById(this.classID).subscribe(
      (response) => {
        if (response && response.data) {
          this.currentClass = response.data;
          this.currentClassStudents = response.data.class_students;

          _.forEach(this.currentClass.class_teachers, item => {
            let name = item.first_name + " " + item.last_name
            teachArr.push(name)
          });
          this.teachers = teachArr.join(',');
          _.forEach(this.currentClass.class_students, item => {
            let name = item.firstName + " " + item.lastName
            studArr.push(name)
          });
          this.students = studArr.join(',');

          let stdArr = [];
          _.forEach(this.currentClass.class_standards, item => {
            stdArr.push(item.standardTitle)
          });
          this.standards = stdArr.join(',');
          this.isLoadClass = true;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
    return this.currentClass;
  }
  getSchoolDetails() {
    this.activateUserData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.schoolService.getSchoolDetailsByUserId(this.activateUserData.id).subscribe(
      (response) => {
        if (response && response.data) {
          this.schoolDetails = response.data[0];
          this.contactPersonName = this.schoolDetails.contact_person_name;
          this.classOwner = this.schoolDetails.admin_account_name;
          this.getAllActiveTeachers(this.schoolDetails);
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
    return this.schoolDetails;
  }
  onDropdownValueChange(event) {
    if (event.value === 'archive') {
      this.open(this.archiveModal);
    } else if (event.value === 'edit') {
      this.openEditClassModal(this.editClsModal);
    } else if (event.value === 'delete') {
      this.open(this.deleteModal);
    } else if (event.value === 'class_setting') {
    } else if (event.menu === 'Settings') {
    }
  }

  /**
   * To check valid class Name
   *  
   */
  validateClassName(control: AbstractControl): any {
    if (control && control.value) {
      let isValid = control.value.match(CustomRegex.schoolNamePattern);
      let clsName = control.value;
      if (isValid && isValid.input) {
        if (this.currentClass && this.currentClass.title === control.value) {
          clsName = undefined;
        }
        if (clsName) {
          this.schoolService.classNameValidator(control.value).subscribe(
            (data) => {
            },
            (error) => {
              console.log(error);
              this.editClassForm.controls['title'].setErrors({ 'classNameValidate': true });
            }
          );
        }
      }
    }
  }

  getAllActiveTeachers(schoolDetails): void {
    let filter=[];
    filter[0]=1;
    filter[1]=schoolDetails.id;
    this.schoolService.getAllTeacher(filter).subscribe(
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

  getStudentList(filter?: any): void {
    this.schoolService.getAllStudents(filter).subscribe(
      (response) => {
        if (response && response.data && response.data.rows) {
          this.studList = _.map(response.data.rows, item => {
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
  * API call to edit class details.
  */
  onEditClass(): void {
    let teacher = [];
    let stdList = [];
    let studList = [];
    _.forEach(this.selectedTeacherValue, item => {
      teacher.push(item.item_id);
    });
    _.forEach(this.selectedValue, item => {
      stdList.push(item.item_id);
    });
    _.forEach(this.selectedStudentValue, item => {
      studList.push(item.item_id);
    });
    if (stdList.length > 0 && teacher.length > 0) {
      let formData = this.editClassForm.value;
      let submission = {
        title: formData.title,
        grade_id: formData.grade.id,
        assigned_teacher_ids: teacher,
        assigned_standard_ids: stdList,
        assigned_student_ids: studList,
        number_of_students: 0 //TODO need to remove
      };
      if (this.editClassForm.invalid) {
        this.toast.showToast('Please enter information for required fields', '', 'error');
        // return;
      } else {
        this.schoolService.editClassDetails(this.classID, submission).subscribe(
          (data) => {
            if (data) {
              this.toast.showToast(`${this.editClassForm.value.title} : updated successfully`, '', 'success');
              this.closeEditClassModal();
            }
          },
          (error) => {
            console.log(error);
            this.toast.showToast(error.error.message, '', 'error');
          }
        );
      }
    } else {
      this.toast.showToast('Please enter information for required fields', '', 'error');
    }
  }
  onCancel(): void {
    this.router.navigate(['/school/admin-classes']);
  }

  onSelectStandrd(item) {
    this.selectedValue.push(item);
    this.selectedStandard = this.selectedValue;
    this.editClassForm.get('standards').setValue(this.selectedStandard);
  }
  onSelectStudent(item) {
    this.selectedStudentValue.push(item);
    this.selectedStudent = this.selectedStudentValue;
    this.editClassForm.get('student').setValue(this.selectedStudent);
  }

  onDeSelectStandard(index) {
    this.selectedValue = [];
    this.selectedStandard = this.selectedStandard.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
   this.selectedValue= this.selectedStandard;

  }
  onDeSelectStudent(index) {
    this.selectedStudentValue = [];
    this.selectedStudent = this.selectedStudent.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
   this.selectedStudentValue= this.selectedStudent;

  }
  onSelectAllStandard(item) {
    this.selectedValue = [];
    this.selectedValue = item;
    this.selectedStandard = this.selectedValue;
    this.editClassForm.get('standards').setValue(this.selectedStandard);
  }
  onSelectAllStudent(item) {
    this.selectedStudentValue = [];
    this.selectedStudentValue = item;
    this.selectedStudent = this.selectedStudentValue;
    this.editClassForm.get('student').setValue(this.selectedStudent);
  }

  onDeselectAllStandard(item) {
    this.selectedValue = item;
  }
  onDeselectAllStudent(item) {
    this.selectedStudentValue = item;
  }

  onSelectTeacher(item) {
    this.selectedTeacherValue.push(item);
    this.selectedTeacher = this.selectedTeacherValue;
    this.editClassForm.get('teacherName').setValue(this.selectedTeacher);
  }

  onDeSelectTeacher(index) {
    this.selectedTeacherValue = [];
    this.selectedTeacher = this.selectedTeacher.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
   this.selectedTeacherValue= this.selectedTeacher;

  }
  onSelectAllTeacher(item) {
    this.selectedTeacherValue = [];
    this.selectedTeacherValue = item;
    this.selectedTeacher = this.selectedTeacherValue;
    this.editClassForm.get('teacherName').setValue(this.selectedTeacher);
  }

  onDeselectAllTeacher(item) {
    this.selectedTeacherValue = item;
  }


  /**
   * On grade dropdown value change
   */
  gradeChange(event) {
    this.gradeTitle = event.menu;
    this.editClassForm.get('grade').setValue(event);
  }

  /**
   * API call on to delete class.
   */
  onDelete(): void {
    if (this.deleteClassForm.invalid) {
      // return;
      this.toast.showToast('Please enter information for required fields', '', 'error');
    } else {
      if (!_.isEmpty(this.deleteClassForm.value.delete) && this.deleteClassForm.value.delete === "DELETE") {
        this.schoolService.deleteClass(this.classID).subscribe(
          (response) => {
            if (response && response.data && response.data.result) {
              this.toast.showToast('Class deleted successfully.', '', 'success');
              this.closeOpenModal();
              this.router.navigate(['/school/admin-classes']);
            }
          },
          (error) => {
            console.log(error);
            this.toast.showToast(error.error.message, '', 'error');
          }
        );
      } else {
        this.toast.showToast('Please enter correct information for required fields', '', 'error');
      }
    }
  }

  /**
  * API call on to delete class.
  */
  onArchiveClass(): void {
    this.schoolService.archiveClass(this.classID).subscribe(
      (response) => {
        if (response && response.data && response.data.result) {
          this.toast.showToast('Class archived successfully.', '', 'success');
          this.closeOpenModal();
          this.router.navigate(['/school/admin-classes']);
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  getClassSettingByClassId(): void {
    let classSetting = [];
    this.schoolService.getClassSettingByClassId(this.classID).subscribe(
      (response) => {
        if (response && response.data) {
         this.settingsList = response.data;
          classSetting = _.map(this.settingsList, item => {

          if (item.key=='classShowPerformanceReportStudent') {
            item['value']="Show performance report in student dashboard for parents";


          }
          if (item.key=='classAllowLessonsExplorationsStudent') {
            item['value']="Allow lessons exploration to students";
            
          }
          if (item.key=='classPassportStudent') {
            item['value']="Passport for students";
           
          }
          return item;

        })

        this.settingsList = _.filter(classSetting, item => {
          if (item && item.value) {
            return item;
          }
        });

        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  changeSetting(item: any){
    let data = {
      settings: []
    };
    data.settings.push({
      id: item.id,
      isEnable: !item.isEnable
    });
    this.schoolService.updateClassSetting(data).subscribe(
      (response) => {
        if (response && response.data) {
          this.toast.showToast('Settings updated successfully.', '', 'success');
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  studentFilter(item: any): void {
    this.classesListtitle = item.menu;
    if (item && item.id) {
      this.getStudentsByClassId(item.id);
    } else {
      this.getStudentsByClassId();
    }
  }

  studentIdFilter(event) {
    this.SortByIdTitle = event.menu;
    if (event && event.value) {
      this.getStudentsByClassId(undefined, event.value);
    } else {
      this.getStudentsByClassId();
    }
  }

  getStudentsByClassId(filter?: any, sortBy?: string): void {
    this.schoolService.getStudentsByClassId(this.classID, filter, sortBy).subscribe(
      (response) => {
        if (response && response.data && response.data.rows) {
        

          this.studentList = _.map(response.data.rows, item => {
            this.allergenList=[];
            
            _.map(item.student.allergens,allergen =>{
              this.allergenList.push(allergen.allergen.allergenTitle)
            });
            let obj = {
              studentId: item.studentId,
              studentName: item.student.firstName + "," + item.student.lastName,
              allergies: this.allergenList,
            }
            return obj;
          });
          this.studentList.forEach(element => {
            element.actions = [
              'Profile',
              'Reports' 
            ]
            element.userPhoto = "./assets/images/student-icon.svg"

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

  studentRefresh(): void {
    this.getStudentsByClassId();

  }

  addStudent(): void {
    this.router.navigate(['/school/add-student'], { queryParams: { classId: this.classID } });
  }
  onActionClick(item?: any, name?: any): void {
    let studentId = item ? item.studentId : name.studentId;
    let showPopup = false;
    if (name === 'Profile' && item) {
      showPopup = true;
    } else if (name.action === 'Profile' && studentId) {
      showPopup = true;
    }
    if (showPopup) {
      this.studentDetails = this.currentClassStudents.find(o => o.id === studentId);
      this.studentDetails.img = './assets/images/student-icon.svg';
      this.openProfile(this.ProfileModal);
    }
  }
  openProfile(modal: any): void {
    this.profileModal = this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'add-student--modal' });
  }

  closeProfileModal(): void {
    this.profileModal.close();
  }

  getStandardProficiencyPercentage():void{
    this.schoolService.getStandardProficiencyPercentage(undefined,this.classID).subscribe((res) => {
      if (res.data) {
        this.planList = res.data;
      }
    });

    this.getTopActiveStudents("week")
    this.getInactiveStudents()
  }

  getTopActiveStudents(duration) {
    this.schoolService.getNewStudents(1,duration).subscribe((response) => {
      _.map(response.data.rows, (item) => {
       this.newStudents=response.data.count
        this.schoolService.getTopActiveSessionStudents(duration, item.id).subscribe((res) => {
          if (res && res.data) {
            _.map(res.data.rows, (objItem) => {
              if (objItem.session_mins != null || objItem.session_mins != NaN) this.mins = (this.mins + objItem.session_mins/res.data.count)/60;
              this.hrs=this.mins.toFixed(2);
            });
          }
        });
      });
    });
   
  }

  getInactiveStudents() {
    this.schoolService.getNewStudents(0,"week").subscribe((response) => {
       this.inactiveStudents=response.data.count
    });
   
  }
  generatePDF() {
    var data = document.getElementById('generatePdf');
    html2canvas(data).then((canvas) => {
      var imgWidth = 208;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm', 'a4');
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

      pdf.save('class_detail.pdf');
    });
  }
}
