import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '@modules/student/services/student.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faCheck, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-flip-games',
  templateUrl: './flip-games.component.html',
  styleUrls: ['./flip-games.component.scss']
})
export class FlipGamesComponent implements OnInit {
  @ViewChild('correctAnsModal') CorrectAnsModal: ElementRef;
  check = faCheck;
  close = faTimes;
  RightArrow = faChevronRight;

  isButtonSection = {};
  lessonHederConfig = {};
  i = 0;
  hasFlippedCard = false;
  lockBoard = false;
  imageFlipQuestions: any = [];
  firstCard;
  secondCard;
  counter = 0;
  isVisiblePrevious = false;
  isVisibleNext = true;
  questionsAttempted: number = 0; closeResult: string;
  ;

  constructor(private router: Router, private modalService: NgbModal, private studentsService: StudentService) {
    this.lessonHederConfig['stepBoard'] = {
      stepTitle: 'Level 1'
    };
  }

  ngOnInit(): void {
    this.getQuestionData();
  }

  onNext(): void {

    if (this.questionsAttempted == this.imageFlipQuestions.length) {
      this.router.navigateByUrl('/');
    } else if (this.questionsAttempted >= 0) {
      this.i++;
      this.lessonHederConfig['stepBoard'] = {
        stepTitle: 'Level ' + this.imageFlipQuestions[this.i].level,
      };
      this.isVisibleNext = true;
      this.counter = 0;
    }
  }

  /**
   * on Previous click event
   */
  onPrevious(): void {
    this.isVisiblePrevious = false;
    this.router.navigateByUrl('/student/games-listing');
  }

  getQuestionData() {
    this.studentsService.getFlipImageQuestions().subscribe((res: any) => {
      this.imageFlipQuestions = res.data;
    });
  }

  flip(item, index) {
    if (item) {
      document.getElementById("card" + index).setAttribute('value', item.id)
    }

    if (this.lockBoard) return;
    if (document.getElementById("card" + index) === this.firstCard) return;

    document.getElementById("card" + index).classList.add('flip-white');
    if (!this.hasFlippedCard) {
      // first click
      this.hasFlippedCard = true;
      this.firstCard = document.getElementById("card" + index);

      return;
    }

    // second click
    this.secondCard = document.getElementById("card" + index);
    this.lockBoard = true;


  }

  checkForMatch() {
    if (this.firstCard && this.secondCard) {
      let isMatch = this.firstCard.getAttribute('value') === this.secondCard.getAttribute('value');
      if (isMatch) {
        this.firstCard.style.borderColor = "green";
        this.secondCard.style.borderColor = "green"

        this.disableCards()
      }
      else {
        this.firstCard.style.borderColor = "red";
        this.secondCard.style.borderColor = "red"
        this.unflipCards();
      }
      //  isMatch ?  this.disableCards() : this.unflipCards();
    }

  }

  disableCards() {
    [this.hasFlippedCard, this.lockBoard] = [false, false];
    [this.firstCard, this.secondCard] = [null, null];
    this.resetBoard();
    this.counter++;
    if (this.counter == (this.imageFlipQuestions[this.i].options.length / 2)) {
      this.modalService.open(this.CorrectAnsModal, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
        this.isVisibleNext = false;
        this.questionsAttempted++;
        this.onNext();
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

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


  unflipCards() {
    this.lockBoard = true;

    setTimeout(() => {
      this.firstCard.classList.remove('flip-white');
      this.secondCard.classList.remove('flip-white');
      this.resetBoard();

    }, 500);
  }

  resetBoard() {
    [this.hasFlippedCard, this.lockBoard] = [false, false];
    [this.firstCard, this.secondCard] = [null, null];
  }
}
