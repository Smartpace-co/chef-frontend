import { Component, OnInit } from '@angular/core';
import { ToasterService } from '@appcore/services/toaster.service';
import {
  faAngleLeft
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '@modules/auth/services/auth.service';
import { StudentService } from '@modules/student/services/student.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  LeftArrow = faAngleLeft;
  constructor(private toast: ToasterService,
    private authService: AuthService, private studentService: StudentService) { }
  languageTitle = 'English';
  languageSettingId = null;
  currentUser: any;
  isParentEnabled = false;
  parentNotiObj;
  isParentNotification: string;
  notificationSetting = [];
  parentNotification = [];
  dataPrivacy = [];
  preferedLanguage;
  languageList = [
    {
      id: "1",
      menu: "English"
    },
    {
      id: "1",
      menu: "France"
    }
  ]
  ngOnInit(): void {
    this.currentUser = JSON.parse(window.sessionStorage.getItem("currentUser"));
    this.getSystemLanguageList();
  }
  /**
  * To get system languages
  */
  getSystemLanguageList(): void {
    this.studentService.getLanguageList().subscribe(
      (response) => {
        if (response && response.data) {
          this.languageList = _.map(response.data, item => {
            let obj = {
              id: item.id,
              menu: item.title,
              key: item.key
            }
            return obj;
          });
          this.settingsDetails();
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  /**
     * To get settingsDetails.
     */
  settingsDetails(): void {
    this.studentService.getSettingDetails(this.currentUser.id, this.currentUser.role.id).subscribe(
      (response) => {
        if (response && response.data) {
          let mappedNotificationSetting = [];
          let mappedParentNotification = [];
          let mappedDataPrivacy = [];
          let mappedLanguage = [];
          mappedNotificationSetting = _.map(response.data, item => {
            if (item.key === 'notiNewStudentAssignment') {
              item['notification'] = 'Notify me when there is a new assignment';
            } else if (item.key === 'notiCompleteStudentAssignment') {
              item['notification'] = 'Notify me when I complete assignments';
            } else if (item.key === 'notiMembershipPaymentIsDue') {
              if(this.currentUser.parentId==null)
              {
                item['notification'] = 'Notify me when membership payment is due';

              }
            
            } else if (item.key === 'notiAppUpdateAvailable') {
              item['notification'] = 'Notify me when there are application updates available';
            }
            return item;
          });
          this.notificationSetting = _.filter(mappedNotificationSetting, item => {
            if (item && item.notification) {
              return item;
            }
          });
          mappedParentNotification = _.map(response.data, item => {
            if (item.key === 'sendNotiToParent') {
              this.isParentNotification = 'Send notifications to parents';
              this.parentNotiObj = item;
              this.isParentEnabled = item.isEnable;
            } else if (item.key === 'performanceReportReadyToParent') {
              item['value'] = 'When my performance report is ready';
            } else if (item.key === 'completeStudentAssignmentToParent') {
              item['value'] = 'When I complete assignments';
            } else if (item.key === 'membershipPaymentIsDueToParent') {
              item['value'] = 'When membership payment is due';
            } else if (item.key === 'notiAppUpdateAvailableToParent') {
              item['value'] = 'When there are application updates available';
            }
            return item;
          });
          this.parentNotification = _.filter(mappedParentNotification, item => {
            if (item && item.value) {
              return item;
            }
          });
          mappedDataPrivacy = _.map(response.data, item => {
            if (item.key === 'shareAnalyticsDataAnonymouslyWithChefK') {
              item['privacy'] = 'Share analytics data anonymously with Chef Koochooloo';
            }
            return item;
          });
          this.dataPrivacy = _.filter(mappedDataPrivacy, item => {
            if (item && item.privacy) {
              return item;
            }
          });
          mappedLanguage = _.map(response.data, item => {
            if (item.key === 'languageSetYourPreferredLanguage') {
              item['menu'] = item.key; //item.languageSetYourPreferredLanguage;
              this.languageSettingId = item.id;
              let currentLanguage;
              currentLanguage = this.languageList.find(o => o.id === item.content[0]);
              this.languageTitle = currentLanguage.menu;
            }
            return item;
          });
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  onSettingsUpdate(item: any, isParent?: boolean): void {
    let data = {
      settings: []
    };
    if (isParent) {
      if (item.isEnable) {
        _.forEach(this.parentNotification, ob => {
          data.settings.push({
            id: ob.id,
            isEnable: false
          });
        });
      }
      data.settings.push({
        id: item.id,
        isEnable: !item.isEnable
      });
    } else {
      data.settings.push({
        id: item.id,
        isEnable: !item.isEnable
      });
    }
    this.studentService.updateSettings(data).subscribe(
      (response) => {
        if (response && response.data) {
          this.toast.showToast('Settings updated successfully.', '', 'success');
          this.settingsDetails();
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  onParentUpdate(): void {
    this.isParentEnabled = !this.isParentEnabled;
    this.parentNotiObj['isEnable'] = !this.isParentEnabled;
    this.onSettingsUpdate(this.parentNotiObj, true);
  }

  onLanguageChange(item): void {
    let data = {
      settings: []
    };
    data.settings = [{ id: this.languageSettingId, content: [item.id] }];
    this.studentService.updateSettings(data).subscribe(
      (response) => {
        if (response && response.data) {
          this.toast.showToast('Settings updated successfully.', '', 'success');
          this.settingsDetails();
          window.sessionStorage.setItem('userlanguage', item.key)
          this.authService.setuserlang();
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
}
