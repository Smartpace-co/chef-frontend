import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import * as _ from 'lodash';
import { ToasterService } from '@appcore/services/toaster.service';
@Component({
  selector: 'app-cooking-technique',
  templateUrl: './cooking-technique.component.html',
  styleUrls: ['./cooking-technique.component.scss']
})
export class CookingTechniqueComponent implements OnInit {

  index: number;
  lessonHederConfig = {};
  activatedRoute: any;
  cookingTechnique: any;
  assignmentList: any;
  assignmentId: string;
  cookingTechniqueList = [];
  videoUrl: string;
  isLoad = false;
  currentAssignedLesson;
  isVisibleNext = true;
  slideConfig;
  constructor(private router: Router, private toast: ToasterService, private sanitizer: DomSanitizer, private studentService: StudentService, private utilityService: UtilityService) {
    this.lessonHederConfig['stepBoard'] = {
      stepNumber: 'Step 5',
      stepTitle: 'Cooking Technique',
      stepLogo: './assets/images/culinary-icon.png'
    }
  }

  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId')
    this.getCookingTechnique();
    let previousTime = this.utilityService.calculateTimeBetweenDates();
    this.updateLessonProgress(previousTime);
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
  getCookingTechnique() {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data && response.data.recipe.recipeTechniques) {
          this.currentAssignedLesson = response.data;
          this.isVisibleNext = false;
          this.cookingTechniqueList = _.map(response.data.recipe.recipeTechniques, item => {
            let secureUrl;
            if (item && item.culinaryTechnique && item.culinaryTechnique.video) {
              secureUrl = this.sanitizer.bypassSecurityTrustResourceUrl(item.culinaryTechnique.video);
            }
            let ob = {
              description: item.culinaryTechnique.description,
              link: secureUrl
            }
            return ob;
          });
          this.getSliderConfig();
          this.isLoad = true;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  getSliderConfig(): void {
    this.slideConfig = {
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: '<div class=\'nav-btn next-slide\'></div>',
      prevArrow: '<div class=\'nav-btn prev-slide\'></div>',
      dots: this.cookingTechniqueList && this.cookingTechniqueList.length > 1 ? true : false,
      infinite: false,
    };

  }
  onPrevious(): void {
    if (this.currentAssignedLesson) {
      if (!_.isEmpty(this.currentAssignedLesson.recipe.preparationSteps))
        this.router.navigate(['student/cooking-preparation']);
    } else {
      this.router.navigate(['student/ingredient-list']);
    }
  }

  onNext(): void {
    this.router.navigate(['student/cooking-steps']);
  }

}
