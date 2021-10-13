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
import { DistrictService } from '@modules/district/services/district.service';
import { ToasterService } from '@appcore/services/toaster.service';
import { CustomRegex } from '@appcore/validators/custom-regex';
import * as _ from 'lodash';
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
  currentClassStudents;
  studentDetails;
  schoolTitle = 'Select School';
  schoolIcon = '';
  schoolList = [];
  SettingTitle = 'More Actions';
  planList:any;
  hrs:any

  tabTitle:string;
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
  isLoadClass = false;
  sortByIdTitle = "Sort by Student ID";
  sortByList = [
    {
      id: "1",
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
  filterListtitle = "All Students";
  selectedAllergenValue=[];
  selectedAllergen=null;
  allergenList=[];
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
  studentList = [];
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
  @ViewChild('archive') archiveModal: ElementRef;
  @ViewChild('delete') deleteModal: ElementRef;
  @ViewChild('editClass') editClsModal: ElementRef;
  @ViewChild('profile') ProfileModal: ElementRef;

  allergies = [];
  closeModal;
  editClassModal;
  profileModal;
  classID: any;
  currentClass: any;
  selectedValue = [];
  selectedStandard = null
  selectedTeacherValue = [];
  selectedTeacher = null;
  selectedStudent = null;
  selectedStudentValue = [];
  standardList = [];
  teacherList = [];
  allStudentList = [];
  isLoadAllStudents = false;
  term: string;
  gradeTitle = 'Select the grade';
  gradeList = [];
  stdList = [];
  standards: string;
  userForm: FormGroup;
  addStudentForm: FormGroup;
  deleteClassForm: FormGroup;
  editClassForm: FormGroup;
  classSetting: any;
  activateUserData: any;
  inactiveStudents:any;
  newStudents=0
  mins=0;
  constructor(
    private modalService: NgbModal,
    private districtService: DistrictService,
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
      this.getAllActiveTeachers(undefined);
      this.getAllGradeList();
      this.getAllLearningStandards();
      this.getStudentList();
      this.getSchoolList();
      this.studentRefresh();
      this.settingsRefresh();
      this.getStandardProficiencyPercentage();
    }
    this.editClassForm = new FormGroup({
      school: new FormControl(''),
      teacherName: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required, this.validateClassName.bind(this)]),
      grade: new FormControl([], [Validators.required]),
      standards: new FormControl('', [Validators.required]),
      students: new FormControl('')
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

    this.getTopActiveStudents("week")
    this.getInactiveStudents()

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
    if (this.currentClass.school) {
      this.editClassForm.get('school').setValue(this.currentClass.school.name);
      this.schoolTitle = this.currentClass.school.name;
    }
    if (this.currentClass && this.currentClass.class_teachers) {
      console.log(this.currentClass.class_teachers)

      this.editClassForm.get('teacherName').setValue(this.currentClass.class_teachers);
      this.selectedTeacher = _.map(this.currentClass.class_teachers, item => {
        let obj = {
          item_id: item.id,
          item_text: `${item.first_name} ${item.last_name}`
        }
        return obj;
      });

      this.selectedTeacherValue = this.selectedTeacher;
      console.log(this.selectedTeacherValue)
    }
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
    this.editClassForm.get('students').setValue(this.currentClass.class_students);
    this.selectedStudent = _.map(this.currentClass.class_students, item => {
      let obj = {
        item_id: item.id,
        item_text: `${item.firstName} ${item.lastName}`
      }
      return obj;
    });
    this.selectedStudentValue = this.selectedStudent;
  }

  closeEditClassModal(): void {
    this.schoolTitle = 'Select School';
    this.editClassModal.close();
    this.getClassDetails();
  }

  getClassDetails(): void {
    this.districtService.getClassById(this.classID).subscribe(
      (response) => {
        if (response && response.data) {
          this.currentClass = response.data;
          this.currentClassStudents = response.data.class_students;
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
          this.districtService.classNameValidator(control.value).subscribe(
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

  getAllActiveTeachers(schoolId: any): void {
    this.districtService.getAllTeacher(1, schoolId).subscribe(
      (response) => {
        if (response && response.data && response.data.rows) {
          this.teacherList = _.map(response.data.rows, item => {
            if (item && item.teacher) {
              let obj = {
                item_id: item.teacher.id,
                item_text: `${item.teacher.first_name} ${item.teacher.last_name}`
              }
              return obj;
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

  /**
   * To get student list.
   *
   */
  getStudentList(): void {
    this.districtService.getAllStudents(1, undefined).subscribe(
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
    * API call to edit class details.
    */
  onEditClass(): void {
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
    if (stdList.length > 0 && teacher.length > 0) {
      let formData = this.editClassForm.value;
      let submission = {
        title: formData.title,
        grade_id: formData.grade.id,
        school_id: formData.school && formData.school.id ? formData.school.id : undefined,
        assigned_teacher_ids: teacher,
        assigned_standard_ids: stdList,
        assigned_student_ids: students
      };
      if (this.editClassForm.invalid) {
        this.toast.showToast('Please enter information for required fields', '', 'error');
        // return;
      } else {
        this.districtService.editClassDetails(this.classID, submission).subscribe(
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
    this.router.navigate(['/district/admin-classes']);
  }

  schoolChange(event) {
    this.editClassForm.get('school').setValue(event);
    this.schoolTitle = event.menu;
    if (event && event.id) {
      this.getAllActiveTeachers(event.id);
      this.editClassForm.get('teacherName').setValue(null);
      this.selectedTeacherValue = [];
      this.selectedTeacher = null;
    }
  }

  onSelectStandrd(item) {
    this.selectedValue.push(item);
    this.selectedStandard = this.selectedValue;
    this.editClassForm.get('standards').setValue(this.selectedStandard);
  }

  onDeSelectStandard(index) {
    this.selectedValue = [];
    // this.selectedStandard.splice(index, 1);
    this.selectedStandard = this.selectedStandard.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
    this.selectedValue = this.selectedStandard;
    this.editClassForm.get('standards').setValue(this.selectedStandard);

  }
  onSelectAllStandard(item) {
    this.selectedValue = [];
    this.selectedValue = item;
    this.selectedStandard = this.selectedValue;
    this.editClassForm.get('standards').setValue(this.selectedStandard);
  }

  onDeselectAllStandard(item) {
    this.selectedValue = item;
    this.editClassForm.get('standards').setValue(this.selectedValue);
  }

  onSelectTeacher(item) {
    this.selectedTeacherValue.push(item);
    this.selectedTeacher = this.selectedTeacherValue;
    this.editClassForm.get('teacherName').setValue(this.selectedTeacher);
  }

  onDeSelectTeacher(index) {
    this.selectedTeacherValue = [];
    // this.selectedTeacher.splice(index, 1);
    this.selectedTeacher = this.selectedTeacher.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
    this.selectedTeacherValue= this.selectedTeacher;
    this.editClassForm.get('teacherName').setValue(this.selectedTeacher);

  }
  onSelectAllTeacher(item) {
    this.selectedTeacherValue = [];
    this.selectedTeacherValue = item;
    this.selectedTeacher = this.selectedTeacherValue;
    this.editClassForm.get('teacherName').setValue(this.selectedTeacher);
  }

  onDeselectAllTeacher(item) {
    this.selectedTeacherValue = item;
    this.editClassForm.get('teacherName').setValue(this.selectedTeacherValue);
  }

  onSelectStudent(item) {
    this.selectedStudentValue.push(item);
    this.selectedStudent = this.selectedStudentValue;
    this.editClassForm.get('students').setValue(this.selectedStudent);
  }

  onDeSelectStudent(index) {
    this.selectedStudentValue = [];
    // this.selectedStudent.splice(index, 1);
    this.selectedStudent = this.selectedStudent.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
    this.selectedStudentValue= this.selectedStudent;
    this.editClassForm.get('students').setValue(this.selectedStudent);

  }
  onSelectAllStudent(item) {
    this.selectedStudentValue = [];
    this.selectedStudentValue = item;
    this.selectedStudent = this.selectedStudentValue;
    this.editClassForm.get('students').setValue(this.selectedStudent);
  }

  onDeselectAllStudent(item) {
    this.selectedStudentValue = item;
    this.editClassForm.get('students').setValue(this.selectedStudentValue);
  }
  /**
   * on click of settings tab.
   */
  settingsRefresh(): void {
    this.districtService.getSettings(this.classID).subscribe(
      (response) => {
        if (response && response.data) {
          let mappedSettings = [];
          mappedSettings = _.map(response.data, item => {
            if (item.key === 'classShowPerformanceReportStudent') {
              item['value'] = 'Show performance report in student dashboard for parents';
            } else if (item.key === 'classAllowLessonsExplorationsStudent') {
              item['value'] = 'Allow lessons exploration to students';
            } else if (item.key === 'classPassportStudent') {
              item['value'] = 'Passport for students';
            } else if (item.key === 'classBadgeStudent') {
              item['value'] = 'Badges for students';
            } else if (item.key === 'classMasteryPointStudent') {
              item['value'] = 'Mastery Points for students';
            } else if (item.key === 'classShowLearnerProfileStudent') {
              item['value'] = 'Show Learner Profile to students';
            }

            return item;
          });
          this.settingsList = _.filter(mappedSettings, item => {
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
  onSettingsUpdate(item: any): void {
    let data = {
      settings: []
    };
    data.settings.push({
      id: item.id,
      isEnable: !item.isEnable
    });
    this.districtService.editSettings(data).subscribe(
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
  /**
   * On click of student tab.
   *  
   */
  studentRefresh(): void {
    this.getStudentsByClassId();
  }
  addNewStudent(): void {
    this.router.navigate(['/district/add-student'], { queryParams: { cid: this.classID } });
  }
  /**
   * To show student list.
   * 
   */
  getStudentsByClassId(filter?: any, sortBy?: any): void {
    this.districtService.getStudentsByClassId(this.classID, filter, sortBy).subscribe(
      (response) => {
        if (response && response.data) {
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
            element.studentPhoto = "./assets/images/student-icon.svg";
            element.actions = [
              "Profile",
              "Reports"
            ]
          });
          this.isLoadAllStudents = true;
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
    this.editClassForm.get('grade').setValue(event);
  }
  gradeFilter(event) {
    this.sortByIdTitle = event.menu;
    if (event && event.value) {
      this.getStudentsByClassId(undefined, event.value);
    } else {
      this.getStudentsByClassId();
    }
  }
  /**
   * Active/inactive filter.
   * @param item 
   */
  studentFilter(item: any): void {
    this.filterListtitle = item.menu;
    if (item && item.id) {
      this.getStudentsByClassId(item.id);
    } else {
      this.getStudentsByClassId();
    }
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
        this.districtService.deleteClass(this.classID).subscribe(
          (response) => {
            if (response && response.data && response.data.result) {
              this.toast.showToast('Class deleted successfully.', '', 'success');
              this.closeOpenModal();
              this.router.navigate(['/district/admin-classes']);
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
    this.districtService.archiveClass(this.classID).subscribe(
      (response) => {
        if (response && response.data && response.data.result) {
          this.toast.showToast('Class archived successfully.', '', 'success');
          this.closeOpenModal();
          this.router.navigate(['/district/admin-classes']);
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  getClassSettingByClassId(): void {
    this.districtService.getClassSettingByClassId(this.classID).subscribe(
      (response) => {
        if (response && response.data) {
          this.classSetting = response.data;
          if (this.classSetting.performanceReport == true) {
            this.settingsList[0].checked = true;
          }
          if (this.classSetting.lessonExploration == true) {
            this.settingsList[1].checked = true;
          }
          if (this.classSetting.passport == true) {
            this.settingsList[2].checked = true;
          }
          if (this.classSetting.badges == true) {
            this.settingsList[3].checked = true;
          }
          if (this.classSetting.masteryPoints == true) {
            this.settingsList[4].checked = true;
          }
          if (this.classSetting.learnerProfile == true) {
            this.settingsList[5].checked = true;
          }



        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
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
    this.districtService.getStandardProficiencyPercentage(undefined,this.classID).subscribe((res) => {
      if (res.data) {
        this.planList = res.data;
      }
    });
  }

  getTopActiveStudents(duration) {
    this.districtService.getAllStudents(1,undefined).subscribe((response) => {
      _.map(response.data.rows, (item) => {
        this.newStudents=response.data.count
         this.districtService.getTopActiveSessionStudents(duration, item.id).subscribe((res) => {
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

  getInactiveStudents() {
    this.districtService.getNewStudents(0,"week").subscribe((response) => {
       this.inactiveStudents=response.data.count
    });
   
  }

}
