import { Component, ElementRef, Input, OnInit, ViewChild,OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentsService } from '@modules/teacher/services/students.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  faCheck,
  faChevronRight,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { DynamicFormComponent } from '@modules/lesson-steps/dynamic-form/dynamic-form.component';
import { StudentService } from '@modules/student/services/student.service';
import { ToasterService } from '@appcore/services/toaster.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-assessment-question',
  templateUrl: './assessment-question.component.html',
  styleUrls: ['./assessment-question.component.scss']
})
export class AssessmentQuestionComponent implements OnInit,OnDestroy {
  @ViewChild('dynamicComponent') dynamicComponent: DynamicFormComponent;
  @ViewChild('correctAnsModal') CorrectAnsModal: ElementRef;
  @Input() showPrevious: boolean;
  lessonHederConfig = {};
  showNext = true;
  openModal;
  assessmentGroup: FormGroup;
  form;
  sessionData;
  index: number = 0;
  attempt = 0;
  questionIndex: number = 0;
  isCorrectAns = false;
  isRightAns = false;
  allUnit = [];
  isVisiblePrevious = false;
  mostPeeled: string;
  isVisibleNext = true;
  previousElement;
  closeModal;
  closeResult = '';
  slectedOption;
  check = faCheck;
  close = faTimes;
  RightArrow = faChevronRight;
  assignmentId: string;
  assignmentData: any;
  panelIndex;
  selectedEassyAns: string;
  getSingleSelectValue: any;
  draggedItem;
  hint: string;
  getMultiselectedValues;
  AllQuestionsList: any;
  lessonData:any;
  currentAssignedLesson;
  constructor(private modalService: NgbModal,
    private router: Router,
    private toast: ToasterService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private studentService: StudentService,
    private utilityService: UtilityService,
    private teacherService : TeacherService) {
    this.lessonHederConfig['stepBoard'] = {
      stepNumber: 'Step 9',
      stepTitle: 'Assessment',
      stepLogo: './assets/images/assessment-icon.png'
    }
    this.panelIndex = this.activatedRoute.snapshot.queryParams && this.activatedRoute.snapshot.queryParams.index;
  }

  ngOnInit(): void {
    this.teacherService.setTeachersHeader(true);
    this.showPrevious = true;
    this.assignmentId = localStorage.getItem('assignmentId')
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.lessonData = this.teacherService.getAssignLessonData();
    this.getStudentData(this.lessonData);
  
  }

  ngOnDestroy(){
    this.teacherService.setTeachersHeader(false);
  }

 

  /**
   * To get all the questions and pass to construct dynamic-forms.
   */

     

  getStudentData(data) {
    this.currentAssignedLesson = data;
    this.assignmentData = data.lesson.questions;
    if (this.assignmentData && this.assignmentData.length > 0) {
      const mappedQuestion = _.map(this.assignmentData, item => {
        let ansType = item.answer_type.key;
        let correctAns = [];
        if (ansType === 'essay') {
          item.questionType = 'essay';
          item.form = [
            {
              "formCtrlName": `q1+${item.id}`,
              "formCtrlType": "text"
            }
          ];
        } else if (ansType === 'singleSelection') {
          item.questionType = 'singleSelection';
          item.form = [];
          item.options = item.answers;
        } else if (ansType === 'multipleSelection') {
          item.questionType = 'multipleSelection';
          item.form = [];
          if (item.answers && item.answers.length > 0) {
            _.forEach(item.answers, o => {
              if (o.isAnswer === true) {
                correctAns.push(o);
              }
            });
          }
          item.allCorrectAns = correctAns;
          item.options = item.answers;
        } else if (ansType === 'dragAndDrop') {
          item.questionType = 'dragAndDrop';
          item.form = [];
          item.options = item.answers;
        }

        return item;
      });
      this.AllQuestionsList = _.filter(mappedQuestion, item => {
        if (item && item.questionType) {
          return item;
        }
      });
      if (this.panelIndex) {
        this.questionIndex = parseInt(this.panelIndex);
      }
      this.form = this.AllQuestionsList[this.questionIndex];
      let url = this.router.url.split("?")[0].split('/teacher')[1];
      let urlToEdit = url + '?index=' + this.questionIndex;
      this.location.replaceState(urlToEdit);
      console.log("form", this.form);
      // this.updateLessonProgress();
    }
  }

