import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { faCheck, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { StudentService } from '@modules/student/services/student.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-flag-game-activity',
  templateUrl: './flag-game-activity.component.html',
  styleUrls: ['./flag-game-activity.component.scss']
})
export class FlagGameActivityComponent implements OnInit {
  @ViewChild('correctAnsModal') CorrectAnsModal: ElementRef;
  isButtonSection = {}
  lessonHederConfig = {};
  assignmentId: string;
  assignmentQuestion: any[] = [];
  isVisibleNext = true;
  closeResult = '';
  selectedFlag;
  check = faCheck;
  close = faTimes;
  RightArrow = faChevronRight;
  isRightAns = false;
  countryName;
  questionsAttempted: number = 0;
  allFlags = [];
  i=0;
  constructor(private router: Router, private utilityService: UtilityService, private modalService: NgbModal, private studentService: StudentService, private toast: ToasterService) {
    this.lessonHederConfig['stepBoard'] = {
      stepTitle: 'Level 1'

    };
  }

  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId')
    this.getQuestionData();
  }

  getQuestionData() {
    this.studentService.getFlagMatchQuestions().subscribe((res: any) => {
      let sortedArray = res.data.sort((a, b) => a.level > b.level ? 1 : -1);
      this.assignmentQuestion = res.data;
     /*  this.lessonHederConfig={
        stepNumber: 'Level 1',
        stepTitle: 'Question 1',
        stepLogo: './assets/images/wash-your-hands.png'

      } */
    });

  }

 /*  getAssignedLessonData() {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data) {
          this.assignmentData = response.data;
          this.countryName = response.data.recipe.country.countryName;
          this.allFlags = response.data.recipe.country.matchFlags;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
*/
  getFlag(item: any): void {
    this.openResultPopup(item);
  }

  /**
   * to show answers on popup for question.
   */
  openResultPopup(data: any): void {
    if (data && data.isAnswer) {
      this.isRightAns = true;
    } else {
      this.isRightAns = false;
    }
    this.modalService.open(this.CorrectAnsModal, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (this.isRightAns) {
        // this.saveAnswer();
        this.isVisibleNext = false;
        this.questionsAttempted++;
        this.onNext();
      }
      else{
        this.assignmentQuestion[this.i].optionFlags.sort(() => Math.random() - 0.5)
      }
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

  /**
  * on Next click event
 */
  onNext(): void {
    if (this.questionsAttempted == this.assignmentQuestion.length) {
      this.router.navigate(['/student/games-listing']);
    } else if (this.questionsAttempted >= 0) {
      this.i++;
      this.lessonHederConfig['stepBoard'] = {
        stepTitle: 'Level '+this.assignmentQuestion[this.i].level
      };
      this.isVisibleNext = true;
    }
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.router.navigate(['student/games-listing']);
  }
}
