import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  faCog,
  faThLarge,
  faList,
  faChevronRight,
  faEllipsisV,
  faChartLine,
  faTrophy,
  faHistory,
  faChevronLeft,
  faCogs,
  faAngleDown,
  faExclamationTriangle,
  faArrowUp,
  faAngleUp,
  faPlus,
  faMinus,
  faAngleDoubleRight,
  faAngleDoubleLeft,
  faLongArrowAltUp,
  faCheck,
  faSearch,
  faEye,
  faCalendarAlt,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import { ToasterService } from '@appcore/services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import * as _ from 'lodash';
import { TranslationService } from '@appcore/services/translation.service';

@Component({
  selector: 'app-teacher-performance',
  templateUrl: './teacher-performance.component.html',
  styleUrls: ['./teacher-performance.component.scss']
})
export class TeacherPerformanceComponent implements OnInit, OnDestroy {
  settings = faCog;
  gridview = false;
  listview = true;
  ViewIcon = faList;
  rightArrow = faChevronRight;
  leftArrow = faChevronLeft;
  cogs = faCogs;
  DownArrow = faAngleDown;
  upArrow = faAngleUp;
  doubleArrowRight = faAngleDoubleRight;
  doubleArrowLeft = faAngleDoubleLeft;
  plus = faPlus;
  minus = faMinus;
  faDots = faEllipsisV;
  performance = faChartLine;
  leaderboard = faTrophy;
  activity = faHistory;
  longArrowUp = faLongArrowAltUp;
  check = faCheck;
  search = faSearch;
  exclamation = faExclamationTriangle;
  eye = faEye;
  heading1 = false;
  heading2 = false;
  heading3 = false;
  performance1 = false;
  performance2 = false;
  performance3 = true;
  Filters = true;
  performance4 = false;
  performance5 = false;
  slider = true;
  tabs = false;
  closeModal: any;
  closeModal1: any;
  criteriaModal: any;
  profileModal: any;
  // Variable decalarations
  subscription: Subscription;

  reportTypeId: number;
  selectedClassId: number;
  duration = 'week';
  standard: boolean = false;

  ViewTitle = 'Tile View';
  ViewList = [];

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

