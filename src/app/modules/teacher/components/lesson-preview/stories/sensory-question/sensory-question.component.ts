import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentsService } from '@modules/teacher/services/students.service';
@Component({
  selector: 'app-sensory-question',
  templateUrl: './sensory-question.component.html',
  styleUrls: ['./sensory-question.component.scss']
})
export class SensoryQuestionComponent implements OnInit {

  isVisibleNext = true;
  lessonHederConfig = {};
  sensoryQuestionList: any;
  assignmentId: string;
  sessionData: any;
  assignmentData: any;
  constructor(private router: Router, private studentsService: StudentsService, private utilityService: UtilityService) {
    this.lessonHederConfig['stepBoard'] = {
      stepNumber: 'Step 3',
      stepTitle: 'Sensory Exercise',
      stepLogo: './assets/images/bulb.png'
    }
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId')
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.getSensoryQueData();
  }

  getSensoryQueData() {
    this.studentsService.getStudentData().subscribe((response: []) => {
      response.forEach((element: any) => {
        if (this.utilityService.strictCompare(element.email, this.sessionData.email)) {
          if (element.assignmentList.length > 0) {
            element.assignmentList.forEach(ele => {
              if (this.utilityService.strictCompare(ele.id, this.assignmentId)) {
                this.assignmentData = ele;
                this.sensoryQuestionList = this.assignmentData.sensoryQuestionList;
              }
            });
          }
        }
      });
    });
  }

  onAnsItemChange(event: any): void {
    if (event && event.target && event.target.value) {
      this.isVisibleNext = false;
    }
  }

  onPrevious(): void {
    this.router.navigate(['student/nutrient-question']);
  }

  onNext(): void {
    this.router.navigate(['student/cooking-preparation']);
  }
}
