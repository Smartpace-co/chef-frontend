import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import {
  faArrowDown,
  faCartPlus,
  faChevronRight,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import { StudentService } from '@modules/student/services/student.service';
import * as _ from 'lodash';
import { ToasterService } from '@appcore/services/toaster.service';
import { AuthService } from '@modules/auth/services/auth.service';
@Component({
  selector: 'app-student-assignments',
  templateUrl: './student-assignments.component.html',
  styleUrls: ['./student-assignments.component.scss']
})
export class StudentAssignmentsComponent implements OnInit {
  @ViewChild('slickModal') slickModal: SlickCarouselComponent;
  RightArrow = faChevronRight;
  downArrow = faArrowDown;
  UpArrow = faChevronUp;
  cart = faCartPlus;
  classInfo;
  closeModal;
  questionModal;
  closeResult = '';
  @Input() index: number;
  sessionData;
  assignmentInfo;
  isLoad = false;
  defaultRecipeImg: string;
  assignmentList = []
  classId;
  slideConfig = {
    slidesToShow: 2,
    slidesToScroll: 1,
    dots: false,
    infinite: false,
    vertical: true,
    verticalSwiping: true,
    nextArrow: false,
    prevArrow: false,
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 580,

        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  constructor(private activatedRoute: ActivatedRoute,private authService:AuthService, private toast: ToasterService, private router: Router, private modalService: NgbModal, private studentService: StudentService) {
    this.defaultRecipeImg = './assets/images/nsima-bent-icon.png';
    this.classId = this.activatedRoute && this.activatedRoute.snapshot.queryParams && this.activatedRoute.snapshot.queryParams.id ? this.activatedRoute.snapshot.queryParams.id : undefined;
  }

  ngOnInit(): void {
    this.authService.setuserlang();
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.getAssignmentList();
  }
  getAssignmentList(): void {
    let filterByClassId = this.classId ? this.classId : undefined;
    this.studentService.getAssignedLessonList(filterByClassId).subscribe(
      (res) => {
        let isDue;
        let dueDate;
        let calculatedDay;
        let lessonStatus;
        let dayLabel;
        let startDayLabel;
        let futureStartday;
        if (res && res.data && res.data.rows) {
          this.assignmentList = _.map(res.data.rows, item => {
            // calculate 'due in' label.
            if (item && item.endDate) {
              let d = new Date(item.endDate);
              let d1 = new Date();
              var time_difference = d.getTime() - d1.getTime();
              isDue = (time_difference / (1000 * 60 * 60 * 24)).toFixed(0);
              dueDate = parseInt(isDue);
              calculatedDay = dueDate === -0 ? 0 : dueDate;
            }
            // calculate 'start in' label  
            if (item && item.startDate) {
              var sDateDiff = new Date(item.startDate).getTime() - new Date().getTime();
              let diff = (sDateDiff / (1000 * 60 * 60 * 24)).toFixed(0);
              let resDate = parseInt(diff);
              futureStartday = resDate === -0 ? 0 : resDate;
            }
            if (item.studentProgress === null) {
              lessonStatus = 'Start';
            } else if (item.studentProgress && item.studentProgress.startedAt && item.studentProgress.endedAt === null) {
              lessonStatus = 'Continue';
            } else if (item.studentProgress && item.studentProgress.endedAt) {
              lessonStatus = 'Completed';
            }
            if (calculatedDay > 1) {
              dayLabel = 'days'
            } else {
              dayLabel = 'day'
            }
            if (futureStartday > 1) {
              startDayLabel = 'days'
            } else {
              startDayLabel = 'day'
            }
            let obj = {
              id: item.id,
              title: (calculatedDay && calculatedDay > 0 || calculatedDay === 0) ? `due in ${calculatedDay} ${dayLabel}` : 'Expired',
              startInFuture: (futureStartday && futureStartday > 0 || futureStartday === 0) ? true : false,
              otherTitle: (futureStartday && futureStartday > 0 || futureStartday === 0) ? `start in ${futureStartday} ${startDayLabel}` : 'Expired',
              status: lessonStatus,
              icon: item.recipe.recipeImage ? item.recipe.recipeImage : this.defaultRecipeImg,
              menu: item.assignmentTitle,
              duration: item.lessonTime,
              startedOn: item.studentProgress && item.studentProgress.startedAt ? item.studentProgress.startedAt : undefined,
              endedOn: item.studentProgress && item.studentProgress.endedAt ? item.studentProgress.endedAt : undefined,
              // disabled: (calculatedDay && calculatedDay > 0 || calculatedDay === 0) && (lessonStatus != 'Completed') ? false : true,
              disabled:(futureStartday && futureStartday > 0) || (lessonStatus === 'Completed') ? true : false,
              customSetting: item.customSetting,
              lessonId: item.lessonId,
              isCountryBgImg: item.recipe.country && item.recipe.country.backgroundImage ? true : false,
              percent: item.studentProgress && item.studentProgress.percentCompleted ? item.studentProgress.percentCompleted : undefined
            }
            return obj;
          });
          this.isLoad = true;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  slideChange(event) {
    if (event.wheelDelta >= 0) {
      this.slickModal.slickPrev()
    } else {
      this.slickModal.slickNext()
    }
  }

  open(content, item) {
    if (item.disabled == false) {
      this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
      this.assignmentInfo = item;
      /* this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',centered: true }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }); */
    }
  }
  openQuestionModal(content) {
    // this.questionModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'question-modal' });
  }
  closeQuestionModal(): void {
    this.questionModal.close();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  startAssignment(item) {
    if (item.disabled == false) {
      this.modalService.dismissAll();
      localStorage.setItem('assignmentId', item.id);
      localStorage.setItem('lessonId', item.lessonId);
      localStorage.setItem('lessonType', 'Assigned');
      if (item.status === 'Start') {
        let todayDate = new Date();
        let submission = {
          assignLessonId: item.id,
          startedAt: todayDate
        }
        this.studentService.startLessonProgress(submission).subscribe(
          (response: any) => {
            if (response && response.data) {
              window.sessionStorage.setItem('previousDate', JSON.stringify(new Date()));
              if (item.customSetting && item.customSetting.content) {
                for (let ob of item.customSetting.content) {
                  if (ob.title === 'Story' && ob.status === true) {
                    if (item.isCountryBgImg) {
                      this.router.navigate(['/student/country-image']);
                    } else {
                      this.router.navigate(['/student/learning-objective']);
                    }
                    break;
                  } else {
                    this.router.navigate(['student/safety-hygiene']);
                  }
                }
              }
            }
          },
          (error) => {
            console.log(error);
            this.toast.showToast(error.error.message, '', 'error');
          }
        );
      } else if (item.status === 'Continue') {
        this.studentService.getLessonProgress(item.id).subscribe(
          (response: any) => {
            if (response && response.data && !_.isEmpty(response.data.currentScreen)) {
              window.sessionStorage.setItem('previousDate', JSON.stringify(new Date()));
              let isQueryParam = response.data.currentScreen.split(":")[1];
              if (isQueryParam) {
                this.router.navigate([`/student${response.data.currentScreen.split(":")[0]}`], { queryParams: { index: isQueryParam } });
              } else {
                this.router.navigate([`/student${response.data.currentScreen}`])
              }
            }
          },
          (error) => {
            console.log(error);
            this.toast.showToast(error.error.message, '', 'error');
          }
        );
      }
    }
  }

  exploreGlobe() {
    this.router.navigate(['/student/explore-lesson'])
  }

  showClassInfo(): void {
    this.router.navigate([`/student/class-details/${this.classId}`]);
  }
}