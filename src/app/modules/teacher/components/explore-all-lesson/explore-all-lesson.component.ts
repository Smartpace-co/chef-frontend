import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FaConfig } from '@fortawesome/angular-fontawesome';
import { faSearch, faAngleDoubleLeft, faStar, faChevronRight, faBookmark, faCalendarAlt, faExclamationTriangle, faInfoCircle, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { ToasterService } from '@appcore/services/toaster.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { forEach, identity } from 'lodash';
import { ClassesService } from '@modules/teacher/services/classes.service';
import { UtilityService } from '@appcore/services/utility.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { title } from 'process';
import { Subscription } from 'rxjs';
import { TranslationService } from '@appcore/services/translation.service';

@Component({
  selector: 'app-explore-all-lesson',
  templateUrl: './explore-all-lesson.component.html',
  styleUrls: ['./explore-all-lesson.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExploreAllLessonComponent implements OnInit {
  SearchIcon = faSearch;
  FilterArrow = faAngleDoubleLeft;
  Star = faStar;
  RightArrow = faChevronRight;
  leftarrow = faChevronLeft;
  BookmarkIcon = faBookmark;
  term = "";
  tempLessonList = [];
  // searchByParam = '';
  // searchBy = 'Search By';
  // searchByList = [];
  allLessonList: any;
  lessonList: any;
  topRatedList: any;
  tempTopRatedList = [];
  suggestedForYouList: any;
  tempSuggestedForYouList = [];
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
  suggestedForYouSubscription: Subscription;
  standardLessonSubscription: Subscription;
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
  tempStandardList = [];
  lessonType: any;
  lessonItemData: any;
  selectedDate: any;
  lessonTime:any;

  recipeDetails;
  defaultRecipeImg;

  constructor(private classService: ClassesService,
    private utilityService: UtilityService,
    public faConfig: FaConfig,
    private authService: AuthService,
    private toast: ToasterService,
    private modalService: NgbModal,
    private router: Router,
    public teacherservice: TeacherService,
    private translate: TranslationService,
    private calendar: NgbCalendar, public formatter: NgbDateParserFormatter,
    private config: NgbDatepickerConfig) {
    faConfig.defaultPrefix = 'far';
    let today = calendar.getToday()
    this.fromDate = new NgbDate(today.year, today.month, today.day)
    this.toDate = new NgbDate(today.year, today.month, today.day),
      this.img = './assets/recipe.jpeg';
      const current = new Date();
      config.minDate = {
        year: current.getFullYear(), month:
          current.getMonth() + 1, day: current.getDate()
      };

    this.defaultRecipeImg = '/assets/images/nsima-bent-icon.png';
  }

  ngOnInit(): void {
    this.AssignLesson = new FormGroup({
      title: new FormControl('', [Validators.required]),
      class: new FormControl(null, [Validators.required]),
      fromDate: new FormControl(this.fromDate, [Validators.required]),
      toDate: new FormControl(this.toDate, [Validators.required]),
      customSetting: new FormControl(null, []),
    });

    this.lessonId = this.teacherservice.getLessonId();

    this.localData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.lessonType = window.sessionStorage.getItem('lessonType')

    this.classTitle = this.translate.getStringFromKey('student.add-student.class.placeholder');
    this.settingTitle = this.translate.getStringFromKey('teacher.explore-lessons.select-setting');

    if (this.lessonType === "all") {
      this.teacherservice.viewMore = true;
      this.teacherservice.lessonFilterType = 'all';

      this.getlessonsData();
      this.subscription = this.teacherservice.getFilteredALLLessonData().subscribe(data => {
        this.allLessonList = data.allLessonData;
      });
    }
    else if (this.lessonType === "lessonFeatured") {
      this.teacherservice.viewMore = true;
      this.teacherservice.lessonFilterType = 'lessonFeatured';

      this.getFeaturedlessonsData();
      this.subscription = this.teacherservice.getFilteredLessonData().subscribe(data => {
        this.lessonList = data.lessonData;
      });
    } else if (this.lessonType === "lessonTopRated") {
      this.teacherservice.viewMore = true;
      this.teacherservice.lessonFilterType = 'lessonTopRated';
      this.getTopRatedLessons();
      this.topRatedSubscription = this.teacherservice.getFilteredTopRatedLessonData().subscribe(data => {
        this.topRatedList = data.topRatedData;
      });
    } else if (this.lessonType === "lessonStandard") {
      this.teacherservice.viewMore = true;
      this.teacherservice.lessonFilterType = 'lessonStandard';
      this.getStandardLesson();
      this.standardLessonSubscription = this.teacherservice.getFilteredStanardLessonData().subscribe(data => {
        this.standardList = data.standardData;
      });
    } else if (this.lessonType === "suggestedForYou") {
      this.teacherservice.viewMore = true;
      this.teacherservice.lessonFilterType = 'suggestedForYou';
      this.getSuggestedForYouLessons();
      this.suggestedForYouSubscription = this.teacherservice.getFilteredSuggestedForYouLessonData().subscribe(data => {
        this.suggestedForYouList = data.suggestedForYouData;
      });
    }
    this.getCustomList();
    this.advance = true;
  }
  get formControl() {
    return this.AssignLesson.controls;
    // return this.deleteClassForm.controls;
  }

  ngOnDestroy() {
    if (this.lessonType === "lessonFeatured") {
      this.subscription.unsubscribe();
    } else if (this.lessonType === "lessonTopRated") {
      this.topRatedSubscription.unsubscribe();
    }
  }

  OnBackClick() {
    if (this.lessonType === "lessonStandard") {
      this.router.navigate(['/teacher/lesson-standard-list']);
    } else {
      this.router.navigate(['/teacher/explore-lessons-list']);
    }
  }

  // searchByChange(event) {
  //   this.searchBy = event.menu;
  //   this.searchByParam = event.id;
  // }

  searchLesson(event) {
    if (event.target.value.length > 2) {
      // if (!this.searchByParam) return this.toast.showToast('Please select search by', '', 'error');
      let searchResult = [];
      if (this.lessonType === "all") {
        searchResult = this.allLessonList.filter(obj => obj.recipe.recipeTitle.toLowerCase().search(new RegExp(event.target.value.toLowerCase())) > -1);
        if (searchResult.length > 0) this.allLessonList = searchResult;
        else this.allLessonList = [];

      }
      else if (this.lessonType === "lessonFeatured") {
        searchResult = this.lessonList.filter(obj => obj.recipe.recipeTitle.toLowerCase().search(new RegExp(event.target.value.toLowerCase())) > -1);
        if (searchResult.length > 0) this.lessonList = searchResult;
        else this.lessonList = [];

      } else if (this.lessonType === "lessonTopRated") {
        searchResult = this.topRatedList.filter(obj => obj.recipe.recipeTitle.toLowerCase().search(new RegExp(event.target.value.toLowerCase())) > -1);
        if (searchResult.length > 0) this.topRatedList = searchResult;
        else this.topRatedList = [];

      }  else if (this.lessonType === "suggestedForYou") {
        searchResult = this.suggestedForYouList.filter(obj => obj.recipe.recipeTitle.toLowerCase().search(new RegExp(event.target.value.toLowerCase())) > -1);
        if (searchResult.length > 0) this.suggestedForYouList = searchResult;
        else this.suggestedForYouList = [];

      } else if (this.lessonType === "lessonStandard") {
        searchResult = this.standardList.filter(obj => obj.recipe.recipeTitle.toLowerCase().search(new RegExp(event.target.value.toLowerCase())) > -1);
      }
      if (searchResult.length > 0) this.standardList = searchResult;
      else this.standardList = [];
    } else {
      if (this.lessonType === "all") this.allLessonList = this.tempLessonList;
      else if (this.lessonType === "lessonFeatured") this.lessonList = this.tempLessonList;
      else if (this.lessonType === "lessonTopRated") this.topRatedList = this.tempTopRatedList;
      else if (this.lessonType === "lessonStandard") this.standardList = this.tempStandardList;
      else if (this.lessonType === "suggestedForYou") this.suggestedForYouList = this.tempSuggestedForYouList;
    }
  }

  getlessonsData(): void {
    this.teacherservice.getAllLessons(this.viewStatus).subscribe(
      (response) => {
        if (response && response.data) {
          this.allLessonList = response.data.rows;
          this.allLessonList.forEach((element) => {
            if (element.bookmarkLesson.length === 0) {
              element.bookmark = false;
            } else {
              this.bookmark = element.bookmarkLesson[0].isBookmarked;
              element.bookmark = this.bookmark;
            }
          });
          this.tempLessonList = this.allLessonList;
          // this.getTopRatedLessons();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getFeaturedlessonsData(): void {
    this.teacherservice.getFeaturedLessons(this.viewStatus).subscribe(
      (response) => {
        if (response && response.data) {
          this.lessonList = response.data.rows;
          this.lessonList.forEach((element) => {
            if (element.bookmarkLesson.length === 0) {
              element.bookmark = false;
            } else {
              this.bookmark = element.bookmarkLesson[0].isBookmarked;
              element.bookmark = this.bookmark;
            }
          });
          this.tempLessonList = this.lessonList;
          // this.getTopRatedLessons();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getTopRatedLessons(): void {
    this.teacherservice.getTopRatedLessons(this.viewStatus).subscribe(
      (response) => {
        if (response && response.data) {
          this.topRatedList = response.data;
          this.topRatedList.forEach((element) => {
            if (element.bookmarkLesson.length === 0) {
              element.bookmark = false;
            } else {
              this.bookmark = element.bookmarkLesson[0].isBookmarked;
              element.bookmark = this.bookmark;
            }
          });
          this.tempTopRatedList = this.topRatedList;
          // this.getStandardLesson();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getSuggestedForYouLessons(): void {
    this.teacherservice.getSuggestedForYouLessons(this.viewStatus).subscribe(
      (response) => {
        if (response && response.data) {
          this.suggestedForYouList = response.data;
          this.suggestedForYouList.forEach((element) => {
            if (element.bookmarkLesson.length === 0) {
              element.bookmark = false;
            } else {
              this.bookmark = element.bookmarkLesson[0].isBookmarked;
              element.bookmark = this.bookmark;
            }
          });
          this.tempSuggestedForYouList = this.suggestedForYouList;
          // this.getStandardLesson();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getStandardLesson(): void {
    this.lessonItemData = this.teacherservice.GetStandardLessons();
    this.teacherservice.getaAllStandardsList(JSON.stringify(this.lessonItemData.lessonIds)).subscribe((response) => {
      if (response && response.data) {
        this.standardList = response.data;
        this.tempStandardList = this.standardList;
      }
    },
      (error) => {
        console.log(error);
      }
    );
    // this.teacherservice.getStandardsList(this.viewStatus).subscribe(
    //   (response) => {
    //     if (response && response.data) {
    //       this.standardList = response.data;
    //     }
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }

  getRecipeList(item) {
    this.teacherservice.getLessonById(item.id).subscribe(
      (response: any) => {
        if (response && response.data) {
          let item = response.data;

          if (item.lesson.bookmarkLesson.length === 0) {
            item.bookmark = false;
          } else {
            this.bookmark = item.lesson.bookmarkLesson[0].isBookmarked;
            item.bookmark = this.bookmark;
          }

          const activities = [];

          let cooking = {
            "time": item.recipe.recipeTechniques.map(elem => elem.estimatedTime ? elem.estimatedTime : 0).reduce((a, b) => a + b),
            "title": "Cooking",
            "status": item.recipe.recipeTechniques.some(elem => elem.culinaryTechnique.status == true),
            "icon": "./assets/images/recipe.svg",
            "cooking": [{
              "id": 1,
              "culinaryTechniqueTitle": 'Culinary Technique',
              "estimatedTime": item.recipe.recipeTechniques.map(elem => elem.estimatedTime ? elem.estimatedTime : 0).reduce((a, b) => a + b),
              // "status": item.recipe.recipeTechniques.some(elem => elem.culinaryTechnique.status == true)
              "status": item.recipe.recipeTechniques.some(elem => elem.status == true)
            }],
          };
          activities.push(cooking);

          let story = {
            "time": item.lesson.storyTime,
            "title": "Story",
            "status": true,
            "icon": "./assets/images/book.svg"
          };

          activities.push(story);

          let activityList = [];

          if (item.lesson.multiSensoryQuestions && Object.keys(item.lesson.multiSensoryQuestions).length) {
            activityList.push({
              "id": item.lesson.multiSensoryQuestions.id,
              "title": "Sensory Learning Exercise",
              "time": item.lesson.multiSensoryQuestions.estimatedTime ? item.lesson.multiSensoryQuestions.estimatedTime : 0,
              "status": item.lesson.multiSensoryQuestions.status,
              "lable": "Sensory Learning Exercise"
            });
          }

          if (item.lesson.experiment && Object.keys(item.lesson.experiment).length) {
            activityList.push({
              "id": item.lesson.experiment.id,
              "title": item.lesson.experiment.experimentTitle,
              "time": item.lesson.experiment.estimatedMakeTime ? item.lesson.experiment.estimatedMakeTime : 0,
              "status": item.lesson.experiment.status,
              "lable": "Science Experiment"
            });
          }

          if (!item.lesson.activity) {
            item.lesson.activity = {
              estimatedMakeTime: 10,
              status: false
            }
          }
          let learningActivity = {
            "time": (item.lesson.multiSensoryQuestions ? item.lesson.multiSensoryQuestions.estimatedTime : 0) + (item.lesson.experiment.estimatedMakeTime ? item.lesson.experiment.estimatedMakeTime : 0), // remove temperorary condition once estimatedMakeTime added by api
            "title": "Learning Activities",
            "status": item.lesson.activity.status == true || item.lesson.experiment.status == true ? true : false,
            "Activities": activityList,
            "icon": "./assets/images/recipe.svg",
          }
          activities.push(learningActivity);

          const assessMents = [];
          let totalTime = 0;
          let assesmentStatus = [];
          let label = ""


          let elaObj = {
            id: '',
            key: '',
            title: '',
            estimatedTime: 0,
            lable: '',
            assignedQuestions: 0,
            totalQuestions: 0,
            status: ''
          };
          let mathObj = {
            id: '',
            key: '',
            title: '',
            estimatedTime: 0,
            lable: '',
            assignedQuestions: 0,
            totalQuestions: 0,
            status: ''
          };
          let ngss = {
            id: '',
            key: '',
            title: '',
            estimatedTime: 0,
            lable: '',
            assignedQuestions: 0,
            totalQuestions: 0,
            status: ''
          };
          let ncss = {
            id: '',
            key: '',
            title: '',
            estimatedTime: 0,
            lable: '',
            assignedQuestions: 0,
            totalQuestions: 0,
            status: ''
          };
          if (item.lesson.questions.filter(obj => obj.questionType.key === 'ela').length) {
            elaObj.id = item.lesson.questions.filter(elem => elem.questionType.key === 'ela')[0].id;
            elaObj.key = "ela";
            elaObj.title = item.lesson.questions.filter(elem => elem.questionType.key === 'ela')[0].title;
            elaObj.estimatedTime = item.lesson.questions.map(elem => (elem.questionType.key === 'ela') ? elem.estimatedTime : 0).reduce((a, b) => a + b);
            elaObj.lable = "English Language Art Questions";
            elaObj.assignedQuestions = item.lesson.questions.filter(obj => obj.questionType.key === 'ela').length;
            elaObj.totalQuestions = item.lesson.questions.filter(obj => obj.questionType.key === 'ela').length;
            elaObj.status = item.lesson.questions.filter(obj => obj.questionType.key === 'ela')[0].status;
            assessMents.push(elaObj);
            assesmentStatus.push(item.lesson.questions.filter(elem => elem.questionType.key === 'ela')[0].status);
          }


          if (item.lesson.questions.filter(obj => obj.questionType.key === 'math').length) {
            mathObj.id = item.lesson.questions.filter(elem => elem.questionType.key === 'math')[0].id;
            mathObj.key = "math";
            mathObj.title = item.lesson.questions.filter(elem => elem.questionType.key === 'math')[0].title;
            mathObj.estimatedTime = item.lesson.questions.map(elem => (elem.questionType.key === 'math') ? elem.estimatedTime : 0).reduce((a, b) => a + b);
            mathObj.lable = "Math Questions";
            mathObj.assignedQuestions = item.lesson.questions.filter(obj => obj.questionType.key === 'math').length;
            mathObj.totalQuestions = item.lesson.questions.filter(obj => obj.questionType.key === 'math').length;
            mathObj.status = item.lesson.questions.filter(obj => obj.questionType.key === 'math')[0].status;
            assessMents.push(mathObj);
            assesmentStatus.push(item.lesson.questions.filter(elem => elem.questionType.key === 'math')[0].status);
          }

          if (item.lesson.questions.filter(obj => obj.questionType.key === 'ngss').length) {
            ngss.id = item.lesson.questions.filter(elem => elem.questionType.key === 'ngss')[0].id;
            ngss.key = "ngss";
            ngss.title = item.lesson.questions.filter(elem => elem.questionType.key === 'ngss')[0].title;
            ngss.estimatedTime = item.lesson.questions.map(elem => (elem.questionType.key === 'ngss') ? elem.estimatedTime : 0).reduce((a, b) => a + b);
            ngss.lable = "NGSS Questions";
            ngss.assignedQuestions = item.lesson.questions.filter(obj => obj.questionType.key === 'ngss').length;
            ngss.totalQuestions = item.lesson.questions.filter(obj => obj.questionType.key === 'ngss').length;
            ngss.status = item.lesson.questions.filter(obj => obj.questionType.key === 'ngss')[0].status;
            assessMents.push(ngss);
            assesmentStatus.push(item.lesson.questions.filter(elem => elem.questionType.key === 'ngss')[0].status);
          }

          if (item.lesson.questions.filter(obj => obj.questionType.key === 'ncss').length) {
            ncss.id = item.lesson.questions.filter(elem => elem.questionType.key === 'ncss')[0].id;
            ncss.key = "ncss";
            ncss.title = item.lesson.questions.filter(elem => elem.questionType.key === 'ncss')[0].title;
            ncss.estimatedTime = item.lesson.questions.map(elem => (elem.questionType.key === 'ncss') ? elem.estimatedTime : 0).reduce((a, b) => a + b);
            ncss.lable = "NCSS Questions";
            ncss.assignedQuestions = item.lesson.questions.filter(obj => obj.questionType.key === 'ncss').length;
            ncss.totalQuestions = item.lesson.questions.filter(obj => obj.questionType.key === 'ncss').length;
            ncss.status = item.lesson.questions.filter(obj => obj.questionType.key === 'ncss')[0].status;
            assessMents.push(ncss);
            assesmentStatus.push(item.lesson.questions.filter(elem => elem.questionType.key === 'ncss')[0].status);
          }
          let assessment = {
            "time": item.lesson.assessmentTime ? item.lesson.assessmentTime : 0,
            "title": "Assessments",
            "status": assesmentStatus.some(elem => elem == true),
            "icon": "./assets/images/rocket.svg",
            "Assessments": assessMents
          }

          activities.push(assessment);
          let totalTimes = activities.map(elem => elem.time).reduce((a, b) => a + b);
          this.resultLessonInfo = item;
          this.resultLessonInfo["estimatedTotalTime"] = totalTimes;
          this.resultLessonInfo["activities"] = activities;
        }
      },
      (error) => {
        console.log(error);
      }
    );


    // this.lessonList = item.recipe;

  }
  getClassList() {
    this.teacherservice.getClassesList().subscribe(
      (res) => {
        if (res) {
          if (_.isArray(res.data.rows)) {
            this.allPackages = res.data.rows;
          } else {
            this.allPackages = [res.data.rows];
          }
          this.classList = _.map(this.allPackages, item => {
            let obj = {
              id: item.id,
              menu: item.title
            }
            return obj;
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );

  }

  getCustomList() {
    this.teacherservice.customList().subscribe(
      (res) => {
        if (res) {
          if (_.isArray(res.data)) {
            this.allSettings = res.data;
            this.showCustomList = true

          } else {
            this.allSettings = [res.data];
            this.showCustomList = false;
          }
          this.customList = _.map(this.allSettings, item => {
            let obj = {
              id: item.id,
              menu: item.settingName,
              content: item.content
            }
            return obj;
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //  /**
  //   * To check valid lesson Title
  //   *   
  //   */
  validLessonTitle(event): any {
    let name = event.target.value;
    let lable = "lessonTitle"
    this.teacherservice.titleSettingValidator(name, lable).subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
        this.AssignLesson.controls['title'].setErrors({ 'titleValidate': true });
      }
    );
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



  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.AssignLesson.controls.fromDate.setValue(date);
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      let dateObj = new NgbDate(this.toDate.year, this.toDate.month, this.toDate.day);
      this.AssignLesson.controls.toDate.setValue(dateObj);
    } else {
      this.toDate = null;
      this.fromDate = date;
      let dateObj = new NgbDate(this.fromDate.year, this.fromDate.month, this.fromDate.day);
      // this.AssignLesson.controls.fromDate.setValue(dateObj);
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

  // onInfoClick(item, i) {
  //   this.itemInfo = item;
  //   this.lessonTime = item.lessonTime;
  //   this.teacherservice.getLessonInfo(item.id).subscribe((res) => {
  //     this.showInfo = i + 1;
  //     this.selectedIndex = i
  //     let count = this.classApplied ? 3 : 4;
  //     this.showInfo = Math.floor(this.selectedIndex / count) == 0 ? 1 : Math.floor(this.selectedIndex / count) * count + 1;
  //     this.resultLessonInfo = res.data;
  //     this.resultLessonInfo.learningObjectivesForStudent = this.resultLessonInfo.learningObjectivesForStudent.replace(/&nbsp;|<[^>]+>/g, '');
  //     this.ingrdients = this.resultLessonInfo.recipe.recipeIngredients.map(x => x.ingredient.ingredientTitle).join(",");
  //     this.equipments = this.resultLessonInfo.experiment.experimentTools.map(x => x.tool.toolTitle).join(",");
  //   }), (error) => {
  //     console.log(error);
  //   }
  // }

  
  onInfoClick(content, item) {
    this.itemInfo = item;
    this.lessonTime = item.lessonTime;
    this.teacherservice.getLessonInfo(item.id).subscribe((res) => {
      let { 
        recipe, 
        grade, 
        learningObjectivesForStudent, 
        experiment,
        standards } = res.data;

      this.recipeDetails = {
        grade: grade.grade,
        lessonTime: item.lessonTime,
        objective: learningObjectivesForStudent,
        name: recipe.recipeTitle,
        nameAlternative: recipe.alternativeName, 
        countryName: recipe.country ? recipe.country.countryName : "",
        image: recipe.recipeImage || this.defaultRecipeImg,

        ingredients: this.handleIngredient(recipe.recipeIngredients),
        equipments: experiment ? this.handleEquipments(experiment.experimentTools) : [],
        standards: standards,
      }
      this.closeModal = this.modalService.open(content, { windowClass: "recipeModel" , ariaLabelledBy: 'modal-basic-title', centered: true });

    }), (error) => {
      console.log(error);
    }
  }

  private handleIngredient(arr: any[]){
    if(arr.length < 1) return [];
    return arr.reduce((acc,curr)=> ([...acc, curr.ingredient.ingredientTitle]) , []);
  }

  private handleEquipments(arr: any[]){
    if(arr.length < 1) return [];
    return arr.reduce((acc,curr)=> ([...acc, curr.tool.toolTitle]) , []);
  }

  onCancel() {
    //this.lessonList(i);
    this.showInfo = 0;
  }

  toggleClass() {

    this.classApplied = !this.classApplied;
    if (this.selectedIndex) {
      let count = this.classApplied ? 3 : 4;
      this.showInfo = Math.floor(this.selectedIndex / count) == 0 ? 1 : Math.floor(this.selectedIndex / count) * count + 1;
    }

  }

  bookmarkClass(item?: any) {
    // item.bookmark = !item.bookmark;
    let isBookmarked;
    if (item.bookmark = !item.bookmark) {
      isBookmarked = true;
    } else {
      isBookmarked = false;
    }
    let obj = {}
    obj["isBookmarked"] = isBookmarked;
    this.teacherservice.bookmarkLesson(item.id, obj).subscribe(
      (data) => {
        this.toast.showToast('lesson bookmarked successful', '', 'success');
      },
      (error) => {
        this.toast.showToast(error, '', '');
      }
    );
  }

  onDefaultChanged(e) {
    this.advance = e.target.checked;
  }


  AdvanceLink() {
    if (this.advance == true) {
      return;
    } else {
      localStorage.setItem('settings', JSON.stringify(this.AssignLesson.value));

      this.closeModal.close();
      this.resultLessonInfo["defaultSetting"] = this.advance;
      this.resultLessonInfo["type"] = "new";
      this.resultLessonInfo["classList"] = this.classList;
      this.teacherservice.setLessonData(this.resultLessonInfo);
      sessionStorage.setItem('lsData',JSON.stringify(this.resultLessonInfo));
      this.router.navigate(['/teacher/explore-lessons-setting', this.lessonInfo.id]);
    }

  }

  open(content, item) {

    this.getRecipeList(item);
    this.getClassList();
    this.lessonInfo = item;

    this.AssignLesson.controls.title.setValue(item.recipe.recipeTitle);
    if (!this.resultLessonInfo.class) {
      this.classTitle = 'Select class'
    }
    else {
      this.classTitle = this.resultLessonInfo.class
    }

    if (!this.customList.length) {
      this.showCustomList = false;
    } else {
      this.showCustomList = true;
      if (!this.resultLessonInfo.customSetting) {
        this.settingTitle = 'Select Setting'
      }
      else {
        this.settingTitle = this.resultLessonInfo.customSetting
      }
    }
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });


    /* this.closeModal=this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' },).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    }); */
  }

  openAssignModal(content, item) {

    this.onCancel();
    this.getRecipeList(item);
    this.getClassList();
    this.lessonInfo = item;

    this.AssignLesson.controls.title.setValue(item.recipe.recipeTitle);
    if (!this.resultLessonInfo.class) {
      this.classTitle = 'Select class'
    }
    else {
      this.classTitle = this.resultLessonInfo.class
    }

    if (!this.customList.length) {
      this.showCustomList = false;
    } else {
      this.showCustomList = true;
      if (!this.resultLessonInfo.customSetting) {
        this.settingTitle = 'Select Setting'
      }
      else {
        this.settingTitle = this.resultLessonInfo.customSetting
      }
    }
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });


    /* this.closeModal=this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' },).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    }); */
  }
  /**
   * On classes dropdown value change
   */
  classChange(event) {
    this.classTitle = event.menu;
    this.AssignLesson.get('class').setValue(event);
  }

  settingChange(event) {
    this.settingTitle = event.menu;
    this.AssignLesson.get('customSetting').setValue(event);
    this.advance = false;
  }

  /**
   * assign lesson form submit
   */

  assignLesson() {
    if (this.AssignLesson.invalid) {
      return;
    } else {
      let scrData = this.AssignLesson.value;
      this.startDate = moment.utc(new Date(scrData.fromDate.year, scrData.fromDate.month - 1, scrData.fromDate.day));
      this.endDate = moment.utc(new Date(scrData.toDate.year, scrData.toDate.month - 1, scrData.toDate.day));
      let obj = {};

      obj['lessonId'] = this.lessonInfo.id;
      obj['recipeId'] = this.lessonInfo.recipe.id;
      obj['classId'] = scrData.class.id;
      obj['assignmentTitle'] = scrData.title;
      obj['startDate'] = this.startDate;
      obj['endDate'] = this.endDate;
      obj['defaultSetting'] = this.advance;
      if (this.showCustomList == false) {
        obj['settingName'] = "Default";
        obj['content'] = this.resultLessonInfo.activities;
      }
      else if (scrData.customSetting == null) {
        obj['settingName'] = "Default";
        obj['content'] = this.resultLessonInfo.activities;
      }
      else {
        obj['customSettingId'] = scrData.customSetting.id;
      }
      this.teacherservice.assignLesson(obj).subscribe(
        (data) => {
          this.toast.showToast('Lesson Assigned Successfully', '', 'success');
          this.closeModal.close();
          // this.router.navigate(['/teacher/explore-lessons.component']);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  assignDetails() {
    this.router.navigate(['teacher/individual-student-assignment-details']);
  }

  // new Code//
  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: '<div class=\'nav-btn next-slide\'></div>',
    prevArrow: '<div class=\'nav-btn prev-slide\'></div>',
    dots: false,
    infinite: false,
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 580,

        settings: {
          slidesToShow: 1
        }
      }
    ]
  };





}
