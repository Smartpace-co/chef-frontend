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

  this.teacherService.saveAnswers(obj).subscribe((res)=>{
  },(error)=>{
    this.toast.showToast(error.error.message, '', 'error');
  })
  
 }
 
  
  
  

}
