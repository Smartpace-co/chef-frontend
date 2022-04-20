import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { AuthService } from '@modules/auth/services/auth.service';
@Component({
  selector: 'app-learning-objective',
  templateUrl: './learning-objective.component.html',
  styleUrls: ['./learning-objective.component.scss']
})
export class LearningObjectiveComponent implements OnInit {
  lessonHederConfig = {};
  isVisibleNext = false;
  defaultRecipeImg: string;
  recipeImg: string;
  showPrevious = false; // To hide previous button
  slideConfig;
  assignmentTitle: any;
  assignmentList: any;
  assignmentId: string;
  isLoad = false;
  countryBgImg;
  learningObjective = [];
  learnObjString: string;
  audioTrack;
  lesson;
  constructor(private router: Router, private toast: ToasterService, private studentService: StudentService, private utilityService: UtilityService,private authService:AuthService) {
    this.lessonHederConfig['stepBoard'] = null;
    this.defaultRecipeImg = './assets/images/nsima-bent-icon.png';
  }

  ngOnInit(): void {
    this.authService.setuserlang();
    this.assignmentId = localStorage.getItem('assignmentId')
    this.getStudentData();
    this.lesson = localStorage.getItem('lessonType');
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
        if (response && response.data) {
          // if (this.lesson === 'Explore') {
          this.assignmentTitle = response.data.recipe.recipeTitle;
          // } else {
          //   this.assignmentTitle = response.data.assignmentTitle;
          // }
          this.recipeImg = response.data.recipe.recipeImage ? response.data.recipe.recipeImage : this.defaultRecipeImg;
          this.audioTrack = response.data.lesson.learningObjectivesForStudentTrack;
          this.countryBgImg = response.data.recipe.country.backgroundImage;
          this.showPrevious = this.countryBgImg ? true : false;
          this.learnObjString = response.data.lesson.learningObjectivesForStudent.replace(/&nbsp;|<[^>]+>/g, '');
          // this.learnObjString = '<ol><li><strong>learn special class and have? a specilaization recipie cooking learn special. class and have a specilaization recipie cookinglearn special class and have a specilaization. recipie cookinglearn special class and have a specilaization recipie cookinglearn special. class and have a specilaization recipie cookinglearn special class and have. a specilaization recipie cookinglearn special class and have a specilaization recipie cookinglearn special class and have a specilaization recipie cookinglearn special class and have a specilaization recipie cookinglearn special class and have a specilaization recipie cookinglearn special class and have a specilaization recipie cookinglearn special class and have a specilaization recipie cookinglearn special class and have a specilaization recipie cooking</strong></li></ol>'
          // let stripedHtml = this.learnObjString.replace(/<[^>]+>/g, '');
          // this.learningObjective = stripedHtml.split(/[!,?,.]/);         
          // this.learningObjective = this.learnObjString ? this.learnObjString.match(/.{1,175}(\s|$)/g) : undefined;
          this.learningObjective = this.learnObjString ? this.learnObjString.split(".") : undefined;
          this.learningObjective = this.learningObjective.filter(e => e && e.trim() != "");
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
      dots: this.learningObjective && this.learningObjective.length > 1 ? true : false,
      infinite: false,
    };
  }
  /**
  * on Next click event
 */
  onNext(): void {
    this.router.navigate(['/student/summary-view']);
  }

  /**
  * on Previous click event
 */
  onPrevious(): void {
    this.router.navigate(['/student/country-image']);
  }
}