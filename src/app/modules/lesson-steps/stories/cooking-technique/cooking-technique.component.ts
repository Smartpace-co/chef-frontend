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
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: '<div class=\'nav-btn next-slide\'></div>',
    prevArrow: '<div class=\'nav-btn prev-slide\'></div>',
    dots: true,
    infinite: false,
  };

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
          // this.cookingTechniqueList = response.data.recipe.recipeTechniques;
          this.cookingTechniqueList = _.filter(response.data.recipe.recipeTechniques, item => {
            if (item && (item.dialogue || item.animationLink)) {
              return item;
            }
          });
          // if (response.data.recipe.recipeTechniques[0].dialogue) {
          //   // let stringDialogue = response.data.recipe.recipeTechniques[0].dialogue.replace(/<[^>]+>/g, '');
          //   this.cookingTechniqueList.push(response.data.recipe.recipeTechniques[0].dialogue);// stringDialogue.match(/.{1,220}/g);
          // }
          // if (response.data.recipe.recipeTechniques[0] && response.data.recipe.recipeTechniques[0].animationLink) {
          //   this.videoUrl = response.data.recipe.recipeTechniques[0].animationLink;
          // }
          this.isLoad = true;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
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

  getSanitizeUrl(urlData: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(urlData);
  }
}
