import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import * as _ from 'lodash';
import { AuthService } from '@modules/auth/services/auth.service';
@Component({
  selector: 'app-conversational-sentence',
  templateUrl: './conversational-sentence.component.html',
  styleUrls: ['./conversational-sentence.component.scss']
})
export class ConversationalSentenceComponent implements OnInit {

  lessonHederConfig = {};
  isVisibleNext = true;
  assignmentId: any;
  conversationText: string;
  currentAssignedLesson;
  lesson;
  isLoad = false;
  constructor(private toast: ToasterService, private utilityService: UtilityService, private router: Router, private studentService: StudentService,private authService: AuthService,) {
    this.authService.setuserlang();
    this.lessonHederConfig['stepBoard'] = null;
  }

  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId');
    this.lesson = localStorage.getItem('lessonType');
    this.getSentenceData();
    let previousTime = this.utilityService.calculateTimeBetweenDates();
    this.updateLessonProgress(previousTime);
  }

  updateLessonProgress(time: any): void {
    let submission = {
      currentScreen: this.router.url.split('/student')[1],
      timeTaken: time ? time : undefined,
      completedStep: 'Story'
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
  getSentenceData() {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data) {
          this.currentAssignedLesson = response.data;
          this.conversationText = this.currentAssignedLesson.conversationSentence && this.currentAssignedLesson.conversationSentence.conversationSentence ? this.currentAssignedLesson.conversationSentence.conversationSentence : undefined;
          if (!this.conversationText) {
            this.toast.showToast('There is no conversation sentence.', '', 'warning');
          }
          this.isLoad = true;
          this.isVisibleNext = false;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );

  }
  onAnsItemChange(event: any): void {
    if (event && event.target && event.target.value) {
      this.isVisibleNext = false;
    }
  }

  onFirstPage(): void {
    this.router.navigate(['student/learning-objective']);
  }

  /**
  * on Next click event
 */
  onNext(): void {
    if (this.isVisibleNext === false) {
      if (this.currentAssignedLesson.customSetting && this.currentAssignedLesson.customSetting.content) {
        for (let ob of this.currentAssignedLesson.customSetting.content) {
          if (ob.title === 'Cooking' && ob.status === true) {
            this.router.navigate(['/student/safety-hygiene']);
            break;
          } else if (ob.title === 'Learning Activities' && ob.status === true) {
            let isSensoryExercise = _.find(ob.Activities, function (item) { return item.lable === 'Sensory Learning Exercise'; });
            let isExperiment = _.find(ob.Activities, function (item) { return item.lable === 'Science Experiment'; });
            if (isSensoryExercise && isSensoryExercise.status === true && this.currentAssignedLesson.lesson && this.currentAssignedLesson.lesson.multiSensoryQuestions && !_.isEmpty(this.currentAssignedLesson.lesson.multiSensoryQuestions.question.trim())) {
              this.router.navigate(['/student/sensory-exercise']);
              break;
            } else if (isExperiment && isExperiment.status === true) {
              this.router.navigate(['/student/experiment'])
              break;
            }
          } else if (ob.title === 'Assessments' && ob.status === true) {
            this.router.navigate(['/student/assessment-question']);
            break;
          } else {
            this.router.navigate(['/student/action-activities']);
          }
        }
      } else if (this.lesson === 'Explore') {
        this.router.navigate(['/student/safety-hygiene']);
      }
    }
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.router.navigate(['/student/recipe-fact']);
  }

}