  /**
   * on Next click event
  */
  onNext(): void {
    this.showNextScreen();
    //  this.checkCurrentAnswers();
  }

  /**
   * map submission and pass data to show popup.
   */
  checkCurrentAnswers(): void {
    let mappedIds = [];
    let submission = {
      assignLessonId: parseInt(this.assignmentId),
      questionId: this.AllQuestionsList[this.questionIndex] && this.AllQuestionsList[this.questionIndex].id ? this.AllQuestionsList[this.questionIndex].id : undefined,
      answerTypeId: this.AllQuestionsList[this.questionIndex] && this.AllQuestionsList[this.questionIndex].answerTypeId ? this.AllQuestionsList[this.questionIndex].answerTypeId : undefined,
    };
    if (this.AllQuestionsList[this.questionIndex].questionType === 'essay') {
      this.attempt = 0;
      this.showNextScreen();
      // submission['essay'] = this.selectedEassyAns;
      // submission['isCorrect'] = true;
      // submission['pointsEarned'] = 0;
      // this.validateAndSaveData(submission, 'isEssay');
    } else if (this.AllQuestionsList[this.questionIndex].questionType === 'singleSelection') {
      this.showNextScreen();
      // submission['answerIds'] = this.getSingleSelectValue && this.getSingleSelectValue.id ? [this.getSingleSelectValue.id] : undefined;
      // this.openResultPopup('single', this.getSingleSelectValue, undefined, undefined, submission);
    } else if (this.AllQuestionsList[this.questionIndex].questionType === 'multipleSelection') {
      this.showNextScreen();
      // _.forEach(this.getMultiselectedValues, item => {
      //   mappedIds.push(item.id);
      // });
      // submission['answerIds'] = mappedIds;
      // this.openResultPopup('multiple', undefined, this.getMultiselectedValues, undefined, submission);
    } else if (this.AllQuestionsList[this.questionIndex].questionType === 'dragAndDrop') {
      this.showNextScreen();
      // submission['answerIds'] = this.draggedItem && this.draggedItem.id ? [this.draggedItem.id] : undefined;
      // this.openResultPopup('drag', undefined, undefined, this.draggedItem, submission);
    }else{
      this.showNextScreen();
    }
  }

  /**
   * to check no. of attempt and correct answers.
   */
  validateAndSaveData(submission: any, isEssay?: any): void {
    if (isEssay) {
      this.isRightAns = true;
    }
    if (this.attempt < 2 && this.isRightAns) {
      // this.onAnswerSubmit(submission);
      this.showNextScreen();
    } else if (this.attempt === 2) {
      this.showNextScreen();
      // this.onAnswerSubmit(submission);
    } else if (this.attempt > 2) {
      this.showNextScreen();
    }
  }

  /**
   * API call to save answers.
   * @param submission 
   */
  onAnswerSubmit(submission: any): void {
    this.studentService.saveAnswerToAPI(submission).subscribe(
      (response: any) => {
        if (response && response.data) {
          this.showNextScreen();
        }
      },
      (error) => {
        console.log(error);
        if (error && error.error.status === 400) {
          this.toast.showToast(error.error.message, '', 'error');
          setTimeout(() => {
            this.showNextScreen();
          }, 2000);
        }
      }
    );
  }

  /**
   * to show next questions.
   */
  showNextScreen(): void {
    if (this.questionIndex != 0) {
      this.questionIndex = parseInt(localStorage.getItem('questionIndex'))
    }
    let tempIndex = parseInt(this.panelIndex);
    if (tempIndex && this.AllQuestionsList.length === tempIndex && this.questionIndex === tempIndex) {
      this.questionIndex = this.AllQuestionsList.length;
    } else {
      this.questionIndex = this.questionIndex + 1;
    }
    localStorage.setItem('questionIndex', this.questionIndex.toString());
    this.form = this.AllQuestionsList[this.questionIndex];
    let url = this.router.url.split("?")[0].split('/teacher')[1];
    let urlToEdit = url + '?index=' + this.questionIndex;
    this.location.replaceState(urlToEdit);
    // this.updateLessonProgress();
    this.isVisibleNext = true;
    this.attempt = 0;
    this.dynamicComponent.isHint = false;
    console.log("AllQuestionsList",this.AllQuestionsList);
    console.log("questionIndex",this.questionIndex);
    if (this.AllQuestionsList.length === this.questionIndex) {
      // this.router.navigate(['teacher/action-activities']);
      this.router.navigate(['teacher/linguistic-details']); 
    }
  }

