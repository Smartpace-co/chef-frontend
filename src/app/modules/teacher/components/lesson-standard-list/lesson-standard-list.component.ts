import { Component, OnInit } from '@angular/core';
import { FaConfig } from '@fortawesome/angular-fontawesome';
import { faSearch, faAngleDoubleLeft, faStar, faChevronRight, faBookmark, faCalendarAlt, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import {  FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { ToasterService } from '@appcore/services/toaster.service';
import { NgbModal, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ClassesService } from '@modules/teacher/services/classes.service';
import { UtilityService } from '@appcore/services/utility.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lesson-standard-list',
  templateUrl: './lesson-standard-list.component.html',
  styleUrls: ['./lesson-standard-list.component.scss']
})
export class LessonStandardListComponent implements OnInit {

  SearchIcon = faSearch;
  FilterArrow = faAngleDoubleLeft;
  Star = faStar;
  RightArrow = faChevronRight;
  BookmarkIcon = faBookmark;
  term = "";
  searchList = [];
  lessonList: any;
  topRatedList: any;
  Calendar = faCalendarAlt;
  exclamationTriangle = faExclamationTriangle;
  classTitle = 'Select class';
  settingTitle = 'Select Setting';
  classList = [];
  customList = [];
  closeModal
  showInfo = 0;
  lessonInfo: any;
  classApplied = true;
  localData: any;
  bookmark = false;
  closeResult = '';
  infoCircle = faInfoCircle;
  subscription: Subscription;
  topRatedSubscription: Subscription;
  AssignLesson: FormGroup;
  // Date Picker
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  resultLessonInfo: any = [];
  selectedIndex: any = 0;
  lessonId: number;
  recipeList = [];
  grade: any;
  img: any;
  allPackages = [];
  allSettings = [];
  advance: boolean = false;
  showCustomList: boolean;
  isDisabled: boolean;
  startDate: any;
  endDate: any;
  ingrdients: any;
  equipments: any;
  itemInfo: any;
  viewStatus = true;
  standardList: any;
  lessonType: any;
  constructor(private classService: ClassesService,
    private utilityService: UtilityService,
    public faConfig: FaConfig,
    private authService: AuthService,
    private toast: ToasterService,
    private modalService: NgbModal,
    private router: Router,
    public teacherservice: TeacherService,
    private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    faConfig.defaultPrefix = 'far';
    this.img = './assets/recipe.jpeg';
  }

  ngOnInit(): void {
    this.lessonId = this.teacherservice.getLessonId();
    this.localData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.lessonType = this.teacherservice.GetLessonType();
    this.teacherservice.viewMore = true;
    this.getStandardLesson();

  }

  OnBackClick() {
    this.router.navigate(['/teacher/explore-lessons-list']);
  }


  getStandardLesson(): void {
    this.teacherservice.getStandardsList(this.viewStatus).subscribe(
      (response) => {
        if (response && response.data) {
          this.standardList = response.data;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getLessons(item) {
    this.lessonType = "lessonStandard";
    this.teacherservice.setLessonType(this.lessonType);
    this.teacherservice.setStandardLessons(item);
    this.router.navigate(['/teacher/explore-all-lesson']);
  }


  toggleClass() {

    this.classApplied = !this.classApplied;
    if (this.selectedIndex) {
      let count = this.classApplied ? 3 : 4;
      this.showInfo = Math.floor(this.selectedIndex / count) == 0 ? 1 : Math.floor(this.selectedIndex / count) * count + 1;
    }

  }

  /**
   * On classes dropdown value change
   */
  classChange(event) {
    this.classTitle = event.menu;
    this.AssignLesson.get('class').setValue(event);
  }

}
