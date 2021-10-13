import { Component, OnInit } from '@angular/core';
import { DistrictService } from '../../services/district.service';
import { ToasterService } from '@appcore/services/toaster.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  count = 0;
  currentUser: any;
  notifications:any

  /*notificationList=[
    {
      title:"OTHERS",
      message:"New class has been created successfully!",
      time:"2 Hours ago",
      buttonName:"View Class",
      status:"new"
    },
    {
      title:"SYSTEM ALERTS",
      message:"New application update is available.",
      time:"Friday, March 6",
      buttonName:"View Update",
      status:"new"
    },
    {
      title:"Billing & Payment",
      message:"Your new payment method  has been added successfully.",
      time:"Thursday, March 5",
      buttonName:"View",
      status:"visited"
    },
    {
      title:"NEW ACCOUNT",
      message:"Welcome to Chef Koochooloo",
      time:"",
      buttonName:"Take a Tour",
      status:"new"
    }
  ]*/
  constructor(private districtService: DistrictService,private toast: ToasterService) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.getNotificationCount(this.currentUser.id);
    this.getNotifications(this.currentUser.id);
    this.updateNotificationStatus(this.currentUser.id);

  }
  getNotificationCount(districtId)
  {
        this.districtService.getNotificationsUnreadCount(districtId,this.currentUser.role.id).subscribe(
      (res) => {
        if(res && res.data)  
          this.count=res.data;
        else
         this.count=0;
      });
  }

  getNotifications(districtId){
    this.districtService.getNotifications(districtId,this.currentUser.role_id).subscribe(
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
 updateNotificationStatus(districtId): void {
  this.districtService.updateNotification(districtId, this.currentUser.role_id).subscribe(
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