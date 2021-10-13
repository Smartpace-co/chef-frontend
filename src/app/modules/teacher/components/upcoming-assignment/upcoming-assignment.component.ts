import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { ToasterService } from '@appcore/services/toaster.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  faCartPlus,
  faChevronRight,
  faPlus,
  faSearch,
  faStickyNote,
  faList,
  faThLarge,
  faCheckCircle,
  faSort
} from '@fortawesome/free-solid-svg-icons';
import { SortByPipe } from '@shared/pipes/sort-by.pipe';
import { element } from 'protractor';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import * as _ from 'lodash';
import { StudentService } from '@modules/student/services/student.service';
import { UtilityService } from '@appcore/services/utility.service';
import { TranslationService } from '@appcore/services/translation.service';

@Component({
  selector: 'app-upcoming-assignment',
  templateUrl: './upcoming-assignment.component.html',
  styleUrls: ['./upcoming-assignment.component.scss']
})
export class UpcomingAssignmentComponent implements OnInit {
  PlusIcon = faPlus;
  SearchIcon = faSearch;
  Ingredients = faCartPlus;
  Instructions = faStickyNote;
  RightArrow = faChevronRight;
  check = faCheckCircle;
  SortByIcon = faSort;
  term = '';
  gridview = false;
  listview = false;


  date: Date = new Date();
  allPackages: any;
  classList: any;
  closeModal;
  assignmentId: any;
  cartHeader: any;
  assignmentTitle: any;
  reciepe_icon: any;
  defaultRecipeImg: any;
  assignmentLable = "assignments";
  viewFrom: any;
  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToasterService,
    private modalService: NgbModal,
    private sortBy: SortByPipe,

