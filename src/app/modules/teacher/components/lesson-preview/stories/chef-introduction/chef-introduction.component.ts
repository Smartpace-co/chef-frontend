import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-chef-introduction',
  templateUrl: './chef-introduction.component.html',
  styleUrls: ['./chef-introduction.component.scss']
})
export class ChefIntroductionComponent implements OnInit,OnDestroy {
  lessonHederConfig = {};
  assignmentId: string;
  isLoad = false;
  lessonData:any;
  chefIntro = []; 
  countryBgImg;
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: '<div class=\'nav-btn next-slide\'></div>',
    prevArrow: '<div class=\'nav-btn prev-slide\'></div>',
    dots: true,
    infinite: false,
  };
  constructor(private router: Router, private utilityService: UtilityService, 
    private toast: ToasterService, private teacherService : TeacherService) { 
    this.lessonHederConfig['stepBoard'] = null;
  }

  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId');
    this.lessonData = this.teacherService.getAssignLessonData();
    this.chefIntro = _.map(this.lessonData.lesson.chefIntroductions, item => {
      let obj = {
        id: item.id,
        text: item.text ? item.text.replace(/&nbsp;|<[^>]+>/g, '') : undefined
      }
      return obj;
    });
    // this.countryBgImg = this.lessonData.recipe.country.backgroundImage;
    this.isLoad = true;
    this.teacherService.setTeachersHeader(true);
  }

  ngOnDestroy(){
    this.teacherService.setTeachersHeader(false);
  }

  onNext(): void {
    this.router.navigate(['teacher/recipe-fact']);
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.router.navigate(['teacher/greeting']);
  }
}
