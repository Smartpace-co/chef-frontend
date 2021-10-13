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
} from '@fortawesome/free-solid-svg-icons';
import { DistrictService } from '@modules/district/services/district.service';
import * as _ from 'lodash';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'
@Component({
  selector: 'app-school-performance-report',
  templateUrl: './school-performance-report.component.html',
  styleUrls: ['./school-performance-report.component.scss']
})
export class SchoolPerformanceReportComponent implements OnInit {
  settings =  faCog;
  gridview = false;
  listview = true;
  ViewIcon = faList;
  rightArrow = faChevronRight;
  faDots = faEllipsisV;
  performance = faChartLine;
  leaderboard = faTrophy;
  activity = faHistory;
  ViewTitle = "Tile View";
  duration = 'week';
  planList = [];
  closeModal: any;
  closeModal1: any;
  ViewList = [
    {
      id: '1',
      menu: 'Tile View',
      link: '',
      icon: faThLarge,
    },
    {
      id: '2',
      menu: 'List View',
      link: '',
      icon:faList
    }
  ];
  schoolList =[
  /*  {
      schoolId: 21435,
      schoolName:"Argonaut Elementary",
      teachername:"Ms. Linda Padilla",
      clssess:10,
      students:200,
      profilePic:"./assets/images/student-icon.svg",
      ccssMath:"90% , 90%",
      ccssEla:"65% , 65%",
      Ngss:"43% , 43%",
      ibPyp:"83% , 83%"
    },
    {
      schoolId: 21435,
      schoolName:"Foothill Elementary",
      teachername:"Mrs. Louisa Patterson",
      clssess:10,
      students:200,
      profilePic:"./assets/images/student-icon.svg",
      ccssMath:"90% , 90%",
      ccssEla:"65% , 65%",
      Ngss:"43% , 43%",
      ibPyp:"83% , 83%"
    },
    {
      schoolId: 21435,
      schoolName:"Saratoga Elementary ",
      teachername:"Ms. Cara Allen",
      clssess:10,
      students:200,
      profilePic:"./assets/images/student-icon.svg",
      ccssMath:"90% , 90%",
      ccssEla:"65% , 65%",
      Ngss:"43% , 43%",
      ibPyp:"83% , 83%"
    },
    {
      schoolId: 21435,
      schoolName:"St. Andrew’s ",
      teachername:"Ms. Cassie Noble",
      clssess:10,
      students:200,
      profilePic:"./assets/images/student-icon.svg",
      ccssMath:"90% , 90%",
      ccssEla:"65% , 65%",
      Ngss:"43% , 43%",
      ibPyp:"83% , 83%"
    }*/
  ];
  schoolHeadersList = [
    {
       "title": "School Title",
       "data": "schoolName"
    },
    {
       "title": "CCSS - MATH PROFICIENCY",
       "data": "MATH"
    },
    {
       "title": "CCSS - ELA PROFICIENCY",
       "data": 'ELA'
    },
    {
       "title": "NGSS PROFICIENCY",
       "data": "NGSS",
    },
    {
       "title": "NCSS PROFICIENCY",
       "data": "NCSS"
    }
  ];

  schoolCheckboxHeadersList = [
    {
       "title": "CCSS - MATH PROFICIENCY",
       "data": "MATH",
       "check": false
    },
    {
       "title": "CCSS - ELA PROFICIENCY",
       "data": 'ELA',
       "check": false
    },
    {
       "title": "NGSS PROFICIENCY",
       "data": "NGSS",
       "check": false
    },
    {
       "title": "NCSS PROFICIENCY",
       "data": "NCSS",
       "check": false
    }
  ];
  filterTitle = "This Week";
  filterList = [
    {
      id: '1',
      menu: 'This Week',
      link: '',
      icon: '',
    },
    {
      id: '2',
      menu: 'This Month',
      link: '',
      icon: '',
    },
    {
      id: '3',
      menu: 'This Quarter',
      link: '',
      icon: '',
    },
    {
      id: '4',
      menu: 'This Year',
      link: '',
      icon: '',
    }
  ]
  constructor(private districtService: DistrictService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getSchoolPerformanceReport("week")
  }
  getSchoolPerformanceReport(duration){
    this.duration=duration;
    this.districtService.getAllSchools(this.duration,1).subscribe(
      (response) => {
        if (response && response.data && response.data.rows) {
          this.schoolList = _.map(response.data.rows, item => {
            let obj = {
              schoolId: item.school.id,
              schoolName:item.school.name,
              teachername:'',
              clssess:0,
              time: 0,
              students:item.school.students,
              MATH:"",
             ELA:"",
            NGSS:"",
            NCSS:""
            };
            let filter=[];
            filter[0]=1;
            filter[1]=item.school.id;
            this.districtService.getAllTeacher(filter,'asc').subscribe(
              (response) => {
                if (response && response.data && response.data.rows) {
                  if(response.data.rows[0]){
                    obj.teachername=response.data.rows[0].teacher.first_name + " "+response.data.rows[0].teacher.last_name
                  }
                }
              });


            let filter1=[];
            filter1[0]=1;
            filter1[1]=item.school.id;
            this.districtService.getAllClasses(filter1,'asc').subscribe(
              (res) => {
                if (res && res.data && res.data.rows) {
                  obj.clssess=res.data.rows.length;
                  _.map(res.data.rows, (item, index) => {
                    this.districtService.getStandardProficiencyPercentage(duration, item.id).subscribe((res1) => {
                      if (res1.data) {                    
                        this.planList.push(res1.data);
                        if (this.planList && this.planList[index]) {
                        obj.ELA= this.planList[index].attempted[0] + '%  ' + this.planList[index].proficiency[0] + '%',
                        obj.MATH= this.planList[index].attempted[1] + '%  ' + this.planList[index].proficiency[1] + '%',
                        obj.NGSS= this.planList[index].attempted[2] + '%  ' + this.planList[index].proficiency[2] + '%',
                        obj.NCSS= this.planList[index].attempted[3] + '%  ' + this.planList[index].proficiency[3] + '%'
                      }
                    }
                    });
                  });
                }
              });
            return obj;
          })
          this.schoolList.forEach(element => {          
            element.profilePic = element.profile_image ? element.profile_image :"./assets/images/student-icon.svg"
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
  open(content) {
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'dist-modal' });
  }
  closeOpenModal() {
    this.closeModal.close();
  }
  closeOpenModal1() {
    this.closeModal1.close();
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

      pdf.save('school_performance_report.pdf');
    });
  }
  openRead(content) {
    this.closeModal1 = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'dist-modal' });
  }
  hideContentColumns(e, value) {
    this.schoolHeadersList = this.schoolHeadersList.filter(function (obj) {
      return obj.title !== value.title;
    });
    _.forEach(this.schoolCheckboxHeadersList, (i) => {
      if (i.title === value.title) {
        i.check = true;
      }
    });
}
}