  ngAfterContentChecked(): void {
    if (this.assignmentData && this.AllQuestionsList.length - 1 === this.questionIndex) {
      this.showNext = false;
    } else {
      this.showNext = true;
    }
    if (this.questionIndex > 0) {
      this.isVisiblePrevious = true;
    }
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.questionIndex = this.questionIndex - 1;
    this.form = this.AllQuestionsList[this.questionIndex]
    if (this.questionIndex < 0) {
      this.router.navigate(['/teacher/start-experiment']);
    }
    // this.router.navigate(['teacher/serving']);
  }

  /**
   * to get value of multi-select type of questions.
   * @param selectedItems
   */
  getMultiSelectedAns(selectedItems?: any): void {
    this.getMultiselectedValues = selectedItems;
    this.isVisibleNext = false;
  }
  /**
   * to get value of single select type of questions.
   * @param item 
   */
  getSingleSelectAns(item: any): void {
    if (item && item.id) {
      this.getSingleSelectValue = item;
      this.isVisibleNext = false;
    }
  }

  /**
   * to get value of drag-drop type of questions.
   * @param ev 
   */
  drag(ev) {
    if (ev.target && ev.target.id && ev.target.id != '') {
      ev.dataTransfer.setData("text", ev.item.id);
      this.previousElement = ev.target.parentElement;
      this.draggedItem = ev.item;
    }
  }

  /**
  * to get value of drag-drop type of questions.
  * @param ev 
  */
  drop(ev) {
    let elementToUpdate;
    ev.preventDefault();
    if (ev.target && ev.target.firstChild != null) {
      elementToUpdate = ev.target.firstChild;
      ev.target.removeChild(elementToUpdate);
      let cardContainer: HTMLElement = document.getElementById('options');
      _.forEach(cardContainer.children, element => {
        if (element.children.length === 0) {
          element.appendChild(elementToUpdate);
        }
      });
    }
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    if (this.draggedItem) {
      this.isVisibleNext = false;
    }
  }

  /**
   * to show answers on popup for all type of questions.
   */
  openResultPopup(ansType?: any, singleData?: any, multiData?: any, dragData?: any, submission?: any): void {
    if (ansType === 'single') {
      if (singleData && singleData.isAnswer === true) {
        this.isRightAns = true;
      } else {
        this.isRightAns = false;
      }
    } else if (ansType === 'drag') {
      if (dragData.isAnswer === true) {
        this.isRightAns = true;
      } else {
        this.isRightAns = false;
      }
    } else if (ansType === 'multiple') {
      // let isCorrect = this.calculateMultiSelectAnswer();
      let isCorrect = true;
      if (multiData && multiData.length > 0 && isCorrect) {
        this.isRightAns = true;
      } else {
        this.isRightAns = false;
      }
    }
    this.showNextScreen();
    // this.hint = this.AllQuestionsList[this.questionIndex] && this.AllQuestionsList[this.questionIndex].hint ? this.AllQuestionsList[this.questionIndex].hint : undefined;
    // this.modalService.open(this.CorrectAnsModal, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    //   this.attempt = this.attempt + 1;
    //   submission['isCorrect'] = this.isRightAns;
    //   if (this.attempt && this.attempt === 1) {
    //     submission['pointsEarned'] = 1;
    //   } else if (this.attempt === 2) {
    //     submission['pointsEarned'] = 2.5;
    //   }
    //   this.validateAndSaveData(submission);
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });

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

  calculateMultiSelectAnswer(): boolean {
    let arr = [];
    _.forEach(this.getMultiselectedValues, op => {
      if (op.isAnswer) {
        arr.push(op);
      }
    });
    if ((arr.length === this.getMultiselectedValues.length) && (arr.length === this.AllQuestionsList[this.questionIndex].allCorrectAns.length)) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * to get value of essay type of questions.
   * @param item 
   */
  answerChange(data) {
    if (_.isEmpty(data) || data === undefined) {
      this.isVisibleNext = true;
    } else {
      this.selectedEassyAns = data;
      this.isVisibleNext = false;
    }
  }
}

