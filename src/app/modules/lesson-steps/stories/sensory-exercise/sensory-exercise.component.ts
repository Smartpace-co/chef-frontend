import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-sensory-exercise',
  templateUrl: './sensory-exercise.component.html',
  styleUrls: ['./sensory-exercise.component.scss']
})
export class SensoryExerciseComponent implements OnInit {

  descriptiveAnswer;
  lessonHederConfig = {};
  currentAssignedLesson;
  assignmentId: string;
  isVisibleNext = true;
  questionData;
  lesson;
  constructor(private router: Router, private utilityService: UtilityService, private studentService: StudentService, private toast: ToasterService) {
    this.lessonHederConfig['stepBoard'] = {
      // stepNumber: 'Step 3',
      stepTitle: 'Sensory Exercise',
      stepLogo: './assets/images/bulb.png'
    }
  }

  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId');
    this.lesson = localStorage.getItem('lessonType');
    let previousTime = this.utilityService.calculateTimeBetweenDates();
    this.updateLessonProgress(previousTime);
    this.getLessonData();
  }

  updateLessonProgress(time: any): void {
    let submission = {
      currentScreen: this.router.url.split('/student')[1],
      timeTaken: time ? time : undefined
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

  getLessonData(): void {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data && response.data.lesson) {
          this.currentAssignedLesson = response.data;
          this.questionData = response.data.lesson.multiSensoryQuestions;
          this.isVisibleNext = false;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  /**
   * To get entered text from textarea field.
   * @param data 
   */
  onInputValueChange(data) {
    this.descriptiveAnswer = data;
  }

  /**
   * API call to save answer for sensory-exercise.
   */
  onSubmitAnswer(): void {
    if (!_.isEmpty(this.descriptiveAnswer)) {
      let submission = {
        assignLessonId: parseInt(this.assignmentId),
        questionId: this.questionData.id,
        answerTypeId: this.questionData.answerTypeId,
        essay: this.descriptiveAnswer
      };
      this.studentService.saveAnswerToAPI(submission).subscribe(
        (response: any) => {
          if (response && response.data) {
            this.toast.showToast(' Answer saved successfully', '', 'success');
            // this.isVisibleNext = false;
          }
        },
        (error) => {
          console.log(error);
          if (error && error.error.status === 400) {
            this.toast.showToast(error.error.message, '', 'error');
            // setTimeout(() => {
            //   this.isVisibleNext = false;
            // }, 2000);
          }
        }
      );
    } else {
      this.toast.showToast('Please add answer of this exercise.', '', 'error');
    }
  }

  /**
   * on click of previous
   */
  onPrevious(): void {
    if (this.currentAssignedLesson.customSetting && this.currentAssignedLesson.customSetting.content) {
      for (let ob of this.currentAssignedLesson.customSetting.content) {
        if (ob.title === 'Cooking' && ob.status === true) {
          this.router.navigate(['/student/ingredient-list']);
          break;
        } else if (ob.title === 'Story' && ob.status === true) {
          this.router.navigate(['/student/conversional-sentence'])
        }
      }
    } else if (this.lesson === 'Explore') {
      this.router.navigate(['/student/ingredient-list']);
    }
  }

  /**
   * on click of next
   */
  onNext(): void {
    if (this.currentAssignedLesson.customSetting && this.currentAssignedLesson.customSetting.content) {
      for (let ob of this.currentAssignedLesson.customSetting.content) {
        if (ob.title === 'Cooking' && ob.status === true) {
          if (!_.isEmpty(this.currentAssignedLesson.recipe.preparationSteps)) {
            this.router.navigate(['/student/cooking-preparation']);
          } else {
            this.router.navigate(['/student/cooking-technique']);
          }
          break;
        } else if (ob.title === 'Learning Activities' && ob.status === true) {
          let isExperiment = _.find(ob.Activities, function (item) { return item.lable === 'Science Experiment'; });
          if (isExperiment && isExperiment.status === true) {
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
      if (!_.isEmpty(this.currentAssignedLesson.recipe.preparationSteps)) {
        this.router.navigate(['/student/cooking-preparation']);
      } else {
        this.router.navigate(['/student/cooking-technique']);
      }
    }
  }
}
