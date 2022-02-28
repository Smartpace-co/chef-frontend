import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UtilityService } from '@appcore/services/utility.service';
import { ToasterService } from '@appcore/services/toaster.service';
import {
  faAngleLeft
} from '@fortawesome/free-solid-svg-icons';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { NotificationService } from '../../../../shared/services/notification.service';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  providers: [NgbPaginationConfig] // add NgbPaginationConfig to the component providers
})
export class NotificationsComponent implements OnInit {
  LeftArrow = faAngleLeft;
  notificationList = [];
  notificationCount;
  currentUser: any;
  page = 1;
  pageSize = 10;
  constructor(private config: NgbPaginationConfig, private toast: ToasterService, private notificationService: NotificationService, private location: Location, public utiltiService: UtilityService) {
    this.config.boundaryLinks = true;
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(window.sessionStorage.getItem("currentUser"));
    this.getCount();
  }
  /**
   * On click of back button.
   */
  onNotificationBack(): void {
    this.location.back();
  }

  /**
   * To get notification list.
   */
  getNotificationList(): void {
    this.notificationService.getNotificationDetails(this.currentUser.id, this.currentUser.role.id).subscribe(
      (response) => {
        this.notificationList = response.data;
        if (this.notificationCount > 0) {
          this.updateNotifications();
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  /**
   * To get count of notifications.
   */
  getCount(): void {
    this.notificationService.getNotificationCount(this.currentUser.id, this.currentUser.role.id).subscribe(
      (response) => {
        this.notificationCount = response.data;
        this.getNotificationList();
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  /**
   * To update notification's status.
   * @param data 
   */
  updateNotifications(): void {
    let seenNotificationIds = [];
    _.filter(this.notificationList, item => {
      if (item && !item.isSeen) {
        seenNotificationIds.push(item.id);
      }
    });
    this.notificationService.updateNotification(this.currentUser.id, this.currentUser.role.id, seenNotificationIds).subscribe(
      (response) => {
        if (response && response.data && response.data.length > 0) {
          // this.toast.showToast('Notifications updated successful', '', 'success');
        }
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
