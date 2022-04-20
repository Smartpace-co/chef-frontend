import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomRegex } from '@appcore/validators/custom-regex';
import * as _ from 'lodash';
import { ClassesService } from '@modules/teacher/services/classes.service';
import { 
  faAngleDoubleRight,
  faHome,
  faDollarSign,
  faBuilding,
  faCog,
  faUserFriends,
  faGraduationCap,
  faUserShield ,
  faTools,
  faQuestion,
  faLifeRing,
  faUniversity,
  faUsers,
  faUserPlus,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '@modules/auth/services/auth.service';
import { SchoolService } from '@modules/school/services/school.service';
import { TeacherInstructionsComponent } from '@modules/teacher/components/teacher-instructions/teacher-instructions.component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from '@appcore/services/toaster.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('proceedMembershipClassModal') proceedMembershipClassModal: ElementRef;

  currentUser:string;
  teachersCount:any
  closeModal:any
  closeModal1:any
  classCount:any
  activateUserData:any
  studentsCount:any
  NextArrow = faAngleDoubleRight;
  home = faHome;
  billing = faDollarSign;
  profile = faHome;
  membership = faHome;
  schools = faBuilding;
  classes = faHome;
  reports = faHome;
  settings =  faCog;
  users = faUserFriends;
  student =faGraduationCap;
  teachers = faHome;
  roles =faUserShield;
  troubleshooting = faTools;
  faq = faQuestion;
  help = faLifeRing;
  issue = faHome;
  discussion = faHome;
  faUniversity=faUniversity;
  faUsers= faUsers;
  faUserPlus=faUserPlus;
  faPlus= faPlus;
   menubarStatus: boolean = false;
   teacherList = [];
   selectedValue = [];
  selectedStandard = null
  selectedTeacherValue = [];
  selectedTeacher = null;
  selectedStudentValue = [];
  selectedStudent = null
  standardList = [];
  allStudentList = [];
  studentList=[]
  gradeList = [];
  reportData: any;
  growthData: any;
  mins:any;
  hrs:any
  inactiveStudents: any;
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

   menuList=[
     {
       id:'1',
       name:'Home',
       icon: this.home,
       type:'menu',
       status:'active'
     },
     {
      id:'2',
      name:'DISTRICT',
      icon:'',
      type:'heading',
      status:''
    },
    {
      id:'3',
      name:'Billing',
      icon:this.billing,
      type:'menu',
      status:''
    },
    {
      id:'4',
      name:'Profile',
      icon:this.profile,
      type:'menu',
      status:''
    },
    {
      id:'5',
      name:'Membership',
      icon:this.membership,
      type:'menu',
      status:''
    },
    {
     id:'6',
     name:'SCHOOLS',
     icon:'',
     type:'heading',
     status:''
   },
   {
     id:'7',
     name:'Schools',
     icon:this.schools,
     type:'menu',
     status:''
   },
   {
     id:'8',
     name:'Reports',
     icon:this.reports,
     type:'menu',
     status:''
   },
   {
     id:'9',
     name:'CLASSES',
     icon:'',
     type:'heading',
     status:''
   },
   {
     id:'10',
     name:'Classes',
     icon:this.classes,
     type:'menu',
     status:''
   },
   {
     id:'11',
     name:'Reports',
     icon:this.reports,
     type:'menu',
     status:''
   },
   {
    id:'12',
    name:'CONTENT',
    icon:'',
    type:'heading',
    status:''
  },
  {
    id:'13',
    name:'Settings',
    icon:this.settings,
    type:'menu',
    status:''
  },
  {
    id:'14',
    name:'Reports',
    icon:this.reports,
    type:'menu',
    status:''
  },
  {
    id:'15',
    name:'USERS',
    icon:'',
    type:'heading',
    status:''
  },
  {
    id:'16',
    name:'Users',
    icon:this.users,
    type:'menu',
    status:''
  },
  {
    id:'17',
    name:'Student',
    icon:this.student,
    type:'menu',
    status:''
  },
  {
    id:'18',
    name:'Teachers',
    icon:this.teachers,
    type:'menu',
    status:''
  },
  {
    id:'19',
    name:'Roles',
    icon:this.roles,
    type:'menu',
    status:''
  },
  {
    id:'20',
    name:'Reports',
    icon:this.reports,
    type:'menu',
    status:''
  },
  {
    id:'21',
    name:'SUPPORTS',
    icon:'',
    type:'heading',
    status:''
  },
  {
    id:'22',
    name:'Troubleshooting',
    icon:this.troubleshooting,
    type:'menu',
    status:''
  },
  {
    id:'23',
    name:'FAQ',
    icon:this.faq,
    type:'menu',
    status:''
  },
  {
    id:'24',
    name:'Report an Iissue',
    icon: this.issue,
    type:'menu',
    status:''
  },
  {
    id:'25',
    name:'Get Help',
    icon:this.help,
    type:'menu',
    status:''
  },
  {
    id:'26',
    name:'Discussion Forum',
    icon:this.discussion,
    type:'menu',
    status:''
  }
  ]
  createClassForm: any;
  gradeTitle = 'Select the grade';
  schoolTitle = 'Select School';
  classesListtitle = "All Classes";
  SortByGradeTitle = "Sort by Grade";
  schoolDetails:any
  closeResult = '';
  loggedInUser;

  subjectList = [];
  selectedSubjectValue = [];
  selectedSubject = null;
 // strikeCheckout:any = null; 
  constructor(private authService:AuthService,
    private schoolService:SchoolService,
    private router:Router,
    private toast: ToasterService,
    private modalService: NgbModal,
    private classService : ClassesService) { }

  ngOnInit(): void {
    this.loggedInUser =  JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.schoolService.getSchoolDetailsByUserId(this.loggedInUser.id).subscribe(
      (response) => {
        if (response && response.data) {
          this.schoolDetails = response.data[0];
          this.getPracticeAndGrowthReport(this.schoolDetails.id);
          this.getAllActiveTeachers(this.schoolDetails.id);
          this.getTeachersCount();
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
    this.authService.currentUser.subscribe((data: any) => {
      if (data) {
      this.activateUserData=data
        this.currentUser = data.admin_account_name ? data.admin_account_name : undefined;
      } 
    });
    this.getAllClassList();
    this.getAllGradeList();
    this.getStudentList();
    this.getAllLearningStandards();  
    
    this.createClassForm = new FormGroup({
   
      teacherName: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required, this.validateClassName.bind(this)]),
      grade: new FormControl([], [Validators.required]),
      standards: new FormControl(''),
      subjects: new FormControl('', [Validators.required]),
      students: new FormControl('')
    });
    this.authService.setuserlang();

    this.getStudentsCount()
    this.getInactiveStudents();
    this.getTopActiveStudents('week');
    this.getSessionReport()
    this.getSubjectList();
  }
  get formControl() {
    return this.createClassForm.controls;
  }
  /**
   * function to Change language 
   */
  
  openMenu(){
      this.menubarStatus = !this.menubarStatus;       
  }
  getTeachersCount(){
    if(this.schoolDetails.id)
    {
    this.schoolService.getAllTeacher(undefined,this.schoolDetails.id).subscribe(
      (response) => {
        if(response && response.data.rows)
        {
          this.teachersCount=response.data.rows.length;
        }

    });  
  }
  }
 
  getStudentsCount(){
    
    this.schoolService.getAllStudents(undefined).subscribe((response) => {
      if(response && response.data.rows)
      {
      this.studentsCount=response.data.rows.length
      }
      
    })
  }

  addSchool(){
    this.router.navigate(["/school/add-schools"])
  }

  addUser(){
    this.router.navigate(["/school/add-user"])
  }


  open(content) {
    if (this.activateUserData) {
      this.schoolService.verifyMaxUserCountClass(this.activateUserData.id, this.activateUserData.role.id).subscribe((res) => {
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
  closeOpenModal() {
    this.closeModal.close();
    this.resetForm();
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
    this.selectedSubjectValue = [];
    this.selectedSubject = null;
  }
  
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
  // classFilter(item: any): void {
  //   this.classesListtitle = item.menu;
  //   if (item && item.id) {
  //     this.getAllClassList(item.id);
  //   } else {
  //     this.getAllClassList();
  //   }
  // }
  // gradeFilter(event) {
  //   this.SortByGradeTitle = event.menu;
  //   if (event && event.value) {
  //     this.getAllClassList(undefined, event.value);
  //   } else {
  //     this.getAllClassList();
  //   }
  // }

  
/**
 * API call to get all classes.
 */
 getAllClassList(): void {
  this.schoolService.getAllClasses(1).subscribe(
    (response) => {
      if (response && response.data && response.data.rows) {
        this.classCount=response.data.rows.length
      }
    },
    (error) => {
      console.log(error);
      this.toast.showToast(error.error.message, '', 'error');
    }
  );
}

  getAllActiveTeachers(schoolId): void {
    this.schoolService.getAllTeacher(1,schoolId).subscribe(
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

  // getSchoolList(): void {
  //   this.schoolService.getSchools(1).subscribe(
  //     (response) => {
  //       if (response && response.data && response.data.rows) {
  //         this.schoolList = _.map(response.data.rows, item => {
  //           let obj = {
  //             id: item.school.id,
  //             menu: item.school.name
  //           }
  //           return obj;
  //         });
  //       }
  //     },
  //     (error) => {
  //       console.log(error);
  //       this.toast.showToast(error.error.message, '', 'error');
  //     }
  //   );
  // }
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
  /**
   * To get student list.
   *
   */
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
        district_id: JSON.parse(localStorage.getItem('schoolDetails')).district_id,
        grade_id: formData.grade.id,
        school_id: this.schoolDetails.id,
        assigned_teacher_ids: teacher,
        assigned_standard_subject_group_ids : formData.subjects,
        assigned_standard_ids: stdList,
        assigned_student_ids: students
      };
      this.schoolService.addClassDetails(submission).subscribe(
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
  onProceed() {
    this.closePopup();
    this.router.navigate(['/school/edit-membership']);

  }
  closePopup(): void {
    this.closeModal1.close();
  }
  addStudents()
  {
    this.router.navigate(['/school/add-student']);

  }
  addTeachers()
  {
    this.router.navigate(['/school/add-teacher']);

  }
  getPracticeAndGrowthReport(schoolId) {
    this.schoolService.getPracticeAndGrowthReport(schoolId).subscribe((res) => {
      this.reportData = res.data.practiceData;
      this.growthData = res.data.growthData;
    },
      (error) => {
        console.log(error);
      })
  }

  getInactiveStudents() {
    this.schoolService.getInactiveStudents().subscribe((res) => {
      if (res && res.data) {
        if(res.data.count==0)
          this.inactiveStudents=0
        else
           this.inactiveStudents=res.data.count
      }
    });
  }

  getTopActiveStudents(duration) {
    this.schoolService.getAllStudents(1).subscribe((response) => {
      _.map(response.data.rows, (item) => {
        this.schoolService.getTopActiveSessionStudents(duration, item.id).subscribe((res) => {
          if (res && res.data) {
            let score = res.data.count;
           if(score==0)
             this.mins=0
           else
            _.map(res.data.rows, (objItem) => {
              this.mins = (this.mins + objItem.session_mins / score)/60;
              this.hrs=parseFloat(this.mins).toFixed(2) +" hr";

            });
          }
        });
      });
    });
   
  }

  /*studentWithAboveAndBelowAverageActivity(){
    this.schoolService.studentWithAboveAndBelowAverageActivity("week").subscribe((response) => {
      if(response && response.data)
      {
        this.studentWithBelowAverage=response.data.studentWithBelowAverage
        this.studentWithAboveAverage=response.data.studentWithAboveAverage
      }
     

    });
  }*/

  getSessionReport() {
    this.schoolService.studentWithAboveAndBelowAverageActivity("week").subscribe((res) => {
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
