import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { TranslationService } from '@appcore/services/translation.service';
import { UtilityService } from '@appcore/services/utility.service';

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
import { DistrictService } from '@modules/district/services/district.service';
import { NotificationService } from '@shared/services/notification.service';
import { interval, Subject, Subscription } from 'rxjs';
@Component({
  selector: 'app-district-header',
  templateUrl: './district-header.component.html',
  styleUrls: ['./district-header.component.scss']
})
export class DistrictHeaderComponent implements OnInit, AfterContentChecked {
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
  linkActive: boolean=true;
  linkPerformance: boolean=false;
  count;
  ProfileMenuList = [];
  sessionData: any;
  userName: any;
  profileMenu: string;
  isPerformanceHeader = false;
  isPerformance: string;
  activeUrl: string;
  districtDetails: any;
  profilePic: string;
  unsubscribe$: Subject<boolean> = new Subject();
  language: any;
  subscription: Subscription;
  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToasterService,
    private districtService: DistrictService,
    private activatedRoute: ActivatedRoute,
    private translate : TranslationService,
    private notificationService:NotificationService,
    public utilityService: UtilityService) {
    this.profilePic = './assets/images/user-profile.png'
  }

  ngOnInit(): void {
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.authService.getLanguage().subscribe((res)=>{
      this.language=res;
      if(this.language){
        this.ProfileMenuList=[ 
          {
          id: '1',
          menu: this.translate.getStringFromKey('district.dashboard.profile-menu.profile'),
          value: 'profile',
          icon: faUser,
          isSubscriptionPause: false
    
        },
        {
          id: '2',
          menu:  this.translate.getStringFromKey('district.dashboard.profile-menu.setting'),
          value: 'settings',
          icon: faCog,
          isSubscriptionPause: false
    
        },
        {
          id: '3',
          menu:  this.translate.getStringFromKey('district.dashboard.profile-menu.help'),
          value: 'help',
          icon: faLifeRing,
          isSubscriptionPause: false
        },
        {
          id: '4',
          menu:  this.translate.getStringFromKey('district.dashboard.profile-menu.signout'),
          value: 'signout',
          icon: faSignOutAlt,
          isSubscriptionPause: false
    
        }]
      }});
    
    if (this.sessionData.isSubscriptionPause == true) {
      this.ProfileMenuList[1].isSubscriptionPause=true;
      this.ProfileMenuList[2].isSubscriptionPause=true;
    }
    if(this.sessionData.parent_role)
    {
      this.getDistrictUserProfile()
    }
    else
    {
      this.getProfileList();
    }
    this.districtService.getProfileObs().subscribe(profile => this.districtDetails = profile);
    this.getNotificationCount();
    // get notification after every 10 second.
    const source = interval(10000);
    this.subscription = source.subscribe(val => this.getNotificationCount());
  }

  ngAfterContentChecked(): void {
    this.activeUrl = this.activatedRoute && this.activatedRoute['_routerState'] && this.activatedRoute['_routerState'].snapshot.url;
    if (this.activeUrl === '/district/class-activity-report') {
      this.linkActive = true;
      this.linkPerformance = false;
      this.isPerformance = localStorage.getItem('isPerformanceHeader')
      this.isPerformanceHeader = this.isPerformance ? true : false;
    } else if (this.activeUrl === "/district/school-report") {
      this.linkActive = true;
      this.linkPerformance = false;
      this.isPerformance = localStorage.getItem('isPerformanceHeader')
      this.isPerformanceHeader = this.isPerformance ? true : false;
    } else if (this.activeUrl === "/district/class-performance-report") {
      this.linkActive = false;
      this.linkPerformance = true;
      this.isPerformance = localStorage.getItem('isPerformanceHeader')
      this.isPerformanceHeader = this.isPerformance ? true : false;
    } else if (this.activeUrl === "/district/school-performance-report") {
      this.linkActive = false;
      this.linkPerformance = true;
      this.isPerformance = localStorage.getItem('isPerformanceHeader')
      this.isPerformanceHeader = this.isPerformance ? true : false;
    } else {
      this.isPerformanceHeader = false;
    }
  }

  getPerformance(): void {
    this.linkActive = false;
    this.linkPerformance = true;
    if (this.activeUrl === '/district/class-activity-report') {
      this.router.navigate(['/district/class-performance-report']);
    }
    else if (this.activeUrl === '/district/school-report') {
      this.router.navigate(['/district/school-performance-report']);
    }

  }
  getReport(): void {
    this.linkActive = true;
    this.linkPerformance = false;
    if (this.activeUrl === '/district/class-performance-report') {
      this.router.navigate(['/district/class-activity-report']);
    }
    else if (this.activeUrl === '/district/school-performance-report') {
      this.router.navigate(['/district/school-report']);
    }
  }

  getProfileList(): void {
    this.districtService.getDistrictProfile().subscribe(
      (response) => {
        if (response && response.data) {
          let districtData = response.data;
          let distObj = {
            name: districtData.district_admin.admin_account_name,
            district: districtData.district_admin.name,
            address: districtData.district_admin.district_address,
            img: districtData.profile_image || this.profilePic,
            phone: districtData.phone_number,
          };
          this.districtDetails = distObj;
          districtData.district_admin.role = {...response.data.role}
          localStorage.setItem('districtDetails', JSON.stringify(districtData.district_admin));
          this.authService.setuserlang();
          // this.getNotificationCount(districtData.id)

        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }


  getDistrictUserProfile(): void {
  
    this.districtService.getDistrictUserProfile().subscribe(
      (response) => {
        if(response && response.data){
        this.districtService.getDistrictAdminProfile(response.data.createdBy).subscribe(
          (res) => {
          let districtData = res.data;
          let distObj = {
            name: response.data.details.first_name,
            district: districtData.district_admin.name,
            address: districtData.district_admin.district_address,
            img: response.data.profile_image || this.profilePic,
            phone: response.data.phone_number,
          };
          this.districtDetails = distObj;
          districtData.role = {...response.data.role}
          this.authService.setuserlang();
          // this.getNotificationCount(districtData.id)
        
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
      this.router.navigate(['/district/user-profile']);
    } else if (event.value === 'settings') {
      this.router.navigate(['/district/settings']);
    } else if (event.value === 'help') {
      this.router.navigate(['/district/get-help']);
    } 
    else if (event.value === 'signout') {
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
    }
  }

  getNotifications(schoolId){
    this.router.navigate(['/district/notifications']);
  }
  getNotificationCount()
  {
    this.notificationService.getNotificationCount(this.sessionData.id, this.sessionData.role.id).subscribe(
      (res) => {
        if(res && res.data)
        {

          this.count=res.data;
        }else{
          this.count = undefined;
        }
      },(error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      });
   
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
    this.subscription.unsubscribe();
  }
}
