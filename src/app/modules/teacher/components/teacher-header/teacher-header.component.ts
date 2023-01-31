
import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { environment } from '@environments/environment';
import { ToasterService } from '@appcore/services/toaster.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  faArchive,
  faChartLine,
  faCoffee,
  faCog,
  faDollarSign,
  faEdit,
  faExclamationTriangle,
  faHome,
  faLifeRing,
  faPlus,
  faPlusSquare,
  faShapes,
  faSignOutAlt,
  faTrash,
  faUser,
  faUsers,
  faTimes,
  faSearch,
  faCheck,
  faSync
} from '@fortawesome/free-solid-svg-icons';
declare var $: any;
import { UtilityService } from '@appcore/services/utility.service';
import { ClassesService } from '@modules/teacher/services/classes.service';
import * as _ from 'lodash';
import { TeacherService } from '@modules/teacher/services/teacher.service'
import { NotificationService } from '@shared/services/notification.service';
import { TranslationService } from '@appcore/services/translation.service';
import { DistrictService } from '@modules/district/services/district.service';
import { forkJoin, Subscription } from 'rxjs';
@Component({
  selector: 'app-teacher-header',
  templateUrl: './teacher-header.component.html',
  styleUrls: ['./teacher-header.component.scss']
})
export class TeacherHeaderComponent implements OnInit, OnDestroy {

  @ViewChild('archive') archiveModal: ElementRef;
  @ViewChild('create') createModal: ElementRef;
  @ViewChild('delete') deleteModal: ElementRef;
  @ViewChild('join') joinModal: ElementRef;
  @ViewChild('closeButton') closeButton;
  @ViewChild('proceedMembershipClassModal') proceedMembershipClassModal: ElementRef;

  /**
   * Icon Initialisation
   */
  faCoffee = faCoffee;
  userIcon = faUsers;
  Home = faHome;
  Assignment = faShapes;
  Roster = faUser;
  Performance = faChartLine;
  Settings = faCog;
  exclamationTriangle = faExclamationTriangle;
  PlusIcon = faPlus;
  timesIcon = faTimes;
  explore = faSearch;
  check = faCheck;
  teacherId: number;
  selectedValue = [];
  selectedSubject = null
  PerformanceTitle = "Performance";
  membershipUserRoleId: any;
  closeModal1;
  id:any
  SyncIcon = faSync;

  // stickyNote = faStickyNote;
  // eye = faEye;
  // cart = faCartPlus;
  // info = faInfoCircle;
  // leftArrow = faAngleLeft;
  /**
   * Class-list
   */
  dropDownMenuTitle;
  dropDownIconMain = faUsers;
  dropDownMenuList = [];
  profilePic: string;
  userDetails: any;
  notificationCount = 0;
  icon = faCheck;
  subscription: Subscription;
  /**
   * User Profile
   */
  ProfileMenu;
  ProfileMenuList = [];

  /**
   * More Action
   */
  SettingTitle = 'More Actions';
  SettingIconMain = faCog;
  SettingList = [];

  /**
   * Create Class - Grade List
   */
  GradeTitle = 'Select Grade';
  GradeList = [];

  closeResult = '';
  createClass: FormGroup;
  deleteClassForm: FormGroup;
  joinClassForm: FormGroup;

