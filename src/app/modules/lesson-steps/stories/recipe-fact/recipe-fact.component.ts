import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
@Component({
  selector: 'app-recipe-fact',
  templateUrl: './recipe-fact.component.html',
  styleUrls: ['./recipe-fact.component.scss']
})
export class RecipeFactComponent implements OnInit {

  lessonHederConfig = {};
  assignmentId: string;
  assignmentData: any;
  recipeImg: string;
  defaultRecipeImg: string;
  isLoad = false;
  countryBgImg;
  constructor(private toast: ToasterService, private router: Router, private studentService: StudentService, private utilityService: UtilityService) {
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
        if (response && response.data) {
          this.assignmentData = response.data.lesson;
          this.recipeImg = response.data.recipe.recipeImage ? response.data.recipe.recipeImage : this.defaultRecipeImg;
          this.countryBgImg = response.data.recipe.country.backgroundImage;
          this.isLoad = true;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  /**
  * on Next click event
 */
  onNext(): void {
    this.router.navigate(['student/recipe-content']);
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.router.navigate(['student/greeting']);
    // this.router.navigate(['student/country-location']);
  }

}
