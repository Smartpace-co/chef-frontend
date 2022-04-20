import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { AuthService } from '@modules/auth/services/auth.service';
@Component({
  selector: 'app-let-start',
  templateUrl: './let-start.component.html',
  styleUrls: ['./let-start.component.scss']
})
export class LetStartComponent implements OnInit {
  lessonHederConfig = {};
  assignmentId: string;
  constructor(private router: Router, private utilityService: UtilityService, private studentService: StudentService, private toast: ToasterService,private authService: AuthService,) {
    this.authService.setuserlang();
    this.lessonHederConfig['stepBoard'] = null;
  }

  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId');
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

  /**
  * on Next click event
 */
  onNext(): void {
    this.router.navigate(['student/conversional-sentence']);
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.router.navigate(['/student/recipe-fact']);
  }
}
