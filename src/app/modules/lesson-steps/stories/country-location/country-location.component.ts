import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { AuthService } from '@modules/auth/services/auth.service';
@Component({
  selector: 'app-country-location',
  templateUrl: './country-location.component.html',
  styleUrls: ['./country-location.component.scss']
})
export class CountryLocationComponent implements OnInit {
  lessonHederConfig = {};
  assignmentId: string;
  assignmentData: any;
  countryName: string;
  constructor(private router: Router, private studentService: StudentService, private toast: ToasterService, private utilityService: UtilityService,private authService: AuthService,) {
    this.authService.setuserlang();
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
          this.assignmentData = response.data;
          this.countryName = response.data.recipe.country.countryName;
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
    this.router.navigate(['student/recipe-fact']);
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.router.navigate(['student/find-country']);
  }

}
