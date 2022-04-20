import { Component, OnInit, Input,AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import {
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { StudentService } from '@modules/student/services/student.service';
import * as _ from 'lodash';
import { TranslationService } from '@appcore/services/translation.service';
import { AuthService } from '@modules/auth/services/auth.service';
@Component({
  selector: 'app-safety-hygiene',
  templateUrl: './safety-hygiene.component.html',
  styleUrls: ['./safety-hygiene.component.scss']
})
export class SafetyHygieneComponent implements OnInit,AfterContentChecked {

  lessonHederConfig = {};
  check = faCheck;
  index: number;
  selectedItem;
  isVisiblePrevious = true;
  isVisibleNext = true;
  assignmentId: string;
  assignmentData: any;
  hygieneList = [];
  lesson;
  currentAssignedLesson;
  audioTrack;
  showPrevious = true; // To hide previous button
  constructor(private router: Router, private studentService: StudentService, private toast: ToasterService, private utilityService: UtilityService,private translate: TranslationService,private authService: AuthService,) {
    this.authService.setuserlang();
    
  }

  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId');
    this.lesson = localStorage.getItem('lessonType');
    this.getStudentData();
    let previousTime = this.utilityService.calculateTimeBetweenDates();
    this.updateLessonProgress(previousTime);
  }
  ngAfterContentChecked():void{
    this.lessonHederConfig['stepBoard'] = {
      stepNumber: this.translate.getStringFromKey('student.assigned-lessons.lesson-steps.summary-view.step') +' 2',
      stepTitle: this.translate.getStringFromKey('student.assigned-lessons.lesson-steps.summary-view.safety-and-hygiene'),
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
  getStudentData() {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data && response.data.lesson.safetySteps) {
          this.currentAssignedLesson = response.data;
          this.audioTrack = response.data.lesson.safetyStepsTrack;
          this.isVisiblePrevious = false;
          if (this.currentAssignedLesson && this.currentAssignedLesson.customSetting && this.currentAssignedLesson.customSetting.content) {
            for (let ob of this.currentAssignedLesson.customSetting.content) {
              if (ob.title === 'Story' && ob.status === false) {
                this.showPrevious = false;
              }
            }
          }
          this.hygieneList = _.map(response.data.lesson.safetySteps, item => {
            let obj = {
              id: item.id,
              desc: item.text ? item.text.replace(/&nbsp;|<[^>]+>/g, '') : undefined
            }
            return obj;
          });
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  onItemChange(item: any): void {
    if (item) {
      this.isVisibleNext = false;
    }
  }

  onPrevious(): void {
    if (this.currentAssignedLesson.customSetting && this.currentAssignedLesson.customSetting.content) {
      for (let ob of this.currentAssignedLesson.customSetting.content) {
        if (ob.title === 'Story' && ob.status === true) {
          this.router.navigate(['/student/conversional-sentence']);
          break;
        } else if (ob.title != 'Cooking') {
          this.router.navigate(['/student/assignment']);
        }
      }
    } else if (this.lesson === 'Explore') {
      this.router.navigate(['/student/conversional-sentence']);
    }
  }

  onNext(): void {
    this.router.navigate(['student/ingredient-list']);
  }
}