import { Component, OnInit, HostListener, Renderer2, Input, AfterContentChecked } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { TranslationService } from '@appcore/services/translation.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-cooking-steps',
  templateUrl: './cooking-steps.component.html',
  styleUrls: ['./cooking-steps.component.scss']
})
export class CookingStepsComponent implements OnInit, AfterContentChecked {

  lessonHederConfig = {};
  scrollTop = 0;
  isChecked: boolean;
  cookingSteps: any;
  assignmentList: any;
  assignmentId: string;
  isVisibleNext = true;
  isVisiblePrevious = true;
  currentAssignedLesson;
  isCooking = false;
  lesson;
  audioTrack;
  defaultLessonImage: string;
  constructor(private router: Router, private sanitizer: DomSanitizer, private toast: ToasterService, private activatedRoute: ActivatedRoute, private studentService: StudentService, private utilityService: UtilityService,private authService: AuthService,private translate: TranslationService) {
    this.authService.setuserlang();
    this.defaultLessonImage = './assets/images/default-lesson.png';
  }

  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId');
    this.lesson = localStorage.getItem('lessonType');
    this.getCookingSteps();
    let previousTime = this.utilityService.calculateTimeBetweenDates();
    this.updateLessonProgress(previousTime);
  }

  ngAfterContentChecked():void{
    this.lessonHederConfig['stepBoard'] = {
      stepNumber: this.translate.getStringFromKey('student.assigned-lessons.lesson-steps.summary-view.step')+' 6',
      stepTitle:this.translate.getStringFromKey('student.assigned-lessons.lesson-steps.summary-view.cooking-steps'),
      stepLogo: './assets/images/knife.png'
    };
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

  getCookingSteps() {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        let cnt = 1;
        if (response && response.data && response.data.recipe.cookingSteps) {
          this.currentAssignedLesson = response.data;
          this.audioTrack = response.data.recipe.cookingStepsTrack;
          this.isVisibleNext = false;
          this.isVisiblePrevious = false;
          this.cookingSteps = _.map(response.data.recipe.cookingSteps, item => {
            let secureUrl;
            if (item && item.link) {
              secureUrl = this.sanitizer.bypassSecurityTrustResourceUrl(item.link);
            }
            let obj = {
              id: cnt,
              info: item.text,
              image: item.image ? item.image : this.defaultLessonImage,
              video: secureUrl,
              isBigChef: item.isApplicableForBigChef === true ? './assets/images/teacher-1.png' : undefined,
              isLittleChef: item.isApplicableForLittleChef === true ? './assets/images/profile-icon-13.png' : undefined,
            }
            cnt = cnt + 1;
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

  onPrevious(): void {
    if (this.currentAssignedLesson.customSetting && this.currentAssignedLesson.customSetting.content) {
      for (let ob of this.currentAssignedLesson.customSetting.content) {
        let isCulinary = _.find(ob.cooking, function (item) { return item.culinaryTechniqueTitle === 'Culinary Technique'; });
        if (isCulinary && isCulinary.status === true) {
          this.router.navigate(['/student/cooking-technique']);
          break;
        } else if (!_.isEmpty(this.currentAssignedLesson.recipe.preparationSteps)) {
          this.router.navigate(['/student/cooking-preparation']);
        } else {
          this.router.navigate(['student/ingredient-list']);
        }
      }
    } else if (this.lesson === 'Explore') {
      this.router.navigate(['student/cooking-technique']);
    }
  }

  onNext(): void {
    if (this.currentAssignedLesson.customSetting && this.currentAssignedLesson.customSetting.content) {
      for (let ob of this.currentAssignedLesson.customSetting.content) {
        if (ob.title === 'Cooking' && ob.status === true) {
          this.isCooking = true;
        } else if (ob.title === 'Learning Activities' && ob.status === true) {
          let isExperiment = _.find(ob.Activities, function (item) { return item.lable === 'Science Experiment'; });
          if (isExperiment && isExperiment.status === true) {
            this.router.navigate(['/student/experiment']);
            break;
          }
        } else if (ob.title != 'Story' && this.isCooking) {
          this.router.navigate(['/student/cleaning']);
          break;
        } else if (ob.title === 'Assessments' && ob.status === true) {
          this.router.navigate(['/student/assessment-question']);
          break;
        } else {
          this.router.navigate(['/student/action-activities']);
        }
      }
    } else if (this.lesson === 'Explore') {
      this.router.navigate(['/student/experiment']);
    }
  }

}
