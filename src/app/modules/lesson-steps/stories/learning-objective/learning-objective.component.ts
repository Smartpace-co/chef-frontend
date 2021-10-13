import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';

@Component({
  selector: 'app-learning-objective',
  templateUrl: './learning-objective.component.html',
  styleUrls: ['./learning-objective.component.scss']
})
export class LearningObjectiveComponent implements OnInit {
  lessonHederConfig = {};
  isVisibleNext = false;
  showPrevious = false; // To hide previous button
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: false,
    nextArrow: false,
    // nextArrow: '<div class=\'nav-btn next-slide\'>>></div>',
    // prevArrow: '<div class=\'nav-btn prev-slide\'><<</div>',
    dots: true,
    infinite: false,
  };
  assignmentTitle: any;
  assignmentList: any;
  assignmentId: string;
  isLoad = false;
  learningObjective = [];
  learnObjString: string;
  audioTrack;
  countryBgImg;
  constructor(private router: Router, private toast: ToasterService, private studentService: StudentService, private utilityService: UtilityService) {
    this.lessonHederConfig['stepBoard'] = null;
  }

  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId')
    this.getStudentData();
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

  getStudentData() {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data) {
          this.assignmentTitle = response.data.assignmentTitle;
          this.countryBgImg = response.data.recipe.country.backgroundImage;
          this.audioTrack = response.data.lesson.learningObjectivesForStudentTrack;
          this.learnObjString = response.data.lesson.learningObjectivesForStudent.replace(/&nbsp;|<[^>]+>/g, '');
          // this.learnObjString = '<ol><li><strong>learn special class and have? a specilaization recipie cooking learn special. class and have a specilaization recipie cookinglearn special class and have a specilaization. recipie cookinglearn special class and have a specilaization recipie cookinglearn special. class and have a specilaization recipie cookinglearn special class and have. a specilaization recipie cookinglearn special class and have a specilaization recipie cookinglearn special class and have a specilaization recipie cookinglearn special class and have a specilaization recipie cookinglearn special class and have a specilaization recipie cookinglearn special class and have a specilaization recipie cookinglearn special class and have a specilaization recipie cookinglearn special class and have a specilaization recipie cooking</strong></li></ol>'
          // let stripedHtml = this.learnObjString.replace(/<[^>]+>/g, '');
          // this.learningObjective = stripedHtml.split(/[!,?,.]/);         
          this.learningObjective = this.learnObjString.match(/.{1,220}/g);
          this.isLoad = true;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  /**
  * on Next click event
 */
  onNext(): void {
    this.router.navigate(['/student/summary-view']);
  }
}
