import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '@modules/student/services/student.service';
import { ToasterService } from '@appcore/services/toaster.service';
import * as _ from 'lodash';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { UtilityService } from '@appcore/services/utility.service';
@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.scss']
})
export class ExperimentComponent implements OnInit {

  assignmentId: string;
  assignmentData: any;
  isButtonSection = {};
  show: boolean = false;
  isChecked: boolean;
  panelIndex;
  play = faPlay;
  currentAssignedLesson;
  experimentData;
  lesson;
  isVisibleNext = true;
  isVisiblePrevious = true;
  constructor(private toast: ToasterService, private utilityService: UtilityService, private studentService: StudentService, private router: Router) {
  }

  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId');
    this.lesson = localStorage.getItem('lessonType');
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
  getStudentData(): void {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data) {
          this.currentAssignedLesson = response.data;
          this.experimentData = response.data.lesson.experiment;
          this.isButtonSection = {
            title: this.experimentData.experimentTitle ? this.experimentData.experimentTitle : undefined
          };
          this.isVisibleNext = false;
          this.isVisiblePrevious = false;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  onPrevious(): void {
    if (this.currentAssignedLesson.customSetting && this.currentAssignedLesson.customSetting.content) {
      for (let ob of this.currentAssignedLesson.customSetting.content) {
        if (ob.title === 'Cooking' && ob.status === true) {
          this.router.navigate(['/student/cooking-steps']);
          break;
        }
        //  else if (ob.title === 'Learning Activities' && ob.status === true) {
        //   let isSensoryExercise = _.find(ob.Activities, function (item) { return item.lable === 'Sensory Learning Exercise'; });
        //   if (isSensoryExercise && isSensoryExercise.status === true) {
        //     this.router.navigate(['/student/sensory-exercise']);
        //     break;
        //   }
        // }
        else if (ob.title === 'Story' && ob.status === true) {
          this.router.navigate(['/student/conversional-sentence'])
        }
      }
    } else if (this.lesson === 'Explore') {
      this.router.navigate(['/student/cooking-steps']);
    }
  }

  /**
   * on Next click event
  */
  onNext(): void {
    this.router.navigate(['student/experiment-steps']);
  }
}