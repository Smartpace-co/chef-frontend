import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import{TeacherService} from '../../services/teacher.service'
import{
  faEdit
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-membership-details',
  templateUrl: './membership-details.component.html',
  styleUrls: ['./membership-details.component.scss']
})
export class MembershipDetailsComponent implements OnInit {
  faEdit = faEdit;
  currentUser:any;
  packageId:any;
  packageDetails:any
  id:any;
  isEnabled:boolean
  validityDate:any

  constructor(private teacherService:TeacherService, private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
       this.getSubscribePackageDetails()
  }


  getSubscriptionPackageById(packageId):void{
    this.teacherService.getSubscriptionPackageById(packageId).subscribe(res=>{
      if(res && res.data){
            this.packageDetails=res.data
            var date=new Date();

            if(this.packageDetails.validityFrom<this.packageDetails.validityTo)
            {
              var month = this.packageDetails.validityTo;
              this.validityDate = new Date(date.getFullYear(), month-1, 1);
            }
            else{
              var month = this.packageDetails.validityTo;
              this.validityDate = new Date(date.getFullYear()+1, month-1, 1);
            }
          
      }
    })
  }

  getSubscribePackageDetails():void{
    this.currentUser=JSON.parse(window.sessionStorage.getItem("currentUser"));
    if(this.currentUser && this.currentUser.parentId)
    {
      this.id=this.currentUser.parentId
      this.isEnabled=false;
    }
    else
    {
      this.id=this.currentUser.id
      this.isEnabled=true;

    }
    this.teacherService.getActiveSubscribePackageDetails(this.id).subscribe(res=>{
      if(res && res.data ){
        this.packageId=res.data.packageId
        if(this.packageId){
             this.getSubscriptionPackageById(this.packageId)  
        }    
      }
    })
  }

  
  editMembership(): void {
    this.router.navigate(['/teacher/edit-membership']);
  }


}
