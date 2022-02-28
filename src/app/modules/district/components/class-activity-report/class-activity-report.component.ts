import { Component, OnInit } from '@angular/core';
import { faCog, faThLarge, faList, faChevronRight, faEllipsisV, faChartLine, faTrophy, faHistory } from '@fortawesome/free-solid-svg-icons';
import { DistrictService } from '@modules/district/services/district.service';
import * as _ from 'lodash';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ExcelService } from '../../../../shared/services/excel.service';

@Component({
  selector: 'app-class-activity-report',
  templateUrl: './class-activity-report.component.html',
  styleUrls: ['./class-activity-report.component.scss']
})
export class ClassActivityReportComponent implements OnInit {
  settings = faCog;
  gridview = true;
  listview = false;
  ViewIcon = faList;
  rightArrow = faChevronRight;
  faDots = faEllipsisV;
  performance = faChartLine;
  activity = faHistory;
  ViewTitle = 'List View';
  activateUserData: any;
  classActivityList = [];
  teacherActivityList = [];
  duration = 'week';
  collapseTeacherActivity: boolean = false;
  linkActive: boolean = true;
  linkPerformance: boolean = false;
  teacher: boolean = false;
  closeModal: any;
  closeModal1: any;
  downlaodModal: any;
  ViewList = [
    {
      id: '1',
      menu: 'Tile View',
      link: '',
      icon: faThLarge
    },
    {
      id: '2',
      menu: 'List View',
      link: '',
      icon: faList
    }
  ];
  /*classActivityList =[
    {
      schoolId: 21435,
      schoolName:"Argonaut Elementary",
      teachername:"Ms. Linda Padilla",
      students:200,
      profilePic:"./assets/images/student-icon.svg",
      grade: "K",
      room: 218,
      time: "1hr 10min"
    },
    {
      schoolId: 21435,
      schoolName:"Foothill Elementary",
      teachername:"Mrs. Louisa Patterson",
      students:200,
      profilePic:"./assets/images/student-icon.svg",
      grade: "H",
      room: 111,
      time: "1hr 15min"
    },
    {
      schoolId: 21435,
      schoolName:"Saratoga Elementary ",
      teachername:"Ms. Cara Allen",
      students:200,
      profilePic:"./assets/images/student-icon.svg",
      grade: "G",
      room: 228,
      time: "1hr 30min"
    },
    {
      schoolId: 21435,
      schoolName:"St. Andrew’s ",
      teachername:"Ms. Cassie Noble",
      students:200,
      profilePic:"./assets/images/student-icon.svg",
      grade: "V",
      room: 212,
      time: "1hr 35min"
    }
  ];*/
  classActivityHeadersList = [
    {
      title: 'GRADE',
      data: 'grade'
    },
    {
      title: 'CLASS TITLE',
      data: 'className'
    },
    {
      title: 'SCHOOL TITLE',
      data: 'schoolName'
    },
    {
      title: 'NUMBER OF STUDENTS',
      data: 'students'
    },
    {
      title: 'AVERAGE STUDENT TIME',
      data: 'time'
    }
  ];
  headersList = [
    {
      title: 'GRADE',
      data: 'grade',
      check: false
    },
    {
      title: 'SCHOOL TITLE',
      data: 'schoolName',
      check: false
    },
    {
      title: 'NUMBER OF STUDENTS',
      data: 'students',
      check: false
    },
    {
      title: 'AVERAGE STUDENT TIME',
      data: 'time',
      check: false
    }
  ];
  /*teacherActivityList =[
    {
      schoolId: 21435,
      schoolName:"Argonaut Elementary",
      teachername:"Ms. Linda Padilla",
      Sessions:2,
      profilePic:"./assets/images/student-icon.svg",
      grade: "K",
      time: "1hr 10min"
    },
    {
      schoolId: 21435,
      schoolName:"Foothill Elementary",
      teachername:"Mrs. Louisa Patterson",
      Sessions:1,
      profilePic:"./assets/images/student-icon.svg",
      grade: "H",
      time: "1hr 15min"
    },
    {
      schoolId: 21435,
      schoolName:"Saratoga Elementary ",
      teachername:"Ms. Cara Allen",
      Sessions:3,
      profilePic:"./assets/images/student-icon.svg",
      grade: "G",
      time: "1hr 30min"
    },
    {
      schoolId: 21435,
      schoolName:"St. Andrew’s ",
      teachername:"Ms. Cassie Noble",
      Sessions:2,
      profilePic:"./assets/images/student-icon.svg",
      grade: "V",
      time: "1hr 35min"
    }
  ];*/
  teacherHeadersList = [
    {
      title: 'GRADE',
      data: 'grade'
    },
    {
      title: 'CLASS TITLE',
      data: 'className'
    },
    {
      title: 'TEACHER NAME',
      data: 'teacherName'
    },
    {
      title: 'NUMBER OF SESSIONS',
      data: 'sessions'
    },
    {
      title: 'AVERAGE STUDENT TIME',
      data: 'time'
    }
  ];
  teacherList = [
    {
      title: 'GRADE',
      data: 'grade',
      check: false
    },
    {
      title: 'TEACHER NAME',
      data: 'teacherName',
      check: false
    },
    {
      title: 'NUMBER OF SESSIONS',
      data: 'sessions',
      check: false
    },
    {
      title: 'AVERAGE STUDENT TIME',
      data: 'time',
      check: false
    }
  ];

  filterTitle = 'This Week';
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
  constructor(private districtService: DistrictService, private modalService: NgbModal, private excelService: ExcelService) { }

