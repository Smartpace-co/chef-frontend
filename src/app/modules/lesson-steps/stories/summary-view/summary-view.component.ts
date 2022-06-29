import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { UtilityService } from '@appcore/services/utility.service';
import { ToasterService } from '@appcore/services/toaster.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { StudentService } from '@modules/student/services/student.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-summary-view',
  templateUrl: './summary-view.component.html',
  styleUrls: ['./summary-view.component.scss']
})
export class SummaryViewComponent implements OnInit {
  lessonHederConfig = {};
  isVisibleNext = false;
  isVisiblePrevious = false;
  assignmentId: string;
  assignmentData: any;
  chefName: string;
  previousUrl: string;
  stepNumber = 0;
  disableStep: string;
  countryName: string;
  currentAssignedLesson;
  isLoad = false;
  isCountryLoad = false;
  countryBgImg;
  LeftArrow = faAngleLeft;
  constructor(private studentService: StudentService, private router: Router, private toast: ToasterService, private location: Location, private authService: AuthService,
    private utilityService: UtilityService) { 
      this.authService.setuserlang();
    }

  ngOnInit(): void {
    
    if (this.router.url === '/student/summary-view') {
      this.studentService.previousUrl$.subscribe((previousUrl: string) => {
        this.previousUrl = previousUrl;
      });
    }
    if (this.previousUrl != '/student/learning-objective' && this.previousUrl != '/student/greeting') {
      this.isVisibleNext = true;
      this.isVisiblePrevious = true;
    }
    this.assignmentId = localStorage.getItem('assignmentId')
    this.getStudentData();
    let previousTime = this.utilityService.calculateTimeBetweenDates();
    this.updateLessonProgress(previousTime);
    this.getCustomSettings();
  }

  checkStatus(): void {
    if (this.previousUrl === '/student/conversional-sentence') {
      this.stepNumber = 1;
    } else if (this.previousUrl === '/student/safety-hygiene') {
      this.stepNumber = 2;
    } else if (this.previousUrl === '/student/ingredient-list') {
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
        if (!cardContainer.children[index].classList.contains('inactive')) {
          cardContainer.children[index].classList.add('active');
        }
      }
    }
    this.isLoad = true;
  }
  getCustomSettings(): void {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data) {
          let isStory = false;
          let isCooking = false;
          let isCulinary = false;
          let isCookingPreparation = false;
          let isAssessment = false;
          this.currentAssignedLesson = response.data;
          if (this.currentAssignedLesson.customSetting && this.currentAssignedLesson.customSetting.content) {
            _.forEach(this.currentAssignedLesson.customSetting.content, ob => {
              if (ob.title === 'Story' && ob.status === false) {
                isStory = true;
              } else if (ob.title === 'Cooking' && ob.status === false) {
                isCooking = true;
              } else if (ob.title === 'Cooking') {
                let isCulinaryData = ob.cooking.find(item => item.culinaryTechniqueTitle === 'Culinary Technique');
                if (isCulinaryData && isCulinaryData.status === false) {
                  isCulinary = true;
                }
              } else if (ob.title === 'Cooking' && _.isEmpty(this.currentAssignedLesson.recipe.preparationSteps)) { //validation based on data.
                isCookingPreparation = true;
              } else if (ob.title === 'Assessments' && ob.status === false) {
                isAssessment = true;
              }
            })
          }
          let cardContainer: HTMLElement = document.getElementById('wood');
          if (isStory) {
            cardContainer.children[0].classList.add('inactive');
          }
          if (isCooking) {
            cardContainer.children[1].classList.add('inactive');
            cardContainer.children[2].classList.add('inactive');
            cardContainer.children[3].classList.add('inactive');
            cardContainer.children[4].classList.add('inactive');
            cardContainer.children[5].classList.add('inactive');
            cardContainer.children[6].classList.add('inactive');
            cardContainer.children[7].classList.add('inactive');
          }
          if (isCookingPreparation) { //validation based on data.
            cardContainer.children[3].classList.add('inactive');
          }
          if (isCulinary) {
            cardContainer.children[4].classList.add('inactive');
          }
          if (isAssessment) {
            cardContainer.children[8].classList.add('inactive');
          }
          this.checkStatus();
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  updateLessonProgress(time: any): void {
    let submission = {
      // currentScreen: this.router.url.split('/student')[1], //Getting issue when continue assigned lesson, if previously close tab on this page.
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
    this.authService.currentUser.subscribe((data) => {
      if (data) {
        this.chefName = data['firstName'];
      }
    });
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data) {
          this.countryName = response.data.recipe.country.countryName;
          this.countryBgImg = response.data.recipe.country.backgroundImage;
          this.isCountryLoad = true;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }


  navigateBack() {
    this.location.back();
  }

  navigateTostep(path) {
    console.log("path: ", path);
    switch (path) {
      case 1: {
        this.router.navigate(['student/learning-objective']);
        break;
      }
      case 2: {
        this.router.navigate(['student/safety-hygiene']);
        break;
      }
      case 3: {
        this.router.navigate(['student/ingredient-list']);
        break;
      }
      case 4: {
        this.router.navigate(['student/cooking-preparation']);
        break;
      }
      case 5: {
        this.router.navigate(['student/cooking-technique']);
        break;
      }
      case 6: {
        this.router.navigate(['student/cooking-steps']);
        break;
      }
      case 7: {
        this.router.navigate(['student/cleaning']);
        break;
      }
      case 8: {
        this.router.navigate(['student/serving']);
        break;
      }
      case 9: {
        this.router.navigate(['student/assessment-question']);
        break;
      }
      default: break;
    }
  }

  /**
  * on Next click event
 */
  onNext(): void {
    this.router.navigate(['student/greeting']);
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.router.navigate(['student/learning-objective']);
  }
}
