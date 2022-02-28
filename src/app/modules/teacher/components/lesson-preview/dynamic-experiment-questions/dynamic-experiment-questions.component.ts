import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faCheck, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dynamic-experiment-questions',
  templateUrl: './dynamic-experiment-questions.component.html',
  styleUrls: ['./dynamic-experiment-questions.component.scss']
})
export class DynamicExperimentQuestionsComponent implements OnInit {

  @Input() showPrevious: boolean;
  @Input() questionData;
  @Output() getSingleSelectedValue = new EventEmitter();
  @Output() valueChange = new EventEmitter();
  @Output() onMultiSelectedAns = new EventEmitter();
  @Output() onDropItem = new EventEmitter();
  @Output() onDragItem = new EventEmitter();
  lessonHederConfig = {};
  experimentGroup: FormGroup;
  sessionData;
  allUnit = [];
  measurementList;
  isHint = false;
  isReference = false;
  viewMeasure = false;
  index: number = 0;
  check = faCheck;
  close = faTimes;
  RightArrow = faChevronRight;
  panelIndex;
  assignmentId: string;
  assignmentData: any;

  constructor() { }

  ngOnInit(): void {
    this.experimentGroup = this.createFormgroup(this.questionData)

  }

  onInputValueChange(data) {
    this.valueChange.emit(data);
  }

  onMultiOptionClick(data: any, correctAns: any) {
    // if (data && data.isAnswer) {
    //   if (this.allUnit.indexOf(data) === -1) {
    //     // data['isSelect'] = true;
    //     this.allUnit.push(data);
    //   } else {
    //     // data['isSelect'] = false;
    //     const index = this.allUnit.indexOf(data);
    //     if (index > -1) {
    //       this.allUnit.splice(index, 1);
    //     }
    //   }
    // }
    // if (correctAns.length === this.allUnit.length) {
    //   this.onMultiSelectedAns.emit(this.allUnit);
    // } else {
    //   this.onMultiSelectedAns.emit();
    // }
    if (data && data.isSelect === true) {
      this.allUnit.push(data);
    } else {
      const index = this.allUnit.indexOf(data);
      if (index > -1) {
        this.allUnit.splice(index, 1);
      }
    }
    this.onMultiSelectedAns.emit(this.allUnit);
  }

  get formControl() {
    return this.experimentGroup.controls;
  }

  onkey() {
  }

  showReference(): void {
    this.isHint = false;
    this.isReference = true;
  }

  closeReference(): void {
    this.isReference = false;
  }

  showHint(): void {
    this.isReference = false;
    this.isHint = true;
  }

  closeHint(): void {
    this.isHint = false;
  }

  viewMeasurement(): void {
    this.viewMeasure = true;
  }

  createFormgroup(questionData) {
    const formData = {};
    if (questionData && questionData) {
      questionData.form.forEach(element => {
        formData[element.formCtrlName] = new FormControl(element.value || '', Validators.required)
      });
      return new FormGroup(formData);
    }
  }

  singleSelectedValue(item: any): void {
    this.getSingleSelectedValue.emit(item);
  }


  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev, item) {
    ev['item'] = item;
    this.onDragItem.emit(ev);
  }

  drop(ev) {
    ev.preventDefault();
    this.onDropItem.emit(ev);
  }
}
