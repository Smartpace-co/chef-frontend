import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { AuthService } from '@modules/auth/services/auth.service';
@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.scss']
})
export class GreetingComponent implements OnInit {
  lessonHederConfig = {};
  assignmentId: string;
  assignmentData: any;
  countryBgImg;
  isLoad = false;
  linguisticList = [];
  slideConfig;
  constructor(private router: Router, private toast: ToasterService, private utilityService: UtilityService, private studentService: StudentService
    ,private authService: AuthService,) {
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
          this.assignmentData = response.data.lesson;
          this.linguisticList = response.data.lesson.linguistic ? response.data.lesson.linguistic.match(/.{1,154}(\s|$)/g) : undefined;
          this.countryBgImg = response.data.recipe.country.backgroundImage;
          this.getSliderConfig();
          this.isLoad = true;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  getSliderConfig(): void {
    this.slideConfig = {
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: '<div class=\'nav-btn next-slide\'></div>',
      prevArrow: '<div class=\'nav-btn prev-slide\'></div>',
      dots: this.linguisticList && this.linguisticList.length > 1 ? true : false,
      infinite: false,
    };
  }
  /**
  * on Next click event
 */
  onNext(): void {
    this.router.navigate(['/student/chef-introduction']);
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.router.navigate(['/student/summary-view']);
  }
}