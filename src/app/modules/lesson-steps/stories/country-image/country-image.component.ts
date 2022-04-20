import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { TranslationService } from '@appcore/services/translation.service';
@Component({
  selector: 'app-country-image',
  templateUrl: './country-image.component.html',
  styleUrls: ['./country-image.component.scss']
})
export class CountryImageComponent implements OnInit {
  lessonHederConfig = {};
  assignmentId: string;
  isLoad = false;
  countryBgImg;
  styleOb: any;
  showPrevious = false; // To hide previous button
  constructor(private router: Router, private utilityService: UtilityService, private studentService: StudentService, private toast: ToasterService,private authService: AuthService,private translate: TranslationService) {
    this.authService.setuserlang();
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
        if (response && response.data) {
          this.countryBgImg = response.data.recipe.country.backgroundImage;
          this.styleOb = {
            'background': ' url(' + this.countryBgImg + ')',
            'background-size': 'cover',
            'background-repeat': 'no-repeat'
          }
          this.lessonHederConfig['stepBoard'] = {
            stepTitle: response.data.recipe.country.countryName,
            stepTopTitle:this.translate.getStringFromKey('header-content.welcome')
          };
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
    this.router.navigate(['/student/learning-objective']);
  }

}
