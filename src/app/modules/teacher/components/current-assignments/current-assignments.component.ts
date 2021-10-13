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
  faSort,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faChevronLeft,
  faStar,
  faBookmark
} from '@fortawesome/free-solid-svg-icons';
import { SortByPipe } from '@shared/pipes/sort-by.pipe';
import { element } from 'protractor';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';

@Component({
  selector: 'app-current-assignments',
  templateUrl: './current-assignments.component.html',
  styleUrls: ['./current-assignments.component.scss']
})
export class CurrentAssignmentsComponent implements OnInit {
  LeftArrow = faAngleDoubleLeft;
  rightArrow = faAngleDoubleRight;
  PlusIcon = faPlus;
  SearchIcon = faSearch;
  Ingredients = faCartPlus;
  Instructions = faStickyNote;
  RightArrow = faChevronRight;
  leftArrow = faChevronLeft;
  check = faCheckCircle;
  SortByIcon = faSort;
  Star = faStar;
  BookmarkIcon = faBookmark;
  term: string;
  gridview = false;
  listview = false;
  slideConfig: any;
  date: Date = new Date();
  allPackages: any;
  classList: any;
  closeModal;
  assignmentId: any;
  cartHeader :any;
  assignmentTitle: any;
  reciepe_icon: any;
  defaultRecipeImg: any;
  constructor(
    private router: Router,
    private teacherService: TeacherService,
    private authService: AuthService,
    private toast: ToasterService,
    private modalService: NgbModal,
    private sortBy: SortByPipe,
    private utilityService: UtilityService,
    private studentService : StudentService

  ) { }

  UpcomngAssignmentList = [];

  ActivityAssignmentList = [
    {
      Id: '1',
      name: 'Classic Waffles',
      startdate: '04/09/2020',
      duration: '45',
      image: './assets/images/assignment-image.jpg',
      status: 'upcomingAssignment',
      type: 'assignmentList'
    },
    {
      Id: '2',
      name: 'Skillet Potato Scones',
      startdate: '04/02/2020',
      duration: '60',
      image: './assets/images/assignment-image.jpg',
      status: 'upcomingAssignment',
      type: 'assignmentList'
    },
    {
      Id: '3',
      name: 'Skillet Potato Scones',
      startdate: '19/03/2020',
      duration: '55',
      image: './assets/images/assignment-image.jpg',
      status: 'upcomingAssignment',
      type: 'assignmentList'
    },
    {
      Id: '4',
      name: 'Skillet Potato Scones',
      startdate: '03/12/2020',
      duration: '60',
      image: './assets/images/assignment-image.jpg',
      status: 'completedAssignment',
      type: 'assignmentList'
    },
    {
      Id: '5',
      name: 'Skillet Potato Scones',
      startdate: '03/05/2020',
      duration: '45',
      image: './assets/images/assignment-image.jpg',
      status: 'completedAssignment',
      type: 'assignmentList'
    },
    {
      Id: '6',
      name: 'Skillet Potato Scones',
      startdate: '27/02/2020',
      duration: '45',
      image: './assets/images/assignment-image.jpg',
      status: 'completedAssignment',
      type: 'assignmentList'
    }
  ];


  ngOnInit(): void {
    this.getAssignmentList();
  }

 getAssignmentList(){
  this.teacherService.getCurrentAssignmentList(this.teacherService.getSelectedClassId()).subscribe((response) => {
    this.UpcomngAssignmentList = response.data.rows;
    console.log("list", this.UpcomngAssignmentList)
    this.getSlideConfig();
    this.getClassList();

    this.UpcomngAssignmentList.forEach(element =>{
      let currentDate = new Date();
      element.startDate = new Date(element.startDate);
      if (element.startDate.getTime() > currentDate.getTime()) {
        let days = Math.abs((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(element.startDate.getFullYear(), element.startDate.getMonth(), element.startDate.getDate())) / (1000 * 60 * 60 * 24));
        element.cartHeader = `Start In ${days} Days`;
      }else
      {
        element.cartHeader = `Started`;
      }
    })
    // this.calculateDiff(this.UpcomngAssignmentList.

  },
    (error) => {
      console.log(error);
    }
  )
 }

  getSlideConfig() {
    this.slideConfig = {
      slidesToShow: this.UpcomngAssignmentList.length >= 3 ? 3 : this.UpcomngAssignmentList.length,
      // slidesToShow: 2,

      slidesToScroll: 1,
      nextArrow: '<div class=\'nav-btn plan-next-slide\'></div>',
      prevArrow: '<div class=\'nav-btn plan-prev-slide\'></div>',
      dots: false,
      infinite: false,
      responsive: [
        {
          breakpoint: 991,
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
  };

  calculateDiff(startDate) {
    let currentDate = new Date();
    startDate = new Date(startDate);
    if (startDate.getTime() > currentDate.getTime()) {
      let days = Math.abs((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())) / (1000 * 60 * 60 * 24));
      this.cartHeader = `Start In ${days} Days`;
    }else
    {
      this.cartHeader = `Started`;
    }
    }

  // calculateDiff(startDate) {
  //   let currentDate = new Date();
  //   startDate = new Date(startDate);
  //   return Math.abs((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())) / (1000 * 60 * 60 * 24));
  // }

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
      console.log("lesson already start")
      this.toast.showToast('Lesson already started, edit lesson not allowed', '', 'error');
    }



  }
  openInstruction(item) {
    this.teacherService.setLessonData(item);
    this.router.navigate(['/teacher/teacher-instructions']);
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

  openDeleteModel(content, item) {
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
   console.log("item", item)
    this.assignmentId = item.id;
  }

  deleteCurrentAssignment(id) {
    console.log("id", id)
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
    localStorage.setItem('assignmentId', id);
    this.studentService.getAssignedLessonById(parseInt(id)).subscribe(
      (response) => {
        // console.log("assignment response", response)
        if (response && response.data) {
          this.teacherService.setAssignLessonData(response.data);
          this.assignmentTitle = response.data.assignmentTitle;
          this.reciepe_icon = response.data.recipe.recipeImage ? response.data.recipe.recipeImage : this.defaultRecipeImg;
          if (response.data.customSetting && response.data.customSetting.content) {
            for (let ob of response.data.customSetting.content) 
            {
              if (ob.title === 'Story' && ob.status === true) {
                this.router.navigate(['/teacher/learning-objective']);
                break;
              } 
              else{
                this.router.navigate(['/teacher/safety-hygiene']);
              }
            }
          }
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

}
