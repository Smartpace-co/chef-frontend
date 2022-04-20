import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import * as _ from 'lodash';
import { AuthService } from '@modules/auth/services/auth.service';
@Component({
  selector: 'app-chef-introduction',
  templateUrl: './chef-introduction.component.html',
  styleUrls: ['./chef-introduction.component.scss']
})
export class ChefIntroductionComponent implements OnInit {

  lessonHederConfig = {};
  assignmentId: string;
  isLoad = false;
  chefIntro = [];
  slideConfig;

  constructor(private router: Router, private utilityService: UtilityService, private studentService: StudentService, private toast: ToasterService,private authService: AuthService,) {
    this.authService.setuserlang();
    this.lessonHederConfig['stepBoard'] = null;
  }

  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId');
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
        if (response && response.data && response.data.lesson) {
          this.chefIntro = _.map(response.data.lesson.chefIntroductions, item => {
            let obj = {
              id: item.id,
              text: item.text ? item.text.replace(/&nbsp;|<[^>]+>/g, '') : undefined
            }
            return obj;
          });
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
      dots: this.chefIntro && this.chefIntro.length > 1 ? true : false,
      infinite: false,
    };
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
    this.router.navigate(['student/greeting']);
  }

}
