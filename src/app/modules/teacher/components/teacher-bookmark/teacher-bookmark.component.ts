import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { FaConfig } from '@fortawesome/angular-fontawesome';
import { faSearch, faAngleDoubleLeft, faStar, faChevronRight, faBookmark, faCalendarAlt, faExclamationTriangle,faInfoCircle,faPlus ,faThLarge,faList,faSort} from '@fortawesome/free-solid-svg-icons';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SortByPipe } from '@shared/pipes/sort-by.pipe';
import * as _ from 'lodash';
import * as moment from 'moment';
@Component({
  selector: 'app-teacher-bookmark',
  templateUrl: './teacher-bookmark.component.html',
  styleUrls: ['./teacher-bookmark.component.scss']
})
export class TeacherBookmarkComponent implements OnInit {
  SearchIcon = faSearch;
  FilterArrow = faAngleDoubleLeft;
  Star = faStar;
  RightArrow = faChevronRight;
  BookmarkIcon = faBookmark;
  Calendar = faCalendarAlt;
  exclamationTriangle = faExclamationTriangle;
  infoCircle = faInfoCircle;
  PlusIcon = faPlus;
  SortByIcon = faSort;
  ViewTitle = 'Tile View';
  classTitle = 'Select class';
  settingTitle = 'Select Setting';
  ViewIcon = faThLarge;
  showInfo = 0;
  classApplied = true;
  classList = [];
  customList = [];
  closeModal;
  selectedIndex:any = 0;
  resultLessonInfo:any=[];
  AssignLesson: FormGroup;
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  lessonId:number;
  recipeList = [];
  grade :any;
  term: string;
  gridview = false;
  listview = false;
  img : any;
  lessonInfo: any;
  allPackages = [];
  allSettings = [];
  advance:boolean =false;
  showCustomList :boolean;
  isDisabled :boolean;
  startDate :any;
  endDate:any;
  ingrdients :any;
  equipments :any;
  bookmark :boolean;
   itemInfo:any;
   selectedDate: any;
   lessonTime:any;
  ViewList = [
    {
      id: '1',
      menu: 'Tile View',
      link: '',
      icon: faThLarge
    },
    {
      id: '2',
      menu: 'List View',
      link: '',
      icon: faList
    }
  ];

  SortByTitle = 'Sort by';
  SortByList = [
    {
      id: '1',
      menu: 'Sort by Name',
      link: '',
      icon: ''
    },
    {
      id: '2',
      menu: 'Sort by Create Date',
      link: '',
      icon: ''
    }
  ];

  bookmarkListHeaders;


lessonList = [];
  constructor(private teacherService :TeacherService,
    private router: Router,
    public faConfig: FaConfig,
    private toast: ToasterService,
    private modalService: NgbModal,
    private calendar: NgbCalendar,
    private sortBy: SortByPipe,
     public formatter: NgbDateParserFormatter,
     private config: NgbDatepickerConfig) 
    { 
    faConfig.defaultPrefix = 'far';
    let today = calendar.getToday()
    this.fromDate = new NgbDate(today.year, today.month, today.day)
    this.toDate = new NgbDate(today.year, today.month, today.day),
    this.img = './assets/recipe.jpeg';
    const current = new Date();
    config.minDate = {
      year: current.getFullYear(), month:
        current.getMonth() + 1, day: current.getDate()
    }; }

  ngOnInit(): void {
    this.AssignLesson = new FormGroup({
      title: new FormControl('', [Validators.required]),
      class: new FormControl(null, [Validators.required]),
      fromDate: new FormControl( this.fromDate, [Validators.required]),
      toDate: new FormControl (this.toDate, [Validators.required]),
      customSetting : new FormControl(null,[]),
    });
      this.getlessonsData();
      this.getCustomList();
      this.advance = true;
      this.bookmarkListHeaders = [
        { title: 'Id', data: 'id' },
        { title: 'Name', data: 'recipeTitle' },
        { title: 'Duration', data: 'duration' }
      ];
      this.gridview = true;
  }
  get formControl() {
    return this.AssignLesson.controls;
  }

