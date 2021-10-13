import { Component, OnInit } from '@angular/core';
import {
  faCog,
  faThLarge,
  faList,
  faChevronRight,
  faEllipsisV,
  faChartLine,
  faTrophy,
  faHistory,
  faCloudDownloadAlt,
  faBookOpen,
  faClock,
  faUsers,
  faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons';
import { SchoolService } from '@modules/school/services/school.service';
import * as _ from 'lodash';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.scss']
})
export class UserReportComponent implements OnInit {
  settings = faCog;
  listview = true;
  ViewIcon = faList;
  rightArrow = faChevronRight;
  faDots = faEllipsisV;
  performance = faChartLine;
  leaderboard = faTrophy;
  activity = faHistory;
  downloadIcon = faCloudDownloadAlt;
  rightIcon = faAngleDoubleRight;
  filterTitle = 'This Week';
  closeModal1:any
  filterList = [
    {
      id: '1',
      menu: 'This Week',
      link: '',
      icon: ''
    },
    {
      id: '2',
      menu: 'This Month',
      link: '',
      icon: ''
    },
    {
      id: '3',
      menu: 'This Quarter',
      link: '',
      icon: ''
    },
    {
      id: '4',
      menu: 'This Year',
      link: '',
      icon: ''
    }
  ];
  reportDataList = [
    {
      id: 1,
      data: 0,
      title: 'Lessons Assigned',
      icon: faBookOpen
    },
    {
      id: 1,
      data: 0,
      title: 'Inactive Users',
      icon: faUsers
    },
    {
      id: 1,
      data: '0hr 0m',
      title: 'Average session time',
      icon: faClock
    }
  ];
  studentList = [
    // {
    //   id: 36272,
    //   name: 'Kevin Ruaz',
    //   grade: '4,5',
    //   score: 80,
    //   time: '1hr 45min'
    // },
    // {
    //   id: 36277,
    //   name: 'Danilo Nethery',
    //   grade: '3,4,5,6',
    //   score: 85,
    //   time: '1hr 25min'
    // },
    // {
    //   id: 36280,
    //   name: 'Tena Dunson',
    //   grade: '1',
    //   score: 50,
    //   time: '1hr 15min'
    // },
    // {
    //   id: 36271,
    //   name: 'Aaron Samuel',
    //   grade: '7,8',
    //   score: 80,
    //   time: '1hr 40min'
    // },
    // {
    //   id: 36275,
    //   name: 'Cari Kimmell',
    //   grade: '2,3',
    //   score: 85,
    //   time: '1hr 45min'
    // }
  ];
  teacherList = [
    // {
    //   id: 36272,
    //   name: 'Kevin Ruaz',
    //   grade: '4,5',
    //   score: 80,
    //   time: '1hr 45min'
    // },
    // {
    //   id: 36277,
    //   name: 'Danilo Nethery',
    //   grade: '3,4,5,6',
    //   score: 85,
    //   time: '1hr 25min'
    // },
    // {
    //   id: 36280,
    //   name: 'Tena Dunson',
    //   grade: '1',
    //   score: 50,
    //   time: '1hr 15min'
    // },
    // {
    //   id: 36271,
    //   name: 'Aaron Samuel',
    //   grade: '7,8',
    //   score: 80,
    //   time: '1hr 40min'
    // },
    // {
    //   id: 36275,
    //   name: 'Cari Kimmell',
    //   grade: '2,3',
    //   score: 85,
    //   time: '1hr 45min'
    // }
  ];
  studentHeadersList = [
    {
      title: '',
      data: 'id'
    },
    {
      title: '',
      data: 'name'
    },
    {
      title: '',
      data: 'grade'
    },
    {
      title: '',
      data: 'score'
    },
    {
      title: '',
      data: 'time'
    }
  ];
  teacherHeadersList = [
    {
      title: '',
      data: 'name'
    },
    {
      title: '',
      data: 'score'
    },
    {
      title: '',
      data: 'time'
    }
  ];
  duration = 'week';
  clicked: boolean = false;
  activateUserData: any;
  constructor(private schoolService: SchoolService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.activateUserData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.getReport('week');
  }

  getReport(duration) {
    this.clicked = true;
    this.duration = duration;
    this.getAllAssignedLessons(duration);
    this.getInactiveUsers(duration);
    this.getAverageSessionTime(duration);
    this.getTopActiveTeachers(duration);
    this.getTopActiveStudents(duration);

  }

  closeOpenModal1() {
    this.closeModal1.close();
  }

