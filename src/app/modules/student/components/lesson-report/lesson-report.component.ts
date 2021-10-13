import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { StudentService } from '@modules/student/services/student.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-lesson-report',
  templateUrl: './lesson-report.component.html',
  styleUrls: ['./lesson-report.component.scss']
})
export class LessonReportComponent implements OnInit {
  LeftArrow = faAngleLeft;
  assignmentId: any;
  allDetails: any;
  isLoad = false;
  currentUser: any;
  questionList = [];
  constructor(private studentService: StudentService, private toast: ToasterService, private activatedRoute: ActivatedRoute) {
    this.assignmentId = this.activatedRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(window.sessionStorage.getItem("currentUser"));
    this.getReportDetails();
  }

  getReportDetails(): void {
    this.studentService.getLessonReport(this.assignmentId)
      .subscribe((response) => {
        if (response && response.data) {
          let answers;
          this.allDetails = response.data;
          if (this.allDetails && this.allDetails.questionsAnswered) {
            this.questionList = _.map(response.data.questionsAnswered, item => {
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
                question: item.question,
                isEssayQuestion: item.isEssayQuestion,
                studentAnswer: answers,
                incorrectAttempt: item.isEssayQuestion ? undefined : item.incorrectAttempt,
                totalAttempt: item.isEssayQuestion ? undefined : item.totalAttempt,
              }
              return obj;
            });
          }
          this.isLoad = true;
        }
      }, (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      });
  }
}
