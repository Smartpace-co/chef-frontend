import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { UtilityService } from '@appcore/services/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SchoolService } from '../../services/school.service';
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
  selector: 'app-school-side-bar',
  templateUrl: './school-side-bar.component.html',
  styleUrls: ['./school-side-bar.component.scss']
})
export class SchoolSideBarComponent implements OnInit,AfterContentChecked {
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
  accessModulesList=[]
  currentUser:any
  troubleshooting = faTools;
  faq = faQuestion;
  help = faLifeRing;
  issue = faExclamationTriangle;
  discussion = faComments;
   menubarStatus: boolean = false;
   access=[]
   menuList=[
     {
       id:'1',
       name:'Home',
       icon: this.home,
       type:'menu',
       status:'1',
       link:'dashboard',

     },
     {
      id:'2',
      name:'SCHOOL',
      icon:'1',
      type:'heading',
      status:'1',

    },
    {
      id:'3',
      name:'Billing',
      icon:this.billing,
      type:'menu',
      status:'',
      link:'billing',

    },
    {
      id:'4',
      name:'Profile',
      icon:this.profile,
      type:'menu',
      status:'',
      link:'school-profile'

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
     name:'CLASSES',
     icon:'',
     type:'heading',
     status:'1',
    },
   {
     id:'7',
     name:'Classes',
     icon:this.classes,
     type:'menu',
     status:'',
     link:'admin-classes'
   },
   {
     id:'8',
     name:'Reports',
     icon:this.reports,
     type:'menu',
     status:'',
     link:'class-activity-report'
   },
   {
    id:'9',
    name:'CONTENT',
    icon:'',
    type:'heading',
    status:'1',
  },
  {
    id:'10',
    name:'Settings',
    icon:this.settings,
    type:'menu',
    status:'',
    link:'content-settings'
  },
  {
    id:'11',
    name:'Reports',
    icon:this.reports,
    type:'menu',
    status:'',
    link:'admin-content-report'
  },
  {
    id:'12',
    name:'USERS',
    icon:'',
    type:'heading',
    status:'1',
  },
  {
    id:'13',
    name:'Users',
    icon:this.users,
    type:'menu',
    status:'',
    link:'admin-user'
  },
  {
    id:'14',
    name:'Student',
    icon:this.student,
    type:'menu',
    status:'',
    link:'admin-student'
  },
  {
    id:'15',
    name:'Teachers',
    icon:this.teachers,
    type:'menu',
    status:'',
    link:'admin-teacher'
  },
  {
    id:'16',
    name:'Roles',
    icon:this.roles,
    type:'menu',
    status:'',
    link:'admin-users-role'
  },
  {
    id:'17',
    name:'Reports',
    icon:this.reports,
    type:'menu',
    status:'',
    link:'user-report'
  },
   {
    id:'18',
    name:'SUPPORTS',
    icon:'',
    type:'heading',
    status:'1',
  },
//  {
//     id:'19',
//     name:'Troubleshooting',
//     icon:this.troubleshooting,
//     type:'menu',
//     status:'1',
//     link:'troubleshooting'
//   },
  {
    id:'20',
    name:'FAQ',
    icon:this.faq,
    type:'menu',
    status:'1',
    link:'common-questions'
  },
  {
    id:'21',
    name:'Report an Issue',
    icon: this.issue,
    type:'menu',
    status:'1',
    link:'report-issue'
  },
  {
    id:'22',
    name:'Get Help',
    icon:this.help,
    type:'menu',
    status:'1',
    link:'get-help'
  },
  {
    id:'23',
    name:'Discussion Forum',
    icon:this.discussion,
    type:'menu',
    status:'1',
    link:'discussion-forum'
  }
  ]
  activeUrl:string;
  constructor(private router:Router,
    private schoolService:SchoolService,
    private activatedRoute:ActivatedRoute,
    public utilityService: UtilityService
    ) { }

  ngOnInit(): void {
    this.currentUser=JSON.parse(window.sessionStorage.getItem("currentUser"))
    this.sideBarList(this.currentUser);
  }
//   openMenu(){
//     this.menubarStatus = !this.menubarStatus;       
// }
ngAfterContentChecked(): void {
  this.activeUrl = this.activatedRoute && this.activatedRoute['_routerState'] && this.activatedRoute['_routerState'].snapshot.url;
  if (this.activeUrl === '/school/class-activity-report') {
    localStorage.setItem('isPerformanceHeader','true');
  }else if (this.activeUrl === "/school/school-report") {
    localStorage.setItem('isPerformanceHeader','true');
  } 
}

sideBarList(currentUser):void{
  //currentUser.isSubscriptionPause = true
  if(currentUser.role.title==='School')
  {
    if (currentUser.isSubscriptionPause == true) {
      this.menuList[2].status='1'
      this.menuList[3].status='1'
      this.menuList[4].status='1'
      this.menuList[5].status=''
      this.menuList[8].status=''
      this.menuList[11].status=''

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

      this.access=this.menuList

    } 
    else{
     this.schoolService.getAccessModulesByRoleId(currentUser.role_id).subscribe(res=>{
      this.accessModulesList=res.data
 
    _.map(this.menuList,menuItem=>{   
      _.map(this.accessModulesList,item => {
            if(menuItem.type==="menu"){  
              if(!item.access_module.title.includes("Billing")  && !item.access_module.title.includes("Profile")  && !item.access_module.title.includes("Membership"))
              {
                this.menuList[1].status='0'
              }
              if(!item.access_module.title.includes("Classes") && !item.access_module.title.includes("Classes Reports"))
              {                
                this.menuList[5].status='0'

              }
              if(!item.access_module.title.includes("Settings") && !item.access_module.title.includes("Content Reports"))
              {                
                this.menuList[8].status='0'

              }
              if(!item.access_module.title.includes("Users") && !item.access_module.title.includes("Student") && !item.access_module.title.includes("Users") && !item.access_module.title.includes("Teachers")&& !item.access_module.title.includes("Roles") && !item.access_module.title.includes("Users Reports"))
              {                
                this.menuList[11].status='0'

              }


              if(item.access_module.title.includes("Classes"))
              {
                this.menuList[7].status='1'

              }

              if(item.access_module.title.includes("Content"))
              {
                this.menuList[10].status='1'

              }

              if(item.access_module.title.includes("Users"))
              {
                this.menuList[16].status='1'

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

onMenuClick():void{
  this.utilityService.openMenu = false;
}
}
