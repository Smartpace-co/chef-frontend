import { Component, Input, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';
@Component({
  selector: 'app-recipe-content',
  templateUrl: './recipe-content.component.html',
  styleUrls: ['./recipe-content.component.scss']
})
export class RecipeContentComponent implements OnInit,OnDestroy {
  lessonHederConfig = {};
  assignmentId: string;
  sessionData: any;
  assignmentData: any;
  recipeContent: any;
  defaultRecipeImg: string;
  recipeImg: string;
  recipeIngredients = [];
  lessonData:any;
  isLoad = false;
   countryBgImg;
  constructor(private router: Router, private toast: ToasterService, 
    private studentService: StudentService, private utilityService: UtilityService,
    private teacherService : TeacherService) {
    this.lessonHederConfig['stepBoard'] = null;
    this.defaultRecipeImg = './assets/images/nsima-bent-icon.png';
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId')
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.lessonData = this.teacherService.getAssignLessonData();

    let contentOne = this.lessonData.recipe && this.lessonData.recipe.recipeIngredients[0] ? this.lessonData.recipe.recipeIngredients[0] : null;
    let contentTwo = this.lessonData.recipe && this.lessonData.recipe.recipeIngredients[1] ? this.lessonData.recipe.recipeIngredients[1] : null;
    if (contentOne) {
      this.recipeIngredients.push(contentOne);
    }
    if (contentTwo) {
      this.recipeIngredients.push(contentTwo);
    }
    let titleOne = contentOne && contentOne.ingredient ? contentOne.ingredient.ingredientTitle : '';
    let titleTwo = contentTwo && contentTwo.ingredient ? contentTwo.ingredient.ingredientTitle : '';
    this.recipeImg = this.lessonData.recipe.recipeImage ? this.lessonData.recipe.recipeImage : this.defaultRecipeImg;
    let ingredientTitleString;
    if (titleOne && titleTwo) {
      ingredientTitleString = `${titleOne} and ${titleTwo}`
    } else if (titleOne) {
      ingredientTitleString = `${titleOne}`
    } else if (titleTwo) {
      ingredientTitleString = `${titleTwo}`
    }
    this.recipeContent = `${this.lessonData.assignmentTitle} is made of ${ingredientTitleString} sauteed together.`;
    this.countryBgImg = this.lessonData.recipe.country.backgroundImage;
    this.isLoad = true;
    this.teacherService.setTeachersHeader(true);
  }

  ngOnDestroy(){
    this.teacherService.setTeachersHeader(false);
  }
  /**
  * on Next click event
 */
  onNext(): void {
    this.router.navigate(['teacher/let-start']);
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.router.navigate(['teacher/recipe-fact']);
  }
}
