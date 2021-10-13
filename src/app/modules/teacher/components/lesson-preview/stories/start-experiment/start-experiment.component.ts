import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';

@Component({
  selector: 'app-start-experiment',
  templateUrl: './start-experiment.component.html',
  styleUrls: ['./start-experiment.component.scss']
})


export class StartExperimentComponent implements OnInit {
  currentAssignedLesson;
  isButtonSection = {};
  assignmentId: string;
  lessonData : any;
  constructor(private router: Router, private studentService: StudentService, 
    private utilityService: UtilityService, private toast: ToasterService,
    private teacherService : TeacherService) {
  }
  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId');
    this.lessonData = this.teacherService.getAssignLessonData();
    // this.getLessonData(this.lessonData);
    this.isButtonSection = {
      title: this.lessonData.lesson.experiment.experimentTitle ? this.lessonData.lesson.experiment.experimentTitle : undefined
    };
    // let previousTime = this.utilityService.calculateTimeBetweenDates();
    // this.updateLessonProgress(previousTime);
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
  
  getLessonData(data): void {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data) {
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
    this.router.navigate(['teacher/experiment']);
  }
  onPrevious(): void {
    this.router.navigate(['teacher/experiment-description']);
  }


  /**
   * on Next click event
  */
  onNext(): void {
    this.router.navigate(['teacher/experiment-question']);
  }
}
