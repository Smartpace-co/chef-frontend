import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { AuthService } from '@modules/auth/services/auth.service';
@Component({
  selector: 'app-recipe-fact',
  templateUrl: './recipe-fact.component.html',
  styleUrls: ['./recipe-fact.component.scss']
})
export class RecipeFactComponent implements OnInit {

  lessonHederConfig = {};
  assignmentId: string;
  recipeImg: string;
  defaultRecipeImg: string;
  funFactList = [];
  socialStudiesFactList = [];
  slickConfig;
  slideConfig;
  isLoad = false;
  constructor(private toast: ToasterService, private router: Router, private studentService: StudentService, private utilityService: UtilityService,private authService: AuthService,) {
    this.authService.setuserlang();
    this.lessonHederConfig['stepBoard'] = null;
    this.defaultRecipeImg = './assets/images/nsima-bent-icon.png';
  }

  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId')
    this.getStudentData();
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
  getStudentData() {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data && response.data.lesson) {
          this.recipeImg = response.data.recipe.recipeImage ? response.data.recipe.recipeImage : this.defaultRecipeImg;
          this.funFactList = response.data.lesson.funFact ? response.data.lesson.funFact.match(/.{1,95}(\s|$)/g) : undefined;
          this.socialStudiesFactList = response.data.lesson.socialStudiesFact ? response.data.lesson.socialStudiesFact.match(/.{1,95}(\s|$)/g) : undefined;
          this.getSlickConfig();
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
      dots: this.funFactList && this.funFactList.length > 1 ? true : false,
      infinite: false,
    };

  }
  getSlickConfig(): void {
    this.slickConfig = {
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: '<div class=\'nav-btn next-slide\'></div>',
      prevArrow: '<div class=\'nav-btn prev-slide\'></div>',
      dots: this.socialStudiesFactList && this.socialStudiesFactList.length > 1 ? true : false,
      infinite: false,
    };

  }

  /**
  * on Next click event
 */
  onNext(): void {
    this.router.navigate(['student/conversional-sentence']);
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.router.navigate(['/student/chef-introduction']);
    // this.router.navigate(['student/country-location']);
  }

}
