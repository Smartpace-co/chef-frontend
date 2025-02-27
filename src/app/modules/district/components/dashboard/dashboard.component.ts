import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomRegex } from '@appcore/validators/custom-regex';
import * as _ from 'lodash';
import {
  faAngleDoubleRight,
  faHome,
  faDollarSign,
  faBuilding,
  faCog,
  faUserFriends,
  faGraduationCap,
  faUserShield,
  faTools,
  faQuestion,
  faLifeRing,
  faUniversity,
  faUsers,
  faUserPlus,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '@modules/auth/services/auth.service';
import { DistrictService } from '@modules/district/services/district.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from '@appcore/services/toaster.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('proceedMembershipClassModal') proceedMembershipClassModal: ElementRef;

  currentUser: string;
  schoolCount: any;
  closeModal1: any;
  closeResult = '';
  classCount: any;
  activateUserData: any;
  usersCount: any;
  inactiveStudents: any;
  NextArrow = faAngleDoubleRight;
  home = faHome;
  billing = faDollarSign;
  profile = faHome;
  membership = faHome;
  schools = faBuilding;
  classes = faHome;
  reports = faHome;
  settings = faCog;
  users = faUserFriends;
  student = faGraduationCap;
  teachers = faHome;
  roles = faUserShield;
  troubleshooting = faTools;
  faq = faQuestion;
  help = faLifeRing;
  issue = faHome;
  discussion = faHome;
  faUniversity = faUniversity;
  faUsers = faUsers;
  faUserPlus = faUserPlus;
  faPlus = faPlus;
  menubarStatus: boolean = false;
  isLoadUser = false;
  filter = [];
  schoolList = [];
  teacherList = [];
  selectedValue = [];
  selectedStandard = null;
  selectedTeacherValue = [];
  selectedTeacher = null;
  selectedStudentValue = [];
  selectedStudent = null;
  classList = [];
  standardList = [];
  allStudentList = [];
  gradeList = [];
  schoolIcon = '';
  reportData: any;
  growthData: any;
  mins:any;
  hrs:any;
  sessionData = {
    totalAverageHour: 0,
    belowAverageCount: 0,
    aboveAverageCount: 0,
    inactiveStudentCount: 0
  };
  donutChart = [
    {
      label: 'Above average',
      strokeDasharray: "40, 60",
      strokeDashoffset: '25'
    },
    {
      label: 'Inactive',
      strokeDasharray: "40, 60",
      strokeDashoffset: '65'
    },
    {
      label: 'Below Average',
      strokeDasharray: "20, 80",
      strokeDashoffset: '85'
    },
  ];
  menuList = [
    {
      id: '1',
      name: 'Home',
      icon: this.home,
      type: 'menu',
      status: 'active'
    },
    {
      id: '2',
      name: 'DISTRICT',
      icon: '',
      type: 'heading',
      status: ''
    },
    {
      id: '3',
      name: 'Billing',
      icon: this.billing,
      type: 'menu',
      status: ''
    },
    {
      id: '4',
      name: 'Profile',
      icon: this.profile,
      type: 'menu',
      status: ''
    },
    {
      id: '5',
      name: 'Membership',
      icon: this.membership,
      type: 'menu',
      status: ''
    },
    {
      id: '6',
      name: 'SCHOOLS',
      icon: '',
      type: 'heading',
      status: ''
    },
    {
      id: '7',
      name: 'Schools',
      icon: this.schools,
      type: 'menu',
      status: ''
    },
    {
      id: '8',
      name: 'Reports',
      icon: this.reports,
      type: 'menu',
      status: ''
    },
    {
      id: '9',
      name: 'CLASSES',
      icon: '',
      type: 'heading',
      status: ''
    },
    {
      id: '10',
      name: 'Classes',
      icon: this.classes,
      type: 'menu',
      status: ''
    },
    {
      id: '11',
      name: 'Reports',
      icon: this.reports,
      type: 'menu',
      status: ''
    },
    {
      id: '12',
      name: 'CONTENT',
      icon: '',
      type: 'heading',
      status: ''
    },
    {
      id: '13',
      name: 'Settings',
      icon: this.settings,
      type: 'menu',
      status: ''
    },
    {
      id: '14',
      name: 'Reports',
      icon: this.reports,
      type: 'menu',
      status: ''
    },
    {
      id: '15',
      name: 'USERS',
      icon: '',
      type: 'heading',
      status: ''
    },
    {
      id: '16',
      name: 'Users',
      icon: this.users,
      type: 'menu',
      status: ''
    },
    {
      id: '17',
      name: 'Student',
      icon: this.student,
      type: 'menu',
      status: ''
    },
    {
      id: '18',
      name: 'Teachers',
      icon: this.teachers,
      type: 'menu',
      status: ''
    },
    {
      id: '19',
      name: 'Roles',
      icon: this.roles,
      type: 'menu',
      status: ''
    },
    {
      id: '20',
      name: 'Reports',
      icon: this.reports,
      type: 'menu',
      status: ''
    },
    {
      id: '21',
      name: 'SUPPORTS',
      icon: '',
      type: 'heading',
      status: ''
    },
    {
      id: '22',
      name: 'Troubleshooting',
      icon: this.troubleshooting,
      type: 'menu',
      status: ''
    },
    {
      id: '23',
      name: 'FAQ',
      icon: this.faq,
      type: 'menu',
      status: ''
    },
    {
      id: '24',
      name: 'Report an Iissue',
      icon: this.issue,
      type: 'menu',
      status: ''
    },
    {
      id: '25',
      name: 'Get Help',
      icon: this.help,
      type: 'menu',
      status: ''
    },
    {
      id: '26',
      name: 'Discussion Forum',
      icon: this.discussion,
      type: 'menu',
      status: ''
    }
  ];
  createClassForm: any;
  gradeTitle = 'Select the grade';
  schoolTitle = 'Select School';
  classesListtitle = 'All Classes';
  SortByGradeTitle = 'Sort by Grade';

  // strikeCheckout:any = null;
  constructor(
    private authService: AuthService,
    private districtService: DistrictService,
    private router: Router,
    private toast: ToasterService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((data) => {
      if (data) {
        this.activateUserData = data;
        this.currentUser = data['admin_account_name'] ? data['admin_account_name'] : undefined;
      }
    });   
    this.createClassForm = new FormGroup({
      school: new FormControl(''),
      teacherName: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required, this.validateClassName.bind(this)]),
      grade: new FormControl([], [Validators.required]),
      standards: new FormControl('', [Validators.required]),
      students: new FormControl('')
    });
    this.authService.setuserlang();

    this.getSchoolCount();
    this.getClassCount();
    this.getUsersCount();
    this.getPracticeAndGrowthReport();
    this.getSessionReport();
  }
  get formControl() {
    return this.createClassForm.controls;
  }
  /**
   * function to Change language
   */

  openMenu() {
    this.menubarStatus = !this.menubarStatus;
  }
  getSchoolCount() {
    this.districtService.getSchools(1).subscribe((response) => {
      if (response && response.data.rows) {
        this.schoolCount = response.data.rows.length;
      }
    });
  }
  getClassCount() {
    this.districtService.getAllClasses(1).subscribe((response) => {
      if (response && response.data) {
        this.classCount = response.data.count;
      }
    });
  }
  getUsersCount() {
    this.districtService.getAllUser().subscribe((response) => {
      if (response && response.data.rows) {
        this.usersCount = response.data.rows.length;
      }
    });
  }

  addSchool() {
    this.router.navigate(['/district/add-schools']);
  }

  addUser() {
    this.router.navigate(['/district/add-user']);
  }

  open(content) {
    if (this.activateUserData) {
      this.districtService.verifyMaxUserCountClass(this.activateUserData.id, this.activateUserData.role.id).subscribe(
        (res) => {
          if (res.status == 200) { 
            this.getAllActiveTeachers(undefined,false); // To get all teacher.
            this.getSchoolList();
            this.getAllGradeList();
            this.getStudentList(undefined,false);
            this.getAllLearningStandards();           
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
          this.closeModal1 = this.modalService.open(this.proceedMembershipClassModal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true,
            windowClass: 'proceed-membership-class-modal'
          });
        }
      );
    }
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

  validateClassName(control: AbstractControl): any {
    if (control && control.value) {
      let isValid = control.value.match(CustomRegex.schoolNamePattern);
      if (isValid && isValid.input) {
        this.districtService.classNameValidator(control.value).subscribe(
          (data) => {},
          (error) => {
            console.log(error);
            this.createClassForm.controls['title'].setErrors({ classNameValidate: true });
          }
        );
      }
    }
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
  
  getAllActiveTeachers(schoolId?: any,existInSchool?:boolean): void {    
    this.districtService.getAllTeacher(1,schoolId,undefined,existInSchool).subscribe(
      (response) => {
        if (response && response.data && response.data.rows) {
          this.teacherList = _.map(response.data.rows, (item) => {
            let obj = {
              item_id: item.teacher.id,
              item_text: `${item.teacher.first_name} ${item.teacher.last_name}`
            };
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
          this.schoolList = _.map(response.data.rows, (item) => {
            let obj = {
              id: item.school.id,
              menu: item.school.name
            };
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
          this.gradeList = _.map(response.data, (item) => {
            let obj = {
              id: item.id,
              menu: item.grade
            };
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
          this.standardList = _.map(response.data, (item) => {
            let obj = {
              item_id: item.id,
              item_text: item.standardTitle
            };
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
          this.allStudentList = _.map(response.data.rows, (item) => {
            let obj = {
              item_id: item.id,
              item_text: `${item.firstName} ${item.lastName}`
            };
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
  onSave(): void {
    this.activateUserData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    if (this.createClassForm.invalid) {
      // return;
      this.toast.showToast('Please enter information for required fields', '', 'error');
    } else {
      let teacher = [];
      let stdList = [];
      let students = [];
      _.forEach(this.selectedTeacherValue, (item) => {
        teacher.push(item.item_id);
      });
      _.forEach(this.selectedValue, (item) => {
        stdList.push(item.item_id);
      });
      _.forEach(this.selectedStudentValue, (item) => {
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
            this.getClassCount();
          }
        },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
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

  onProceed() {
    this.closePopup();
    this.router.navigate(['/district/edit-membership']);
  }
  closePopup(): void {
    this.closeModal1.close();
  }
  getPracticeAndGrowthReport() {
    this.districtService.getDistrictProfile().subscribe((response) => {
      if (response && response.data) {
        this.districtService.getPracticeAndGrowthReport(response.data.district_admin.id).subscribe(
          (res) => {
            this.reportData = res.data.practiceData;
            this.growthData = res.data.growthData;
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
  }
 
  getSessionReport() {
    this.districtService.studentWithAboveAndBelowAverageActivity("week").subscribe((res) => {
      if (res && res.data && res.status == 200) {
        this.sessionData = res.data;
        this.donutChart = [];
        this.donutChart.push({
          label: 'Above average',
          strokeDasharray: res.data.aboveAveragePercent + ' ' + (100 - res.data.aboveAveragePercent),
          strokeDashoffset: '25'
        });

        this.donutChart.push({
          label: 'Inactive',
          strokeDasharray: res.data.inactiveStudentPercent + ' ' + (100 - res.data.inactiveStudentPercent),
          strokeDashoffset: (100 - (100 - res.data.inactiveStudentPercent) + 25).toString(),
        });

        this.donutChart.push({
          label: 'Below average',
          strokeDasharray: res.data.belowAveragePercent + ' ' + (100 - res.data.belowAveragePercent),
          strokeDashoffset: (100 - (100 - res.data.belowAveragePercent) + parseInt(this.donutChart[1].strokeDashoffset)).toString()
        });
      }

    },
      (error) => {
        console.log(error);
      })
  }
    
}
