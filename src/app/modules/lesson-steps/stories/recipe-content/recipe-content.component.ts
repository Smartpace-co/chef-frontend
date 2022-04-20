import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { AuthService } from '@modules/auth/services/auth.service';
@Component({
  selector: 'app-recipe-content',
  templateUrl: './recipe-content.component.html',
  styleUrls: ['./recipe-content.component.scss']
})
export class RecipeContentComponent implements OnInit {
  lessonHederConfig = {};
  assignmentId: string;
  assignmentData: any;
  recipeContent: any;
  defaultRecipeImg: string;
  recipeImg: string;
  recipeIngredients = [];
  isLoad = false;
  lesson;
  constructor(private router: Router, private toast: ToasterService, private studentService: StudentService, private utilityService: UtilityService,private authService: AuthService,) {
    this.authService.setuserlang();
    this.lessonHederConfig['stepBoard'] = null;
    this.defaultRecipeImg = './assets/images/nsima-bent-icon.png';
  }

  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId');
    this.lesson = localStorage.getItem('lessonType');
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
        if (response && response.data && response.data.recipe.recipeIngredients) {
          let contentOne = response.data.recipe && response.data.recipe.recipeIngredients[0] ? response.data.recipe.recipeIngredients[0] : null;
          let contentTwo = response.data.recipe && response.data.recipe.recipeIngredients[1] ? response.data.recipe.recipeIngredients[1] : null;
          if (contentOne) {
            this.recipeIngredients.push(contentOne);
          }
          if (contentTwo) {
            this.recipeIngredients.push(contentTwo);
          }
          let assignmentTitle;
          // if (this.lesson === 'Explore') {
            assignmentTitle = response.data.recipe.recipeTitle;
          // } else {
          //   assignmentTitle = response.data.assignmentTitle;
          // }
          let titleOne = contentOne && contentOne.ingredient ? contentOne.ingredient.ingredientTitle : '';
          let titleTwo = contentTwo && contentTwo.ingredient ? contentTwo.ingredient.ingredientTitle : '';
          this.recipeImg = response.data.recipe.recipeImage ? response.data.recipe.recipeImage : this.defaultRecipeImg;
          let ingredientTitleString;
          if (titleOne && titleTwo) {
            ingredientTitleString = `${titleOne} and ${titleTwo}`
          } else if (titleOne) {
            ingredientTitleString = `${titleOne}`
          } else if (titleTwo) {
            ingredientTitleString = `${titleTwo}`
          }
          this.recipeContent = `${assignmentTitle} is made of ${ingredientTitleString} sauteed together.`;
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
    this.router.navigate(['student/let-start']);
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.router.navigate(['student/recipe-fact']);
  }
}
