import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import * as _ from 'lodash';
import { AuthService } from '@modules/auth/services/auth.service';

@Component({
  selector: 'app-start-experiment',
  templateUrl: './start-experiment.component.html',
  styleUrls: ['./start-experiment.component.scss']
})
export class StartExperimentComponent implements OnInit {
  currentAssignedLesson;
  isButtonSection = {};
  assignmentId: string;
  isCooking = false;
  lesson;
  isVisibleNext = true;
  constructor(private router: Router, private studentService: StudentService, private utilityService: UtilityService, private toast: ToasterService,private authService: AuthService,) {
    this.authService.setuserlang();
  }
  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId');
    this.lesson = localStorage.getItem('lessonType');
    this.getLessonData();
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
  getLessonData(): void {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data) {
          this.currentAssignedLesson = response.data;
          this.isVisibleNext = false;
          this.isButtonSection = {
            title: response.data.lesson.experiment.experimentTitle ? response.data.lesson.experiment.experimentTitle : undefined
          };
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  onExperiment(): void {
    this.router.navigate(['student/experiment']);
  }
  onPrevious(): void {
    this.router.navigate(['student/experiment-description']);
  }


  /**
   * on Next click event
  */
  onNext(): void {
    if (this.currentAssignedLesson && this.currentAssignedLesson.defaultSetting === true || this.lesson === 'Explore') {
      if (!_.isEmpty(this.currentAssignedLesson.lesson.experiment.experimentQuestions)) {
        this.router.navigate(['student/experiment-question']);
      } else {
        this.router.navigate(['/student/cleaning']);
      }
    } else {
      if (this.currentAssignedLesson && this.currentAssignedLesson.defaultSetting === false && this.currentAssignedLesson.customSetting && this.currentAssignedLesson.customSetting.content) {
        for (let ob of this.currentAssignedLesson.customSetting.content) {
          if (ob.title === 'Cooking' && ob.status === true) {
            this.isCooking = true;
          } else if (ob.title === 'Learning Activities' && ob.status === true) {
            let isExperiment = _.find(ob.Activities, function (item) { return item.lable === 'Science Experiment'; });
            if (isExperiment && isExperiment.status === true && !_.isEmpty(this.currentAssignedLesson.lesson.experiment.experimentQuestions)) {
              this.router.navigate(['student/experiment-question']);
              break;
            }
          } else if (ob.title === '!Story' && this.isCooking === true) {
            this.router.navigate(['/student/cleaning']);
            break;
          } else if (ob.title === 'Assessments' && ob.status === true) {
            this.router.navigate(['/student/assessment-question']);
            break;
          } else {
            this.router.navigate(['/student/action-activities']);
          }
        }
      }
    }
  }
}
