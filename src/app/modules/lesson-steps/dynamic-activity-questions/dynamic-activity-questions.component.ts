import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dynamic-activity-questions',
  templateUrl: './dynamic-activity-questions.component.html',
  styleUrls: ['./dynamic-activity-questions.component.scss']
})
export class DynamicActivityQuestionsComponent implements OnInit {
  @Output() onSubmitActivity = new EventEmitter();
  @Input() questionData;
  actionActivityGroup: FormGroup;
  activityDescription: string;
  isHint = false;
  measurementList;
  isReference = false;
  viewMeasure = false;
  constructor() { }

  ngOnInit(): void {
    this.actionActivityGroup = this.createFormgroup(this.questionData)
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

  onInputValueChange(data) {
    this.activityDescription = data;
  }

  onSaveActivity() {
    this.onSubmitActivity.emit(this.activityDescription);
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
}
