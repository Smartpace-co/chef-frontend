import { Component, OnInit } from '@angular/core';
import { ToasterService } from '@appcore/services/toaster.service';
import { SchoolService } from '@modules/school/services/school.service';
import { AuthService } from '@modules/auth/services/auth.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-school-settings',
  templateUrl: './school-settings.component.html',
  styleUrls: ['./school-settings.component.scss']
})
export class SchoolSettingsComponent implements OnInit {
  
  notificationList = [];
  privacyList = [];
  languageSettingId=null;
  languageTitle = 'English';
  languageList=[];
  settingsList = [];
  constructor(private schoolService: SchoolService, private toast: ToasterService, public authService: AuthService) { }

  ngOnInit(): void {
    this.getSystemLanguageList();
    this.getSettingsList();
  }

  /**
   * To get system languages
   */
   getSystemLanguageList(): void {
    this.schoolService.getLanguageList().subscribe(
      (response) => {
        if (response && response.data) {
          this.languageList = _.map(response.data, item => {
            let obj = {
              id: item.id,
              menu: item.title,
              key:item.key
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
  
  /**
    * To get list of settings.
    */
  getSettingsList(): void {
    let schoolRole = JSON.parse(localStorage.getItem('schoolDetails'));
    this.schoolService.getSettings(schoolRole.id, schoolRole.role.id).subscribe(
      (response) => {
        if (response && response.data) {
          let mappedNotification = [];
          let mappedDataPrivacy = [];
          let mappedLanguage = [];

          mappedNotification = _.map(response.data, item => {
            /*if (item.key === 'notiSchoolAnnouncements') {
              item['notification'] = 'School announcements';
            } else if (item.key === 'notiCourseAnnouncements') {
              item['notification'] = 'Course announcements';
            } else */if (item.key === 'notiStudentPerformanceAlerts') {
              item['notification'] = 'Student performance alerts';
            } else if (item.key === 'notiNewCoursesAvailable') {
              item['notification'] = 'New lessons available';
            } else if (item.key === 'notiLatestStudentSubmissionWork') {
              item['notification'] = 'Latest student submission work';
            } else if (item.key === 'notiOpenEndedQuestionResponsesToBeGraded') {
              item['notification'] = 'Open ended question responses to be graded';
            } else if (item.key === 'notiReceiveAllNotificationsAsEmails') {
              item['notification'] = 'Receive all notifications as emails';
            }
            return item;
          });
          this.notificationList = _.filter(mappedNotification, item => {
            if (item && item.notification) {
              return item;
            }
          });
          mappedDataPrivacy = _.map(response.data, item => {
            if (item.key === 'dataPrivacyShowContactInformationStudent') {
              item['privacy'] = 'Show contact information to students';
            } /*else if (item.key === 'dataPrivacyAllowStudentsToEmailMe') {
              item['privacy'] = 'Allow students to email me';
            } else if (item.key === 'dataPrivacyShowWorkingInformationToStudent') {
              item['privacy'] = 'Show working information to student';
            }*/
            return item;
          });
          this.privacyList = _.filter(mappedDataPrivacy, item => {
            if (item && item.privacy) {
              return item;
            }
          });
          mappedLanguage = _.map(response.data, item => {
            if (item.key === 'languageSetYourPreferredLanguage') {
              item['menu'] = item.languageSetYourPreferredLanguage;
              this.languageSettingId=item.id;
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
  /**
   * on toggle switch and dropdown change.
   * @param item 
   */
  onSettingsUpdate(item: any): void {
    let data = {
      settings: []
    };
    if (item.content) {
      item.content.push(item.id);
      data.settings = [{ id: item.id, content: item.content }];
    } else {
      data.settings.push({
        id: item.id,
        isEnable: !item.isEnable
      });
    }
    this.schoolService.editSettings(data).subscribe(
      (response) => {
        if (response && response.data) {
          this.toast.showToast('Settings updated successfully.', '', 'success');
          this.getSettingsList();
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
    if(item.key=="dataPrivacyShowContactInformationStudent" && item.isEnable===false){
      this.schoolService.showContactInformationToStudent().subscribe(
        (response) => {
          if (response) {
          };
        });
      }   
  }
  
  ChangeLang(item) {
    let data = {
      settings: []
    };
    data.settings = [{ id: this.languageSettingId, content: [item.id] }];
     this.schoolService.editSettings(data).subscribe(
      (response) => {
        if (response && response.data) {
          this.toast.showToast('Settings updated successfully.', '', 'success');
          this.getSettingsList();
          window.sessionStorage.setItem('userlanguage',item.key)
          this.authService.setuserlang();
          this.authService.setLanguage(item.key);
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  } 
}


