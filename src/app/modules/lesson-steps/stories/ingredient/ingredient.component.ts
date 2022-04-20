import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import * as _ from 'lodash';
import { AuthService } from '@modules/auth/services/auth.service';
@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss']
})
export class IngredientComponent implements OnInit {

  ingredientId: any;
  selectedIngredient: any;
  ingredientsList: any;
  assignmentList: any;
  assignmentId: string;
  currentAssignedLesson;
  isVisibleNext = true;
  lesson;
  isCooking = false;
  isCulinary = false;
  defaultIngredientImg: string;
  constructor(private router: Router,
    private studentService: StudentService,
    private toast: ToasterService,
    private utilityService: UtilityService,
    private activatedRoute: ActivatedRoute,private authService: AuthService,) {
      this.authService.setuserlang();
    this.defaultIngredientImg = './assets/images/nsima-bent-icon.png';
  }

  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId');
    this.lesson = localStorage.getItem('lessonType');
    this.ingredientId = this.activatedRoute.snapshot.params.id;
    if (this.ingredientId) {
      this.getDetails();
    }
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
  getDetails(): void {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data && response.data.recipe.recipeIngredients) {
          this.currentAssignedLesson = response.data;
          this.isVisibleNext = false;
          let foundData = response.data.recipe.recipeIngredients.find(x => x.id === parseInt(this.ingredientId));
          if (foundData && foundData.ingredient) {
            this.selectedIngredient = foundData.ingredient;
            this.selectedIngredient['image'] = foundData && foundData.ingredient && foundData.ingredient.images[0] ? foundData.ingredient.images[0].image : this.defaultIngredientImg;
            this.selectedIngredient['lTop'] = foundData.spotlightFacts[0] && foundData.spotlightFacts[0].fact ? foundData.spotlightFacts[0].fact : undefined;
            this.selectedIngredient['rTop'] = foundData.spotlightFacts[1] && foundData.spotlightFacts[1].fact ? foundData.spotlightFacts[1].fact : undefined;
            this.selectedIngredient['lBottom'] = foundData.spotlightFacts[2] && foundData.spotlightFacts[2].fact ? foundData.spotlightFacts[2].fact : undefined;
            this.selectedIngredient['rBottom'] = foundData.spotlightFacts[3] && foundData.spotlightFacts[3].fact ? foundData.spotlightFacts[3].fact : undefined;
            if (this.selectedIngredient.additionalNutrients) {
              this.selectedIngredient['nutrients'] = _.map(foundData.ingredient.additionalNutrients, nt => {
                if (nt.nutrient) {
                  let data = {
                    id: nt.nutrient.id,
                    title: nt.nutrient.nutrientTitle
                  }
                  return data;
                }
              });
            }
          }
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  onPrevious(): void {
    this.router.navigate(['student/ingredient-list']);
  }

  onNext(): void {
    if (this.currentAssignedLesson && this.currentAssignedLesson.defaultSetting === false && this.currentAssignedLesson.customSetting && this.currentAssignedLesson.customSetting.content) {
      for (let ob of this.currentAssignedLesson.customSetting.content) {
        if (ob.title === 'Cooking' && ob.status === true) {
          this.isCooking = true;
          let culinary = _.find(ob.cooking, function (item) { return item.culinaryTechniqueTitle === 'Culinary Technique'; });
          if (culinary && culinary.status === true) {
            this.isCulinary = true;
          }
        } else if (ob.title === 'Learning Activities' && ob.status === true) {
          let isSensoryExercise = _.find(ob.Activities, function (item) { return item.lable === 'Sensory Learning Exercise'; });
          if (isSensoryExercise && isSensoryExercise.status === true && this.currentAssignedLesson.lesson && this.currentAssignedLesson.lesson.multiSensoryQuestions && !_.isEmpty(this.currentAssignedLesson.lesson.multiSensoryQuestions.question.trim())) {
            this.router.navigate(['/student/sensory-exercise']);
            break;
          }
        } else if (ob.title != 'Story' && this.isCooking) {
          if (!_.isEmpty(this.currentAssignedLesson.recipe.preparationSteps)) {
            this.router.navigate(['/student/cooking-preparation']);
          } else if (this.isCulinary) {
            this.router.navigate(['/student/cooking-technique']);
          } else {
            this.router.navigate(['/student/cooking-steps']);
          }
          break;
        }
      }
    } else if (this.lesson === 'Explore' || this.currentAssignedLesson.defaultSetting === true) {
      if (this.currentAssignedLesson.lesson && this.currentAssignedLesson.lesson.multiSensoryQuestions && !_.isEmpty(this.currentAssignedLesson.lesson.multiSensoryQuestions.question.trim())) {
        this.router.navigate(['/student/sensory-exercise']);
      } else if (!_.isEmpty(this.currentAssignedLesson.recipe.preparationSteps)) {
        this.router.navigate(['/student/cooking-preparation']);
      } else {
        this.router.navigate(['/student/cooking-technique']);
      }
    }
  }
}
