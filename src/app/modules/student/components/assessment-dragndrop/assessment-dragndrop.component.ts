import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentsService } from '@modules/teacher/services/students.service';

@Component({
  selector: 'app-assessment-dragndrop',
  templateUrl: './assessment-dragndrop.component.html',
  styleUrls: ['./assessment-dragndrop.component.scss']
})
export class AssessmentDragndropComponent implements OnInit {
  lessonHederConfig = {};
  assignmentId: string;
  sessionData: any;
  assignmentData: any;

  constructor(private router: Router,private utilityService:UtilityService, private studentsService:StudentsService) {
    this.lessonHederConfig['stepBoard'] = null;
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId')
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.getStudentData();
  }

  getStudentData() {
    this.studentsService.getStudentData().subscribe((response: []) => {
      response.forEach((element: any) => {
        if (this.utilityService.strictCompare(element.email, this.sessionData.email)) {
          if (element.assignmentList.length > 0) {
            element.assignmentList.forEach(ele => {
              if (this.utilityService.strictCompare(ele.id, this.assignmentId)) {
                this.assignmentData=ele;
              }
            });
          }
        }
      });
    });
  }

  /**
  * on Next click event
 */
  onNext(): void {
    this.router.navigate(['student/introduction']);
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.router.navigate(['student/summary-view']);
  }

   allowDrop(ev) {
    ev.preventDefault();
  }
  
   drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }
  
   drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }
}
