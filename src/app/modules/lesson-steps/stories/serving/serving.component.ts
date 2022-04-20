import { Component, OnInit, Input, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import * as _ from 'lodash';
import { AuthService } from '@modules/auth/services/auth.service';
import { TranslationService } from '@appcore/services/translation.service';
@Component({
  selector: 'app-serving',
  templateUrl: './serving.component.html',
  styleUrls: ['./serving.component.scss']
})
export class ServingComponent implements OnInit, AfterContentChecked {

  lessonHederConfig = {};
  assignmentId: string;
  servingData: any;
  isLoad = false;
  isVisibleNext = true;
  slideConfig: any;
  currentAssignedLesson;
  lesson;
  audioTrack;
  constructor(private router: Router, private toast: ToasterService, private studentService: StudentService, private utilityService: UtilityService,private authService: AuthService,private translate: TranslationService) {
    this.authService.setuserlang();
  }

  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId');
    this.lesson = localStorage.getItem('lessonType');
    this.getServingData();
    let previousTime = this.utilityService.calculateTimeBetweenDates();
    this.updateLessonProgress(previousTime);
  }

  ngAfterContentChecked():void{
    this.lessonHederConfig['stepBoard'] = {
      stepNumber:this.translate.getStringFromKey('student.assigned-lessons.lesson-steps.summary-view.step')+ ' 8',
      stepTitle:this.translate.getStringFromKey('student.assigned-lessons.lesson-steps.summary-view.serving') ,
      stepLogo: './assets/images/plate-icon.png'
    }
  }

  updateLessonProgress(time: any): void {
    let submission = {
      currentScreen: this.router.url.split('/student')[1],
      timeTaken: time ? time : undefined,
      completedStep: 'Cooking'
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
  getServingData() {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data && response.data.recipe && response.data.recipe.servingSteps) {
          this.currentAssignedLesson = response.data;
          this.audioTrack = response.data.recipe.servingStepsTrack;
          this.isVisibleNext = false;
          this.servingData = response.data.recipe.servingSteps[0].text ? response.data.recipe.servingSteps[0].text.match(/.{1,154}(\s|$)/g) : undefined;
          // this.servingData = this.servingData.filter(e => e && e.trim() != "");
          this.getSlideConfig();
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  getSlideConfig(): void {
    this.slideConfig = {
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow: false,
      nextArrow: false,
      // nextArrow: '<div class=\'nav-btn next-slide\'>>></div>',
      // prevArrow: '<div class=\'nav-btn prev-slide\'><<</div>',
      dots: this.servingData && this.servingData.length > 1 ? true : false,
      infinite: false,
    };
    this.isLoad = true;
  }

  onPrevious(): void {
    this.router.navigate(['student/cleaning']);
  }

  onNext(): void {
    if (this.currentAssignedLesson.customSetting && this.currentAssignedLesson.customSetting.content) {
      for (let ob of this.currentAssignedLesson.customSetting.content) {
        if (ob.title === 'Assessments' && ob.status === true) {
          this.router.navigate(['/student/assessment-question']);
          break;
        } else {
          this.router.navigate(['/student/action-activities']);
        }
      }
    } else if (this.lesson === 'Explore') {
      this.router.navigate(['/student/assessment-question']);
    }
  }
}
