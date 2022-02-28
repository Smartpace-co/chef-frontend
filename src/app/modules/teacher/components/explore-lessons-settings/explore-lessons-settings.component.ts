import { Component, OnInit } from '@angular/core';
import { faSearch, faAngleDoubleLeft, faStar, faChevronRight, faBookmark, faCalendarAlt, faExclamationTriangle, faChevronDown, faEdit, faClock } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { ToasterService } from '@appcore/services/toaster.service';
import { NgbModal, NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { UtilityService } from '@appcore/services/utility.service';
import { ClassesService } from '@modules/teacher/services/classes.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import * as moment from 'moment';

@Component({
  selector: 'app-explore-lessons-settings',
  templateUrl: './explore-lessons-settings.component.html',
  styleUrls: ['./explore-lessons-settings.component.scss']
})
export class ExploreLessonsSettingsComponent implements OnInit {
  SearchIcon = faSearch;
  FilterArrow = faAngleDoubleLeft;
  Star = faStar;
  RightArrow = faChevronRight;
  BookmarkIcon = faBookmark;
  Calendar = faCalendarAlt;
  exclamationTriangle = faExclamationTriangle;
  isCollapsed = false;
  localData: any;
  activities = [];
  bookmark = false;
  dropIcon = faChevronDown;
  edit = faEdit;
  clock = faClock;

  lessonInfo: any;
  formInfo: any;
  classTitle = 'Select class';
  classList = [];

  closeResult = '';
  AssignLesson: FormGroup;
  lessonList = [];
  lessonid: string = "";
  show = false;
  percent: any;
  startDate: any;
  endDate: any;
  recipeData: any;
  custmiseType: any;
  isEdit: any;
  selectedFromDate: any;
  selectedToDate: any
  assignmentTitle: any;
  reciepe_icon: any;
  defaultRecipeImg: any;
  viewFrom: any;
  lessonTime:any;
  allLessonInfo;
  // Date Picker
  hoveredDate: NgbDate | null = null;

  fromDate: any;
  toDate: any;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private authService: AuthService,
    private toast: ToasterService,
    private modalService: NgbModal,
    private teacherservice: TeacherService,
    private calendar: NgbCalendar, public formatter: NgbDateParserFormatter,
    private utilityService: UtilityService,
    private classService: ClassesService
  ) {
    this.lessonid = this.activatedroute.snapshot.params.id;
  }

  ngOnInit(): void {
    let today = this.calendar.getToday();
    this.fromDate = this.dateValue(new NgbDate(today.year, today.month, today.day));
    this.toDate = this.dateValue(new NgbDate(today.year, today.month, today.day));

    this.AssignLesson = new FormGroup({
      title: new FormControl('', [Validators.required]),
      class: new FormControl(null, [Validators.required]),
      fromDate: new FormControl(this.fromDate, [Validators.required]),
      toDate: new FormControl(this.toDate, [Validators.required]),
      settingName: new FormControl("", [Validators.required])

    });
    this.localData = JSON.parse(window.sessionStorage.getItem('currentUser'));

    if(!this.teacherservice.getLessonData()){
      this.teacherservice.setLessonData(JSON.parse(sessionStorage.getItem('lsData')));
    }

    this.recipeData = this.teacherservice.getLessonData();

    

    this.custmiseType = this.recipeData.type;
    if (this.custmiseType === "edit") {
      this.getEditData(this.recipeData);
      this.isEdit = true;
    } else {
    this.formInfo = JSON.parse(localStorage.getItem('settings'));
      this.getData(this.recipeData);
      this.isEdit = false;
    }

  }

  dateValue(date: NgbDateStruct) {
    return date ? ('0' + date.month).slice(-2) + "-" + ('0' + date.day).slice(-2) + "-" + date.year : null
  }

  getData(data) {
    this.allLessonInfo = data;
    this.lessonTime=data.lesson.lessonTime;
    this.lessonInfo = data.recipe;
    this.activities = data.activities;
    this.classList = data.classList;
    this.bookmark = data.bookmark;
    this.lessonInfo.bookmark = this.bookmark;

    this.AssignLesson.get('title').setValue(this.formInfo.title);
    // this.formInfo.fromDate = fromDateObj.year + '/' + fromDateObj.month + '/' + fromDateObj.day;

    this.AssignLesson.get('fromDate').setValue(this.utilityService.LessonformatDate(this.formInfo.fromDate));
    this.selectedFromDate = this.formInfo.fromDate;

    // this.formInfo.toDate = toDateObj.year + '/' + toDateObj.month + '/' + toDateObj.day;
    this.AssignLesson.get('toDate').setValue(this.utilityService.LessonformatDate(this.formInfo.toDate));
    this.selectedToDate = this.formInfo.toDate;

    this.AssignLesson.get('class').setValue(this.formInfo.class);
    if (this.formInfo.class) {
      this.classTitle = this.formInfo.class.menu
    }
  }

  getEditData(data) {
    this.lessonTime=data.lesson.lessonTime;
    this.lessonInfo = data.recipe;
    this.activities = data.activities;
    this.classList = data.classList;
    this.bookmark = data.bookmark;



    this.AssignLesson.get('title').setValue(data.assignmentTitle);

    this.AssignLesson.get('fromDate').setValue(this.utilityService.customLessonformatDate(data.startDate));
    this.selectedFromDate = this.utilityService.customLessonformatDate(data.startDate);

    this.AssignLesson.get('toDate').setValue(this.utilityService.customLessonformatDate(data.endDate));
    this.selectedToDate = this.utilityService.customLessonformatDate(data.endDate);

    this.AssignLesson.get('class').setValue(data.classId);
    if (data.classId) {
      this.classTitle = data.classList.filter(function (x) { return x.id === data.classId }).map(function (x) {
        return x.menu;
      });
    }
    this.AssignLesson.get('settingName').setValue(data.customSetting.settingName);
    this.formInfo = this.AssignLesson.value;
  }

  get formControl() {
    return this.AssignLesson.controls;
  }


  bookmarkClass(item?: any) {
    // item.bookmark = !item.bookmark;

    let isBookmarked;
    if (item.bookmark = !item.bookmark) {
      isBookmarked = true;
      this.bookmark = true;
    } else {
      isBookmarked = false;
      this.bookmark = false;
    }
    let obj = {}
    obj["isBookmarked"] = isBookmarked;
    this.teacherservice.bookmarkLesson(item.lessonId, obj).subscribe(
      (data) => {
        this.toast.showToast('lesson bookmarked successful', '', 'success');
      },
      (error) => {
        this.toast.showToast(error, '', '');
      }
    );
  }

  onPreview() {
    this.viewFrom = "Setting";
    this.teacherservice.setViewFrom(this.viewFrom);
    let lessonData = this.recipeData;
    this.teacherservice.setAssignLessonData(lessonData);
    this.assignmentTitle = lessonData.recipe.recipeTitle;
    this.reciepe_icon = lessonData.recipe.recipeImage ? lessonData.recipe.recipeImage : this.defaultRecipeImg;
    if (lessonData.activities) {
      for (let ob of lessonData.activities) {
        if (ob.title === 'Story' && ob.status === true) {
          this.router.navigate(['/teacher/learning-objective']);
          break;
        }
        else {
          this.router.navigate(['/teacher/safety-hygiene']);
        }
      }
    }
  }

  onCancel() {
    this.router.navigate(['/teacher/upcoming-assignment']);
  }


  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.AssignLesson.controls.fromDate.setValue(this.fromDate);

    } else if (this.fromDate && !this.toDate && date) {
      this.toDate = this.dateValue(date);
      // let dateObj = new NgbDate(this.toDate.year, this.toDate.month, this.toDate.day);
      this.AssignLesson.controls.toDate.setValue(this.toDate);
    } else {
      this.toDate = null;
      this.fromDate = this.dateValue(date);
      // let dateObj = new NgbDate(this.fromDate.year, this.fromDate.month, this.fromDate.day);
      this.AssignLesson.controls.fromDate.setValue(this.fromDate);
    }

  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  toggle(item) {
    item.isCollapsed = !item.isCollapsed
  }

  validLessonTitle(event): any {
    let name = event.target.value;
    let lable = "lessonTitle"
    this.teacherservice.titleSettingValidator(name, lable).subscribe(
      (data) => {
      },
      (error) => {
        this.AssignLesson.controls['title'].setErrors({ 'titleValidate': true });
      }
    );
  }

  validateSetting(event): any {
    let name = event.target.value;
    let lable = "settingTitle"
    this.teacherservice.titleSettingValidator(name, lable).subscribe(
      (data) => {
      },
      (error) => {
        this.AssignLesson.controls['settingName'].setErrors({ 'settingValidate': true });
      }
    );
  }

  funcActivities(title) {
    if (title == "Assessments") {
      let solved = this.recipeData.activities[3].Assessments;
      for (let i = 0; i <= solved.length; i++) {
        if (solved[i]?.assignedQuestions !== solved[i]?.totalQuestions) {
          this.percent = (solved[i].assignedQuestions / solved[i].totalQuestions) * 100;
          return this.percent + '%';
        }
      }
    }

  }

  onItemStatus(item) {

    if (item && item.status) {
      item.status = false;
      if (item.title === 'Learning Activities') {
        item.Activities.map(data => {
          data.status = false;
          item.isCollapsed = false;
        })
        this.recipeData.estimatedTotalTime = this.recipeData.estimatedTotalTime - item.time;
      }
      if (item.title === 'Assessments') {
        item.Assessments.map(data => {
          data.status = false;
          item.isCollapsed = false;
        })
        this.recipeData.estimatedTotalTime = this.recipeData.estimatedTotalTime - item.time;
      }

      if (item.title === 'Cooking') {
        item.cooking.map(data => {
          data.status = false;
          item.isCollapsed = false;
        })
        this.activities.map(data => {
          4
          if (data.title === 'Story' && !data.status) {
            this.recipeData.estimatedTotalTime = this.recipeData.estimatedTotalTime - item.time;
            data.status = true;

            this.recipeData.estimatedTotalTime = this.recipeData.estimatedTotalTime + data.time;
          }
          else if (data.title === 'Story' && data.status) {
            this.recipeData.estimatedTotalTime = this.recipeData.estimatedTotalTime - item.time;
          }
        })
      }

      if (item.title === 'Story') {
        this.activities.map(data => {
          if (data.title === 'Cooking' && !data.status) {
            this.recipeData.estimatedTotalTime = this.recipeData.estimatedTotalTime - item.time;
            data.status = true;
            this.recipeData.estimatedTotalTime = this.recipeData.estimatedTotalTime + data.time;
          }
          else if (data.title === 'Cooking' && data.status) {
            this.recipeData.estimatedTotalTime = this.recipeData.estimatedTotalTime - item.time;
          }

        })
      }

    } else {
      item.status = true;
      if (item.title === 'Learning Activities') {
        item.Activities.map(data => {
          data.status = true;
          item.isCollapsed = true;
        })
        this.recipeData.estimatedTotalTime = this.recipeData.estimatedTotalTime + item.time;
      }

      if (item.title === 'Assessments') {
        item.Assessments.map(data => {
          data.status = true;
          item.isCollapsed = true;
        })
        this.recipeData.estimatedTotalTime = this.recipeData.estimatedTotalTime + item.time;
      }
      if (item.title === 'Cooking') {
        item.cooking.map(data => {
          data.status = true;
          item.isCollapsed = true;
        })
        this.recipeData.estimatedTotalTime = this.recipeData.estimatedTotalTime + item.time;
      }

      if (item.title === 'Story') {
        this.recipeData.estimatedTotalTime = this.recipeData.estimatedTotalTime + item.time;
      }


    }
  }
  classChange(event) {
    this.classTitle = event.menu;
    this.AssignLesson.get('class').setValue(event);
  }

  assignLesson() {
    if (this.AssignLesson.invalid) {
      return;
    } else {
      let scrData = this.AssignLesson.value;
      this.startDate = this.utilityService.LessonformatDate(scrData.fromDate);
      this.endDate = this.utilityService.LessonformatDate(scrData.toDate);

      // console.log('print src data === ', scrData);

      // this.startDate = moment.utc(new Date(scrData.fromDate.year, scrData.fromDate.month - 1, scrData.fromDate.day + 1));
      // this.endDate = moment.utc(new Date(scrData.toDate.year, scrData.toDate.month - 1, scrData.toDate.day + 1));


      let obj = {};
      obj['assignmentTitle'] = scrData.title;
      obj['startDate'] = this.startDate;
      obj['endDate'] = this.endDate;
      obj['settingName'] = scrData.settingName;
      obj['content'] = this.recipeData.activities;

      if (this.isEdit) {
        obj['defaultSetting'] = true;
        obj['classId'] = scrData.class.id;
        obj['customSettingId'] = this.recipeData.customSetting.id;
        this.teacherservice.editLesson(this.recipeData.id, obj).subscribe(
          (data) => {
            if (data.status === 200) {
              this.toast.showToast('Lesson Updated Successfully', '', 'success');
              this.router.navigate(['/teacher/upcoming-assignment'])
            } (error) => {
              this.toast.showToast(error.error.message, '', 'error');
            }
          },
          (error) => {
            this.toast.showToast(error.error.message, '', 'error');
          }
        );
      } else {
        obj['lessonId'] = this.recipeData.lesson.id;
        obj['recipeId'] = this.lessonInfo.id;
        obj['classId'] = scrData.class.id;
        obj['defaultSetting'] = this.recipeData.defaultSetting;
        this.teacherservice.assignLesson(obj).subscribe(
          (data) => {
            this.toast.showToast('Lesson Assigned Successfully', '', 'success');
            this.router.navigate(['/teacher/explore-lessons-list'])
          },
          (error) => {
            this.toast.showToast(error.error.message, '', 'error');
          }
        );
      }

    }
  }
}
