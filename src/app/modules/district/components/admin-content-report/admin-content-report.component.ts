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
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { DistrictService } from '@modules/district/services/district.service';
import * as _ from 'lodash';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ExcelService } from '../../../../shared/services/excel.service';

@Component({
  selector: 'app-admin-content-report',
  templateUrl: './admin-content-report.component.html',
  styleUrls: ['./admin-content-report.component.scss']
})
export class AdminContentReportComponent implements OnInit {
  settings = faCog;
  listview = true;
  ViewIcon = faList;
  rightArrow = faChevronRight;
  faDots = faEllipsisV;
  performance = faChartLine;
  leaderboard = faTrophy;
  activity = faHistory;
  downloadIcon = faCloudDownloadAlt;
  filterTitle = 'This Week';
  clicked: boolean = false;
  adminContentList = [];
  standardList = [];
  activateUserData: any;
  duration = 'week';
  closeModal: any;
  closeModal1: any;
  downlaodModal: any;
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
        data: '0 hr',
        title: 'Average session time',
        icon: faClock
      }
    ];
  /* adminContentList = [
    {
      lesson:"Classic Waffles",
      grade:"4,5",
      rating:"",
      subject:"CCSS Math, CCSS ELA, NGSS",
      time:"8",
      dots:"..."
    },
    {
      lesson:"Skillet Potato Scones",
      grade:"3,4,5,6",
      rating:"",
      subject:"CCSS ELA, NGSS",
      time:"5",
      dots:"..."
    },
    {
      lesson:"Banana Breakfast Cookies",
      grade:"1",
      rating:"",
      subject:"CCSS Math, NGSS",
      time:"5",
      dots:"..."
    },
    {
      lesson:"Fluffy French Toast",
      grade:"7,8",
      rating:"",
      subject:"CCSS Math, CCSS ELA, NGSS",
      time:"3",
      dots:"..."
    },
    {
      lesson:"Blueberry Pancakes",
      grade:"2,3",
      rating:"",
      subject:"CCSS Math",
      time:"1",
      dots:"..."
    }
  ];*/
  adminContentHeadersList = [
    {
      title: 'LESSON',
      data: 'lesson'
    },
    {
      title: 'GRADE',
      data: 'grade'
    },
    {
      title: 'RATING',
      data: 'rating',
      isStarRating: true
    },
    {
      title: 'STANDARDS',
      data: 'standard'
    },
    {
      title: 'NUMBER OF TIMES ASSIGNED',
      data: 'time'
    },
 
  ];

  adminHeadersList = [
    {
      title: 'GRADE',
      data: 'grade',
      check:false
    },
    {
      title: 'RATING',
      data: 'rating',
      isStarRating: true,
      check:false
    },
    {
      title: 'STANDARDS',
      data: 'standard',
      check:false
    },
    {
      title: 'NUMBER OF TIMES ASSIGNED',
      data: 'time',
      check:false
    }
  ];
  constructor(private districtService: DistrictService, private modalService: NgbModal, private excelService: ExcelService) {}

  ngOnInit(): void {
    this.activateUserData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.getReport('week');
  }

  getReport(duration) {
    this.clicked = true;
    this.duration = duration;
    this.getAllAssignedLessons(duration);
    this.getInactiveUsers(duration);
    this.getAverageSessionTime(duration)
    this.getAllTopRatedLesson(duration);
  }

  getAllAssignedLessons(duration) {
    this.districtService.getDistrictProfile().subscribe(res => {
      if (res && res.data) {
        this.districtService.getAllAssignedLessons(duration, res.data.district_admin.id).subscribe((res) => {
          if (res && res['data']) {
            this.reportDataList[0].data = res['data'].count;
          }
        });
      }
    });
  }

  getInactiveUsers(duration) {
    let count=0;

    this.districtService.getAllInactiveUser(0, duration).subscribe((res) => {
      if (res && res['data']) {
        count=count+res['data'].count
      }
    });

    this.districtService.getNewStudents(0, duration).subscribe((res) => {
      if (res && res['data']) {
        count=count+res['data'].count

      }
    });
    this.districtService.getNewTeacher(0, duration).subscribe((res) => {
      if (res && res['data']) {
        count=count+res['data'].count       
        this.reportDataList[1].data = count;

      }
    });
  }

  getAllTopRatedLesson(duration) {
    this.districtService.getAllTopRatedLesson(duration).subscribe((response) => {
      if (response && response.data && response.data) {
        this.adminContentList = _.map(response.data, (item) => {
          this.standardList = [];

          let obj = {
            lesson: item.recipe.recipeTitle,
            grade: item.grade.grade,
            rating: [],
            standard: [],
            time: 0
          };

          _.map(response.data, (item) => {
            _.map(item.questions, (item1) => {
              _.map(item1.standards, (item2) => {
                this.standardList.push(item2.standard.standardTitle);
                obj.standard = this.standardList;
              });
            });
          });

          this.districtService.getNumberOfTimesLessonAssigned(item.recipe.id).subscribe((res) => {
            obj.time = res['data'].count;
          });

          if(item.rating==1)
            obj.rating =[true, false, false, false, false]
          else if(item.rating==2)
          obj.rating =[true, true, false, false, false]
          else if(item.rating==3)
          obj.rating =[true, true, true, false, false]
          else if(item.rating==4)
          obj.rating =[true, true, true, true, false]
          else if(item.rating==5)
          obj.rating =[true, true, true, true, true]
          else obj.rating =[false, false, false, false, false]
          return obj;
        });
      }
    });
  }
  
  open(content) {
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'dist-modal' });
  }
  closeOpenModal() {
    this.closeModal.close();
  }
  closeOpenModal1() {
    this.closeModal1.close();
  }
 
  openRead(content) {
    this.closeModal1 = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'dist-modal' });
  }

  openDownloadModal(content) {
    this.downlaodModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'dist-modal' });
  }
  closeDownlaodModal() {
    this.downlaodModal.close();
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

      pdf.save('content_report.pdf');
    });
  }

  printExcelSheet(): void {

    let newArray = [];
    let i = 1;

    if (this.adminContentList.length) {
      for (let element of this.adminContentList) {
        let obj = {};
        obj["SL.No."] = i++;
        for (let elm in element) {
          if (elm === "lesson") obj["Lesson"] = element[elm];
          if (elm === "grade") obj["Grade"] = element[elm];
          if (elm === "rating") obj["Rating"] = element[elm].filter(obj => obj).length;
          if (elm === "standard") {
            let standards = '';
            for (let i = 0; i < element[elm].length; i++) {
              if (i < element[elm].length - 1) standards = standards + element[elm][i] + ', ';
              else standards = standards + element[elm];
            }
            obj["Standard"] = standards;
          }
          if (elm === "time") obj["Time"] = element[elm];
        }
        newArray.push(obj);
      }
      this.excelService.exportAsExcelFile(newArray, 'Lesson report');
    }
    this.closeDownlaodModal();
  }

  hideContentColumns(e, value) {
    this.adminContentHeadersList = this.adminContentHeadersList.filter(function (obj) {
      return obj.title !== value;
    });
    _.forEach(this.adminHeadersList, (i) => {
      if (i.title === value) {
        i.check = true;
      }
    });
  }

  getAverageSessionTime(duration) {
    let teacherCount=0,studentCount=0,totalMins;
    let mins=0, teacherMins=0,hrs=0
     let averageTeacherMins=0,averageStudentMins=0;
     this.districtService.getNewStudents(1,duration).subscribe((response) => {
      _.map(response.data.rows, (item) => {
        this.districtService.getTopActiveSessionStudents(duration, item.id).subscribe((res) => {
          if (res && res.data) {
            studentCount=res.data.count;
            _.map(res.data.rows, (objItem) => {
              if (objItem.session_mins != null || objItem.session_mins != NaN) mins =mins + objItem.session_mins;

            });
            if(studentCount){
              averageStudentMins=mins/studentCount;
              totalMins=averageStudentMins
            }
          }
        });
      });
    });
    this.districtService.getNewTeacher(1,duration).subscribe((response) => {
      _.map(response.data.rows, (item) => {
        this.districtService.getTopActiveSessionTeachers(duration,item.id).subscribe((res) => {
          if (res && res.data) {
            teacherCount=res.data.count;
            _.map(res.data.rows, (objItem) => {
              if (objItem.session_mins != null || objItem.session_mins != NaN)
               teacherMins = teacherMins + objItem.session_mins
            });
            if(teacherCount){
              averageTeacherMins=teacherMins/teacherCount;
              totalMins=(totalMins+averageStudentMins)/60
              this.reportDataList[2].data=parseFloat(totalMins).toFixed(4) +" hr";
            }
          }
        });
      });
    });
  }

}