  ngOnInit(): void {
    this.activateUserData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.getClassActivityReport('week');
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
  openDownloadModal(content) {
    this.downlaodModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'dist-modal' });
  }
  closeDownlaodModal() {
    this.downlaodModal.close();
  }

  getClassActivityReport(duration) {
    this.teacher = false;
    this.duration = duration;

    this.districtService.getDistrictProfile().subscribe((res) => {
      if (res && res.data) {
        this.districtService.getClassActivityReport(res.data.district_admin.id, duration).subscribe((res) => {
          if (res.data && res.data.rows) {
            let averageMins = 0;

            this.classActivityList = _.map(res.data.rows, (item) => {
              let obj = {
                displayCode: `CK00000${item.id}`,
                schoolName: item.school.name,
                className: item.title,
                students: item.class_students.length,
                profilePic: './assets/images/student-icon.svg',
                grade: item.grade.grade,
                room: '',
                time: ''
              };

              _.map(item.class_students, (itemStudent) => {
                let mins = 0;
                this.districtService.getTopActiveSessionStudents(duration, itemStudent.id).subscribe((res) => {
                  if (res && res.data) {
                    let score = res.data.count;
                    _.map(res.data.rows, (objItem) => {
                      mins = mins + objItem.session_mins / score;
                      averageMins = mins + averageMins;
                    });
                    obj.time = (averageMins / 60).toFixed(4);
                  }
                });
              });
              return obj;
            });
          }
        });
      }
    });
  }

  getTeacherActivityReport(duration) {
    this.teacher = true;

    this.duration = duration;
    this.districtService.getDistrictProfile().subscribe((res) => {
      if (res && res.data) {
        this.districtService.getClassActivityReport(res.data.district_admin.id, duration).subscribe((res) => {
          if (res.data && res.data.rows) {
            let averageMins = 0;
            let averageScore = 0;
            this.teacherActivityList = _.map(res.data.rows, (item) => {
              let obj = {
                className: item.title,
                schoolName: item.school.name,
                teacherName:
                  item && item.class_teachers ? `${item.class_teachers[0].first_name} ${item.class_teachers[0].last_name}` : 'teacher',
                profilePic: './assets/images/student-icon.svg',
                grade: item.grade.grade,
                sessions: 0,
                time: ""
              };


              _.map(item.class_students, (itemStudent) => {
                let mins = 0;
                this.districtService.getTopActiveSessionStudents(duration, itemStudent.id).subscribe((res) => {
                  if (res && res.data) {
                    let score = res.data.count;
                    averageScore = score + averageScore;
                    obj.sessions = averageScore;
                    _.map(res.data.rows, (objItem) => {
                      mins = mins + objItem.session_mins / score;
                      averageMins = mins + averageMins;
                    });
                    obj.time = (averageMins / 60).toFixed(4);
                  }
                });
              });

              return obj;
            });
          }
        });
      }
    });
  }

  changeView(event) {
    if (event.menu === 'Tile View') {
      this.ViewTitle = 'Tile View';
      this.gridview = true;
      this.listview = false;
      this.ViewIcon = faThLarge;
    } else {
      this.ViewTitle = 'List View';
      this.gridview = false;
      this.listview = true;
      this.ViewIcon = faList;
    }
  }
  hideContentColumns(e, value) {
    if (this.teacher) {
      this.teacherHeadersList = this.teacherHeadersList.filter(function (obj) {
        return obj.title !== value.title;
      });
      _.forEach(this.teacherList, (i) => {
        if (i.title === value.title) {
          i.check = true;
        }
      });
    } else {
      this.classActivityHeadersList = this.classActivityHeadersList.filter(function (obj) {
        return obj.title !== value.title;
      });
      _.forEach(this.headersList, (i) => {
        if (i.title === value.title) {
          i.check = true;
        }
      });
    }
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

      pdf.save('class_activity_report.pdf');
    });
  }

  printExcelSheet(): void {

    let newArray = [];
    let i = 1;

    if (!this.teacher) {
      for (let element of this.classActivityList) {
        let obj = {};
        obj["SL.No."] = i++;
        for (let elm in element) {
          if (elm === "displayCode") obj["Class Id"] = element[elm];
          if (elm === "schoolName") obj["School Name"] = element[elm];
          if (elm === "className") obj["Class Name"] = element[elm];
          if (elm === "students") obj["Students"] = element[elm];
          if (elm === "grade") obj["Grade"] = element[elm];
          if (elm === "room") obj["Room"] = element[elm];
          if (elm === "time") obj["Time"] = element[elm];
        }
        newArray.push(obj);
      }

      this.excelService.exportAsExcelFile(newArray, 'Class Activity Report');

    }

    if (this.teacher) {
      for (let element of this.teacherActivityList) {
        let obj = {};
        obj["SL.No."] = i++;
        for (let elm in element) {
          if (elm === "schoolName") obj["School Name"] = element[elm];
          if (elm === "className") obj["Class Name"] = element[elm];
          if (elm === "teacherName") obj["Teacher Name"] = element[elm];
          if (elm === "grade") obj["Grade"] = element[elm];
          if (elm === "sessions") obj["Sessions"] = element[elm];
          if (elm === "time") obj["Time"] = element[elm];
        }
        newArray.push(obj);
      }
      this.excelService.exportAsExcelFile(newArray, 'Teacher Activity Report');
    }
    this.closeDownlaodModal();
  }

  openRead(content) {
    this.closeModal1 = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'dist-modal' });
  }
}
