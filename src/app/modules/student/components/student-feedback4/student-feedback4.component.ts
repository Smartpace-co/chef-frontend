import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentsService } from '@modules/teacher/services/students.service';

@Component({
  selector: 'app-student-feedback4',
  templateUrl: './student-feedback4.component.html',
  styleUrls: ['./student-feedback4.component.scss']
})
export class StudentFeedback4Component implements OnInit {

  showNext = false;
  isButtonSection = {};
  assignmentList: any;
  assignmentId: string;
  sessionData: any;
  activityQueOne: any;
  activityQueTwo: any;
  constructor(private router: Router, private studentsService: StudentsService, private utilityService: UtilityService) {
    this.isButtonSection = {
      title: 'Take Action Activity'
    };
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId')
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.getCleaningSteps();
  }

  getCleaningSteps() {
    this.studentsService.getStudentData().subscribe((response: []) => {
      response.forEach((element: any) => {
        if (this.utilityService.strictCompare(element.email, this.sessionData.email)) {
          this.assignmentList = element.assignmentList;
          if (this.assignmentList.length > 0) {
            this.assignmentList.forEach(ele => {
              if (this.utilityService.strictCompare(ele.id, this.assignmentId)) {
                this.activityQueOne = ele.take_action_acticity[0].activity_que_one;
                this.activityQueTwo = ele.take_action_acticity[1].activity_que_two;
              }
            });
          }
        }
      });
    });
  }

  onPrevious(): void {
    let questionIndex = localStorage.getItem('questionIndex');
    this.router.navigate(['student/assessment-question'], { queryParams: { index: questionIndex } });
  }

}
