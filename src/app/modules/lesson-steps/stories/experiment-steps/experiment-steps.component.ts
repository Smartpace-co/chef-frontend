import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { UtilityService } from '@appcore/services/utility.service';
import { FormGroup } from '@angular/forms';
import { StudentService } from '@modules/student/services/student.service';
import { ToasterService } from '@appcore/services/toaster.service';
import * as _ from 'lodash';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-experiment-steps',
  templateUrl: './experiment-steps.component.html',
  styleUrls: ['./experiment-steps.component.scss']
})
export class ExperimentStepsComponent implements OnInit {
  play = faPlay;
  assignmentId: string;
  assignmentData: any;
  isButtonSection = {};
  experimentGroup: FormGroup;
  form;
  isLoad = false;
  isVisibleNext = true;
  experimentData;
  questionIndex: number = 0;
  experimentSteps = [];
  defaultLessonImage:string;
  constructor(private toast: ToasterService, private modalService: NgbModal, private studentService: StudentService,
    private sanitizer: DomSanitizer, private router: Router, private utilityService: UtilityService) {
      this.defaultLessonImage = './assets/images/default-lesson.png';
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
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId))
      .subscribe((response) => {
        let cnt = 1;
        if (response && response.data) {
          this.experimentData = response.data.lesson.experiment;
          this.isButtonSection = {
            title: this.experimentData.experimentTitle ? this.experimentData.experimentTitle : undefined
          };
          this.experimentSteps = _.map(this.experimentData.experimentSteps, item => {
            let secureUrl;
            if (item && item.link) {
              secureUrl = this.sanitizer.bypassSecurityTrustResourceUrl(item.link);
            }
            let obj = {
              id: cnt,
              info: item.text,
              image: item.image ? item.image : this.defaultLessonImage,
              videoUrl: secureUrl,
            }
            cnt = cnt + 1;
            return obj;
          });
          this.isLoad = true;
          this.isVisibleNext = false;
        }
      },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
  }
  addObservation(): void {
    this.router.navigate(['/student/experiment-observation'])
  }

  onPrevious(): void {
    this.router.navigate(['/student/experiment'])
  }

  /**
   * on Next click event
  */
  onNext(): void {
    this.router.navigate(['/student/experiment-description']);
  }

}