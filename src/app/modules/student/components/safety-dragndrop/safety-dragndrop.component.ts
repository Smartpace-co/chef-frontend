import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { ToasterService } from '@appcore/services/toaster.service';
import * as _ from 'lodash';
import { promise } from 'protractor';

@Component({
  selector: 'app-safety-dragndrop',
  templateUrl: './safety-dragndrop.component.html',
  styleUrls: ['./safety-dragndrop.component.scss']
})
export class SafetyDragndropComponent implements OnInit {
  isButtonSection = {}
  lessonHederConfig = {};
  sessionData: any;
  assignmentData: any;
  isVisiblePrevious = false;
  isVisibleNext = true;
  i: number = 0;
  panelIndex;
  questionIndex = 0;
  questionsAttempted: number = 0;
  optionNumber: number;

  fillArray = false;
  finalAnswerArray = [];
  answerArray = [];

  // new var
  arr: any[] = [];
  assignmentQuestion: any[] = [];
  form: any;


  constructor(private router: Router, private utilityService: UtilityService,private toast:ToasterService, private studentsService: StudentService) {
    this.lessonHederConfig['stepBoard'] = {
      //stepNumber: 'Level 1',
      stepTitle: 'Level 1'

    };
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.getQuestionData();
  }

  getQuestionData() {
    this.studentsService.getDragAndDropQuestions().subscribe((res: any) => {
      let sortedArray = res.data.sort((a, b) => a.level > b.level ? 1 : -1);
      this.assignmentQuestion = res.data;
     /*  this.lessonHederConfig={
        stepNumber: 'Level 1',
        stepTitle: 'Question 1',
        stepLogo: './assets/images/wash-your-hands.png'

      } */
    });

  }

  /**
   * on Next click event
   */
  onNext(): void {

    if (this.questionsAttempted == this.assignmentQuestion.length) {
      this.router.navigateByUrl('/');
    } else if (this.questionsAttempted >= 0) {
      this.i++;
      this.lessonHederConfig['stepBoard'] = {
        stepTitle: 'Level '+this.assignmentQuestion[this.i].level,

      };
      this.isVisibleNext = true;
    }
  }

  /**
   * on Previous click event
   */
  onPrevious(): void {
    this.isVisiblePrevious = false;
    this.router.navigateByUrl('/student/games-listing');
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev, j) {
    ev.dataTransfer.setData('text', ev.target.id);
    this.optionNumber = j;
  }

  drop(ev, ev1, i, questionID) {
    if (this.fillArray == false) {
      for (let index = 0; index < this.assignmentQuestion[i].subQuestions.length; index++) {
        this.answerArray.push({ questionID: this.assignmentQuestion[i].subQuestions[index].id, answerObj: '', answerID: '' });
        this.finalAnswerArray.push({ question: this.assignmentQuestion[i].subQuestions[index].id, answer: '' });
      }
      this.fillArray = true;
    }

    ev.preventDefault();
    var data = ev.dataTransfer.getData('text');
    document.getElementById('write-answer' + questionID).appendChild(document.getElementById(data));

    if (!this.answerArray[questionID].answerObj) {
      this.answerArray[questionID].answerObj = ev.target.firstChild;
      this.answerArray[questionID].answerID = data;
      this.finalAnswerArray[questionID].answer = data;
      for (let index = 0; index < this.assignmentQuestion[i].subQuestions.length; index++) {
        if (document.getElementById('write-answer' + index).firstChild == null) {
          this.finalAnswerArray[index].answer = '';
          this.answerArray[index].answerObj = '';
        }
      }
    } else {
      let optionIndex;

      var promise = new Promise((resolve, reject) => {
        let ii: number;
        for (let index = 0; index < this.assignmentQuestion[i].subQuestions.length; index++) {
          if (this.assignmentQuestion[i].options[index].id == this.answerArray[questionID].answerID) {
            optionIndex = index;
            ii = index;
            resolve(ii);
            break;
          }
        }
      });

      promise.then((ii) => {
        document.getElementById(ii.toString()).appendChild(this.answerArray[questionID].answerObj);

        this.answerArray[questionID].answerObj = document.getElementById('write-answer' + questionID).lastChild;

        this.answerArray[questionID].answerID = data;

        this.finalAnswerArray[questionID].answer = data;
        for (let index = 0; index < this.assignmentQuestion[i].subQuestions.length; index++) {
          if (document.getElementById('write-answer' + index).firstChild == null) {
            this.finalAnswerArray[index].answer = '';
            this.answerArray[index].answerObj = '';
          }
        }
      });
    }

    let counter = 0;
    for (let index = 0; index < this.assignmentQuestion[i].subQuestions.length; index++) {
      if (this.finalAnswerArray[index].answer == this.finalAnswerArray[index].question) {
        counter++;
        if (counter == this.assignmentQuestion[i].subQuestions.length) {
          let count = i + 1;
          this.toast.showToast('You have successfully answered ', '', 'success');
        //  alert('You have successfully cleared Stage ' + count);
          this.isVisibleNext = false;
          this.questionsAttempted++;
          this.finalAnswerArray = [];
          this.answerArray = [];
          this.fillArray = false;
        }
        else {
      }
      } else {
        let xyz = 0
        this.finalAnswerArray.forEach(element => {
          if (element.answer != "") {
            // this.allFieldFilled++
            xyz++
          }
        });
        if (counter != this.assignmentQuestion[i].subQuestions.length && xyz == this.assignmentQuestion[i].subQuestions.length) {
          this.toast.showToast('Please try again', '', 'error');
          this.reset();
          break;

        }
      }
    }
  }

  reset() {
    for (let i = 0; i < this.assignmentQuestion[this.i].options.length; i++) {
      for (let j = 0; j < this.answerArray.length; j++) {

        if (this.assignmentQuestion[this.i].options[i].id == this.answerArray[j].answerID) {

          document.getElementById(i.toString()).appendChild(this.answerArray[j].answerObj);
          this.answerArray[j].answerObj = '';
          this.answerArray[j].answerID = '';
      }
    }
  }

  }
  dropIntoOption(ev, option) {
    ev.preventDefault();
    this.optionNumber = option;
    var data = ev.dataTransfer.getData('text');
    ev.target.appendChild(document.getElementById(data));
    for (let index = 0; index < this.assignmentQuestion[this.i].options.length; index++) {
      if (this.assignmentQuestion[this.i].options[index].id == ev.target.firstChild.id) {
        document.getElementById(index.toString()).appendChild(ev.target.firstChild);
      }
    }
  }
}
