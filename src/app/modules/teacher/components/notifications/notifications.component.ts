import { Component, OnInit } from '@angular/core';
import { ToasterService } from '@appcore/services/toaster.service';
import {
  faAngleLeft
  } from '@fortawesome/free-solid-svg-icons';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import { NotificationService } from '@shared/services/notification.service';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  providers: [NgbPaginationConfig]
})
export class NotificationsComponent implements OnInit {
  LeftArrow = faAngleLeft;
  notificationList=[];
  currentUser:any;
  page = 1;
  pageSize = 10;
  notificationCount:any;
  // notificationList=[
  //   {
  //     id:'1',
  //     type:'Class Activity',
  //     info:'New assignment is created by your class teacher Ms. Paulo',
  //     time:'2 Hours Ago',
  //     status:''
  //   },
  //   {
  //     id:'2',
  //     type:'New Recipe',
  //     info:'New Recipe for Belgium Waffles has been created.',
  //     time:'8 Hours Ago',
  //     status:'Start Now'
  //   },
  //   {
  //     id:'3',
  //     type:'Class Activity',
  //     info:'Diana has invited you to join “Math Club”',
  //     time:'Thursday, 03/04/2020',
  //     status:'Join Now'
  //   },
  //   {
  //     id:'4',
  //     type:'New language',
  //     info:'Spanish language have been added',
  //     time:'Thursday, 03/04/2020',
  //     status:''
  //   }
  // ]

  teacherData:any;
  constructor( private teacherService: TeacherService,
              private notificationService:NotificationService,
              private toast: ToasterService,
              private config: NgbPaginationConfig,) { 
                this.config.boundaryLinks = true;
              }

  ngOnInit(): void {
    this.currentUser = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.getNotificationList();
  }

  /**
   * To get notification list.
   */
   getNotificationList(): void {
    this.notificationService.getNotificationDetails(this.currentUser.user_id, this.currentUser.role.id).subscribe(
      (response) => {
        console.log("notificationList data",response.data)
        this.notificationList = response.data;
        this.updateNotificationStatus();
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  /**
   * To get notification list.
   */
   updateNotificationStatus(): void {
    let seenNotificationIds = [];
    console.log('notificationlist',this.notificationList);
    _.filter(this.notificationList, item => {
      if (item && !item.isSeen) {
        seenNotificationIds.push(item.id);
      }
    });
    this.notificationService.updateNotification(this.currentUser.user_id, this.currentUser.role.id,seenNotificationIds).subscribe(
      (response) => {
        // console.log("Res",response);
        this.toast.showToast('Notification seen', '', 'success');
        this.getCount();
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  getCount(): void {
    this.notificationService.getNotificationCount(this.currentUser.user_id, this.currentUser.role.id).subscribe(
      (response) => {
        // console.log("notificationCount",response.data);
        this.notificationCount = response.data;
        this.teacherService.sendNotificationCount(this.notificationCount);
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

/**
   * compare dates.
   * @param data 
   */
 isSameDay(data: any): boolean {
  return new Date(data.createdAt).getDay() === new Date().getDay();
}
}
