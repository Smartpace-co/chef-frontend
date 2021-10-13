import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FaConfig } from '@fortawesome/angular-fontawesome';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  faCartPlus,
  faChevronRight,
  faPlus,
  faSearch,
  faStickyNote,
  faList,
  faThLarge,
  faCheckCircle,
  faSort,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faChevronLeft,
  faStar,
  faBookmark,
  faCalendarAlt,
  faAngleDown,
  faAngleUp,
  faEdit,
  faClock
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-customize-assign-lesson',
  templateUrl: './customize-assign-lesson.component.html',
  styleUrls: ['./customize-assign-lesson.component.scss']
})
export class CustomizeAssignLessonComponent implements OnInit {
  LeftArrow = faAngleDoubleLeft;
  rightArrow = faAngleDoubleRight;
  PlusIcon = faPlus;
  SearchIcon = faSearch;
  Ingredients = faCartPlus;
  Instructions = faStickyNote;
  RightArrow = faChevronRight;
  leftArrow = faChevronLeft;
  check = faCheckCircle;
  SortByIcon = faSort;
  Star = faStar;
  BookmarkIcon = faBookmark;
  Calendar = faCalendarAlt;
  DownArrow = faAngleDown;
  UpArrow = faAngleUp;
  EditIcon = faEdit;
  ClockIcon = faClock;
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  AssignLesson: FormGroup;
  classTitle = 'Select class';
  classList= [
    {
        "id": 1,
        "menu": "Class: Room 112",
        "classGrade": "Grade 1",
        "classStandards": [
            "standard 1"
        ],
        "classStatus": "active",
        "type": "classList",
        "icon": ""
    },
    {
        "id": 2,
        "menu": "Special Class: Room 102",
        "classGrade": "Grade 1",
        "classStandards": [
            "standard 1"
        ],
        "classStatus": "active",
        "type": "classList",
        "icon": ""
    }
  ];
  settingsList = [
    {
    "Id": 1,
    "activityTypeIcon": "./assets/images/recipe-icon.png",
    "activityType": "Cooking",
    "estimatedTime": "35 min",
    "switch" : true,
    "instructions" : "",
    "subList" :[
      {
        "activityType": "Culinary Technique",
        "estimatedTime": "5 min",
        "questions":""
      }
     ]
    },
    {
      "Id": 2,
      "activityTypeIcon": "./assets/images/lesson-book-icon.png",
      "activityType": "Story",
      "estimatedTime": "10 min",
      "switch" : false,
      "instructions" : "",
      "subList" :[]
    },
    {
      "Id": 3,
      "activityTypeIcon": "./assets/images/lesson-activity-icon.png",
      "activityType": "Learning Activities",
      "estimatedTime": "25 min",
      "switch" : true,
      "instructions" : "",
      "subList" :[
        {
          "activityType": "Sensory Learning Exercise",
          "estimatedTime": "5 min",
          "questions":""
        },
        {
          "activityType": "Health and Wellness",
          "estimatedTime": "10 min",
          "questions":""
        },
        {
          "activityType": "Science Experiment",
          "estimatedTime": "10 min",
          "questions":""
        }
      ]
    },
    {
      "Id": 4,
      "activityTypeIcon": "./assets/images/lessson-rocket-icon.png",
      "activityType": "Assessments",
      "estimatedTime": "20 min",
      "switch" : true,
      "instructions" : "Each assessment question is a multiple choice question that is estimated to take 1 minute or less. The Take Action Activities are meant to be collaborative and estimated to take 10 minutes to answer. ",
      "subList" :[
        {
          "activityType": "Social Studies Questions",
          "estimatedTime": "",
          "questions": "2/4 questions"
        },
        {
          "activityType": "English Language Arts Questions",
          "estimatedTime": "",
          "questions": "4/4 questions"
        },
        {
          "activityType": "Math Questions",
          "estimatedTime": "",
          "questions": "4/4 questions"
        }, 
        {
          "activityType": "Science Questions",
          "estimatedTime": "",
          "questions": "4/4 questions"
        },
        {
          "activityType": "Take Action Activity",
          "estimatedTime": "",
          "questions": "2/4 questions"
        }
       ]
      },
      {
        "Id": 5,
        "activityTypeIcon": "./assets/images/recipe-icon.png",
        "activityType": "Activities and Mini Games",
        "estimatedTime": "5 min per game",
        "switch" : true,
        "instructions" : "",
        "subList" :[
          {
            "activityType": "Vegetable Slice",
            "estimatedTime": "5 min",
            "questions":""
          },
          {
            "activityType": "Drag n Drop Ingredients",
            "estimatedTime": "5 min",
            "questions":""
          },
          {
            "activityType": "Matching the Flag",
            "estimatedTime": "5 min",
            "questions":""
          }
         ]
        }
  ];
  constructor(public faConfig: FaConfig,
    private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    faConfig.defaultPrefix = 'far';
    let today = calendar.getToday()
    this.fromDate = new NgbDate(today.year, today.month, today.day)
    this.toDate = new NgbDate(today.year, today.month, today.day)
  }

  ngOnInit(): void {
    this.AssignLesson = new FormGroup({
      title: new FormControl('', [Validators.required]),
      class: new FormControl(null, [Validators.required]),
      fromDate: new FormControl( this.fromDate, [Validators.required]),
      toDate: new FormControl (this.toDate, [Validators.required]),
    });
  }
  get formControl() {
    return this.AssignLesson.controls;
  }
  classChange(event) {

  }
}