  public assetPath = environment.assetUrl;
  localData: any;
  classList = [];
  selectedClassListID;
  selectedClassAccesCode: any;
  membershipUserId: any;
  closeModal;
  subjectList = [];
  classLabel = 'create';
  teacherDetails: any;
  teacherData:any;
  PerformanceList = [];
  isLoading: boolean = false;
  userId: number;
  isCleverUser: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToasterService,
    private modalService: NgbModal,
    private classService: ClassesService,
    private utilityService: UtilityService,
    private teacherService: TeacherService,
    private translate: TranslationService,
    private notificationService: NotificationService,
    private districtService: DistrictService,
  ) { this.profilePic = './assets/images/user-profile.png' }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.localData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.userId =this.localData.id;
    this.isCleverUser = this.localData.from_clever || false;
    this.teacherService.getProfileObs().subscribe(profile => this.teacherDetails = profile);
    // if (this.localData.language) this.teacherService.setUserLanguage(this.localData.language.key);
    this.authService.getLanguage().subscribe((lang: any) => {
      if (lang) {
        this.SettingTitle = this.translate.getStringFromKey('teacher.dashboard.more-action');
          this.PerformanceTitle = this.translate.getStringFromKey('teacher.dashboard.performance');
          this.GradeTitle = this.translate.getStringFromKey('school.class.add-class.grade-field-placeholder');
          
          const signoutObj = {
            id: '9',
            menu: this.translate.getStringFromKey('teacher.profile-menu.signout'),
            value: 'signout',
            link: '',
            icon: faSignOutAlt,
            isSubscriptionPause: false
          };

          const cleverSync = {
            id: '9',
            menu: 'Sync Class with Clever',
            value: 'sync',
            link: '',
            icon: faSync,
            isSubscriptionPause: false
          }
          
          this.ProfileMenuList = [
            {
              id: '1',
              menu: this.translate.getStringFromKey('teacher.profile-menu.profile'),
              value: 'profile',
              icon: faUser,
              isSubscriptionPause: false
            },
            {
              id: '2',
              menu: this.translate.getStringFromKey('teacher.profile-menu.billing'),
              value: 'billing',
              link: 'teacher/billing',
              icon: faDollarSign,
              isSubscriptionPause: false
            },
            {
              id: '3',
              menu: this.translate.getStringFromKey('teacher.profile-menu.membership'),
              value: 'membership',
              link: 'teacher/membership-details',
              icon: faUsers,
              isSubscriptionPause: false
            },
            {
              id: '4',
              menu: this.translate.getStringFromKey('teacher.profile-menu.joinClass'),
              value: 'joinClass',
              link: '',
              icon: faPlusSquare,
              isSubscriptionPause: false
            },
            {
              id: '5',
              menu: this.translate.getStringFromKey('teacher.profile-menu.archivedClasses'),
              value: 'archivedClasses',
              link: '',
              icon: faArchive,
              isSubscriptionPause: false
            },
            {
              id: '6',
              menu: this.translate.getStringFromKey('teacher.profile-menu.settings'),
              value: 'settings',
              link: 'teacher/setting',
              icon: faCog,
              isSubscriptionPause: false
            },
            {
              id: '7',
              menu: this.translate.getStringFromKey('teacher.profile-menu.discussionForum'),
              value: 'discussionForum',
              link: 'teacher/discussion-forum',
              icon: faUsers,
              isSubscriptionPause: false
            },
            {
              id: '8',
              menu: this.translate.getStringFromKey('teacher.profile-menu.help'),
              value: 'help',
              link: 'teacher/get-help',
              icon: faLifeRing,
              isSubscriptionPause: false
            } 
          ];


          if(this.localData.from_clever){
            const newEl = [cleverSync, {...signoutObj, id: '10'}]
            this.ProfileMenuList = this.ProfileMenuList.concat(newEl)
          }else {
            this.ProfileMenuList.push(signoutObj)
          }

        this.PerformanceList = [
          {
            id: '1',
            menu: this.translate.getStringFromKey('teacher.performance.by-student.performance-by-standards'),
            // icon: faCheck
          },
          {
            id: '2',
            menu: this.translate.getStringFromKey('teacher.performance.by-student.performance-by-assignments'),
            // icon: ''
          },
          {
            id: '3',
            menu: this.translate.getStringFromKey('teacher.performance.by-student.performance-by-students')
            // icon: ''
          }
        ]

        if (this.SettingList.length > 0) {
          this.SettingList = [
            {
              id: '1',
              menu: this.translate.getStringFromKey('teacher.dashboard.class-setting'),
              value: 'class_setting',
              icon: faCog
            },
            {
              id: '2',
              menu: this.translate.getStringFromKey('teacher.dashboard.edit-class'),
              value: 'edit',
              icon: faEdit
            },
            {
              id: '3',
              menu: this.translate.getStringFromKey('teacher.dashboard.archive-class'),
              value: 'archive',
              icon: faArchive
            },
            {
              id: '4',
              menu: this.translate.getStringFromKey('teacher.dashboard.delete-class'),
              value: 'delete',
              icon: faTrash
            }
          ];
        }

      }

    });

    if (this.localData.isSubscriptionPause == true) {
      // this.ProfileMenuList[0].isSubscriptionPause=true;
      this.ProfileMenuList[1].isSubscriptionPause = true;
      // this.ProfileMenuList[2].isSubscriptionPause=true;
      this.ProfileMenuList[3].isSubscriptionPause = true;
      this.ProfileMenuList[4].isSubscriptionPause = true;
      this.ProfileMenuList[5].isSubscriptionPause = true;
      this.ProfileMenuList[6].isSubscriptionPause = true;
      this.ProfileMenuList[7].isSubscriptionPause = true;
      // this.ProfileMenuList[8].isSubscriptionPause=true;
    }

    this.initalizeClassForm();

    this.deleteClassForm = new FormGroup({
      delete: new FormControl('', [Validators.required])
    });

    this.joinClassForm = new FormGroup({
      teacherId: new FormControl('', [Validators.required]),
      accessCode: new FormControl('', [Validators.required])
    });
    this.subscription = this.teacherService.getNotificationCount().subscribe((data) => {
      this.notificationCount = data.notificationCount;
    });
    // Get the sessionStoarge data
    this.getTeacherData();
    this.getGradeList();
    this.getSubjectList();

  }

  syncData(){
    this.isLoading = true;
    let email = this.localData.email;
    this.teacherService.syncClassesByTeacher(this.userId, email).subscribe((res)=> {
      this.isLoading = false;
      const newData = {...this.localData, ...res.data}
      sessionStorage.setItem('currentUser', JSON.stringify(newData));
      this.toast.showToast(res.message, '', 'success');
      window.location.reload();
    },
    (error)=> {
      this.isLoading = false;
      this.toast.showToast(error.error.message, '', 'error');
    })

  }


  initalizeClassForm() {
    this.createClass = new FormGroup({
      district_id: new FormControl(''),
      school_id: new FormControl(''),
      title: new FormControl('', [Validators.required]),
      grade_id: new FormControl('', [Validators.required]),
      assigned_teacher_ids: new FormControl('', [Validators.required]),
      assigned_standard_subject_group_ids: new FormControl('',[Validators.required]),
      assigned_standard_ids:new  FormControl([]),
      assigned_student_ids: new FormControl([]),
      status: new FormControl(true, [Validators.required])
    });
  }

  get formControl() {
    return this.createClass.controls;
  }

  fakeData() {
    this.classService.getAll().subscribe((data: any) => {
    });
  }

  /**
   * This method will get class list of logged-in teacher-user for showing header and sub header
   */
  getClassList(teacherId) {
    // API call to fetch class list
    this.classService.getClassList(teacherId).subscribe((response: any) => {
      // this.ProfileMenu = element.username;
      if (response && response.data && response.data.count > 0) {
        this.classList = _.map(response.data.rows, item => {
          let obj = {
            id: item.id,
            menu: item.title,
            classGrade: item.grade_id,
            classSubjects: item.selectedSubject,
            classStatus: item.status,
            access_code: item.access_code,
            type: 'classList',
            link: '',
            icon: faUsers
          }
          return obj;
        });
        this.selectedClassListID = response.data.rows[response.data.rows.length - 1].id;
        this.selectedClassAccesCode = response.data.rows[response.data.rows.length - 1].access_code;


        this.teacherService.setSelectedClassId(this.selectedClassListID);
        this.teacherService.setSelectedClassAccesCode(this.selectedClassAccesCode);


        this.dropDownMenuTitle = response.data.rows[response.data.rows.length - 1].title;
        this.dropDownMenuList = this.classList;

        this.SettingList = [
          {
            id: '1',
            menu: this.translate.getStringFromKey('teacher.dashboard.class-setting'),
            value: 'class_setting',
            icon: faCog
          },
          {
            id: '2',
            menu: this.translate.getStringFromKey('teacher.dashboard.edit-class'),
            value: 'edit',
            icon: faEdit
          },
          {
            id: '3',
            menu: this.translate.getStringFromKey('teacher.dashboard.archive-class'),
            value: 'archive',
            icon: faArchive
          },
          {
            id: '4',
            menu: this.translate.getStringFromKey('teacher.dashboard.delete-class'),
            value: 'delete',
            icon: faTrash
          }
        ];
      }
    }, (error) => {
      console.log(error);
      this.toast.showToast(error.error.message, '', 'error');
    });

  }

  /**
   * This method will get infomation w.r.t classID
   * @param classID
   */
  getClassInfo(classID) {
    // this.subjectList = [];
    // Get class detail of given id
    this.selectedValue = []; // clear selected value of multiselect
    // this.selectedSubject = null;
    this.classService.getClassInfo(classID).subscribe((response: any) => {
      if (response && response.data) {
        if (response.data.id === classID) {
          this.createClass.get('title').setValue(response.data.title);
          this.createClass.get('grade_id').setValue(response.data.grade.id);
          this.GradeTitle = response.data.grade.grade;
          if (response.data.class_standard_subject_groups.length > 0) {
          response.data.class_standard_subject_groups.forEach((data) => {
              this.selectedValue.push({
                item_id: data.id,
                item_text: data.subjectTitle,
                subject:data.subject
              });
            });
   
          this.selectedSubject = this.selectedValue;
          this.createClass.get('assigned_standard_subject_group_ids').setValue(this.selectedSubject.map(obj => obj.item_id));

          }
          this.createClass.get('status').setValue(response.data.status);
        }
      }
    },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      });
  }

  /**
   * Open a modal for respective action of class @param content
   */
  open(content) {
    if (this.localData) {
      if(this.localData.parentId)
      {
        this.membershipUserId=this.localData.parentId
        this.teacherService.getUserDetailsByID(this.localData.parentId).subscribe((parentDetailsResponse) => {
          if(parentDetailsResponse.data)
          {
            this.membershipUserRoleId=parentDetailsResponse.data.role.id
            this.teacherService.verifyMaxUserCountClass(this.membershipUserId, this.membershipUserRoleId).subscribe((res) => {
              if(res.status==200)
              {
                this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'create-class-modal' });
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
          //  this.resetForm();
            this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
         
      }

    }
  }


  getTeacherData() {
    this.classService.getTeacherData(this.localData.id).subscribe((response: any) => {
      if (response && response.data) {
        // console.log(response.data);

      //  this.teacherDetails = response.data;
      let details={
        profile_image:response.data.profile_image,
        first_name:response.data.teacher.first_name,
        last_name:response.data.teacher.last_name,
      } 
      this.teacherDetails=details
      this.teacherData=response.data

        this.getCount();
        this.teacherService.setTeacherDetails(this.teacherDetails);
        // console.log("tecaherdata",response.data);

        this.createClass.get('assigned_teacher_ids').setValue([response.data.teacher.id]);

        if (response.data.teacher.district_id)
          this.createClass.get('district_id').setValue(response.data.teacher.district_id);

        if (response.data.teacher.school)
          this.createClass.get('school_id').setValue(response.data.teacher.school.id);

        this.teacherId = response.data.teacher.id;
        this.joinClassForm.get('teacherId').setValue(this.teacherId);

        this.getClassList(this.teacherId);

      }
    }, (error) => {
      console.log(error);
      this.toast.showToast(error.error.message, '', 'error');
    });
  }

  /**
  * To get count of notifications.
  */
  getCount(): void {
    // console.log("tecaherdeta", this.teacherDetails);
    this.notificationService.getNotificationCount(this.teacherData.id, this.teacherData.role.id).subscribe(
      (response) => {
        this.notificationCount = response.data;
        this.teacherService.sendNotificationCount(this.notificationCount);
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }


  // This method will fetch grade list for dropdown in create/edit class

  getGradeList() {
    this.classService.getGradeList().subscribe((response: any) => {
      if (response && response.data) {
        this.GradeList = _.map(response.data, item => {
          let obj = {
            id: item.id,
            menu: item.grade,
            link: ''
          }
          return obj;
        });
      }
    }, (error) => {
      console.log(error);
      this.toast.showToast(error.error.message, '', 'error');
    });
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

  /**
   * This method will create new class for logged in teacher user.
   * Need to integrate API call here
   */
  addClass() {
    const classListcount = this.classList.length + 1;
    if (this.createClass.invalid) {
      this.toast.showToast('Please enter information for required fields', '', 'error');
      //  return;
    } else {
      if (this.classLabel === 'create') {
        let omitArray = [];
        if (this.localData.parentId) {
          this.id = this.localData.parentId
  
        }
        else {
          this.id = this.localData.id;
  
        }
        this.createClass.value.parent_id=this.id
        if (!this.createClass.value.district_id) omitArray.push("district_id");
        if (!this.createClass.value.school_id) omitArray.push("school_id");
        const submission = _.omit(this.createClass.value, omitArray);

        this.classService.addClass(submission).subscribe((response: any) => {
          if (response && response.data && response.status === 200) {
            this.getClassList(this.teacherId);
            this.closeModal.close();
            this.toast.showToast('Class Created Successful', '', 'success');
            this.classService.setClassListObs(this.classList);
            this.resetForm();
            this.router.navigate(['teacher/dashboard']);
          }
          (error) => {
            console.log(error);
            this.toast.showToast(error.error.message, '', 'error');
          }
        }, (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        });
      } else if (this.classLabel === 'edit') {
        const submission = _.omit(this.createClass.value, ["district_id", "school_id", "assigned_student_ids"]);
        //const submission = _.omit(this.createClass.value, ["district_id", "school_id", "assigned_student_ids","ela_subject_ids","math_subject_ids","ngss_subject_ids","ncss_subject_ids"]);

        this.classService.updateClass(this.selectedClassListID, submission).subscribe((response: any) => {
          if (response && response.data && response.status === 200) {
            this.getClassList(this.teacherId);
            this.closeModal.close();
            this.toast.showToast('Class Updated Successful', '', 'success');
            this.resetForm();
            this.classLabel = 'create';
          }
          (error) => {
            console.log(error);
            this.toast.showToast(error.error.message, '', 'error');
          }
        }, (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        });

      }
    }
  }

  joinClass() {
    this.teacherService.joinClass(this.joinClassForm.value).subscribe(
      (data) => {
        this.getClassList(this.teacherId);
        this.dropDownMenuList = this.classList;
        this.closeModal.close();
        this.toast.showToast('Join Class Successful', '', 'success');
      },
      (error) => {
        this.toast.showToast(error, '', '');
      }
    );
  }

  /**
   * this method will change the class status to archive
   */
  archiveClass() {
    this.teacherService.archiveClass(this.selectedClassListID).subscribe(
      (data) => {
        this.dropDownMenuList = this.classList;
        this.closeModal.close();
        this.toast.showToast('Class Archived Successful', '', 'success');
      },
      (error) => {
        this.toast.showToast(error, '', '');
      }
    );
  }

  /**
   * This method will delete the selected class
   */
  deleteClass() {
    if (this.deleteClassForm.invalid) {
      return;
    } else {
      let deleteText = this.deleteClassForm.value.delete.toUpperCase();
      if (deleteText === "DELETE") {
        this.teacherService.deleteClass(this.selectedClassListID).subscribe(
          (data) => {
            this.classList.forEach((element, index) => {
              if (element.id === this.selectedClassListID) {
                this.classList.splice(index, 1);
              }
            });
            if (this.classList.length > 0) {
              this.dropDownMenuList = this.classList;
              this.dropDownMenuTitle = this.classList[0].menu;
              this.selectedClassListID = this.classList[0].id;
            }
            this.closeModal.close();
            this.toast.showToast('Class Deleted Successful', '', 'success');
          },
          (error) => {
            this.toast.showToast(error, '', '');
          }
        );
      } else {
        this.toast.showToast('Enter delete value', '', '');
      }
    }
  }

  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }

  /**
   *
   * This method will register dropdown value change @param event
   */
  onDropdownValueChange(event) {
    if (event.value === 'profile') {
      this.router.navigate(['/teacher/user-profile'])
    } else if (event.id === '4') {
      this.open(this.joinModal);
    } else if (event.id === '5') {
      this.router.navigate(['teacher/archived-classes']);
    } else if (event.value === 'signout') {
      this.authService.logoutUser().subscribe(
        (data) => {
          if (data) {
            this.toast.showToast('Logout Successful', '', 'success');
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (event.type === 'classList') {
      this.selectedClassListID = event.id;
      this.teacherService.setSelectedClassId(this.selectedClassListID);

      this.selectedClassAccesCode = event.access_code;
      this.teacherService.setSelectedClassAccesCode(this.selectedClassAccesCode);
      this.teacherService.emitNavChangeEvent(event.id);
      this.dropDownMenuTitle = event.menu;
      this.router.navigate(['teacher/dashboard']);
    } else if (event.value === 'settings') {
      this.router.navigate(['teacher/setting']);
    }
    else if (event.value === 'discussionForum') {
      this.router.navigate(['teacher/discussion-forum']);
    }else if (event.value === 'help') {
      this.router.navigate(['teacher/get-help']);
    }
    else if (event.value === 'billing') {
      this.router.navigate(['teacher/billing']);
    } else if (event.value === 'membership') {
      this.router.navigate(['teacher/membership-details']);
    } else if( event.value === 'sync'){
      this.syncData();
    }
  }

  OnProfileMenuListDropdownChange(event) {
    if (event.value === 'archive') {
      this.open(this.archiveModal);
    } else if (event.value === 'edit') {
      this.classLabel = 'edit';
      this.open(this.createModal);
      this.getClassInfo(this.selectedClassListID);
    } else if (event.value === 'class_setting') {
      this.router.navigate(['teacher/class-info']);
    } else if (event.value === 'delete') {
      this.open(this.deleteModal);
    } else if (event.value === 'settings') {
      this.router.navigate(['teacher/setting']);
    }

  }

  onReportListClick(event) {
    this.PerformanceList.forEach((element) => {
      if (element.id == event.id) {
        element['icon'] = this.icon;
      } else {
        element['icon'] = '';
      }
    });

    console.log(event);

    this.teacherService.sendReportTypeId(event.id);
    this.router.navigate(['teacher/teacher-performance', event.id]);
    setTimeout(() => {
      this.getCount();
    }, 100);


    // this.teacherService.setReportId(event.id);

  }

  /**
   * This method will register - GradeList dropdown value change @param event
   */
  onGradeListDropdownValueChange(event) {
    this.GradeTitle = event.menu;
    this.createClass.get('grade_id').setValue(event.id);
  }

  onSelectSubject(item) {
    this.selectedValue.push(item);
    this.selectedSubject = this.selectedValue;
    this.createClass.get('assigned_standard_subject_group_ids').setValue(this.selectedSubject.map(obj => obj.item_id));
  }

  onDeSelectSubject(index) {
    this.selectedValue = [];
    this.selectedSubject = this.selectedSubject.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
    this.selectedValue = this.selectedSubject;
  /*   this.selectedSubject.splice(index, 1);
    this.selectedValue = this.selectedSubject; */
    this.createClass.get('assigned_standard_subject_group_ids').setValue(this.selectedSubject.map(obj => obj.item_id));
  }

  onSelectAllSubject(item) {
    this.selectedValue = [];
    this.selectedValue = item;
    this.selectedSubject = this.selectedValue;

    // assign selected subjects id to array
    this.createClass.get('assigned_standard_subject_group_ids').setValue(this.selectedSubject.map(obj => obj.item_id));
  }

  onDeselectAllSubject(item) {
    this.selectedValue = item;
    this.createClass.get('assigned_standard_subject_group_ids').setValue('');
  }


  closeOpenModal() {
    this.closeModal.close();
    this.resetForm();
  }

  resetForm() {
    this.selectedValue = [];
    this.selectedSubject = null;
    this.classLabel = 'create';
    this.GradeTitle = 'Select Grade';
    this.createClass.controls.title.setValue('');
    this.createClass.controls.grade_id.setValue('');
    this.createClass.controls.status.setValue(true);
  }

  closePopup(): void {
    this.closeModal1.close();
  }

  /**
   * Future use
   */
  // openCreateClassModal(modalName) {
  //   const modalRef = this.modalService.open(ModalComponent, { ariaLabelledBy: 'modal-basic-title', centered: true });
  //   (modalRef.componentInstance.title = modalName), (modalRef.componentInstance.id = '1');
  //   modalRef.result.then(
  //     () => this.getClassList(),
  //     () => {}
  //   );
  // }

  onProceed() {
    this.closePopup();
    this.router.navigate(['/teacher/edit-membership']);

  }

/*   onSelect(item, type) {
    switch (type) {
      case 'ela':
        this.selectedElaSubjectValue.push(item);
        this.selectedElaSubject= this.selectedElaSubjectValue;   
        this.onChange()
        break;
      case 'math':
        this.selectedMathSubjectValue.push(item);
        this.selectedMathSubject= this.selectedMathSubjectValue;   
        this.onChange()     
        break;
      case 'ngss':
        this.selectedNgssSubjectValue.push(item);
        this.selectedNgssSubject= this.selectedNgssSubjectValue; 
        break;
      case 'ncss':
        this.selectedNcssSubjectValue.push(item);
        this.selectedNcssSubject= this.selectedNcssSubjectValue; 
        this.onChange()       
        break;

    }
  }

  onDeSelect(index, type) {
    switch (type) {
      case 'ela':
        this.selectedElaSubjectValue = [];
        this.selectedElaSubject = this.selectedElaSubject.filter(function (obj) {
          return obj.item_id !== index.item_id;
        });
        this.selectedElaSubjectValue = this.selectedElaSubject;
        this.onChange()

        break;
      case 'math':
        this.selectedMathSubjectValue = [];
        this.selectedMathSubject = this.selectedMathSubject.filter(function (obj) {
          return obj.item_id !== index.item_id;
        });
        this.selectedMathSubjectValue = this.selectedMathSubject;
        this.onChange()
        break;
      case 'ngss':
        this.selectedNgssSubjectValue = [];
        this.selectedNgssSubject = this.selectedNgssSubject.filter(function (obj) {
          return obj.item_id !== index.item_id;
        });
        this.selectedNgssSubjectValue = this.selectedNgssSubject;
        this.onChange()
        break;
      case 'ncss':
        this.selectedNcssSubjectValue = [];
        this.selectedNcssSubject = this.selectedNcssSubject.filter(function (obj) {
          return obj.item_id !== index.item_id;
        });
        this.selectedNcssSubjectValue = this.selectedNcssSubject;
        this.onChange()
        break;

    }


  }

  onSelectAll(item, type) {
    switch (type) {
      case 'ela':
        this.selectedElaSubjectValue = [];
        this.selectedElaSubjectValue = item;
        this.selectedElaSubject = this.selectedElaSubjectValue;
        this.onChange()
        break;
      case 'math':
        this.selectedMathSubjectValue = [];
        this.selectedMathSubjectValue = item;
        this.selectedMathSubject = this.selectedMathSubjectValue;
        this.onChange()
        break;
      case 'ngss':
        this.selectedNgssSubjectValue = [];
        this.selectedNgssSubjectValue = item;
        this.selectedNgssSubject = this.selectedNgssSubjectValue;
        this.onChange()
        break;
      case 'ncss':
        this.selectedNcssSubjectValue = [];
        this.selectedNcssSubjectValue = item;
        this.selectedNcssSubject = this.selectedNcssSubjectValue;
        this.onChange()
        break;

    }
  }

  onDeselectAll(item, type) {
    switch (type) {
      case 'ela':
        this.selectedElaSubjectValue = item;
        this.onChange()

        break;
      case 'math':
        this.selectedMathSubjectValue = item;
        this.onChange()

        break;
      case 'ngss':
        this.selectedNgssSubjectValue = item;
        this.onChange()

        break;
      case 'ncss':
        this.selectedNcssSubjectValue = item;
        this.onChange()
        break;

    }
  }
  onChange(){
    let contentArray=this.selectedElaSubjectValue.concat(this.selectedMathSubjectValue,this.selectedNgssSubjectValue,this.selectedNcssSubjectValue)
    this.createClass.controls['assigned_standard_subject_group_ids'].patchValue( contentArray.map(res=>res.item_id))
    
  }
   */
}
