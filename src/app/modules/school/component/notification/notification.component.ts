import { Component, OnInit } from '@angular/core';
import { UtilityService } from '@appcore/services/utility.service';
import { faEdit, faDownload } from '@fortawesome/free-solid-svg-icons';
import { ToasterService } from '@appcore/services/toaster.service';
import { NotificationService } from '@shared/services/notification.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  faEdit = faEdit;
  currentUser: any;
  id: any;
  roleId: any;
  faDownload = faDownload;
  constructor(private notificationService: NotificationService, private toast: ToasterService, public utiltiService: UtilityService) { }
  billingList = [];
  count: any
  notifications: any
  page = 1;
  pageSize = 10;

  ngOnInit(): void {
    this.currentUser = JSON.parse(window.sessionStorage.getItem('currentUser'));
    // if (this.currentUser && this.currentUser.parentId) {
    //   this.id = this.currentUser.parentId;
    // } else {
    //   this.id = this.currentUser.id;
    // }
    this.id = this.currentUser.id;
    this.getCount();
  }

  /**
     * To get notification count.
     */
  getCount() {
    this.notificationService.getNotificationCount(this.id, this.currentUser.role.id).subscribe(
      (res) => {
        if (res && res.data) {
          this.count = res.data;
        } else {
          this.count = undefined;
        }
        this.getNotificationList();
      }, (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      });
  }

  /**
     * To get notification list.
     */
  getNotificationList() {
    this.notificationService.getNotificationDetails(this.id, this.currentUser.role_id).subscribe(
      (res) => {
        if (res && res.data) {
          this.notifications = res.data;
          if (this.count > 0) {
            this.updateNotificationStatus();
          }
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
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
    this.notificationService.updateNotification(this.id, this.currentUser.role_id, seenNotificationIds).subscribe(
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