import { Component, OnInit } from '@angular/core';
import { faAngleDown, faAngleUp, faArrowUp, faChevronLeft, faChevronRight, faEdit, faExclamationCircle, faLongArrowAltUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-teacher-homepage',
  templateUrl: './teacher-homepage.component.html',
  styleUrls: ['./teacher-homepage.component.scss']
})
export class TeacherHomepageComponent implements OnInit {

  leftArrow = faChevronLeft;
  rightArrow = faChevronRight;
  DownArrow = faAngleDown;
  UpArrow = faAngleUp;
  UpArrowLong = faArrowUp;
  EditIcon = faEdit;
  exclamation = faExclamationCircle;

  progressBar = false; //replace only progress bar in completion rate column
  completionRate= false;//replace whole completion rate column

  percentage = true; //replace only percentage in completion rate column
  scoreComparison= true;//replace completion rate column
  constructor() { }

  ngOnInit(): void {
  }

  classData = [
    {
      id: 1,
      details: "Standards that Need Practice",
      practice: "CCSS Math",
      practiceText: true,
      practiceimage: false,
    },
    {
      id: 1,
      details: "Number of Skills Mastered ",
      practice: "5",
      practiceText: true,
      practiceimage: false,
    },
    {
      id: 1,
      details: "Average Class Accuracy",
      practice: "80%",
      practiceText: true,
      practiceimage: false,
    },
    {
      id: 1,
      details: "Customize Statistics ",
      practice: "+",
      practiceText: false,
      practiceimage: true,
    }
  ];

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: '<div class=\'nav-btn plan-next-slide\'></div>',
    prevArrow: '<div class=\'nav-btn plan-prev-slide\'></div>',
    dots: false,
    infinite: false,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 1
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

  progressActivity = [
    {
      Id: '1',
      heading: "Banana Breakfast Cookies",
      status: "Ongoing Virtual Lesson",
      date: "XX/XX/XXXX",
    },
    {
      Id: '2',
      heading: "Banana Breakfast Cookies",
      status: "Ongoing Virtual Lesson",
      date: "XX/XX/XXXX",
    },
    {
      Id: '3',
      heading: "Banana Breakfast Cookies",
      status: "Ongoing Virtual Lesson",
      date: "XX/XX/XXXX",
    },
    {
      Id: '4',
      heading: "Banana Breakfast Cookies",
      status: "Ongoing Virtual Lesson",
      date: "XX/XX/XXXX",
    },
  ];

  sortByTitle = 'Sort by';
  sortByList = [
    {
      id: 1,
      menu: "Performance (Low to High)",
    },
    {
      id: 2,
      menu: "Performance (High to Low)",
    },
    {
      id: 3,
      menu: "Completion Rate ",
    },
    {
      id: 4,
      menu: "Alphabetically ",
    },
    {
      id: 5,
      menu: "Time Spent ",
    }
  ];

  studentList = [
    {
      "Id": 1,
      "studentPhoto": "./assets/images/student.png",
      "name": "Samuel, Aaron",
      "percentage": "NA",
      "status": "5/10",
      "scoreComparison": "5%",
      "exclamation": true,
      "subList": [
        {
          "remainerText": "Send a reminder to complete the lesson",
        }
      ]
    },
    {
      "Id": 2,
      "studentPhoto": "./assets/images/student.png",
      "name": "Ruaz, Kevin",
      "percentage": "5%",
      "status": "15/15",
      "scoreComparison": "5%",
      "exclamation": false,
      "subList": [
        {
          "remainerText": "Congratulate student for completing assignment ",
        }
      ]
    },
    {
      "Id": 3,
      "studentPhoto": "./assets/images/student.png",
      "name": "Keil, Exie",
      "percentage": "5%",
      "status": "2/3",
      "scoreComparison": "5%",
      "exclamation": false,
      "subList": [
        {
          "remainerText": "Congratulate student for completing assignment ",
        }
      ]
    },
    {
      "Id": 4,
      "studentPhoto": "./assets/images/student.png",
      "name": "Mintz, Terrance",
      "percentage": "5%",
      "status": "2/3",
      "scoreComparison": "5%",
      "exclamation": false,
      "subList": [
        {
          "remainerText": "Congratulate student for completing assignment ",
        }
      ]
    },
    {
      "Id": 5,
      "studentPhoto": "./assets/images/student.png",
      "name": "Cobble, Adelaida",
      "percentage": "5%",
      "status": "2/3",
      "scoreComparison": "5%",
      "exclamation": false,
      "subList": [
        {
          "remainerText": "Congratulate student for completing assignment ",
        }
      ]
    },
    {
      "Id": 7,
      "studentPhoto": "./assets/images/student.png",
      "name": "Ruaz, Kevin",
      "percentage": "5%",
      "status": "2/3",
      "scoreComparison": "5%",
      "exclamation": false,
      "subList": [
        {
          "remainerText": "Congratulate student for completing assignment ",
        }
      ]
    },
    {
      "Id": 8,
      "studentPhoto": "./assets/images/student.png",
      "name": "Keil, Exie",
      "percentage": "5%",
      "status": "2/3",
      "scoreComparison": "5%",
      "exclamation": false,
      "subList": [
        {
          "remainerText": "Congratulate student for completing assignment ",
        }
      ]
    },
    {
      "Id": 9,
      "studentPhoto": "./assets/images/student.png",
      "name": "Mintz, Terrance",
      "percentage": "5%",
      "status": "2/3",
      "scoreComparison": "5%",
      "exclamation": false,
      "subList": [
        {
          "remainerText": "Congratulate student for completing assignment ",
        }
      ]
    },
    {
      "Id": 10,
      "studentPhoto": "./assets/images/student.png",
      "name": "Cobble, Adelaida",
      "percentage": "5%",
      "status": "2/3",
      "scoreComparison": "5%",
      "exclamation": false,
      "subList": [
        {
          "remainerText": "Congratulate student for completing assignment ",
        }
      ]
    },
    {
      "Id": 11,
      "studentPhoto": "./assets/images/student.png",
      "name": "Mintz, Terrance",
      "percentage": "5%",
      "status": "2/3",
      "scoreComparison": "5%",
      "exclamation": false,
      "subList": [
        {
          "remainerText": "Congratulate student for completing assignment ",
        }
      ]
    },
    {
      "Id": 12,
      "studentPhoto": "./assets/images/student.png",
      "name": "Cobble, Adelaida",
      "percentage": "5%",
      "status": "2/3",
      "scoreComparison": "5%",
      "exclamation": false,
      "subList": [
        {
          "remainerText": "Congratulate student for completing assignment ",
        }
      ]
    },
    {
      "Id": 13,
      "studentPhoto": "./assets/images/student.png",
      "name": "Samuel, Aaron",
      "percentage": "5%",
      "status": "2/3",
      "scoreComparison": "5%",
      "exclamation": false,
      "subList": [
        {
          "remainerText": "Congratulate student for completing assignment ",
        }
      ]
    },
    {
      "Id": 14,
      "studentPhoto": "./assets/images/student.png",
      "name": "Ruaz, Kevin",
      "percentage": "5%",
      "status": "2/3",
      "scoreComparison": "5%",
      "exclamation": false,
      "subList": [
        {
          "remainerText": "Congratulate student for completing assignment ",
        }
      ]
    },

  ];
}
