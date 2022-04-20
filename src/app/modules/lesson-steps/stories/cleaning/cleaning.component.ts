import { Component, OnInit, Input, HostListener, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import * as _ from 'lodash';
import { AuthService } from '@modules/auth/services/auth.service';
import { TranslationService } from '@appcore/services/translation.service';
@Component({
  selector: 'app-cleaning',
  templateUrl: './cleaning.component.html',
  styleUrls: ['./cleaning.component.scss']
})
export class CleaningComponent implements OnInit, AfterContentChecked {

  scrollTop = 0;
  isChecked: boolean;
  lessonHederConfig = {};
  index: number;
  cleaningStepList: any;
  assignmentList: any;
  assignmentId: string;
  isVisiblePrevious = true;
  isCooking = false;
  currentAssignedLesson;
  lesson;
  audioTrack;
  defaultLessonImage: string;
  constructor(private router: Router, private toast: ToasterService,
    private studentService: StudentService, private utilityService: UtilityService,private authService: AuthService,private translate: TranslationService) {
    this.authService.setuserlang();
    this.defaultLessonImage = './assets/images/default-lesson.png';
  }

  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId');
    this.lesson = localStorage.getItem('lessonType');
    this.getCleaningSteps();
    let previousTime = this.utilityService.calculateTimeBetweenDates();
    this.updateLessonProgress(previousTime);
  }
  ngAfterContentChecked():void{
    this.lessonHederConfig['stepBoard'] = {
      stepNumber:this.translate.getStringFromKey('student.assigned-lessons.lesson-steps.summary-view.step')+ ' 7',
      stepTitle:this.translate.getStringFromKey('student.assigned-lessons.lesson-steps.summary-view.cleaning') ,
      stepLogo: './assets/images/wash-your-hands.png'
    }
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

  getCleaningSteps() {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data && response.data.lesson && response.data.lesson.cleanupSteps) {
          this.currentAssignedLesson = response.data;
          this.audioTrack = response.data.lesson.cleanupStepsTrack;
          this.isVisiblePrevious = false;
          this.cleaningStepList = response.data.lesson.cleanupSteps;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  onPrevious(): void {
    if (this.currentAssignedLesson.customSetting && this.currentAssignedLesson.customSetting.content) {
      for (let ob of this.currentAssignedLesson.customSetting.content) {
        if (ob.title === 'Cooking' && ob.status === true) {
          this.isCooking = true;
        } else if (ob.title === 'Learning Activities' && ob.status === true) {
          let isExperiment = _.find(ob.Activities, function (item) { return item.lable === 'Science Experiment'; });
          let isSensoryExercise = _.find(ob.Activities, function (item) { return item.lable === 'Sensory Learning Exercise'; });
          if (isExperiment && isExperiment.status === true) {
            this.router.navigate(['/student/start-experiment']);
            break;
          }
          // else if (isSensoryExercise && isSensoryExercise.status === true) {
          //   this.router.navigate(['/student/sensory-exercise']);
          //   break;
          // }
        } else if (ob.title != 'Story' && this.isCooking) {
          this.router.navigate(['/student/cooking-steps']);
          break;
        } else if (ob.title === 'Story' && ob.status === true) {
          this.router.navigate(['/student/conversional-sentence'])
        }
      }
    } else if (this.lesson === 'Explore') {
      this.router.navigate(['/student/start-experiment']);
    }
  }

  onNext(): void {
    this.router.navigate(['student/serving']);
  }
}
