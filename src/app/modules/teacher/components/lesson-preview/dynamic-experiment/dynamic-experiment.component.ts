import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dynamic-experiment',
  templateUrl: './dynamic-experiment.component.html',
  styleUrls: ['./dynamic-experiment.component.scss']
})
export class DynamicExperimentComponent implements OnInit {

  @Input() experimentData;
  experimentGroup: FormGroup;
  formData = {};
  constructor() { }

  ngOnInit(): void {
    this.createFormgroup(this.experimentData)
  }

  createFormgroup(data) {
    if(data && data.experimentData){
      data.experimentData.form.forEach(element => {
        this.formData[element.formaCtrlname] = new FormControl(element.value || '', Validators.required)
      });
      this.experimentGroup = new FormGroup(this.formData);
    }
  }
}
