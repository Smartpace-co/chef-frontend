import { Component, OnInit,AfterContentChecked } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import * as _ from 'lodash';
import { AuthService } from '@modules/auth/services/auth.service';
import { TranslationService } from '@appcore/services/translation.service';
@Component({
  selector: 'app-cooking-preparation',
  templateUrl: './cooking-preparation.component.html',
  styleUrls: ['./cooking-preparation.component.scss']
})
export class CookingPreparationComponent implements OnInit, AfterContentChecked {

  lessonHederConfig = {};
  isVisibleNext = true;
  isVisiblePrevious = true;
  recipesPreparationList: any;
  assignmentList: any;
  assignmentId: string;
  isCooking = false;
  audioTrack;
  currentAssignedLesson;
  lesson;
  defaultLessonImage: string;
  constructor(private router: Router,private sanitizer: DomSanitizer, private toast: ToasterService, private studentService: StudentService, private utilityService: UtilityService,private authService: AuthService,private translate: TranslationService) {
    this.authService.setuserlang();
    this.lessonHederConfig['stepBoard'] = {
      stepNumber: this.translate.getStringFromKey('student.assigned-lessons.lesson-steps.summary-view.step')+' 4',
      stepTitle: this.translate.getStringFromKey('student.assigned-lessons.lesson-steps.summary-view.cooking-preparation'),
      stepLogo: './assets/images/knife.png'
    };
    this.defaultLessonImage = './assets/images/default-lesson.png';
  }

  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId');
    this.lesson = localStorage.getItem('lessonType');
    this.getRecipesPreparationList();
    let previousTime = this.utilityService.calculateTimeBetweenDates();
    this.updateLessonProgress(previousTime);
  }
  ngAfterContentChecked() : void{
    this.lessonHederConfig['stepBoard'] = {
      stepNumber: this.translate.getStringFromKey('student.assigned-lessons.lesson-steps.summary-view.step')+' 4',
      stepTitle: this.translate.getStringFromKey('student.assigned-lessons.lesson-steps.summary-view.cooking-preparation'),
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
  getRecipesPreparationList() {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data && response.data.recipe.preparationSteps) {
          this.currentAssignedLesson = response.data;
          this.audioTrack = response.data.recipe.preparationStepsTrack;
          this.isVisibleNext = false;
          this.isVisiblePrevious = false;
          this.recipesPreparationList = _.map(response.data.recipe.preparationSteps, item => {
            let secureUrl;
            if (item && item.link) {
              secureUrl = this.sanitizer.bypassSecurityTrustResourceUrl(item.link);
            }
            let obj = {
              id: item.id,
              info: item.text,
              image: item.image ? item.image : this.defaultLessonImage,
              video: secureUrl,
              isBigChef: item.isApplicableForBigChef === true ? './assets/images/teacher-1.png' : undefined,
              isLittleChef: item.isApplicableForLittleChef === true ? './assets/images/profile-icon-13.png' : undefined,
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

  onPrevious(): void {
    if (this.currentAssignedLesson.customSetting && this.currentAssignedLesson.customSetting.content) {
      for (let ob of this.currentAssignedLesson.customSetting.content) {
        if (ob.title === 'Cooking' && ob.status === true) {
          this.isCooking = true;
        }
        // else if (ob.title === 'Learning Activities' && ob.status === true) {
        //   let isSensoryExercise = _.find(ob.Activities, function (item) { return item.lable === 'Sensory Learning Exercise'; });
        //   if (isSensoryExercise && isSensoryExercise.status === true) {
        //     this.router.navigate(['/student/sensory-exercise']);
        //     break;
        //   }
        // }
        else if (ob.title != 'Story' && this.isCooking) {
          this.router.navigate(['student/ingredient-list']);
          break;
        }
      }
    } else if (this.lesson === 'Explore') {
      this.router.navigate(['student/ingredient-list']);
    }
  }

  onNext(): void {
    if (this.currentAssignedLesson.customSetting && this.currentAssignedLesson.customSetting.content) {
      for (let ob of this.currentAssignedLesson.customSetting.content) {
        let isCulinary = _.find(ob.cooking, function (item) { return item.culinaryTechniqueTitle === 'Culinary Technique'; });
        if (isCulinary && isCulinary.status === true) {
          this.router.navigate(['/student/cooking-technique']);
          break;
        } else {
          this.router.navigate(['/student/cooking-steps']);
        }
      }
    } else if (this.lesson === 'Explore') {
      this.router.navigate(['/student/cooking-technique']);
    }
  }
}