    private teacherService: TeacherService,
    private studentService: StudentService,
    private utilityService: UtilityService,
    private translate: TranslationService
  ) { }

  searchassignment: FormGroup;

  assignmentFilterTitle = 'All Assignments';
  assignmentFilterList = [];

  ViewTitle = 'Tile View';
  ViewIcon = faThLarge;
  ViewList = [];

  SortByTitle = 'Sort by';
  SortByList = [];

  UpcomngAssignmentList = [];
  assignmentList = [];

  assignmentListHeaders;

  ngOnInit(): void {
    this.getAssignmentList();
    console.log("assignment list", this.UpcomngAssignmentList);
    this.assignmentListHeaders = [
      { title: 'Id', data: 'id' },
      { title: 'Name', data: 'assignmentTitle' },
      { title: 'Date', data: 'assignmentStartDate' },
      { title: 'Duration', data: 'duration' }
    ];
    this.gridview = true;
    this.searchassignment = new FormGroup({
      search: new FormControl('', [Validators.required])
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
    this.SortByTitle = this.translate.getStringFromKey('table-search-filter-container.sort-by-list.sort-by'),
      this.SortByList = [
        {
          id: '1',
          menu: this.translate.getStringFromKey('table-search-filter-container.sort-by-list.sort-by-name'),
          link: '',
          icon: ''
        },
        {
          id: '2',
          menu: this.translate.getStringFromKey('table-search-filter-container.sort-by-list.sort-by-duration'),
          link: '',
          icon: ''
        }
      ];

    this.assignmentFilterTitle = this.translate.getStringFromKey('teacher.assignment.all-assignment');
    this.assignmentFilterList = [
      {
        id: '1',
        menu: this.translate.getStringFromKey('teacher.assignment.upcoming-assignment'),
        link: '',
        icon: ''
      },
      {
        id: '2',
        menu: this.translate.getStringFromKey('teacher.assignment.completed-assignment'),
        link: '',
        icon: ''
      },
      {
        id: '3',
        menu: this.translate.getStringFromKey('teacher.assignment.ongoing-assignment'),
        link: '',
        icon: ''
      },
      {
        id: '4',
        menu: this.translate.getStringFromKey('teacher.assignment.all-assignment'),
        link: '',
        icon: ''
      }
    ];
  }



  getAssignmentList() {
    this.teacherService.getCurrentAssignmentList(this.teacherService.getSelectedClassId()).subscribe((response) => {
      this.UpcomngAssignmentList = response.data.rows;
      this.getClassList();

      this.UpcomngAssignmentList.forEach(element => {
        let currentDate = new Date();
        element.assignmentStartDate = this.utilityService.LessonformatDate(element.startDate);
        element.duration = element.recipe.estimatedMakeTime;
        element.startDate = new Date(element.startDate);
        element.endDate = new Date(element.endDate);
        if (element.startDate.getTime() > currentDate.getTime()) {
          let days = Math.abs((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(element.startDate.getFullYear(), element.startDate.getMonth(), element.startDate.getDate())) / (1000 * 60 * 60 * 24));
          element.cartHeader = `Start In  ${days} Days`;
          element.assignmentStatus = 'UpComing';
          element.reportBtn = false;
        } else if ((element.endDate.getTime() > currentDate.getTime()) && (currentDate.getTime() > element.startDate.getTime())) {
          element.cartHeader = `Started`;
          element.assignmentStatus = 'OnGoing';
          element.reportBtn = false;
        }
        else if ((currentDate.getTime() > element.endDate.getTime())) {
          element.cartHeader = `Completed`;
          element.assignmentStatus = 'Completed';
          element.reportBtn = true;
        }
      })
      this.assignmentList = [];
      this.assignmentList = _.cloneDeep(this.UpcomngAssignmentList);
    },
      (error) => {
        console.log(error);
      }
    )
  }

  getClassList() {
    this.teacherService.getClassesList().subscribe(
      (res) => {
        if (res) {
          if (_.isArray(res.data.rows)) {
            this.allPackages = res.data.rows;
          } else {
            this.allPackages = [res.data.rows];
          }
          this.classList = _.map(this.allPackages, item => {
            let obj = {
              id: item.id,
              menu: item.title
            }
            return obj;
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  calculateDiff(startDate) {
    let currentDate = new Date();
    startDate = new Date(startDate);
    if (startDate.getTime() > currentDate.getTime()) {
      let days = Math.abs((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())) / (1000 * 60 * 60 * 24));
      this.cartHeader = `Start In  ${days} Days`;
    } else {
      this.cartHeader = `Started`;
    }
  }

  editCustmisation(data) {

    let currentDate = new Date();
    let lessonStartDate = new Date(data.startDate);
    if (lessonStartDate.getTime() > currentDate.getTime()) {
      data["type"] = "edit";
      data["classList"] = this.classList;
      data["bookmark"] = data.lesson.bookmarkLesson;
      data["activities"] = data.customSetting.content;
      data["grade"] = data.lesson.grade;
      let totalTimes = data.customSetting.content.map(elem => elem.status ? elem.time : 0).reduce((a, b) => a + b);
      data["estimatedTotalTime"] = totalTimes;
      this.teacherService.setLessonData(data);
      this.router.navigate(['/teacher/explore-lessons-setting', data.id]);
    } else {
      this.toast.showToast('Lesson already started, edit lesson not allowed', '', 'error');
    }



  }

  assignmentReport(item) {
    console.log("item", item);
    this.router.navigate(['teacher/roster-assignment-details', item.id]);
  }

  archiveAssignememt(item) {
    this.teacherService.archiveAssignmentLesson(item.id).subscribe(
      (data) => {
        this.toast.showToast('Class Archived Successful', '', 'success');
      },
      (error) => {
        this.toast.showToast(error, '', '');
      }
    );
  }
  openInstruction(item) {
    this.teacherService.setLessonData(item);
    this.router.navigate(['/teacher/teacher-instructions']);
  }

  openIngredients(item) {
    console.log("item", item);
    this.teacherService.setAssignmentId(item.id);
    this.router.navigate(['/teacher/order-ingredients']);
  }

  openDeleteModel(content, item) {
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
    this.assignmentId = item.id;
  }

  deleteCurrentAssignment(id) {
    this.teacherService.removeAssignment(id).subscribe((data: any) => {
      this.toast.showToast('Assignment Deleted Successful', '', 'success');
      this.closeOpenModal();
      this.getAssignmentList();
    },
      (error) => {
        this.toast.showToast(error.error.message, '', 'error');
      });
  }

  closeOpenModal() {
    this.closeModal.close();
  }


  startAssignment(id): void {
    this.viewFrom = "View";
    this.teacherService.setViewFrom(this.viewFrom);
    localStorage.setItem('assignmentId', id);
    this.studentService.getAssignedLessonById(parseInt(id)).subscribe(
      (response) => {
        if (response && response.data) {
          this.teacherService.setAssignLessonData(response.data);
          this.assignmentTitle = response.data.assignmentTitle;
          this.reciepe_icon = response.data.recipe.recipeImage ? response.data.recipe.recipeImage : this.defaultRecipeImg;
          if (response.data.customSetting && response.data.customSetting.content) {
            for (let ob of response.data.customSetting.content) {
              if (ob.title === 'Story' && ob.status === true) {
                this.router.navigate(['/teacher/learning-objective']);
                break;
              }
              else {
                this.router.navigate(['/teacher/safety-hygiene']);
              }
            }
          }
        }
      },
      (error) => {
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  sortData(event) {

    if (event.menu === 'Sort by Name') {
      this.UpcomngAssignmentList = this.sortBy.transform(this.UpcomngAssignmentList, 'asc', 'assignmentTitle');
    } else if (event.menu === 'Sort by Duration') {
      this.UpcomngAssignmentList = this.sortBy.transform(this.UpcomngAssignmentList, 'asc', 'duration');
    } else if (event.menu === 'Completed Assignments') {
      this.assignmentFilterTitle = event.menu;
      this.UpcomngAssignmentList = this.assignmentList.filter((ele) => ele.assignmentStatus === 'Completed');
      this.assignmentLable = "completed assignments";
    } else if (event.menu === 'Upcoming Assignments') {
      this.assignmentFilterTitle = event.menu;
      this.UpcomngAssignmentList = this.assignmentList.filter((ele) => ele.assignmentStatus === 'UpComing');
      this.assignmentLable = "upcoming assignments";
    } else if (event.menu === 'All Assignments') {
      this.assignmentFilterTitle = event.menu;
      this.UpcomngAssignmentList = this.assignmentList;
      this.assignmentLable = "assignments";
    } else if (event.menu === 'Ongoing Assignments') {
      this.assignmentFilterTitle = event.menu;
      this.UpcomngAssignmentList = this.assignmentList.filter((ele) => ele.assignmentStatus === 'OnGoing');
      this.assignmentLable = "ongoing assignments";
    }
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

  assignLesson() {
    this.router.navigate(['teacher/explore-lessons-list']);
  }
}
