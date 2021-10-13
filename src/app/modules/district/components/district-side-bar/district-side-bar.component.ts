import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { UtilityService } from '@appcore/services/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DistrictService } from '../../services/district.service';
import * as _ from 'lodash';

import { 
  faAngleDoubleRight,
  faHome,
  faDollarSign,
  faBuilding,
  faCog,
  faUserFriends,
  faGraduationCap,
  faUserShield ,
  faTools,
  faQuestion,
  faLifeRing,
  faUser,
  faIdCard,
  faChartLine,
  faUsers,
  faExclamationTriangle,
  faComments
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-district-side-bar',
  templateUrl: './district-side-bar.component.html',
  styleUrls: ['./district-side-bar.component.scss']
})
export class DistrictSideBarComponent implements OnInit,AfterContentChecked {
  NextArrow = faAngleDoubleRight;
  home = faHome;
  billing = faDollarSign;
  profile = faUser;
  membership = faIdCard;
  schools = faBuilding;
  classes = faUsers;
  reports = faChartLine;
  settings =  faCog;
  users = faUserFriends;
  student =faGraduationCap;
  teachers = faUser;
  roles =faUserShield;
  troubleshooting = faTools;
  faq = faQuestion;
  help = faLifeRing;
  issue = faExclamationTriangle;
  currentUser:any
  discussion = faComments;
   menubarStatus: boolean = false;
   accessModulesList=[]
   access=[]

   menuList=[
    {
      id:'1',
      name:'Home',
      icon: this.home,
      type:'menu',
      status:'1',
      link:'dashboard'
    },
    {
     id:'2',
     name:'DISTRICT',
     icon:'',
     type:'heading',
     status:'1'
   },
   {
     id:'3',
     name:'Billing',
     icon:this.billing,
     type:'menu',
     status:'',
     link:'billing'
   },
   {
     id:'4',
     name:'Profile',
     icon:this.profile,
     type:'menu',
     status:'',
     link:'district-profile'
   },
   {
     id:'5',
     name:'Membership',
     icon:this.membership,
     type:'menu',
     status:'',
     link:'membership-details'
   },
   {
    id:'6',
    name:'SCHOOLS',
    icon:'',
    type:'heading',
    status:'1'
  },
  {
    id:'7',
    name:'Schools',
    icon:this.schools,
    type:'menu',
    status:'',
    link:'district-schools'
  },
  {
    id:'8',
    name:'Reports',
    icon:this.reports,
    type:'menu',
    status:'',
    link:'school-report'
  },
  {
    id:'9',
    name:'CLASSES',
    icon:'',
    type:'heading',
    status:'1'
  },
  {
    id:'10',
    name:'Classes',
    icon:this.classes,
    type:'menu',
    status:'',
    link:'admin-classes'
  },
  {
    id:'11',
    name:'Reports',
    icon:this.reports,
    type:'menu',
    status:'',
    link:'class-activity-report'
  },
  {
   id:'12',
   name:'CONTENT',
   icon:'',
   type:'heading',
   status:'1'
 },
 {
   id:'13',
   name:'Settings',
   icon:this.settings,
   type:'menu',
   status:'',
   link:'content-settings'
 },
 {
   id:'14',
   name:'Reports',
   icon:this.reports,
   type:'menu',
   status:'',
   link:'admin-content-report'
 },
 {
   id:'15',
   name:'USERS',
   icon:'',
   type:'heading',
   status:'1'
 },
 {
   id:'16',
   name:'Users',
   icon:this.users,
   type:'menu',
   status:'',
   link:'admin-user'
 },
 {
   id:'17',
   name:'Student',
   icon:this.student,
   type:'menu',
   status:'',
   link:'admin-student'
 },
 {
   id:'18',
   name:'Teachers',
   icon:this.teachers,
   type:'menu',
   status:'',
   link:'admin-teacher'
 },
 {
   id:'19',
   name:'Roles',
   icon:this.roles,
   type:'menu',
   status:'',
   link:'admin-users-role'
 },
 {
   id:'20',
   name:'Reports',
   icon:this.reports,
   type:'menu',
   status:'',
   link:'user-report'
 },
  {
    id:'21',
    name:'SUPPORTS',
    icon:'',
    type:'heading',
    status:'1'
  },
//  {
//    id:'22',
//    name:'Troubleshooting',
//    icon:this.troubleshooting,
//    type:'menu',
//    status:'1',
//    link:'troubleshooting'
//  },
 {
    id:'23',
    name:'FAQ',
    icon:this.faq,
    type:'menu',
    status:'1',
    link:'common-questions'
  },
  {
    id:'24',
    name:'Report an Issue',
    icon: this.issue,
    type:'menu',
    status:'1',
    link:'report-issue'
  },
  {
    id:'25',
    name:'Get Help',
    icon:this.help,
    type:'menu',
    status:'1',
   link:'get-help'
  },
  {
    id:'26',
    name:'Discussion Forum',
   icon:this.discussion,
   type:'menu',
   status:'1',
    link:'discussion-forum'
 }
 ]
  activeUrl:string;
  constructor(private router:Router,
    private activatedRoute:ActivatedRoute,
    public utilityService: UtilityService,
    private districtService:DistrictService,
    ) { }

  ngOnInit(): void {
    this.currentUser=JSON.parse(window.sessionStorage.getItem("currentUser"))
    this.sideBarList(this.currentUser);
  }
//   openMenu(){
//     this.menubarStatus = !this.menubarStatus;       
// }

onMenuClick():void{
  this.utilityService.openMenu = false;
}

ngAfterContentChecked(): void {
  this.activeUrl = this.activatedRoute && this.activatedRoute['_routerState'] && this.activatedRoute['_routerState'].snapshot.url;
  if (this.activeUrl === '/district/class-activity-report') {
    localStorage.setItem('isPerformanceHeader','true');
  }else if (this.activeUrl === "/district/district-report") {
    localStorage.setItem('isPerformanceHeader','true');
  } 
}

sideBarList(currentUser):void{
  if(currentUser.role.title==='District')
  {
   // currentUser.isSubscriptionPause = true
 
    if (currentUser.isSubscriptionPause == true) {
      this.menuList[2].status='1'
      this.menuList[3].status='1'
      this.menuList[4].status='1'
      this.menuList[5].status=''
      this.menuList[8].status=''
      this.menuList[11].status=''
      this.menuList[14].status=''

      this.access=this.menuList

    }
    else
    {
      this.access=this.menuList

    }
  }
   else{ 
    if (currentUser.isSubscriptionPause == true) {
      this.menuList[2].status='1'
      this.menuList[3].status='1'
      this.menuList[4].status='1'
      this.menuList[5].status=''
      this.menuList[8].status=''
      this.menuList[11].status=''
      this.menuList[14].status=''

      this.access=this.menuList

    }
    else{
     this.districtService.getAccessModulesByRoleId(currentUser.role_id).subscribe(res=>{
      this.accessModulesList=res.data
 
    _.map(this.menuList,menuItem=>{   
      _.map(this.accessModulesList,item => {
            if(menuItem.type==="menu"){  
              if(item.access_module.title.includes("Classes"))
              {
                this.menuList[10].status='1'
              }
               if(item.access_module.title.includes("Content"))
              {
                this.menuList[13].status='1'
              }
              if(item.access_module.title.includes("Users"))
              {
                this.menuList[19].status='1'

              }
              if(menuItem.name.includes(item.access_module.title))
              {
                menuItem.status='1'
              }  
            }
         })    
         this.access.push(menuItem)
    })
  })
}
   }
}
}
