import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-student-action-activity',
  templateUrl: './student-action-activity.component.html',
  styleUrls: ['./student-action-activity.component.scss']
})
export class StudentActionActivityComponent implements OnInit {
  isButtonSection = {};
  activity;
  assignmentId: string;
  isLoad = false;
  isVisiblePrevious = true;
  lesson;
  currentAssignedLesson;
  constructor(private toast: ToasterService, private router: Router, private studentService: StudentService, private utilityService: UtilityService) {
    this.isButtonSection = {
      title: 'Take Action Activity'
    };
  }

  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId');
    this.lesson = localStorage.getItem('lessonType');
    this.getActionActivity();
  }

  getActionActivity() {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data.lesson && response.data.lesson.activity) {
          this.activity = response.data.lesson.activity;
          this.currentAssignedLesson = response.data;
          this.isVisiblePrevious = false;
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
    this.router.navigate(['student/action-activity-question']);
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    if (this.currentAssignedLesson.customSetting && this.currentAssignedLesson.customSetting.content) {
      for (let ob of this.currentAssignedLesson.customSetting.content) {
        // if (ob.title === 'Assessments' && ob.status === true) {
        //   let questionIndex = localStorage.getItem('questionIndex');
        //   this.router.navigate(['student/assessment-question'], { queryParams: { index: questionIndex } });
        //   break;
        // } else 
        if (ob.title === 'Cooking' && ob.status === true) {
          this.router.navigate(['/student/serving']);
          break;
        } else if (ob.title === 'Learning Activities' && ob.status === true) {
          let isSensoryExercise = _.find(ob.Activities, function (item) { return item.lable === 'Sensory Learning Exercise'; });
          let isExperiment = _.find(ob.Activities, function (item) { return item.lable === 'Science Experiment'; });
          if (isExperiment && isExperiment.status === true) {
            this.router.navigate(['/student/start-experiment']);
            break;
          }
          //  else if (isSensoryExercise && isSensoryExercise.status === true) {
          //   this.router.navigate(['/student/sensory-exercise']);
          //   break;
          // }
        } else if (ob.title === 'Story' && ob.status === true) {
          this.router.navigate(['/student/conversional-sentence'])
        }
      }
    } else if (this.lesson === 'Explore') {
      this.router.navigate(['/student/serving']);
    }
  }
}
