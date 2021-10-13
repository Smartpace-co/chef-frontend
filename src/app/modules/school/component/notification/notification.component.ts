import { Component, OnInit } from '@angular/core';
import { SchoolService } from '../../services/school.service';
import { faEdit, faDownload } from '@fortawesome/free-solid-svg-icons';
import { ToasterService } from '@appcore/services/toaster.service';

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
  constructor(private schoolService: SchoolService,private toast: ToasterService) {}
  billingList = [];
  count:any
  notifications:any

  ngOnInit(): void {
    this.currentUser = JSON.parse(window.sessionStorage.getItem('currentUser'));
    if (this.currentUser && this.currentUser.parentId) {
      this.id = this.currentUser.parentId;
    } else {
      this.id = this.currentUser.id;
    }

    this.getNotificationCount(this.id);
    this.getNotifications(this.id);
    this.updateNotificationStatus(this.id);

  }

  getNotificationCount(schoolId)
  {
        this.schoolService.getNotificationsUnreadCount(schoolId,this.currentUser.role.id).subscribe(
      (res) => {
        if(res && res.data)  
          this.count=res.data;
        else
         this.count=0;
      });
  }

  getNotifications(schoolId){
    this.schoolService.getNotifications(schoolId,this.currentUser.role_id).subscribe(
      (res) => {
        if(res && res.data)
        {
         this.notifications=res.data;
        }
      });
  }
/**
   * To get notification list.
   */
 updateNotificationStatus(schoolId): void {
  this.schoolService.updateNotification(schoolId, this.currentUser.role_id).subscribe(
    (response) => {
      // console.log("Res",response);
      this.toast.showToast('Notification seen', '', 'success');
    
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