import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import 'rxjs/add/operator/filter';
import { Location } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  faAngleDoubleLeft,
  faChevronLeft,
  faChevronRight,
  faHome
} from '@fortawesome/free-solid-svg-icons';
import { StudentService } from '@modules/student/services/student.service';
import { JournalComponent } from '../journal/journal.component';
import { PassportComponent } from '../passport/passport.component';
import { NotificationService } from '@shared/services/notification.service';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: 'app-student-nav',
  templateUrl: './student-nav.component.html',
  styleUrls: ['./student-nav.component.scss']
})
export class StudentNavComponent implements OnInit {
  @ViewChild('menus', { read: ElementRef, static: false }) menus: ElementRef
  @Input() ShowMenu = false;
  @Input() userName = false;
  @Input() classInfo = false;
  @Input() backBtn = false;
  @Input() chefIcon = false;
  @Input() showTeacherImg = false;
  @Input() isExplore = false;
  @Output() onClassInfo: EventEmitter<any> = new EventEmitter();
  RightArrow = faChevronRight;
  leftArrow = faChevronLeft;
  home = faHome;
  public isCollapsed = true;
  userData;
  sessionData;
  landingPage = false;
  closeModal;
  menuList = [
    {
      id: "1",
      menu: "Dashboard",
      link: '',
      isSubscriptionPause: false
    },
    {
      id: "2",
      menu: "Profile",
      link: '',
      isSubscriptionPause: false
    },
    {
      id: "3",
      menu: "Achievements",
      link: '',
      isSubscriptionPause: false
    },
    {
      id: "4",
      menu: "Membership",
      link: 'student/membership-details',
      isSubscriptionPause: false

    },
    {
      id: "5",
      menu: "Settings",
      isSubscriptionPause: false

    },
    {
      id: "6",
      menu: "Sign Out",
      link: '',
      isSubscriptionPause: false

    }
  ]
  profileImage;
  showBackBtn = false;
  studentName: string;
  defaultImg;
  classId;
  classTitle;
  teacherProfileImg;
  notificationCount;
  subscription: Subscription;
  LeftArrow = faAngleDoubleLeft;
  constructor(private utilityService: UtilityService, private location: Location, private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService, private studentService: StudentService, private router: Router, private authService: AuthService, private toast: ToasterService, private modalService: NgbModal) {
    router.events.filter((event) => event instanceof NavigationEnd)
      .subscribe((event: any) => {
        // if (event.url === "/student/student-landing" || event.url === "/student/class-info") {
        //   this.landingPage = true;
        // }
        // else { this.landingPage = false }
        // if (event.url === "/student/student-landing" || event.url === "/student/class-info" || event.url === "/student/assignment") {
        //   this.showTeacherImg = false;
        // } else {
        //   this.showTeacherImg = true;
        // }
        // if(event.url === '/student/profile-info'){
        //   this.showBackBtn = false;
        //   this.showTeacherImg = false;
        //   this.landingPage = true;
        // }
        // if (event.url === "/student/assignment") {
        //   this.showBackBtn = true;
        // } else {
        //   this.showBackBtn = false;
        // }
      })
    this.classId = this.activatedRoute && this.activatedRoute.snapshot.queryParams && this.activatedRoute.snapshot.queryParams.id ? this.activatedRoute.snapshot.queryParams.id : undefined;
    this.defaultImg = './assets/images/profile-icon-4.png';
  }

  ngOnInit(): void {
    this.utilityService.documentClickedTarget
      .subscribe(target => this.outsideClickListner(target));
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    if (this.sessionData.isSubscriptionPause == true) {
      this.menuList[0].isSubscriptionPause = true;
      this.menuList[2].isSubscriptionPause = true;
      this.menuList[4].isSubscriptionPause = true;
    }
    this.studentService.getProfileImage().subscribe(profile =>
      this.profileImage = profile || this.sessionData.profileImage || this.defaultImg);
    this.getStudentInfo();
    this.getCount();
    // get notification after every 10 second.
    const source = interval(10000);
    this.subscription = source.subscribe(val => this.getCount());

    if (this.classId) {
      this.getClassDetails();
    }
  }

  /**
 collpase the menus when click outside
 */
  outsideClickListner(target: any): void {
    if (!this.menus.nativeElement.contains(target)) {
      this.isCollapsed = true;
    }
  }

  getStudentInfo(): void {
    this.studentService.getStudentById(this.sessionData.id).subscribe(
      (response) => {
        if (response && response.data) {
          this.studentName = response.data.firstName;
          this.profileImage = response.data.profileImage ? response.data.profileImage : this.defaultImg;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  /**
   * To get class and teacher details on class-info page.
   */
  getClassDetails(): void {
    this.studentService.getClassById(this.classId).subscribe(
      (response) => {
        if (response && response.data) {
          this.classTitle = response.data.title;
          if (response.data.class_teachers) {
            this.teacherProfileImg = response.data.class_teachers[0].profileImage ? response.data.class_teachers[0].profileImage : './assets/images/profile-icon-1.png';
          }
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  menuChange(event) {
    if (event.menu === 'Settings') {
      this.router.navigate(['/student/settings']);
    }
    else if (event.menu === 'Sign Out') {
      this.authService.logoutUser().subscribe(
        (data) => {
          if (data) {
            this.toast.showToast('Logout Successful', '', 'success');
          }
        },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
    } else if (event.menu === 'Profile') {
      this.router.navigate(['/student/profile-info']);
    } else if (event.menu === 'Dashboard') {
      this.router.navigate(['/student/student-landing']);
    }
    else if (event.menu === 'Membership') {
      this.router.navigate(['/student/membership-details']);
    } else if (event.menu === 'Achievements') {
      const modalRef = this.modalService.open(PassportComponent, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'passport-profile' });
      modalRef.componentInstance.name = 'Passport';
    }
  }
  open(content) {
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  seeClassInfo(): void {
    this.onClassInfo.emit();
  }

  onBackButtonClick(): void {
    if (this.router.url === '/student/explore-lesson') {
      this.router.navigate(['/student/student-landing']);
    } else if (this.router.url === '/student/assignment') {
      this.router.navigate(['/student/student-landing']);
    } else {
      this.location.back();
    }
  }
  openJournalList(): void {
    // setTimeout(() => {
    const modalRef = this.modalService.open(JournalComponent, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'feedback-popup' });
    modalRef.componentInstance.name = 'Journal';
    // }, 1000);
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
