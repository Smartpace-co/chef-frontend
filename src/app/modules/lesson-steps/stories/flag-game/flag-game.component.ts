import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { faCheck, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { StudentService } from '@modules/student/services/student.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@modules/auth/services/auth.service';
@Component({
  selector: 'app-flag-game',
  templateUrl: './flag-game.component.html',
  styleUrls: ['./flag-game.component.scss']
})
export class FlagGameComponent implements OnInit {
  @ViewChild('correctAnsModal') CorrectAnsModal: ElementRef;
  assignmentId: string;
  assignmentData: any;
  isVisibleNext = true;
  closeResult = '';
  selectedFlag;
  check = faCheck;
  close = faTimes;
  RightArrow = faChevronRight;
  isRightAns = false;
  countryName;
  allFlags = [];
  constructor(private router: Router, private utilityService: UtilityService, private modalService: NgbModal, private studentService: StudentService, private toast: ToasterService,private authService: AuthService,) {
    this.authService.setuserlang();
  }

  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId')
    this.getAssignedLessonData();
    let previousTime = this.utilityService.calculateTimeBetweenDates();
    this.updateLessonProgress(previousTime);
  }

  updateLessonProgress(time: any): void {
    let submission = {
      currentScreen: this.router.url.split('/student')[1],
      timeTaken: time ? time : undefined
    }
    this.studentService.updateLessonProgress(this.assignmentId, submission).subscribe(
      (response: any) => {
        if (response && response.data) {
          window.sessionStorage.setItem('previousDate', JSON.stringify(new Date()));
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  getAssignedLessonData() {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data) {
          this.assignmentData = response.data;
          this.countryName = response.data.recipe.country.countryName;
          this.allFlags = response.data.recipe.country.matchFlags;
          this.isVisibleNext = false;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
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
        // this.isVisibleNext = false;
        this.onNext();
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
    this.router.navigate(['/student/linguistic-details']);
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.router.navigate(['student/action-activities']);
  }
}
