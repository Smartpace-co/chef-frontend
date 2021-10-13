import { Component, OnInit, Input,OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss']
})
export class IngredientComponent implements OnInit,OnDestroy {

  ingredientId: any;
  selectedIngredient: any;
  ingredientsList: any;
  assignmentList: any;
  assignmentId: string;
  lessonData :any;
  defaultIngredientImg: string;
  constructor(private router: Router,
    private studentService: StudentService,
    private toast: ToasterService,
    private teacherService: TeacherService,
    private utilityService: UtilityService,
    private activatedRoute: ActivatedRoute) { 
      this.defaultIngredientImg = './assets/images/nsima-bent-icon.png';
    }

  ngOnInit(): void {
    this.teacherService.setTeachersHeader(true);
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId');
    this.lessonData = this.teacherService.getAssignLessonData();
    this.ingredientId = this.activatedRoute.snapshot.params.id;
    if (this.ingredientId) {
      this.getDetails(this.lessonData);
    }
    // this.updateLessonProgress();
  }

  ngOnDestroy(){
    this.teacherService.setTeachersHeader(false);
  }

  getDetails(data): void {
    let foundData = data.recipe.recipeIngredients.find(x => x.id === parseInt(this.ingredientId));
    if (foundData && foundData.ingredient) {
      this.selectedIngredient = foundData.ingredient;
      this.selectedIngredient['image'] = foundData && foundData.ingredient && foundData.ingredient.images[0] ? foundData.ingredient.images[0].image : this.defaultIngredientImg;
      this.selectedIngredient['lTop'] = foundData.ingredient.scienceFacts[0] && foundData.ingredient.scienceFacts[0].fact ? foundData.ingredient.scienceFacts[0].fact : undefined;
      this.selectedIngredient['rTop'] = foundData.ingredient.scienceFacts[1] && foundData.ingredient.scienceFacts[1].fact ? foundData.ingredient.scienceFacts[1].fact : undefined;
      this.selectedIngredient['lBottom'] = foundData.ingredient.scienceFacts[2] && foundData.ingredient.scienceFacts[2].fact ? foundData.ingredient.scienceFacts[2].fact : undefined;
      this.selectedIngredient['rBottom'] = foundData.ingredient.scienceFacts[3] && foundData.ingredient.scienceFacts[3].fact ? foundData.ingredient.scienceFacts[3].fact : undefined;
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
  onPrevious(): void {
    this.router.navigate(['teacher/ingredient-list']);
  }

  onNext(): void {
    this.router.navigate(['teacher/sensory-exercise']);
  }
}
