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
  faCloudDownloadAlt
} from '@fortawesome/free-solid-svg-icons';
import { SchoolService } from '@modules/school/services/school.service';
import * as _ from 'lodash';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ExcelService } from '../../../../shared/services/excel.service';

@Component({
  selector: 'app-class-performance-report',
  templateUrl: './class-performance-report.component.html',
  styleUrls: ['./class-performance-report.component.scss']
})
export class ClassPerformanceReportComponent implements OnInit {
  settings = faCog;
  gridview = false;
  listview = true;
  ViewIcon = faList;
  rightArrow = faChevronRight;
  faDots = faEllipsisV;
  performance = faChartLine;
  leaderboard = faTrophy;
  activity = faHistory;
  downloadIcon = faCloudDownloadAlt;
  ViewTitle = 'List View';
  activateUserData: any;
  planList = [];
  duration = 'week';
  standard: boolean = false;

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
  standardsProficiencyList = [
    /*  {
      schoolId: 21435,
      grade: 'K',
      schoolName: 'Argonaut Elementary School',
      classTital: 'Ms. Linda’s Class: Room 218',
      Room: 218,
      teachername: 'Ms. Linda’s',
      profilePic: './assets/images/student-icon.svg',
      ccssMath: ['69%', '69%'],
      ccssEla: ['95%', '95%']
    },
    {
      schoolId: 21435,
      grade: 'K',
      schoolName: 'Argonaut Elementary School',
      classTital: 'Ms. Linda’s Class: Room 218',
      Room: 218,
      teachername: 'Ms. Linda’s',
      profilePic: './assets/images/student-icon.svg',
      ccssMath: ['69%', '69%'],
      ccssEla: ['95%', '95%']
    },
    {
      schoolId: 21435,
      grade: 'K',
      schoolName: 'Argonaut Elementary School',
      classTital: 'Ms. Linda’s Class: Room 218',
      Room: 218,
      teachername: 'Ms. Linda’s',
      profilePic: './assets/images/student-icon.svg',
      ccssMath: ['69%', '69%'],
      ccssEla: ['95%', '95%']
    },
    {
      schoolId: 21435,
      grade: 'K',
      schoolName: 'Argonaut Elementary School',
      classTital: 'Ms. Linda’s Class: Room 218',
      Room: 218,
      teachername: 'Ms. Linda’s',
      profilePic: './assets/images/student-icon.svg',
      ccssMath: ['69%', '69%'],
      ccssEla: ['95%', '95%']
    }*/
  ];
  standardsProficiencyHeadersList = [
    {
      title: 'GRADE',
      data: 'grade'
    },
    {
      title: 'CLASS TITLE',
      data: 'className'
    },
    {
      title: 'CCSS-ELA PROFICIENCY',
      data: 'ELA'
    },
    {
      title: 'CCSS-MATH PROFICIENCY',
      data: 'MATH'
    },
    {
      title: 'NGSS PROFICIENCY',
      data: 'NGSS'
    },
    {
      title: 'NCSS PROFICIENCY',
      data: 'NCSS'
    }
  ];
  standardsHeadersList = [
    {
      title: 'GRADE',
      data: 'grade',
      check:false
    },
    {
      title: 'CCSS-ELA PROFICIENCY',
      data: 'ELA',
      check:false
    },
    {
      title: 'CCSS-MATH PROFICIENCY',
      data: 'MATH',
      check:false
    },
    {
      title: 'NGSS PROFICIENCY',
      data: 'NGSS',
      check:false
    },
    {
      title: 'NCSS PROFICIENCY',
      data: 'NCSS',
      check:false
    }
  ];
  studentReportsList = [
    /*{
      schoolId: 21435,
      grade: 'K',
      schoolName: 'Argonaut Elementary School',
      classTital: 'Ms. Linda’s Class: Room 218',
      Room: 218,
      teachername: 'Ms. Linda’s',
      profilePic: './assets/images/student-icon.svg',
      students: 20,
      actions: ['Download']
    },
    {
      schoolId: 21435,
      grade: 'K',
      schoolName: 'Argonaut Elementary School',
      classTital: 'Ms. Linda’s Class: Room 218',
      Room: 218,
      teachername: 'Ms. Linda’s',
      profilePic: './assets/images/student-icon.svg',
      students: 20,
      actions: ['Download']
    },
    {
      schoolId: 21435,
      grade: 'K',
      schoolName: 'Argonaut Elementary School',
      classTital: 'Ms. Linda’s Class: Room 218',
      Room: 218,
      teachername: 'Ms. Linda’s',
      profilePic: './assets/images/student-icon.svg',
      students: 20,
      actions: ['Download']
    },
    {
      schoolId: 21435,
      grade: 'K',
      schoolName: 'Argonaut Elementary School',
      classTital: 'Ms. Linda’s Class: Room 218',
      Room: 218,
      teachername: 'Ms. Linda’s',
      profilePic: './assets/images/student-icon.svg',
      students: 20,
      actions: ['Download']
    }*/
  ];
  studentReportsHeadersList = [
    {
      title: 'GRADE',
      data: 'grade'
    },
    {
      title: 'CLASS TITLE',
      data: 'className'
    },
    {
      title: 'NUMBER OF STUDENTS',
      data: 'students'
    }
  ];

