import { Component, OnInit } from '@angular/core';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { NotificationService } from '@shared/services/notification.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  count;
  currentUser: any;
  notifications: any
  page = 1;
  pageSize = 10;
  constructor(private notificationService: NotificationService, private toast: ToasterService, public utiltiService: UtilityService) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(window.sessionStorage.getItem("currentUser"));
    this.getCount();
  }

  /**
     * To get notification count.
     */
  getCount() {
    this.notificationService.getNotificationCount(this.currentUser.id, this.currentUser.role.id).subscribe(
      (res) => {
        if (res && res.data) {
          this.count = res.data;
        }else{
          this.count = undefined;
        }
        this.getNotificationList();
      }, (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      });
  }
  /**
       * To get notification List.
       */
  getNotificationList() {
    this.notificationService.getNotificationDetails(this.currentUser.id, this.currentUser.role_id).subscribe(
      (res) => {
        if (res && res.data) {
          this.notifications = res.data;
          if (this.count > 0) {
            this.updateNotificationStatus();
          }
        }
      }, (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      });
  }
  /**
     * To update notification status.
     */
  updateNotificationStatus(): void {
    let seenNotificationIds = [];
    _.filter(this.notifications, item => {
      if (item && !item.isSeen) {
        seenNotificationIds.push(item.id);
      }
    });
    this.notificationService.updateNotification(this.currentUser.id, this.currentUser.role_id, seenNotificationIds).subscribe(
      (response) => {
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
}