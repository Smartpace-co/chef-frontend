import { Component, OnInit } from '@angular/core';
import { faCog, faThLarge, faList, faChevronRight, faEllipsisV, faChartLine, faTrophy, faHistory } from '@fortawesome/free-solid-svg-icons';
import { DistrictService } from '@modules/district/services/district.service';
import * as _ from 'lodash';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-schools-report',
  templateUrl: './schools-report.component.html',
  styleUrls: ['./schools-report.component.scss']
})
export class SchoolsReportComponent implements OnInit {
  settings = faCog;
  gridview = false;
  listview = true;
  ViewIcon = faList;
  rightArrow = faChevronRight;
  faDots = faEllipsisV;
  performance = faChartLine;
  leaderboard = faTrophy;
  activity = faHistory;
  ViewTitle = 'Tile View';
  duration = 'week';
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
  schoolList = [
    /*{
      schoolId: 21435,
      schoolName:"Argonaut Elementary",
      teachername:"Ms. Linda Padilla",
      time: "11hr 15min",
      students:200,
      profilePic:"./assets/images/student-icon.svg"
    },
    {
      schoolId: 21435,
      schoolName:"Foothill Elementary",
      teachername:"Mrs. Louisa Patterson",
      time: "11hr 15min",
      students:200,
      profilePic:"./assets/images/student-icon.svg"
    },
    {
      schoolId: 21435,
      schoolName:"Saratoga Elementary ",
      teachername:"Ms. Cara Allen",
      time: "11hr 15min",
      students:200,
      profilePic:"./assets/images/student-icon.svg"
    },
    {
      schoolId: 21435,
      schoolName:"St. Andrew’s ",
      teachername:"Ms. Cassie Noble",
      time: "11hr 15min",
      students:200,
      profilePic:"./assets/images/student-icon.svg"
    }*/
  ];
  schoolHeadersList = [
    {
      title: 'SCHOOL TITLE',
      data: 'schoolName'
    },
    {
      title: 'STUDENT USERS',
      data: 'students'
    },
    {
      title: 'AVERAGE USER TIME',
      data: 'time'
      //  "isClickable": true
    }
  ];
  schoolHeaderCheckboxList = [
    {
      title: 'STUDENT USERS',
      data: 'students',
      check: false
    },
    {
      title: 'AVERAGE USER TIME',
      data: 'time',
      check: false
      //  "isClickable": true
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
  constructor(private districtService: DistrictService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getAllSchools('week');
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

  getAllSchools(duration) {
    this.duration = duration;
    this.districtService.getAllSchools(this.duration, 1).subscribe((response) => {
      if (response && response.data && response.data.rows) {
        let averageMins = 0;
        let averageScore = 0;
        this.schoolList = _.map(response.data.rows, (item) => {
          let obj = {
            schoolId: item.school.id,
            schoolName: item.school.name,
            teachername: '',
            time: '',
            students: item.school.students
          };
          this.districtService.getDistrictProfile().subscribe((res) => {
            if (res && res.data) {
              this.districtService.getClassActivityReport(res.data.district_admin.id, duration).subscribe((response) => {
                if (response.data && response.data.rows) {
                  _.map(response.data.rows, (item) => {

                  _.map(item.class_students, (itemStudent) => {
                    let mins = 0;
                    this.districtService.getTopActiveSessionStudents(duration, itemStudent.id).subscribe((res) => {
                      if (res && res.data) {
                        let score = res.data.count;
                        averageScore = score + averageScore;
                        _.map(res.data.rows, (objItem) => {
                          mins = mins + objItem.session_mins / score;
                          averageMins = mins + averageMins;
                        });
                        obj.time = (averageMins / 60).toFixed(4);
                      }
                    });
                  });
                });
                }
              });
            }
          });

          let filter = [];
          filter[0] = 1;
          filter[1] = item.school.id;
          this.districtService.getAllTeacher(filter, 'asc').subscribe((response) => {
            if (response && response.data && response.data.rows) {
              if (response.data.rows[0]) {
                obj.teachername = response.data.rows[0].teacher.first_name + ' ' + response.data.rows[0].teacher.last_name;
              }
            }
          });
          return obj;
        });
        this.schoolList.forEach((element) => {
          element.profilePic = element.profile_image ? element.profile_image : './assets/images/student-icon.svg';
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

  generatePDF() {
    var data = document.getElementById('generatePdf');
    html2canvas(data).then((canvas) => {
      var imgWidth = 208;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm', 'a4');
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

      pdf.save('school_report.pdf');
    });
  }

  openRead(content) {
    this.closeModal1 = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'dist-modal' });
  }

  hideContentColumns(e, value) {
    this.schoolHeadersList = this.schoolHeadersList.filter(function (obj) {
      return obj.title !== value.title;
    });
    _.forEach(this.schoolHeaderCheckboxList, (i) => {
      if (i.title === value.title) {
        i.check = true;
      }
    });
  }
}
