import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { faCheck, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentsService } from '@modules/teacher/services/students.service';
@Component({
  selector: 'app-nutrient-question',
  templateUrl: './nutrient-question.component.html',
  styleUrls: ['./nutrient-question.component.scss']
})
export class NutrientQuestionComponent implements OnInit {

  check = faCheck;
  close = faTimes;
  RightArrow = faChevronRight;
  lessonHederConfig = {};
  closeResult = '';
  isCorrectAns = false;
  isVisibleNext = true;
  slectedOption;
  nutrientQuestionList: any;
  assignmentList: any;
  assignmentId: string;
  sessionData: any;

  // energyTypeList = [
  //   { name: 'f-option', value: 'Minty' },
  //   { name: 's-option', value: 'Citrus' },
  //   { name: 't-option', value: 'Nutty and Floral' }
  // ]
  constructor(private router: Router, private modalService: NgbModal,private studentsService: StudentsService, private utilityService: UtilityService) {
    this.lessonHederConfig['stepBoard'] = {
      stepNumber: 'Step 3',
      stepTitle: 'Ingredients',
      stepLogo: './assets/images/Vegetarian_Stew.png'
    }
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId')
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.getSmellTypes();
  }

  open(content, item) {
    this.slectedOption = item;
    if (this.slectedOption && this.slectedOption.value === 'Nutty and Floral') {
      this.isCorrectAns = true;
    } else {
      this.isCorrectAns = false;
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (this.isCorrectAns) {
        this.router.navigate(['student/sensory-question']);
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getSmellTypes() {
    this.studentsService.getStudentData().subscribe((response: []) => {
      response.forEach((element: any) => {
        if (this.utilityService.strictCompare(element.email, this.sessionData.email)) {
          this.assignmentList = element.assignmentList;
          if (this.assignmentList.length > 0) {
            this.assignmentList.forEach(ele => {
              if (this.utilityService.strictCompare(ele.id, this.assignmentId)) {
          this.nutrientQuestionList = ele.nutrientQuestionList;
        }
      });
    }
  }
    });
  });
  }

  onPrevious(): void {
    this.router.navigate(['student/ingredient-list']);
  }

  onNext(): void {
    this.router.navigate(['student/sensory-question']);
  }
}