  getAllAssignedLessons(duration) {
    this.schoolService.getSchoolProfile(this.activateUserData.id).subscribe((res) => {
      if (res && res.data) {
        this.schoolService.getAllAssignedLessons(duration, res.data.school.id).subscribe((res) => {
          if (res && res['data']) {
            this.reportDataList[0].data = res['data'].count;
          }
        });
      }
    });
  }
  getInactiveUsers(duration) {
    let count=0;
    this.schoolService.getAllInactiveUser(0, duration).subscribe((res) => {
      if (res && res['data']) {
       count=count+res['data'].count
      }
    });
    this.schoolService.getNewStudents(0, duration).subscribe((res) => {
      if (res && res['data']) {
        count=count+res['data'].count

      }
    });
    this.schoolService.getNewTeacher(0, duration).subscribe((res) => {
      if (res && res['data']) {
        count=count+res['data'].count       
        this.reportDataList[1].data = count;

      }
    });
  }
  openRead(content) {
    this.closeModal1 = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'dist-modal' });
  }

  
  getAverageSessionTime(duration) {
    let teacherCount=0,studentCount=0,totalMins;
   let mins=0, teacherMins=0,hrs=0
    let averageTeacherMins=0,averageStudentMins=0;
    this.schoolService.getNewStudents(1,duration).subscribe((response) => {
      _.map(response.data.rows, (item) => {
        this.schoolService.getTopActiveSessionStudents(duration, item.id).subscribe((res) => {
          if (res && res.data) {
            studentCount=res.data.count;
            _.map(res.data.rows, (objItem) => {
              if (objItem.session_mins != null || objItem.session_mins != NaN) mins =mins + objItem.session_mins;

            });
            averageStudentMins=mins/studentCount;
            totalMins=averageStudentMins
          }
        });
      });
    });

      this.schoolService.getNewTeacher(1,duration).subscribe((response) => {
        _.map(response.data.rows, (item) => {
          this.schoolService.getTopActiveSessionTeachers(duration,item.id).subscribe((res) => {
            if (res && res.data) {
              teacherCount=res.data.count;
              _.map(res.data.rows, (objItem) => {
                if (objItem.session_mins != null || objItem.session_mins != NaN)
                 teacherMins = teacherMins + objItem.session_mins
              });
              averageTeacherMins=teacherMins/teacherCount;
              totalMins=((totalMins+averageStudentMins)/60).toFixed(4)
              this.reportDataList[2].data=totalMins +" hr";
            }
          });
        });
      });
  }

  getTopActiveTeachers(duration) {
   
        this.schoolService.getNewTeacher(1,duration).subscribe((response) => {
         
          this.teacherList = _.map(response.data.rows, (item) => {
           let obj = {
               id: item.teacher.id,
               name: item.teacher.first_name+" "+item.teacher.last_name,
               score: 0,
               time: ""
           };

           this.schoolService.getTopActiveSessionTeachers(duration,item.id).subscribe((res) => {
            obj.score=res.data.count;
            let mins=0;
            _.map(res.data.rows, (objItem) => {
              if (objItem.session_mins != null || objItem.session_mins != NaN)
              mins=mins+objItem.session_mins/obj.score
             
            });
            obj.time=mins.toFixed(4);
           });
         
           return obj;
        });
        });
     
  }

  getTopActiveStudents(duration) {
 
        this.schoolService.getAllStudents(1).subscribe((response) => {
         
          this.studentList = _.map(response.data.rows, (item) => {
            let obj = {
              id: item.id,
              name: item.firstName+" "+item.lastName,
              grade:'',
              score: 0,
              time: ""
          };
            if(item.grade!=null)
            {
              obj.grade=item.grade.grade
            }
          

           this.schoolService.getTopActiveSessionStudents(duration,item.id).subscribe((res) => {
             if(res && res.data)
             {
               obj.score=res.data.count;
               if(obj.score==0)
               {
                 this.studentList.filter((obj1)=>{
                   return obj.score==0;
                 });
               }
               let mins=0;
               _.map(res.data.rows, (objItem) => {
 
                 mins=mins+objItem.session_mins/obj.score
              
               });
               obj.time=mins.toFixed(4);
             }
            

            
            });
         
           return obj;
        });
        });
     
  }

  generatePDF() {
    var data = document.getElementById('generatePdf');
    html2canvas(data).then((canvas) => {
      var imgWidth = 208;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm', 'a4');
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

      pdf.save('user_report.pdf');
    });
  }
}