  slideConfig = {
    slidesToShow: 3.75,
    slidesToScroll: 1,
    nextArrow: "<div class='nav-btn plan-next-slide slide-btn'></div>",
    prevArrow: "<div class='nav-btn plan-prev-slide slide-btn'></div>",
    dots: false,
    infinite: false,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 580,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  planList = [
    {
      id: 1,
      number1: '37',
      number2: '73',
      grade: 'CCSS - Math Grade 4'
    },
    {
      id: 2,
      number1: '52',
      number2: '89',
      grade: 'CCSS - ELA Grade 4'
    },
    {
      id: 3,
      number1: '45',
      number2: '72',
      grade: 'NGSS - Grade 4'
    },
    {
      id: 4,
      number1: '63',
      number2: '68',
      grade: 'IB - PYP'
    },
    {
      id: 1,
      number1: '37',
      number2: '73',
      grade: 'CCSS - Math Grade 4'
    },
    {
      id: 2,
      number1: '52',
      number2: '89',
      grade: 'CCSS - ELA Grade 4'
    },
    {
      id: 3,
      number1: '45',
      number2: '72',
      grade: 'NGSS - Grade 4'
    },
    {
      id: 4,
      number1: '63',
      number2: '68',
      grade: 'IB - PYP'
    }
  ];

  operationDetails = [
  ];

  skillDetails = [
  ];

  studentDetails = [];

  headersList = [];
  showHeader = true;
  graphicalDetails = [];

  profileInfo: any;
  allergens: any;
  medicalCondition: any;
  journalInfo = [];
  SearchIcon = faSearch;
  Calendar = faCalendarAlt;
  NextArrow = faAngleDoubleRight;
  trash = faTrashAlt;

  // graphicalDetails = [
  //   {
  //     id: 1,
  //     name: "Samuel, Aaron",
  //     studentID: "36271",
  //   },
  //   {
  //     id: 2,
  //     name: "Samuel, Aaron",
  //     studentID: "36271",
  //   },
  //   {
  //     id: 3,
  //     name: "Samuel, Aaron",
  //     studentID: "36271",
  //   },
  // ]
  constructor(
    private router: Router,
    private teacherService: TeacherService,
    private toast: ToasterService,
    private actRoute: ActivatedRoute,
    private modalService: NgbModal,
    private translate: TranslationService
  ) {
    this.reportTypeId = this.actRoute.snapshot.params.id;
    this.selectedClassId = this.teacherService.getSelectedClassId();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    // this.selectedClassId = this.teacherService.getSelectedClassId();
    // console.log(" init reportid", this.reportTypeId);
    // //  this.getPlanList();
    // if(this.reportTypeId == 2){
    //   this.getPlanList();
    // }else if(this.reportTypeId == 3){
    //   this.getStudentReports(this.selectedClassId);
    // }

    this.setData();
    this.subscription = this.teacherService.getReportTypeId().subscribe((data) => {
      this.reportTypeId = data.reportTypeId;
      this.setData();
    });

    this.ViewTitle = this.translate.getStringFromKey('table-search-filter-container.view.tile-view');
    this.ViewList = [
      {
        id: '1',
        menu: this.translate.getStringFromKey('table-search-filter-container.view.tile-view'),
        link: '',
        icon: faThLarge
      },
      {
        id: '2',
        menu: this.translate.getStringFromKey('table-search-filter-container.view.list-view'),
        link: '',
        icon: faList
      }
    ];
    this.filterList = [

    ]
  }

  setData() {
    this.selectedClassId = this.teacherService.getSelectedClassId();
    // console.log('print subject id ==  ' + this.reportTypeId);
    if (this.reportTypeId == 1) {
      this.performance4 = false;
      this.performance5 = false;
      this.performance3 = false;
      this.performance2 = true;
      this.heading3 = false;
      this.heading2 = false;
      this.heading1 = true;
      this.slider = true;
      this.getPlanList();
      this.showHeader = true;
      this.headersList = [
        {
          title: 'Emerging',
          check: true
        },
        {
          title: 'Proficient',
          check: true
        },
        {
          title: 'Advanced',
          check: true
        }
      ]
    }
    if (this.reportTypeId == 2) {
      this.performance4 = false;
      this.performance5 = false;
      this.performance3 = true;
      this.performance2 = false;
      this.heading3 = false;
      this.heading1 = false;
      this.heading2 = true;
      this.slider = true;
      this.getPlanList();
      this.showHeader = true;
      this.headersList = [
        {
          title: 'Not Started',
          check: true
        },
        {
          title: 'Needs Help',
          check: true
        },
        {
          title: 'Making Progress',
          check: true
        },
        {
          title: 'Completed',
          check: true
        }
      ]
    }
    if (this.reportTypeId == 3) {
      this.performance4 = false;
      this.performance3 = false;
      this.performance2 = false;
      this.heading1 = false;
      this.heading2 = false;
      this.heading3 = true;
      this.slider = false;
      this.performance5 = true;
      this.getStudentReports(this.selectedClassId);
      this.showHeader = true;
      this.headersList = [
        {
          title: 'Not Started',
          check: true
        },
        {
          title: 'Needs Help',
          check: true
        },
        {
          title: 'Making Progress',
          check: true
        },
        {
          title: 'Completed',
          check: true
        }
      ]
    }
    // console.log(this.headersList);
  }

  filterDuration(param) {
    this.duration = param;
    if (this.reportTypeId == 2 || this.reportTypeId == 1) this.getPlanList();
    if (this.reportTypeId == 3) this.getStudentReports(this.selectedClassId);
  }

  getPlanList() {
    this.planList = [];
    this.operationDetails = [];
    this.teacherService.getPerformanceCatgList(this.duration, this.selectedClassId).subscribe(
      (response: any) => {
        if (response && response.data && response.status === 200) {
          this.planList = response.data;
          for (let i = 0; i < this.planList.length; i++) {
            this.planList[i].id = i;
          }
          if (this.reportTypeId == 2) {
            this.getReportList(this.planList[0]);
          } else if (this.reportTypeId == 1) {
            this.getReportListByStandard(this.planList[0]);
          }
        }
      },
      (error) => {
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  getReportList(item) {

    if (this.reportTypeId == 1) this.getReportListByStandard(item);
    if (this.reportTypeId == 2) this.getAssignmentReportList(item);
  }

  getAssignmentReportList(item) {
    if (item && item.assignmentIds.length) {
      this.teacherService.getReportList(JSON.stringify(item.assignmentIds), this.selectedClassId,  item.questionTypeInfo.key).subscribe(
        (response: any) => {
          if (response && response.data && response.status === 200) {
            this.operationDetails = response.data;
            this.operationDetails.map((obj) => (obj.subList = []));
          }
        },
        (error) => {
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
    }
  }

  getReportListByStandard(item) {
    if (item && item.assignmentIds.length) {
      this.teacherService.getStandardReportList(JSON.stringify(item.assignmentIds), this.selectedClassId, item.questionTypeInfo.key).subscribe((response: any) => {
        if (response && response.data && response.status === 200) {
          // console.log("standard Respnse",response);
          this.operationDetails = response.data;
          this.operationDetails.map(obj => obj.subList = []);
        }
      });
    }
  }
  getStudentReports(classId) {
    this.teacherService.getClassStudentReport(this.duration, classId).subscribe((res: any) => {
      if (res && res.data && res.status === 200) {
        this.graphicalDetails = res.data;

        for (let i = 0; i < this.graphicalDetails.length; i++) {

          this.graphicalDetails[i].advancedChart = {
            label: 'Advanced',
            strokeDasharray: this.graphicalDetails[i].advanced + ' ' + (100 - this.graphicalDetails[i].advanced),
            strokeDashoffset: '25'
          }

          this.graphicalDetails[i].proficientChart = {
            label: 'proficient',
            strokeDasharray: this.graphicalDetails[i].proficient + ' ' + (100 - this.graphicalDetails[i].proficient),
            strokeDashoffset: (100 - (100 - this.graphicalDetails[i].proficient) + 25).toString()
          }

          this.graphicalDetails[i].emergingChart = {
            label: 'emerging',
            strokeDasharray: this.graphicalDetails[i].emerging + ' ' + (100 - this.graphicalDetails[i].emerging),
            strokeDashoffset: (100 - (100 - this.graphicalDetails[i].emerging) + parseInt(this.graphicalDetails[i].proficientChart.strokeDashoffset)).toString()
          }
        }

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

  openRead(content) {
    this.closeModal1 = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'dist-modal' });
  }

  closeCriteriaModal() {
    this.criteriaModal.close();
  }

  openCriteriaModal(content) {
    this.criteriaModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'dist-modal' });
  }

  onChange(data) {
    this.headersList.filter(obj => obj.title === data.title)[0].check = !data.check;

    if (this.headersList.length === this.headersList.filter(obj => obj.check === false).length) this.showHeader = false;
    else this.showHeader = true;

  }

  openStudentProfile(content, studentId) {
    this.getStudentInfo({ id: studentId });
    this.profileModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  editStudentInfo(studentData) {
    this.router.navigate(['/teacher/edit-student/', studentData.id]);
    this.modalService.dismissAll();
  }

  getStudentInfo(student) {
    this.teacherService.getStudentDetails(student.id).subscribe((data: any) => {
      // console.log("student data", data);
      this.profileInfo = data.data
      this.allergens = this.profileInfo.allergens.map(x => x.allergenTitle).join(",");
      this.medicalCondition = this.profileInfo.medicalConditions.map(x => x.title).join(",");
      this.getJournalInfo(student.id);
      // console.log("student Info", this.profileInfo);
    },
      (error) => {
        // console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      });
    // this.StudentList.forEach((element, index) => {
    //   if (element.studentId == student.studentId) {
    //     if (!Array.isArray(element.studentName)) {
    //       element.studentName = element.studentName.split(',');
    //     }
    //     this.profileInfo = element;
    //     this.studIndex = index;
    //   }
    // });

  }


  getJournalInfo(id) {
    this.teacherService.getStudentJournalDetails(id).subscribe((data: any) => {
      this.journalInfo = data.data;
    },
      (error) => {
        this.toast.showToast(error.error.message, '', 'error');
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

      pdf.save('teacher_report.pdf');
    });

  }
  /*hideContentColumns(e, value) {
      if(this.reportTypeId == 1){
    this.operationDetails = this.operationDetails.filter(function (obj) {
      return obj.title !== value.title;
    });
    _.forEach(this.assignmentHeadersList, (i) => {
      if (i.title === value.title) {
        i.check = true;
      }
    });
  }
}*/

}
