import { Component, OnInit,AfterContentChecked  } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { TranslationService } from '@appcore/services/translation.service';
@Component({
  selector: 'app-student-rating',
  templateUrl: './student-rating.component.html',
  styleUrls: ['./student-rating.component.scss']
})
export class StudentRatingComponent implements OnInit, AfterContentChecked {
  isButtonSection = {};
  lessonId: string;
  assignmentId: string;
  lesson;
  isLoad = false;
  assignmentTitle: string;
  public stars: boolean[] = Array(3).fill(false);

  constructor(private router: Router, private utilityService: UtilityService, private toast: ToasterService, private studentService: StudentService,private authService: AuthService,private translate: TranslationService) {
    this.authService.setuserlang();
  }
  ratings = [
    {
      id: 1,
      img: './assets/images/chef-hat.png',
      isCheck: false
    },
    {
      id: 2,
      img: './assets/images/chef-hat.png',
      isCheck: false
    }, {
      id: 3,
      img: './assets/images/chef-hat.png',
      isCheck: false
    }
  ]
  ngOnInit(): void {
    this.lessonId = localStorage.getItem('lessonId');
    this.lesson = localStorage.getItem('lessonType');
    this.assignmentId = localStorage.getItem('assignmentId');
    this.getLessonData();
    this.updateLessonProgress();
  }

  ngAfterContentChecked(): void {
    this.isButtonSection = {
      title: this.translate.getStringFromKey('school.report-issue.feedback-label')
    };
  }
  getLessonData(): void {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data) {
          // if (this.lesson === 'Explore') {
            this.assignmentTitle = response.data.recipe.recipeTitle;
          // } else {
          //   this.assignmentTitle = response.data.assignmentTitle;
          // }
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
    this.router.navigate(['student/stamps']);
  }
  onPrevious(): void {
    this.router.navigate(['student/linguistic-details']);
  }
  updateLessonProgress(date?: any): void {
    let previousTime = this.utilityService.calculateTimeBetweenDates();
    let submission = {
      currentScreen: this.router.url.split('/student')[1],
      timeTaken: previousTime ? previousTime : undefined,
      endedAt: date ? date : undefined
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
  rate(rating: number) {
    this.stars = this.stars.map((_, i) => rating > i);
    let submission = {
      lessonId: parseInt(this.lessonId),
      rating: rating
    }
    this.studentService.saveRatingsToAPI(submission).subscribe(
      (response: any) => {
        if (response && response.data) {
          this.toast.showToast(' Rating saved successfully', '', 'success');
          let todayDate = new Date();
          this.updateLessonProgress(todayDate);
          this.onNext();
          // setTimeout(() => {
          //   if (this.lesson === 'Explore') {
          //     this.router.navigate(['/student/explore-lesson']);
          //   } else {
          //     this.router.navigate(['/student/assignment']);
          //   }
          // }, 1000);
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
}