  studentHeadersList = [
    {
      title: 'GRADE',
      data: 'grade',
      check:false
    },
    {
      title: 'NUMBER OF STUDENTS',
      data: 'students',
      check:false
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
  closeModal: any;
  closeModal1: any;
  downlaodModal: any;
  constructor(private schoolService: SchoolService,private modalService: NgbModal, private excelService: ExcelService) {}

  ngOnInit(): void {
    this.activateUserData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.getStandardProficiencyList('week');
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

  getStandardProficiencyList(duration): void {
    this.standard=true
    this.duration = duration;
    let standardProficiency;
    this.standardsProficiencyList = [];

    this.schoolService.getSchoolProfile(this.activateUserData.id).subscribe((response) => {
      if (response && response.data) {
        this.schoolService.getClassActivityReport(response.data.school.id, duration).subscribe((res) => {
          if (res.data && res.data.rows) {
            _.map(res.data.rows, (item, index) => {
              this.schoolService.getStandardProficiencyPercentage(duration, item.id).subscribe((res) => {
                if (res.data) {
                  this.planList.push(res.data);
                  if (this.planList) {
                    standardProficiency = {
                      className: item.title,
                      grade: item.grade.grade,
                      teachername:
                        item && item.class_teachers
                          ? `${item.class_teachers[0].first_name} ${item.class_teachers[0].last_name}`
                          : 'teacher',
                      profilePic: './assets/images/student-icon.svg',
                      ELA: this.planList[index].attempted[0] + '%  ' + this.planList[index].proficiency[0] + '%',
                      MATH: this.planList[index].attempted[1] + '%  ' + this.planList[index].proficiency[1] + '%',
                      NGSS: this.planList[index].attempted[2] + '%  ' + this.planList[index].proficiency[2] + '%',
                      NCSS: this.planList[index].attempted[3] + '%  ' + this.planList[index].proficiency[3] + '%'
                    };
                    this.standardsProficiencyList.push(standardProficiency);
                  }
                }
              });
            });
          }
        });
      }
    });
  }

  getStudentProficiencyList(duration): void {
    this.standard=false

    this.duration = duration;
    this.schoolService.getSchoolProfile(this.activateUserData.id).subscribe((response) => {
      if (response && response.data) {
        this.schoolService.getClassActivityReport(response.data.school.id, duration).subscribe((res) => {
          if (res.data && res.data.rows) {
            this.studentReportsList = _.map(res.data.rows, (item) => {
              let obj = {
                className: item.title,
                grade: item.grade.grade,
                teachername:
                  item && item.class_teachers ? `${item.class_teachers[0].first_name} ${item.class_teachers[0].last_name}` : 'teacher',
                profilePic: './assets/images/student-icon.svg',
                students: item.class_students.length
              };
              return obj;
            });
          }
        });
      }
    });
  }
  openRead(content) {
    this.closeModal1 = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'dist-modal' });
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

      pdf.save('class_performance_report.pdf');
    });
  }
  printExcelSheet(): void {
    let newArray = [];
    let i = 1;
    if (this.standard) {
      for (let element of this.standardsProficiencyList) {
        let obj = {};
        obj["SL.No."] = i++;
        for (let elm in element) {
          if (elm === "grade") obj["Grade"] = element[elm];
          if (elm === "className") obj["Class Title"] = element[elm];
          if (elm === "schoolName") obj["School Title"] = element[elm];
          if (elm === "ELA") obj["CCSS-ELA PROFICIENCY"] = element[elm];
          if (elm === "MATH") obj["CCSS-MATH PROFICIENCY"] = element[elm];
          if (elm === "NGSS") obj["NGSS PROFICIENCY"] = element[elm];
          if (elm === "NCSS") obj["NCSS PROFICIENCY"] = element[elm];
        }
        newArray.push(obj);
      }
      this.excelService.exportAsExcelFile(newArray, 'Standard Proficiency');
    }

    if (!this.standard) {
      for (let element of this.studentReportsList) {
        let obj = {};
        obj["SL.No."] = i++;
        for (let elm in element) {
          if (elm === "grade") obj["Grade"] = element[elm];
          if (elm === "className") obj["Class Title"] = element[elm];
          if (elm === "schoolName") obj["School Title"] = element[elm];
          if (elm === "students") obj["Number of Students"] = element[elm];
        }
        newArray.push(obj);
      }
      this.excelService.exportAsExcelFile(newArray, 'Class Proficiency');
    }
    this.closeDownlaodModal();
  }

  hideContentColumns(e, value) {
    if (this.standard) {
      this.standardsProficiencyHeadersList = this.standardsProficiencyHeadersList.filter(function (obj) {
        return obj.title !== value.title;
      });
      _.forEach(this.standardsHeadersList, (i) => {
        if (i.title === value.title) {
          i.check = true;
        }
      });
    } else {
      this.studentReportsHeadersList = this.studentReportsHeadersList.filter(function (obj) {
        return obj.title !== value.title;
      });
      _.forEach(this.studentHeadersList, (i) => {
        if (i.title === value.title) {
          i.check = true;
        }
      });
    }
  }
}
