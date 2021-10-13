import { Component, OnInit } from '@angular/core';
import { ClassesService } from '@modules/teacher/services/classes.service';
import { ToasterService } from '@appcore/services/toaster.service';
import { AuthService } from '@modules/auth/services/auth.service';
import * as _ from 'lodash';
import { TeacherService } from '@modules/teacher/services/teacher.service'
import { TranslationService } from '@appcore/services/translation.service';

@Component({
  selector: 'app-teacher-setting',
  templateUrl: './teacher-setting.component.html',
  styleUrls: ['./teacher-setting.component.scss']
})
export class TeacherSettingComponent implements OnInit {
  languageTitle = 'English';
  languageList = [];
  localData: any;
  teacherId: number;
  languageSettingId = null;

  parentNotiObj;
  notificationSetting = [];
  dataPrivacy = [];


  constructor(
    private classService: ClassesService,
    private teacherService: TeacherService,
    private toast: ToasterService,
    private authService: AuthService,
    private translate: TranslationService
  ) { }

  ngOnInit(): void {
    this.localData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.getTeacherData();
  }

  getTeacherData() {
    this.classService.getTeacherData(this.localData.id).subscribe((response: any) => {
      if (response && response.data) {
        this.teacherId = response.data.teacher.id;
        this.getSystemLanguageList();
        this.settingsDetails();
      }
    }, (error) => {
      console.log(error);
      this.toast.showToast(error.error.message, '', 'error');
    });
  }

  /**
  * To get system languages
  */
  getSystemLanguageList(): void {
    this.classService.getLanguageList().subscribe(
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
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }



  settingsDetails(): void {
    this.classService.getSettingDetails(this.teacherId, this.localData.role.id).subscribe(
      (response) => {
        if (response && response.data) {
          let mappedNotificationSetting = [];
          let mappedDataPrivacy = [];
          let mappedLanguage = [];
          mappedNotificationSetting = _.map(response.data, item => {
            // if (item.key === 'notiSchoolAnnouncements') {
            //   item['notification'] = 'School announcements';
            // } else if (item.key === 'notiClassAnnouncements') {
            //   item['notification'] = 'Class announcements';
            // } else 
            
            if (item.key === 'notiStudentPerformanceAlerts') {
              item['notification'] = this.translate.getStringFromKey('teacher.settings.notification.notiStudentPerformanceAlerts');
            } else if (item.key === 'notiAssignmentSubmissions') {
              item['notification'] = this.translate.getStringFromKey('teacher.settings.notification.notiAssignmentSubmissions');
            } else if (item.key === 'notiOpenEndedQuestionResponsesToBeGraded') {
              item['notification'] = this.translate.getStringFromKey('teacher.settings.notification.notiOpenEndedQuestionResponsesToBeGraded');
            } else if (item.key === 'notiReceiveAllNotificationsAsEmails') {
              item['notification'] = this.translate.getStringFromKey('teacher.settings.notification.notiReceiveAllNotificationsAsEmails');
            }
            return item;
          });
          this.notificationSetting = _.filter(mappedNotificationSetting, item => {
            if (item && item.notification) {
              return item;
            }
          });

          mappedDataPrivacy = _.map(response.data, item => {
            if (item.key === 'dataPrivacyShowContactInformationStudent') {
              item['privacy'] = this.translate.getStringFromKey('teacher.settings.privacy.dataPrivacyShowContactInformationStudent');
            } else if (item.key === 'dataPrivacyAllowStudentsToEmailMe') {
              item['privacy'] = this.translate.getStringFromKey('teacher.settings.privacy.dataPrivacyAllowStudentsToEmailMe');
            } 
            // else if (item.key === 'dataPrivacyShowWorkingInformationToStudent') {
            //   item['privacy'] = 'Show working information to student';
            // }
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
    data.settings.push({
      id: item.id,
      isEnable: !item.isEnable
    });

    this.classService.updateSettings(data).subscribe(
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



  onLanguageChange(item): void {
    let data = {
      settings: []
    };
    data.settings = [{ id: this.languageSettingId, content: [item.id] }];
    this.classService.updateSettings(data).subscribe(
      (response) => {
        if (response && response.data) {
          this.toast.showToast('Settings updated successfully.', '', 'success');
          window.sessionStorage.setItem('userlanguage', item.key)
          this.authService.setuserlang();
          this.authService.setLanguage(item.key);
          this.settingsDetails();
          // this.teacherService.setUserLanguage(item.key);
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

}
