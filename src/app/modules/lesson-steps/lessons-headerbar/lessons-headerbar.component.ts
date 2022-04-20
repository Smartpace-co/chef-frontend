import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common'
import { UtilityService } from '@appcore/services/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faAngleLeft, faCalendar, faSearch
} from '@fortawesome/free-solid-svg-icons';
import { StudentService } from '@modules/student/services/student.service';
import { ToasterService } from '@appcore/services/toaster.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { JournalComponent } from '@modules/student/components/journal/journal.component';
import { interval, Subscription } from 'rxjs';
import { NotificationService } from '@shared/services/notification.service';
@Component({
  selector: 'app-lessons-headerbar',
  templateUrl: './lessons-headerbar.component.html',
  styleUrls: ['./lessons-headerbar.component.scss']
})
export class LessonsHeaderbarComponent implements OnInit {
  @ViewChild('printBox', { read: ElementRef, static: false }) printBox: ElementRef
  @Input() lessonHederConfig;
  @Input() isButtonSection;
  @Input() showBackBtn = true;
  @Input() isLessonInfo = true
  public isCollapsed = true;
  LeftArrow = faAngleLeft;
  story: any = 0
  SearchIcon = faSearch;
  Calendar = faCalendar;
  assignmentList: any;
  assignmentTitle: any;
  assignmentId: string;
  stepNumber: number;
  reciepe_icon: any;
  lesson;
  selectedSearchValue;
  defaultRecipeImg: string;
  notificationCount;
  sessionData;
  subscription: Subscription;
  constructor(private router: Router, private modalService: NgbModal, private notificationService: NotificationService, private toast: ToasterService, private studentService: StudentService, private utilityService: UtilityService, private activatedroute: ActivatedRoute, private location: Location) {
    this.defaultRecipeImg = './assets/images/nsima-bent-icon.png';
  }

  ngOnInit(): void {
    this.lesson = localStorage.getItem('lessonType');
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.utilityService.documentClickedTarget
      .subscribe(target => this.outsideClickListner(target));
    this.assignmentId = localStorage.getItem('assignmentId')
    this.getCount();
    // get notification after every 10 second.
    const source = interval(10000);
    this.subscription = source.subscribe(val => this.getCount());

    if (this.isLessonInfo) {
      this.getLessonInfo();
    }
  }

  /**
   collpase the print menus when click outside
   */
  outsideClickListner(target: any): void {
    if (!this.printBox?.nativeElement.contains(target)) {
      this.isCollapsed = true;
    }
  }

  getLessonInfo(): void {
    this.studentService.getAssignedRecipeTitle(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data) {
          // if (this.lesson === 'Explore') {
            this.assignmentTitle = response.data.recipe.recipeTitle;
          // } else {
          //   this.assignmentTitle = response.data.assignmentTitle;
          // }
          this.reciepe_icon = response.data.recipe.recipeImage ? response.data.recipe.recipeImage : this.defaultRecipeImg;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  onClose() {
    if (this.lesson === 'Explore') {
      this.router.navigate(['/student/explore-lesson']);
    } else {
      this.router.navigate(['/student/assignment']);
    }
  }

  openJournalList(): void {
    const modalRef = this.modalService.open(JournalComponent, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'feedback-popup' });
    modalRef.componentInstance.name = 'Journal';
  }

  navigateBack() {
    this.location.back()
  }

  /**
  * To get count of notifications.
  */
  getCount(): void {
    this.notificationService.getNotificationCount(this.sessionData.id, this.sessionData.role.id).subscribe(
      (response) => {
        this.notificationCount = response.data;
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  /**
   * to unsubscribe notification.
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}