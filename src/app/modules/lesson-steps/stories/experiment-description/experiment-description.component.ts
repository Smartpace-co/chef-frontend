import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';

@Component({
  selector: 'app-experiment-description',
  templateUrl: './experiment-description.component.html',
  styleUrls: ['./experiment-description.component.scss']
})
export class ExperimentDescriptionComponent implements OnInit {
  isButtonSection = {};
  assignmentId: string;
  experimentData;
  experimentFacts = [];
  isVisibleNext = true;
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: '<div class=\'nav-btn next-slide\'></div>',
    prevArrow: '<div class=\'nav-btn prev-slide\'></div>',
    dots: true,
    infinite: false,
  };
  constructor(private router: Router, private utilityService: UtilityService, private studentService: StudentService, private toast: ToasterService) {
  }

  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId')
    this.getExperimentDescription();
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
  getExperimentDescription(): void {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data) {
          this.experimentData = response.data.lesson.experiment;
          this.isButtonSection = {
            title: this.experimentData.experimentTitle ? this.experimentData.experimentTitle : undefined
          };
          // this.experimentFacts = this.experimentData.fact.match(/.{1,100}/g);
          this.experimentFacts = this.experimentData.fact.split(".");
          this.experimentData = this.experimentFacts.filter(e => e && e.trim() != "");
          this.isVisibleNext = false;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  tryAgain(): void {
    this.router.navigate(['/student/experiment']);
  }
  onPrevious(): void {
    this.router.navigate(['/student/experiment-steps'])
  }
  /**
   * on Next click event
  */
  onNext(): void {
    this.router.navigate(['/student/start-experiment']);
  }
}
