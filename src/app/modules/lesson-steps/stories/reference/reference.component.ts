import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { StudentService } from '@modules/student/services/student.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import {
  faChevronRight, 
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.scss']
})
export class ReferenceComponent implements OnInit {
  lesson;
  showNext = false;
  assignmentId;
  referenceLinks = [];
  gradeId;
  lessonTime=null;
  regionCountry = null;
  RightArrow = faChevronRight;

  closeModal;
  recipesList = [];
  selectedRecipe;
  selectedCountry: string;
  isSelectedCountry = false;
  public countryCollapsed = false;
  suggestedForYouList = [];
  defaultRecipeImg;

  
  constructor(private modalService: NgbModal, private toast: ToasterService, private router: Router, private studentService: StudentService,private authService: AuthService,) { 
    this.authService.setuserlang();
  }

  ngOnInit(): void {
    this.lesson = localStorage.getItem('lessonType');
    this.assignmentId = localStorage.getItem('assignmentId');
    this.getStudentData();
    //this.getRecipeListBySuggested(this.regionCountry, parseInt(this.gradeId));
  }

  open(content, item) {
    this.selectedRecipe = item;
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  getRecipeListBySuggested(country?: string, gradeId?: number,lessonTime?: number, lessonType?: boolean): void {
    this.isSelectedCountry = true;
    this.countryCollapsed = false;
    var lngKey= sessionStorage.getItem('userlanguage');
    this.studentService.getSuggestedForYouLessonList(country, gradeId, lessonTime, lessonType, lngKey)
      .subscribe((res) => {
        if (res && res.data&& res.data.rows ) {
          this.suggestedForYouList =  _.map(res.data.rows, item => {
            let obj = {
              id: item.id,
              menu: item.recipeTitle,
              image: item.recipeImage ? item.recipeImage : this.defaultRecipeImg,
              duration: item.lesson.lessonTime,
              isCountryBgImg: item.country && item.country.backgroundImage ? true : false,
              gradeId:item.lesson.grade.grade
            }
            return obj;
          }); 
          //this.recipeData=this.recipesList;
        }
      },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
  }


  selfAssignLesson(item: any): void {
    this.studentService.selfAssignLesson(item.id).subscribe(
      (response: any) => {
        if (response && response.data) {
          this.startAssignment(response.data, item);
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  startAssignment(data: any, recipe: any) {
    this.modalService.dismissAll();
    localStorage.setItem('assignmentId', data.id);
    localStorage.setItem('lessonId', data.lessonId);
    localStorage.setItem('lessonType', 'Explore');
    let todayDate = new Date();
    let submission = {
      assignLessonId: data.id,
      startedAt: todayDate
    }
    this.studentService.startLessonProgress(submission).subscribe(
      (response: any) => {
        if (response && response.data) {
          window.sessionStorage.setItem('previousDate', JSON.stringify(new Date()));
          if (recipe && recipe.isCountryBgImg) {
            this.router.navigate(['/student/country-image']);
          } else {
            this.router.navigate(['/student/learning-objective']);
          }
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }



  getStudentData() {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data && response.data.lesson) {
          this.referenceLinks = response.data.lesson.links;
          this.gradeId = response.data?.lesson?.gradeId ?? null;
          this.regionCountry = response.data?.recipe?.country?.countryName ?? null;
          this.lessonTime = response.data?.lesson?.lessonTime ?? null;
          this.getRecipeListBySuggested(this.regionCountry, parseInt(this.gradeId), parseInt(this.lessonTime));
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  goToAssignedLessonList(): void {
    if (this.lesson === 'Explore') {
      this.router.navigate(['/student/explore-lesson']);
    } else {
      this.router.navigate(['/student/assignment']);
    }
  }
}
