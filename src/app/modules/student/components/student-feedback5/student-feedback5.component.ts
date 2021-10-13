import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '@appcore/services/utility.service';
import { faAngleLeft, faChevronRight, faSearch, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { StudentsService } from '@modules/teacher/services/students.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-student-feedback5',
  templateUrl: './student-feedback5.component.html',
  styleUrls: ['./student-feedback5.component.scss']
})
export class StudentFeedback5Component implements OnInit {
  RightArrow = faChevronRight;
  LeftArrow = faAngleLeft;
  SearchIcon = faSearch;
  Calendar = faCalendar;
  lessonHederConfig = {};
  assignmentId: string;
  sessionData: any;
  textOne: any;
  textTwo: any;
  closeModal;
  constructor(private router: Router, private utilityService: UtilityService, private studentsService: StudentsService, private modalService: NgbModal) {
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
                this.textOne = ele.linguistic_details[0].text_one;
                this.textTwo = ele.linguistic_details[1].text_two;
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
    this.router.navigate(['student/conversional-sentence']);
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.router.navigate(['student/recipe-content']);
  }

  open(content) {
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true ,windowClass: 'feedback-popup'});
  }
  closeOpenModal() {
    this.closeModal.close();
  }
}
