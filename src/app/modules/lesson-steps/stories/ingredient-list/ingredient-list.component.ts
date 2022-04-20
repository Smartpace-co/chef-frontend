import { Component, OnInit, Input, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentsService } from '@modules/teacher/services/students.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  faExchangeAlt
} from '@fortawesome/free-solid-svg-icons';
import { StudentService } from '@modules/student/services/student.service';
import * as _ from 'lodash';
import { ToasterService } from '@appcore/services/toaster.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { TranslationService } from '@appcore/services/translation.service';
@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.scss']
})
export class IngredientListComponent implements OnInit,AfterContentChecked {

  lessonHederConfig = {};
  ingredientsList: any;
  assignmentList: any;
  currentSubstitute: any
  assignmentId: string;
  exchange = faExchangeAlt;
  closeResult = '';
  closeModal;
  lesson;
  currentAssignedLesson;
  isVisibleNext = true;
  isCooking = false;
  isCulinary = false;
  defaultIngredientImg: string;
  constructor(private router: Router, private toast: ToasterService, private studentService: StudentService, private utilityService: UtilityService, private modalService: NgbModal,private authService: AuthService,private translate: TranslationService,) {
    this.authService.setuserlang();
    
    this.defaultIngredientImg = './assets/images/nsima-bent-icon.png';
  }
  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId');
    this.lesson = localStorage.getItem('lessonType');
    this.getIngredientList();
    let previousTime = this.utilityService.calculateTimeBetweenDates();
    this.updateLessonProgress(previousTime);
  }
  ngAfterContentChecked():void{
    this.lessonHederConfig['stepBoard'] = {
      stepNumber: this.translate.getStringFromKey('student.assigned-lessons.lesson-steps.summary-view.step')+' 3',
      stepTitle: this.translate.getStringFromKey('student.assigned-lessons.lesson-steps.summary-view.ingredients'),
      stepLogo: './assets/images/Vegetarian_Stew.png'
    }
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

  getIngredientList() {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data && response.data.recipe.recipeIngredients) {
          this.currentAssignedLesson = response.data;
          this.isVisibleNext = false;
          this.ingredientsList = _.map(response.data.recipe.recipeIngredients, item => {
            if (item && item.ingredient) {
              let obj = {
                id: item.id,
                icon: item.ingredient.images[0] ? item.ingredient.images[0].image : this.defaultIngredientImg,
                quantity: item.quantity ? item.quantity : undefined,
                unit: item && item.unitOfMeasurement ? item.unitOfMeasurement.unitOfMeasure : undefined,
                name: item.ingredient.ingredientTitle,
                isOptional: item.isOptional,
                isSpotlight: item.isSpotlight
              }
              return obj;
            }
          });
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  showDetails(item: any): void {
    // if (item.lTop) {
    this.router.navigate(['student/ingredient', item.id]);
    // }
  }

  onPrevious(): void {
    this.router.navigate(['student/safety-hygiene']);
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

  replaceIngredient(): void {
    var foundIndex = this.ingredientsList.findIndex(item => item.id === this.currentSubstitute.id);
    this.ingredientsList[foundIndex] = this.currentSubstitute;
    this.modalService.dismissAll();
  }

  open(content, item) {
    this.currentSubstitute = item.substitutesData;
    // this.currentSubstitute = this.ingredientsList.find(o => o.id === this.ingredient.id);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
