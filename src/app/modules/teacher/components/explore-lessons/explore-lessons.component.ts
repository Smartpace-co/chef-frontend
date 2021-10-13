import { Component, OnInit } from '@angular/core';
import { faSearch, faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { ClassesService } from '@modules/teacher/services/classes.service';
import { UtilityService } from '@appcore/services/utility.service';
import {TeacherService} from '@modules/teacher/services/teacher.service'

@Component({
  selector: 'app-explore-lessons',
  templateUrl: './explore-lessons.component.html',
  styleUrls: ['./explore-lessons.component.scss']
})
export class ExploreLessonsComponent implements OnInit {
  SearchIcon = faSearch;
  FilterArrow = faAngleDoubleLeft;
  term: string;
  localData: any;
  featuredList = [];
  topRated = [];
  featureSubject = [];
  recommended = []

  lessonId:any;

  /**
   * slick-carousel Config
   */
  slideConfig = {
  //  slidesToShow: this.featuredList.length >= 3 ? 3 : this.featuredList.length,
     slidesToShow : 3,
    slidesToScroll: 1,
    nextArrow: '<div class=\'nav-btn next-slide\'></div>',
    prevArrow: '<div class=\'nav-btn prev-slide\'></div>',
    dots: false,
    infinite: false,
    responsive: [
      {
        breakpoint: 1023,
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

    /**
   * slick-carousel Config for featureSubject
   */
     slideConfigfeaturedSubject = {
      slidesToShow: this.featureSubject.length >= 3 ? 3 : this.featureSubject.length,
      slidesToScroll: 1,
      nextArrow: '<div class=\'nav-btn next-slide\'></div>',
      prevArrow: '<div class=\'nav-btn prev-slide\'></div>',
      dots: false,
      infinite: false,
      responsive: [
        {
          breakpoint: 1023,
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
  
  classApplied = true;

  constructor(
    private router: Router,
    private classService: ClassesService,
    private utilityService: UtilityService,
    private teacherService : TeacherService
  ) { }

  ngOnInit(): void {
    this.localData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    // this.getlessonsData()
  }

  /**
   * get lessons data
   */
  // getlessonsData() {
  //   this.classService.getData().subscribe((response: []) => {
  //     response.forEach((element: any) => {
  //       // if (this.utilityService.strictCompare(element.email, this.localData.email)) {
  //         this.featuredList = element.exploreLessonList.featuredList;
  //         this.topRated = element.exploreLessonList.topRated;
  //         this.featureSubject = element.exploreLessonList.featureSubject;
  //         this.recommended = element.exploreLessonList.recommended;
  //       // }
  //     });
  //   });
  // }

  // getlessonsData(): void {
  //   this.teacherService.getAllLessons().subscribe(
  //     (response) => {
  //       if (response && response.data) {
  //         console.log("res", response.data)
  //          this.featuredList = response.data.featuredList;
  //          this.featureSubject = response.data.featureSubject;
  //          this.recommended = response.data.recommended;
  //          this.topRated = response.data.topRated;
  //          console.log("featuredSubject", this.featureSubject)
  //       }
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }
 

 

  /**
   * sidebar toggle
   */

  toggleClass() {
    this.classApplied = !this.classApplied;
  }
  /**
   * Navigate to explore lessons page
   */
  exploreLessonList(id:any) {

    console.log("id", id);
    this.teacherService.setLessonId(id);
    this.router.navigate(['/teacher/explore-lessons-list']);
  }
}
