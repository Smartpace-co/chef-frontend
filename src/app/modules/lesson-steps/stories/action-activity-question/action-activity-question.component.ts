import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { DynamicActivityQuestionsComponent } from '@modules/lesson-steps/dynamic-activity-questions/dynamic-activity-questions.component';
import { StudentService } from '@modules/student/services/student.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-action-activity-question',
  templateUrl: './action-activity-question.component.html',
  styleUrls: ['./action-activity-question.component.scss']
})
export class ActionActivityQuestionComponent implements OnInit {
  @ViewChild('dynamicActionActivityQuestionsComponent') dynamicComponent: DynamicActivityQuestionsComponent;

  isButtonSection = {};
  isVisibleNext = true;
  assignmentId: string;
  assignmentData: any;
  AllQuestionsList: any;
  panelIndex;
  form;
  questionIndex: number = 0;
  isVisiblePrevious = true;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private location: Location,
    private toast: ToasterService, private studentService: StudentService, private utilityService: UtilityService) {
    this.isButtonSection = {
      title: 'Take Action Activity'
    };
    this.panelIndex = this.activatedRoute.snapshot.queryParams && this.activatedRoute.snapshot.queryParams.index;
  }

  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId')
    this.getStudentData();
  }

  updateLessonProgress(): void {
    let previousTime = this.utilityService.calculateTimeBetweenDates();
    let url = this.router.url.split("?")[0].split('/student')[1];
    let urlToEdit = '/student' + url + '?index=' + this.questionIndex;
    this.location.replaceState(urlToEdit);
    let submission = {
      currentScreen: url + ':' + this.questionIndex,
      timeTaken: previousTime ? previousTime : undefined
    }
    this.studentService.updateLessonProgress(this.assignmentId, submission).subscribe(
      (response: any) => {
        if (response && response.data) {
          window.sessionStorage.setItem('previousDate', JSON.stringify(new Date()));
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  /**
   * To get all the questions and pass to construct dynamic-forms.
   */
  getStudentData() {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data && response.data.lesson) {
          this.assignmentData = response.data.lesson.activity.activityQuestions;
          if (this.assignmentData && this.assignmentData.length > 0) {
            const mappedQuestion = _.map(this.assignmentData, item => {
              let ansType = item.answer_type.key;
              if (ansType === 'essay') {
                item.questionType = 'essay';
                item.form = [
                  {
                    "formCtrlName": `q1+${item.id}`,
                    "formCtrlType": "text"
                  }
                ];
              }
              return item;
            });
            this.AllQuestionsList = _.filter(mappedQuestion, item => {
              if (item && item.questionType) {
                return item;
              }
            });
            if (this.panelIndex) {
              this.questionIndex = parseInt(this.panelIndex);
            }
            this.form = this.AllQuestionsList[this.questionIndex];
            this.isVisibleNext = false;
            this.isVisiblePrevious = false;
            this.updateLessonProgress();
          }
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  /**
   * on Next click event
  */
  onNext(): void {
    this.showNextScreen();
  }
  /**
   * API call to save answers.
   * @param description 
   */
  submitAnswer(description: any): void {
    if (!_.isEmpty(description)) {
      let submission = {
        assignLessonId: parseInt(this.assignmentId),
        questionId: this.AllQuestionsList[this.questionIndex] && this.AllQuestionsList[this.questionIndex].id ? this.AllQuestionsList[this.questionIndex].id : undefined,
        answerTypeId: this.AllQuestionsList[this.questionIndex] && this.AllQuestionsList[this.questionIndex].answerTypeId ? this.AllQuestionsList[this.questionIndex].answerTypeId : undefined,
        essay: description,
        isActivityAction: true
      };
      this.studentService.saveAnswerToAPI(submission).subscribe(
        (response: any) => {
          if (response && response.data) {
            this.toast.showToast(' Answer saved successfully', '', 'success');
            // this.showNextScreen();            
            // this.isVisibleNext = false;
          }
        },
        (error) => {
          console.log(error);
          if (error && error.error.status === 400) {
            this.toast.showToast(error.error.message, '', 'error');
            // setTimeout(() => {
            //   // this.showNextScreen();
            //   this.isVisibleNext = false;
            // }, 2000);
          }
        }
      );
    } else {
      this.toast.showToast('Please add action activity.', '', 'error');
    }
  }

  /**
   * to show next questions.
   */
  showNextScreen(): void {
    // if (this.questionIndex != 0) {
    //   this.questionIndex = parseInt(localStorage.getItem('activityQuestionIndex'))
    // }
    let tempIndex = parseInt(this.panelIndex);
    if (tempIndex && this.AllQuestionsList.length === tempIndex && this.questionIndex === tempIndex) {
      this.questionIndex = this.AllQuestionsList.length;
    } else {
      this.questionIndex = this.questionIndex + 1;
    }
    // localStorage.setItem('activityQuestionIndex', this.questionIndex.toString())
    this.form = this.AllQuestionsList[this.questionIndex];
    this.updateLessonProgress();
    // this.isVisibleNext = true;
    // this.dynamicComponent.isHint = false;
    if (this.AllQuestionsList.length === this.questionIndex) {
      this.router.navigate(['/student/flag-game']);
    }
  }

  ngAfterContentChecked(): void {
    if (this.questionIndex > 0) {
      this.isVisiblePrevious = true;
    }
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    // if (this.questionIndex != 0) {
    //   this.questionIndex = parseInt(localStorage.getItem('activityQuestionIndex'))
    // }
    this.questionIndex = this.questionIndex - 1;
    // localStorage.setItem('activityQuestionIndex', this.questionIndex.toString())
    if (this.questionIndex != 0) {
      this.form = this.AllQuestionsList[this.questionIndex]
    }
    if (this.questionIndex < 0) {
      this.router.navigate(['student/action-activities']);
    }
  }
}
