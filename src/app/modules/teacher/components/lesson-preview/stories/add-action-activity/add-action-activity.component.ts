import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-action-activity',
  templateUrl: './add-action-activity.component.html',
  styleUrls: ['./add-action-activity.component.scss']
})
export class ActionActivityComponent implements OnInit {
  showNext = false;
  activityDescription: string;
  isButtonSection = {};
  assignmentId: string;
  constructor(private router: Router, private toast: ToasterService, private studentService: StudentService, private utilityService: UtilityService) {
    this.isButtonSection = {
      title: 'Take Action Activity'
    };
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId')
  }

  /**
   * API call to save activityDescription.
   */
  onSaveActivity(): void {
    if (!_.isEmpty(this.activityDescription)) {
      let submission = {
        assignLessonId: this.assignmentId,
        essay: this.activityDescription,
        isActivityAction: true,
        isCorrect: true
      };
      this.studentService.saveAnswerToAPI(submission).subscribe(
        (response: any) => {
          if (response && response.data) {
            this.toast.showToast('Action activity added Successful', '', 'success');
            this.activityDescription = undefined;
          }
        },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
    } else {
      this.toast.showToast('Please add action activity.', '', 'error');
    }
  }

  onPrevious(): void {
    this.router.navigate(['teacher/action-activities']);
  }
}
