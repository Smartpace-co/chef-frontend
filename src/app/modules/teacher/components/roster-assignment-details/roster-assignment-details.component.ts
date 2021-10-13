import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';

import {
  faChevronRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faChevronLeft,
  faAngleDown,
  faAngleUp,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import * as _ from 'lodash';
import { error } from 'selenium-webdriver';

@Component({
  selector: 'app-roster-assignment-details',
  templateUrl: './roster-assignment-details.component.html',
  styleUrls: ['./roster-assignment-details.component.scss']
})
export class RosterAssignmentDetailsComponent implements OnInit {

  LeftArrow = faAngleDoubleLeft;
  rightArrow = faAngleDoubleRight;
  RightArrow = faChevronRight;
  leftArrow = faChevronLeft;
  DownArrow = faAngleDown;
  UpArrow = faAngleUp;
  exclamation = faExclamationTriangle;

  assignmentId:number;
  assignmentDetails =[];
  reportData:any;
  isCollapse=false;
  questionList = [];
  // assignmentDetails = [
  //   {
  //   "Id": 1,
  //   "name": "Samuel, Aaron",
  //   "openTime": "12:54 PM,10/20/2020",
  //   "closeTime": "12:59 PM,10/20/2020 ",
  //   "status": "Completed",
  //   "showIcon" : false,
  //   "subList" :[
  //     {
  //       "question1": "Boiling water is an example of which type of heat energy transfer?",
  //       "answer1": "Convection",
  //       "question2":"Which part of  the body can get inflamed from a gluten allergy?",
  //       "answer2": "Liver and Kidney can be …",
  //       "incorrectAttempts": "6",
  //       "numberOfAttempts": "7",
  //       "boiling": "Boiling Experiment",
  //       "cooking": "Cooking Steps",
  //       "cleaing": "Cleaning",
  //       "culinary": "Culinary Technique",
  //     }
  //    ]
  //   },
  //   {
  //     "Id": 2,
  //     "name": "Ruaz, Kevin",
  //     "openTime": "12:54 PM,10/20/2020",
  //     "closeTime": "12:59 PM,10/20/2020 ",
  //     "status": "Making Progress",
  //     "showIcon" : false,
  //     "subList" :[
  //       {
  //         "question1": "Boiling water is an example of which type of heat energy transfer?",
  //         "answer1": "Convection",
  //         "question2":"Which part of  the body can get inflamed from a gluten allergy?",
  //         "answer2": "Liver and Kidney can be …",
  //         "incorrectAttempts": "6",
  //         "numberOfAttempts": "7",
  //         "boiling": "Boiling Experiment",
  //         "cooking": "Cooking Steps",
  //         "cleaing": "Cleaning",
  //         "culinary": "Culinary Technique",
  //       }
  //      ]
  //     },
  //     {
  //       "Id": 3,
  //       "name": "Keil, Exie",
  //       "openTime": "12:54 PM,10/20/2020",
  //       "closeTime": "12:59 PM,10/20/2020 ",
  //       "status": " Needs Help",
  //       "showIcon" : true,
  //       "subList" :[
  //         {
  //           "question1": "Boiling water is an example of which type of heat energy transfer?",
  //           "answer1": "Convection",
  //           "question2":"Which part of  the body can get inflamed from a gluten allergy?",
  //           "answer2": "Liver and Kidney can be …",
  //           "incorrectAttempts": "6",
  //           "numberOfAttempts": "7",
  //           "boiling": "Boiling Experiment",
  //           "cooking": "Cooking Steps",
  //           "cleaing": "Cleaning",
  //           "culinary": "Culinary Technique",
  //         }
  //        ]
  //       },
  //       {
  //         "Id": 4,
  //         "name": "Mintz, Terrance",
  //         "openTime": "12:54 PM,10/20/2020",
  //         "closeTime": "12:59 PM,10/20/2020 ",
  //         "status": "Emerging",
  //         "showIcon" : false,
  //         "subList" :[
  //           {
  //             "question1": "Boiling water is an example of which type of heat energy transfer?",
  //             "answer1": "Convection",
  //             "question2":"Which part of  the body can get inflamed from a gluten allergy?",
  //             "answer2": "Liver and Kidney can be …",
  //             "incorrectAttempts": "6",
  //             "numberOfAttempts": "7",
  //             "boiling": "Boiling Experiment",
  //             "cooking": "Cooking Steps",
  //             "cleaing": "Cleaning",
  //             "culinary": "Culinary Technique",
  //           }
  //          ]
  //         },
  //         {
  //           "Id": 5,
  //           "name": "Kimmell, Cari",
  //           "openTime": "12:54 PM,10/20/2020",
  //           "closeTime": "12:59 PM,10/20/2020 ",
  //           "status": "Proficient",
  //           "showIcon" : false,
  //           "subList" :[
  //             {
  //               "question1": "Boiling water is an example of which type of heat energy transfer?",
  //               "answer1": "Convection",
  //               "question2":"Which part of  the body can get inflamed from a gluten allergy?",
  //               "answer2": "Liver and Kidney can be …",
  //               "incorrectAttempts": "6",
  //               "numberOfAttempts": "7",
  //               "boiling": "Boiling Experiment",
  //               "cooking": "Cooking Steps",
  //               "cleaing": "Cleaning",
  //               "culinary": "Culinary Technique",
  //             }
  //            ]
  //           },
  //           {
  //             "Id": 6,
  //             "name": "Nethery, Danilo",
  //             "openTime": "12:54 PM,10/20/2020",
  //             "closeTime": "12:59 PM,10/20/2020 ",
  //             "status": "Emerging",
  //             "showIcon" : false,
  //             "subList" :[
  //               {
  //                 "question1": "Boiling water is an example of which type of heat energy transfer?",
  //                 "answer1": "Convection",
  //                 "question2":"Which part of  the body can get inflamed from a gluten allergy?",
  //                 "answer2": "Liver and Kidney can be …",
  //                 "incorrectAttempts": "6",
  //                 "numberOfAttempts": "7",
  //                 "boiling": "Boiling Experiment",
  //                 "cooking": "Cooking Steps",
  //                 "cleaing": "Cleaning",
  //                 "culinary": "Culinary Technique",
  //               }
  //              ]
  //             },
  //             {
  //               "Id": 7,
  //               "name": "Cobble, Adelaida",
  //               "openTime": "12:54 PM,10/20/2020",
  //               "closeTime": "12:59 PM,10/20/2020 ",
  //               "status": "Proficient",
  //               "showIcon" : false,
  //               "subList" :[
  //                 {
  //                   "question1": "Boiling water is an example of which type of heat energy transfer?",
  //                   "answer1": "Convection",
  //                   "question2":"Which part of  the body can get inflamed from a gluten allergy?",
  //                   "answer2": "Liver and Kidney can be …",
  //                   "incorrectAttempts": "6",
  //                   "numberOfAttempts": "7",
  //                   "boiling": "Boiling Experiment",
  //                   "cooking": "Cooking Steps",
  //                   "cleaing": "Cleaning",
  //                   "culinary": "Culinary Technique",
  //                 }
  //                ]
  //               },
  //               {
  //                 "Id": 8,
  //                 "name": "Legrange, Larraine",
  //                 "openTime": "12:54 PM,10/20/2020",
  //                 "closeTime": "12:59 PM,10/20/2020 ",
  //                 "status": "Minimal",
  //                 "showIcon" : false,
  //                 "subList" :[
  //                   {
  //                     "question1": "Boiling water is an example of which type of heat energy transfer?",
  //                     "answer1": "Convection",
  //                     "question2":"Which part of  the body can get inflamed from a gluten allergy?",
  //                     "answer2": "Liver and Kidney can be …",
  //                     "incorrectAttempts": "6",
  //                     "numberOfAttempts": "7",
  //                     "boiling": "Boiling Experiment",
  //                     "cooking": "Cooking Steps",
  //                     "cleaing": "Cleaning",
  //                     "culinary": "Culinary Technique",
  //                   }
  //                  ]
  //                 },
  //                 {
  //                   "Id": 9,
  //                   "name": "Dunson, Tena",
  //                   "openTime": "12:54 PM,10/20/2020",
  //                   "closeTime": "12:59 PM,10/20/2020 ",
  //                   "status": "Partial",
  //                   "showIcon" : false,
  //                   "subList" :[
  //                     {
  //                       "question1": "Boiling water is an example of which type of heat energy transfer?",
  //                       "answer1": "Convection",
  //                       "question2":"Which part of  the body can get inflamed from a gluten allergy?",
  //                       "answer2": "Liver and Kidney can be …",
  //                       "incorrectAttempts": "6",
  //                       "numberOfAttempts": "7",
  //                       "boiling": "Boiling Experiment",
  //                       "cooking": "Cooking Steps",
  //                       "cleaing": "Cleaning",
  //                       "culinary": "Culinary Technique",
  //                     }
  //                    ]
  //                   },
  //                   {
  //                     "Id": 10,
  //                     "name": "Srivastava, Rohan",
  //                     "openTime": "12:54 PM,10/20/2020",
  //                     "closeTime": "12:59 PM,10/20/2020 ",
  //                     "status": "Minimal",
  //                     "showIcon" : false,
  //                     "subList" :[
  //                       {
  //                         "question1": "Boiling water is an example of which type of heat energy transfer?",
  //                         "answer1": "Convection",
  //                         "question2":"Which part of  the body can get inflamed from a gluten allergy?",
  //                         "answer2": "Liver and Kidney can be …",
  //                         "incorrectAttempts": "6",
  //                         "numberOfAttempts": "7",
  //                         "boiling": "Boiling Experiment",
  //                         "cooking": "Cooking Steps",
  //                         "cleaing": "Cleaning",
  //                         "culinary": "Culinary Technique",
  //                       }
  //                      ]
  //                     },
  // ];
  constructor( private teacherService : TeacherService,
    private actRoute: ActivatedRoute,
     private router: Router,private toast: ToasterService,) {
    this.assignmentId = this.actRoute.snapshot.params.id
    }

  ngOnInit(): void {
    this.getStudentList();
  }

  getStudentList(){
     this.teacherService.getAssignmentStudentList(this.assignmentId).subscribe((res)=>{
        // console.log("response",res);
        if(res && res.data && res.status == 200){
          this.assignmentDetails = res.data;
         
          // console.log("assignment details", this.assignmentDetails);
        }
     },(error)=>{
      console.log(error);
     })
  }

 
 getStudentReport(item){
   this.teacherService.getAssignmentStudentReport(item.id,this.assignmentId).subscribe((res)=>{
    // console.log("student report",res);
    if(res && res.data && res.status == 200){
        // this.reportData = res.data
        let answers;
          this.reportData = res.data;
          this.questionList = _.map(res.data.questionsAnswered, item => {
            let allAns = [];
            if (item.isEssayQuestion) {
              answers = item.studentAnswer;
            } else {
              _.forEach(item.studentAnswer, item => {
                allAns.push(item.option);
              });
              answers = allAns.join(',');
            }
            let obj = {
              questionid:item.id,
              question: item.question,
              isEssayQuestion: item.isEssayQuestion,
              studentAnswer: answers,
              incorrectAttempt: item.isEssayQuestion ? undefined : item.incorrectAttempt,
              totalAttempt: item.isEssayQuestion ? undefined : item.totalAttempt,
            }
            return obj;
       
          });
          // console.log("questionlist1",this.questionList);
          
        // this.isCollapse = true;
    }
    // console.log("questionlist2",this.questionList);
   },(error)=>{
    console.log(error);
    this.reportData =[];
    this.questionList = [];
    this.toast.showToast(error.error.message, '', 'error');
   })
 }
  
  
 UpdateAnswer(event,quesdetails,item){
  var obj ={};
  // obj["assignLessonId"] = +item.assignmentId;
  obj["assignLessonId"]= this.assignmentId
  obj["studentId"] = item.id;
  obj["questionId"] = quesdetails.questionid;
  if(event.target.value == "true"){
    obj["isCorrect"] = true;
  }else{
    obj["isCorrect"] = false;
  }
  // obj["isCorrect"] = event.target.value;

  console.log("request object",obj);
  this.teacherService.saveAnswers(obj).subscribe((res)=>{
      console.log("res",res);
  },(error)=>{
    this.toast.showToast(error.error.message, '', 'error');
  })
  
 }
 
  
  
  

}
