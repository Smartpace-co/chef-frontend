import { Component, OnInit, Input ,OnDestroy} from '@angular/core';
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
import { TeacherService } from '@modules/teacher/services/teacher.service';
@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.scss']
})
export class IngredientListComponent implements OnInit,OnDestroy {

  lessonHederConfig = {};
  ingredientsList: any;
  sessionData: any;
  assignmentList: any;
  currentSubstitute: any
  assignmentId: string;
  exchange = faExchangeAlt;
  closeResult = '';
  closeModal;
  lessonData :any;
  isCooking = false;
  isCulinary = false;
  defaultIngredientImg: string;
  viewFrom :any;
  content:any;
  constructor(private router: Router, private toast: ToasterService,
     private studentService: StudentService, private utilityService: UtilityService, 
     private modalService: NgbModal,
     private teacherService : TeacherService) {
    this.lessonHederConfig['stepBoard'] = {
      stepNumber: 'Step 3',
      stepTitle: 'Ingredients',
      stepLogo: './assets/images/Vegetarian_Stew.png'
    }
    this.defaultIngredientImg = './assets/images/nsima-bent-icon.png';
  }
  ngOnInit(): void {
    this.teacherService.setTeachersHeader(true);
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId')
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.viewFrom = this.teacherService.getViewFrom();
    this.lessonData = this.teacherService.getAssignLessonData();
    if(this.viewFrom === "View"){
      this.content = this.lessonData.customSetting.content;
    }else {
      this.content = this.lessonData.activities;
    }
    this.ingredientsList = _.map(this.lessonData.recipe.recipeIngredients, item => {
      let obj = {
        id: item.id,
        icon: item.ingredient.images[0] ? item.ingredient.images[0].image : this.defaultIngredientImg,
        quantity: item.quantity ? item.quantity : undefined,
        unit:item && item.unitOfMeasurement ? item.unitOfMeasurement.unitOfMeasure : undefined,
        name: item.ingredient.ingredientTitle
      }
      return obj;
    });  
  }

  ngOnDestroy(){
    this.teacherService.setTeachersHeader(false);
  }
  
  showDetails(item: any): void {
    // if (item.lTop) {
      this.router.navigate(['teacher/ingredient', item.id]);
    // }
  }

  onPrevious(): void {
    this.router.navigate(['teacher/safety-hygiene']);
  }

  // onNext(): void {
  //   this.router.navigate(['teacher/sensory-exercise']);
  // }
  

  onNext(): void {
    if (this.content) {
      for (let ob of this.content) {
        if (ob.title === 'Cooking' && ob.status === true) {
          this.isCooking = true;
          let culinary = _.find(ob.cooking, function (item) { return item.culinaryTechniqueTitle === 'Culinary Technique'; });
          if (culinary && culinary.status === true) {
            this.isCulinary = true;
          }
        } else if (ob.title === 'Learning Activities' && ob.status === true) {
          let isSensoryExercise = _.find(ob.Activities, function (item) { return item.lable === 'Sensory Learning Exercise'; });
          if (isSensoryExercise && isSensoryExercise.status === true && this.lessonData.lesson && this.lessonData.lesson.multiSensoryQuestions && !_.isEmpty(this.lessonData.lesson.multiSensoryQuestions.question.trim())) {
            this.router.navigate(['/teacher/sensory-exercise']);
            break;
          }
        } else if (ob.title != 'Story' && this.isCooking) {
          if (!_.isEmpty(this.lessonData.recipe.preparationSteps)) {
            this.router.navigate(['/teacher/cooking-preparation']);
          } else if (this.isCulinary) {
            this.router.navigate(['/teacher/cooking-technique']);
          } else {
            this.router.navigate(['/teacher/cooking-steps']);
          }
          break;
        }
      }
    } 
    // else if (this.lessonData.defaultSetting === true) {
    //   if (this.lessonData.lesson && this.lessonData.lesson.multiSensoryQuestions && !_.isEmpty(this.lessonData.lesson.multiSensoryQuestions.question.trim())) {
    //     this.router.navigate(['/teacher/sensory-exercise']);
    //   } else if (!_.isEmpty(this.lessonData.recipe.preparationSteps)) {
    //     this.router.navigate(['/teacher/cooking-preparation']);
    //   } else {
    //     this.router.navigate(['/teacher/cooking-technique']);
    //   }
    // }
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