  getlessonsData(): void {
    this.teacherService.getBookmarkedLessonList().subscribe(
      (response) => {
        if (response && response.data) {
          this.lessonList = response.data.rows;
          this.lessonList.forEach( (element) => {
            if(element.bookmarkLesson.length === 0){
              element.bookmark = false;  
            } else{
              this.bookmark = element.bookmarkLesson[0].isBookmarked;
              element.bookmark = this.bookmark; 
              element.recipeTitle = element.recipe.recipeTitle;
              element.duration = element.recipe.estimatedMakeTime;
            }
        });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  sortData(event) {
    if (event.menu === 'Sort by Name') {
      this.lessonList = this.sortBy.transform(this.lessonList, 'asc', 'recipeTitle');
    } else if (event.menu === 'Sort by Create Date') {
      this.lessonList = this.sortBy.transform(this.lessonList, 'asc', 'createdAt');
    }
  }

  // onInfoClick(item, i) {
  //   this.showInfo = i+1;
  //   this.selectedIndex = i;
  //   let count = this.classApplied ? 3 : 4;
  //   this.showInfo = Math.floor(i / count) == 0 ? 1 : Math.floor(i / count) * count+1;
  //   this.resultLessonInfo = item;
  //   this.ingrdients = this.resultLessonInfo.recipe.recipeIngredients.map(x=>x.ingredient.ingredientTitle).join(",");
  //   this.equipments = this.resultLessonInfo.experiment.experimentTools.map(x => x.tool.toolTitle).join(",");
  //   console.log(this.resultLessonInfo);
  // }

  onInfoClick(item, i) {
    this.itemInfo=item;
    this.lessonTime= item.lessonTime;
    this.teacherService.getLessonInfo(item.id).subscribe((res) => {
    this.showInfo = i+1;
    this.selectedIndex = i
    let count = this.classApplied ? 3 : 4;
    this.showInfo = Math.floor(this.selectedIndex / count) == 0 ? 1 : Math.floor(this.selectedIndex / count) * count + 1;
    this.resultLessonInfo = res.data;
    this.resultLessonInfo.learningObjectivesForStudent = this.resultLessonInfo.learningObjectivesForStudent.replace(/&nbsp;|<[^>]+>/g, '');
    this.ingrdients = this.resultLessonInfo.recipe.recipeIngredients.map(x => x.ingredient.ingredientTitle).join(",");
    this.equipments = this.resultLessonInfo.experiment.experimentTools.map(x => x.tool.toolTitle).join(",");
    }),(error) => {
        console.log(error);
    }
  }


  exploreList(){
    this.router.navigate(['/teacher/explore-lessons-list']);
  }

  bookmarkClass(item?:any) {
    let isBookmarked = false;
    let obj={}
    obj["isBookmarked"] = isBookmarked;
    this.teacherService.bookmarkLesson(item.id,obj).subscribe(
      (data) => {
        this.toast.showToast('lesson Unbookmarked successful', '', 'success');
        this.getlessonsData();
      },
      (error) => {
        this.toast.showToast(error,'','');
      }
    );
  }

  onCancel() {
    this.showInfo = 0;
  }

  // getRecipeList(item) {

  //   const activities = [];

  //   let cooking = {
  //     "time": item.recipe.recipeTechniques.map(elem => elem.estimatedTime).reduce((a, b) => a + b),
  //     "title": "Cooking",
  //     "status": item.recipe.recipeTechniques.some(elem => elem.culinaryTechnique.status == true),
  //     "icon": "./assets/images/recipe.svg",
  //     "cooking":  [{
  //               "id": 1,
  //               "culinaryTechniqueTitle": 'Culinary Technique',
  //               "estimatedTime": item.recipe.recipeTechniques.map(elem => elem.estimatedTime).reduce((a, b) => a + b),
  //               "status": item.recipe.recipeTechniques.some(elem => elem.culinaryTechnique.status == true)
  //           }],
  //   }; 
  //   activities.push(cooking);

  //   let story = {
  //     "time": item.storyTime,
  //     "title": "Story",
  //     "status": true,
  //     "icon": "./assets/images/book.svg"
  //   };

  //   activities.push(story);

  //   let activityList = [];
  //   if (item.multiSensoryQuestions && Object.keys(item.multiSensoryQuestions).length) {
  //     activityList.push({
  //       "id": item.multiSensoryQuestions.id,
  //       "title": "Sensory Learning Exercise",
  //       "time": item.multiSensoryQuestions.estimatedTime ? item.multiSensoryQuestions.estimatedTime : 0,
  //       "status": item.activity.status,
  //       "lable": "Sensory Learning Exercise"
  //     });
  //   }
  //   // if (item.activity && Object.keys(item.activity).length) {
  //   //   activityList.push({
  //   //     "id": item.activity.id,
  //   //     "title": item.activity.activityTitle,
  //   //     "time": item.activity.estimatedTime ? item.activity.estimatedTime : 0,
  //   //     "status": item.activity.status,
  //   //     "lable": "Sensory Learning Exercise"
  //   //   });
  //   // }

  //   if (item.experiment && Object.keys(item.experiment).length) {
  //     activityList.push({
  //       "id": item.experiment.id,
  //       "title": item.experiment.experimentTitle,
  //       "time": item.experiment.estimatedMakeTime ? item.experiment.estimatedMakeTime : 0,
  //       "status": item.experiment.status,
  //       "lable": "Science Experiment"
  //     });
  //   }

  //   if (!item.activity) {
  //     item.activity = {
  //       estimatedMakeTime: 10,
  //       status: false
  //     }
  //   }
  //   let learningActivity = {
  //     "time": (item.multiSensoryQuestions.estimatedTime ? item.multiSensoryQuestions.estimatedTime : 0) + (item.experiment.estimatedMakeTime ? item.experiment.estimatedMakeTime : 0), // remove temperorary condition once estimatedMakeTime added by api
  //     "title": "Learning Activities",
  //     "status": item.activity.status == true || item.experiment.status == true ? true : false,
  //     "Activities": activityList,
  //     "icon": "./assets/images/recipe.svg",
  //     }
  //   activities.push(learningActivity);

  //   const assessMents = [];
  //   let totalTime = 0;
  //   let assesmentStatus = [];
  //   let label = ""

  //   if (item.elaQuestions.length > 0) {
  //     totalTime = totalTime + item.elaQuestions.map(elem => elem.estimatedTime).reduce((a, b) => a + b);
  //     item.elaQuestions[0].question_type.estimatedTime = item.elaQuestions.map(elem => elem.estimatedTime).reduce((a, b) => a + b); 
  //     item.elaQuestions[0].question_type["lable"] = "English Language Art Questions";
  //     item.elaQuestions[0].question_type.assignedQuestions = item.elaQuestions.length;
  //     item.elaQuestions[0].question_type.totalQuestions = item.elaQuestions.length;
  //     assessMents.push(item.elaQuestions[0].question_type);
  //     assesmentStatus.push(item.elaQuestions[0].question_type.status);
  //   }

  //   if (item.mathQuestions.length > 0) {
  //     totalTime = totalTime + item.mathQuestions.map(elem => elem.estimatedTime).reduce((a, b) => a + b);
  //     item.mathQuestions[0].question_type.estimatedTime = item.mathQuestions.map(elem => elem.estimatedTime).reduce((a, b) => a + b); 
  //     item.mathQuestions[0].question_type["lable"] = "Math Questions";
  //     item.mathQuestions[0].question_type.assignedQuestions = item.mathQuestions.length;
  //     item.mathQuestions[0].question_type.totalQuestions = item.mathQuestions.length;
  //     assessMents.push(item.mathQuestions[0].question_type);
  //     assesmentStatus.push(item.mathQuestions[0].question_type.status);
  //   }


  //   if (item.ngssQuestions.length > 0) {
  //     totalTime = totalTime + item.ngssQuestions.map(elem => elem.estimatedTime).reduce((a, b) => a + b);
  //     item.ngssQuestions[0].question_type.estimatedTime = item.ngssQuestions.map(elem => elem.estimatedTime).reduce((a, b) => a + b); 
  //     item.ngssQuestions[0].question_type["lable"] = "NGSS Questions";
  //     item.ngssQuestions[0].question_type.assignedQuestions = item.ngssQuestions.length;
  //     item.ngssQuestions[0].question_type.totalQuestions = item.ngssQuestions.length;
  //     assessMents.push(item.ngssQuestions[0].question_type);
  //     assesmentStatus.push(item.ngssQuestions[0].question_type.status);
  //   }

  //   if (item.ncssQuestions.length > 0) {
  //     totalTime = totalTime + item.ncssQuestions.map(elem => elem.estimatedTime).reduce((a, b) => a + b);
  //     item.ncssQuestions[0].question_type.estimatedTime = item.ncssQuestions.map(elem => elem.estimatedTime).reduce((a, b) => a + b);
  //     item.ncssQuestions[0].question_type["lable"] = "NCSS Questions";
  //     item.ncssQuestions[0].question_type.assignedQuestions = item.ncssQuestions.length;
  //     item.ncssQuestions[0].question_type.totalQuestions = item.ncssQuestions.length;
  //     assessMents.push(item.ncssQuestions[0].question_type);
  //     assesmentStatus.push(item.ncssQuestions[0].question_type.status);
  //   }



  //   let assessment = {
  //     "time": totalTime,
  //     "title": "Assessments",
  //     "status": assesmentStatus.some(elem => elem == true),
  //     "icon": "./assets/images/rocket.svg",
  //     "Assessments": assessMents
  //   }

  //   activities.push(assessment);
  //   let totalTimes = activities.map(elem => elem.time).reduce((a, b) => a + b);
  //   // this.grade = item.grade.grade;
  //   this.resultLessonInfo = item;
  //   this.resultLessonInfo["estimatedTotalTime"] = totalTimes;
  //   this.resultLessonInfo["activities"] = activities;
  //   // this.lessonList = item.recipe;

  // }
  getRecipeList(item) {
    this.teacherService.getLessonById(item.id).subscribe(
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
            "time": item.recipe.recipeTechniques.map(elem => elem.estimatedTime ? elem.estimatedTime: 0).reduce((a, b) => a + b),
            "title": "Cooking",
            "status": item.recipe.recipeTechniques.some(elem => elem.culinaryTechnique.status == true),
            "icon": "./assets/images/recipe.svg",
            "cooking": [{
              "id": 1,
              "culinaryTechniqueTitle": 'Culinary Technique',
              "estimatedTime": item.recipe.recipeTechniques.map(elem => elem.estimatedTime ? elem.estimatedTime: 0).reduce((a, b) => a + b),
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
  }
  getClassList(){
     this.teacherService.getClassesList().subscribe(
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

  getCustomList(){
    this.teacherService.customList().subscribe(
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
    this.teacherService.titleSettingValidator(name, lable).subscribe(
      (data) => {
        // console.log(data);
      },
      (error) => {
        // console.log(error);
        this.AssignLesson.controls['title'].setErrors({ 'titleValidate': true });
      }
    );
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
      this.AssignLesson.controls.fromDate.setValue(dateObj);
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
onDefaultChanged(e){
  this.advance = e.target.checked;
}


AdvanceLink() {
  if(this.advance == true){
    return;
  }else{
    localStorage.setItem('settings', JSON.stringify(this.AssignLesson.value));
    this.closeModal.close();
    this.resultLessonInfo["defaultSetting"] = this.advance;
    this.resultLessonInfo["classList"] = this.classList;
    this.teacherService.setLessonData( this.resultLessonInfo);
    sessionStorage.setItem('lsData',JSON.stringify(this.resultLessonInfo));
    this.router.navigate(['/teacher/explore-lessons-setting', this.lessonInfo.id]);
  }
   
}
  open(content,item) {
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
  
    if(!this.customList.length){
        this.showCustomList = false;
    }else{
      this.showCustomList = true;
      if (!this.resultLessonInfo.customSetting) {
        this.settingTitle = 'Select Setting'
      }
      else {
        this.settingTitle = this.resultLessonInfo.customSetting
      }
    }
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });

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
      this.startDate = moment.utc(new Date(scrData.fromDate.year, scrData.fromDate.month - 1, scrData.fromDate.day ));
      this.endDate = moment.utc(new Date(scrData.toDate.year, scrData.toDate.month - 1, scrData.toDate.day ));
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
      else if (scrData.customSetting == null ) {
        obj['settingName'] = "Default";
        obj['content'] = this.resultLessonInfo.activities;
      }
      else {
        obj['customSettingId'] = scrData.customSetting.id;
      }
      this.teacherService.assignLesson(obj).subscribe(
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

}
