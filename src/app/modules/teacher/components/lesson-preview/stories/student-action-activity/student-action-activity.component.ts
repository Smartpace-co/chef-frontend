import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';

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
  constructor(private toast: ToasterService, private router: Router, private studentService: StudentService, private utilityService: UtilityService) {
    this.isButtonSection = {
      title: 'Take Action Activity'
    };
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId')
    this.getActionActivity();
  }

  getActionActivity() {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data.lesson && response.data.lesson.activity) {
          this.activity = response.data.lesson.activity;
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
    this.router.navigate(['student/action-activity']);
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    let questionIndex = localStorage.getItem('questionIndex');
    this.router.navigate(['student/assessment-question'], { queryParams: { index: questionIndex } });
  }
}
