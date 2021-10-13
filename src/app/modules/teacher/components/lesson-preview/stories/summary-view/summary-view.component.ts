import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { UtilityService } from '@appcore/services/utility.service';
import { ToasterService } from '@appcore/services/toaster.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { StudentService } from '@modules/student/services/student.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';

@Component({
  selector: 'app-summary-view',
  templateUrl: './summary-view.component.html',
  styleUrls: ['./summary-view.component.scss']
})
export class SummaryViewComponent implements OnInit {
  lessonHederConfig = {};
  isVisibleNext = false;
  assignmentId: string;
  sessionData: any;
  assignmentData: any;
  chefName: string;
  previousUrl: string;
  stepNumber = 0;
  LeftArrow = faAngleLeft;
  lessonData:any;
  isCountryLoad = false;
  countryName: string;
  constructor(private studentService: StudentService, private router: Router, private toast: ToasterService, private location: Location, private authService: AuthService,
    private utilityService: UtilityService,private teacherService:TeacherService) { }

  ngOnInit(): void {
    if (this.router.url === '/student/summary-view') {
      this.studentService.previousUrl$.subscribe((previousUrl: string) => {
        this.previousUrl = previousUrl;
      });
    }
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId')
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.getStudentData();
    this.updateLessonProgress();
    this.checkStatus();
  }

  checkStatus(): void {
    if (this.previousUrl === '/student/learning-objective' || this.previousUrl === '/student/greeting' || this.previousUrl === '/student/introduction' || this.previousUrl === '/student/find-country' || this.previousUrl === '/student/country-location' || this.previousUrl === '/student/recipe-fact' || this.previousUrl === '/student/recipe-content' || this.previousUrl === '/student/let-start' || this.previousUrl === '/student/conversional-sentence') {
      this.stepNumber = 1;
    } else if (this.previousUrl === '/student/safety-hygiene') {
      this.stepNumber = 2;
    } else if (this.previousUrl === '/student/student/ingredient-list') {
      this.stepNumber = 3;
    } else if (this.previousUrl === '/student/cooking-preparation') {
      this.stepNumber = 4;
    } else if (this.previousUrl === '/student/cooking-technique') {
      this.stepNumber = 5;
    } else if (this.previousUrl === '/student/cooking-steps') {
      this.stepNumber = 6;
    } else if (this.previousUrl === '/student/cleaning') {
      this.stepNumber = 7;
    } else if (this.previousUrl === '/student/serving') {
      this.stepNumber = 8;
    } else if (this.previousUrl === '/student/assessment-question') {
      this.stepNumber = 9;
    }
    let cardContainer: HTMLElement = document.getElementById('wood');
    for (let index = 0; index < cardContainer.children.length; index++) {
      if (index < this.stepNumber) {
        cardContainer.children[index].classList.add('active');
      }
    }
  }
  updateLessonProgress(): void {
    let submission = {
      currentScreen: this.router.url.split('/student')[1],
    }
    this.studentService.updateLessonProgress(this.assignmentId, submission).subscribe(
      (response: any) => {
        if (response && response.data) {
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  getStudentData() {
    // this.studentsService.getStudentData().subscribe((response: []) => {
    //   response.forEach((element: any) => {
    //     if (this.utilityService.strictCompare(element.email, this.sessionData.email)) {
    //       if (element.assignmentList.length > 0) {
    //         element.assignmentList.forEach(ele => {
    //           if (this.utilityService.strictCompare(ele.id, this.assignmentId)) {
    //             this.assignmentData = ele;
    //           }
    //         });
    //       }
    //     }
    //   });
    // });
    this.authService.currentUser.subscribe((data) => {
      if (data) {
        this.chefName = data['firstName'];
      }
    });
    this.lessonData = this.teacherService.getAssignLessonData();
    this.countryName = this.lessonData.recipe.country.countryName;
    this.isCountryLoad = true; 
  }


  navigateBack() {
    this.location.back();
  }

  navigateTostep(path) {
    // switch (path) {
    //   case 1: {
    //     this.router.navigate(['student/learning-objective']);
    //     break;
    //   }
    //   case 2: {
    //     this.router.navigate(['student/safety-hygiene']);
    //     break;
    //   }
    //   case 3: {
    //     this.router.navigate(['student/ingredient-list']);
    //     break;
    //   }
    //   case 4: {
    //     this.router.navigate(['student/cooking-preparation']);
    //     break;
    //   }
    //   case 5: {
    //     this.router.navigate(['student/cooking-technique']);
    //     break;
    //   }
    //   case 6: {
    //     this.router.navigate(['student/cooking-steps']);
    //     break;
    //   }
    //   case 7: {
    //     this.router.navigate(['student/cleaning']);
    //     break;
    //   }
    //   case 8: {
    //     this.router.navigate(['student/serving']);
    //     break;
    //   }
    //   case 9: {
    //     this.router.navigate(['student/assessment-question']);
    //     break;
    //   }
    //   default: break;
    // }
  }

  /**
  * on Next click event
 */
  onNext(): void {
    // window.scroll(0,0);
    this.router.navigate(['student/greeting']);
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.router.navigate(['student/learning-objective']);
  }
}
