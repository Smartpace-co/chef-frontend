import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import{StudentService} from '../../services/student.service'
import {
  faAngleDoubleRight,
  faAngleDoubleLeft,
} from '@fortawesome/free-solid-svg-icons';
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
  LeftArrow = faAngleDoubleLeft;
  currentUser:any;
  packageId:any;
  id:any;
  packageDetails:any
  isEnabled:boolean
  validityDate:any
  roleId:any;

  constructor(private studentService:StudentService, private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

   this.getSubscribePackageDetails()

  }


  getSubscriptionPackageById(packageId):void{
    this.studentService.getSubscriptionPackageById(packageId).subscribe(res=>{
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
      this.studentService.getActiveSubscribePackageDetails(this.id).subscribe(res=>{
        if(res && res.data){
          this.packageId=res.data.packageId
          if(this.packageId){
             this.getSubscriptionPackageById(this.packageId)      
          }
        }
      })
    }
    else
    {
      this.id=this.currentUser.id
      this.roleId=this.currentUser.role.id
      this.isEnabled=true;
      this.studentService.getActiveStudentSubscribePackage(this.id,this.roleId).subscribe(res=>{
        if(res && res.data){
          this.packageId=res.data.packageId
          if(this.packageId){
             this.getSubscriptionPackageById(this.packageId)      
          }
        }
      })

    }
   
  }

  
  editMembership(): void {
  this.router.navigate(['/school/edit-membership']);
  }
}
