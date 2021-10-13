import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { TranslationService } from '@appcore/services/translation.service';
import {
  faArchive,
  faChartLine,
  faCoffee,
  faCog,
  faDollarSign,
  faEdit,
  faExclamationTriangle,
  faHome,
  faLifeRing,
  faPlus,
  faPlusSquare,
  faShapes,
  faSignOutAlt,
  faTrash,
  faUser,
  faUsers,
  faTimes,
  faSearch,
  faEllipsisV,
  faTrophy,
  faHistory
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '@modules/auth/services/auth.service';
import { SchoolService } from '@modules/school/services/school.service';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-school-header',
  templateUrl: './school-header.component.html',
  styleUrls: ['./school-header.component.scss']
})
export class SchoolHeaderComponent implements OnInit, AfterContentChecked {
  faCoffee = faCoffee;
  userIcon = faUsers;
  Home = faHome;
  Assignment = faShapes;
  Roster = faUser;
  Performance = faChartLine;
  Settings = faCog;
  exclamationTriangle = faExclamationTriangle;
  PlusIcon = faPlus;
  timesIcon = faTimes;
  explore = faSearch;
  faDots = faEllipsisV;
  performance = faChartLine;
  leaderboard = faTrophy;
  activity = faHistory;
  linkActive: boolean = true;
  linkPerformance: boolean = false;
  messages: any
  count = 0;
  ProfileMenuList = [];
  sessionData: any;
  userName: any;
  profileMenu: string;
  isPerformanceHeader = false;
  isPerformance: string;
  activeUrl: string;
  schoolDetails: any;
  profilePic: string;
  unsubscribe$: Subject<boolean> = new Subject();
  language: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToasterService,
    private schoolService: SchoolService,
    private activatedRoute: ActivatedRoute,
    public utilityService: UtilityService,
    public translate: TranslationService
  ) {
    this.profilePic = './assets/images/user-profile.png';
  }

  ngOnInit(): void {
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.authService.getLanguage().subscribe((res) => {
      this.language = res;
      if (this.language) {
        this.ProfileMenuList = [
          {
            id: '1',
            menu: this.translate.getStringFromKey('district.dashboard.profile-menu.profile'),
            value: 'profile',
            icon: faUser,
            isSubscriptionPause: false

          },
          {
            id: '2',
            menu: this.translate.getStringFromKey('district.dashboard.profile-menu.setting'),
            value: 'settings',
            icon: faCog,
            isSubscriptionPause: false

          },
          {
            id: '3',
            menu: this.translate.getStringFromKey('district.dashboard.profile-menu.help'),
            value: 'help',
            icon: faLifeRing,
            isSubscriptionPause: false
          },
          {
            id: '4',
            menu: this.translate.getStringFromKey('district.dashboard.profile-menu.signout'),
            value: 'signout',
            icon: faSignOutAlt,
            isSubscriptionPause: false

          }]
      }
    });
    if (this.sessionData.isSubscriptionPause == true) {
      this.ProfileMenuList[1].isSubscriptionPause = true;
      this.ProfileMenuList[2].isSubscriptionPause = true;
    }
    if (this.sessionData.parent_role) {
      this.getSchoolUserProfile();
    } else {
      this.getProfileList(this.sessionData.id);
    }
    this.schoolService.getProfileObs().subscribe((profile) => (this.schoolDetails = profile));

  }

  ngAfterContentChecked(): void {
    this.activeUrl = this.activatedRoute && this.activatedRoute['_routerState'] && this.activatedRoute['_routerState'].snapshot.url;
    if (this.activeUrl === '/school/class-activity-report') {
      this.isPerformance = localStorage.getItem('isPerformanceHeader');
      this.isPerformanceHeader = this.isPerformance ? true : false;
      this.linkActive = true;
      this.linkPerformance = false;
    } else if (this.activeUrl === '/school/school-report') {
      this.isPerformance = localStorage.getItem('isPerformanceHeader');
      this.isPerformanceHeader = this.isPerformance ? true : false;
    } else if (this.activeUrl === '/school/class-performance-report') {
      this.isPerformance = localStorage.getItem('isPerformanceHeader');
      this.isPerformanceHeader = this.isPerformance ? true : false;
    } else if (this.activeUrl === '/school/school-performance-report') {
      this.isPerformance = localStorage.getItem('isPerformanceHeader');
      this.isPerformanceHeader = this.isPerformance ? true : false;
    } else {
      this.isPerformanceHeader = false;
    }
  }

  getReport(): void {
    this.linkActive = true;
    this.linkPerformance = false;
    this.router.navigate(['/school/class-activity-report']);
  }

  getPerformance(): void {
    this.linkActive = false;
    this.linkPerformance = true;
    this.router.navigate(['/school/class-performance-report']);
  }
  getProfileList(id): void {
    this.schoolService.getSchoolProfile(id).subscribe(
      (response) => {
        if (response && response.data) {
          let schoolData = response.data;
          //  this.getNotifications(schoolData.id)
          this.getNotificationCount(schoolData.id)
          let schoolObj = {
            id: schoolData.id,
            name: schoolData.school.admin_account_name,
            school: schoolData.school.name,
            address: schoolData.school.school_address,
            img: schoolData.profile_image || this.profilePic,
            phone: schoolData.phone_number
          };
          this.schoolDetails = schoolObj;
          schoolData.school.role = { ...response.data.role };
          localStorage.setItem('schoolDetails', JSON.stringify(schoolData.school));
          this.authService.setuserlang();
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  getSchoolUserProfile(): void {
    this.schoolService.getSchoolUserProfile().subscribe((response) => {
      if (response && response.data) {
        this.schoolService.getSchoolDetailsByUserId(response.data.createdBy).subscribe(
          (res) => {
            let schoolData = res.data[0];
            //  this.getNotifications(schoolData.id)
            this.getNotificationCount(schoolData.id)

            let schoolObj = {
              id: schoolData.id,
              name: response.data.schoolDetails.first_name,
              school: schoolData.name,
              address: schoolData.school_address,
              img: response.data.profile_image || this.profilePic,
              phone: response.data.phone_number
            };
            this.schoolDetails = schoolObj;
            schoolData.role = { ...response.data.role };
            this.authService.setuserlang();
          },
          (error) => {
            console.log(error);
            this.toast.showToast(error.error.message, '', 'error');
          }
        );
      }
    });
  }
  /**
   *
   * This method will register dropdown value change @param event
   */
  onDropdownValueChange(event) {
    if (event.value === 'profile') {
      this.router.navigate(['/school/user-profile']);
    } else if (event.value === 'settings') {
      this.router.navigate(['/school/school-settings']);
    } else if (event.value === 'help') {
      this.router.navigate(['/school/get-help']);
    } else if (event.value === 'signout') {
      this.authService.logoutUser().subscribe(
        (data) => {
          if (data) {
            this.toast.showToast('Logout Successful', '', 'success');
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  getNotifications(schoolId) {
    this.router.navigate(['/school/notification']);
  }

  getNotificationCount(schoolId) {
    this.schoolService.getNotificationsUnreadCount(schoolId, this.sessionData.role_id).subscribe(
      (res) => {
        if (res && res.data) {

          this.count = res.data;
        }
      });

  }
}
