import { Component, OnInit, Input,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import * as _ from 'lodash';
 
@Component({
  selector: 'app-serving',
  templateUrl: './serving.component.html',
  styleUrls: ['./serving.component.scss']
})
export class ServingComponent implements OnInit,OnDestroy {

  lessonHederConfig = {};
  assignmentId: string;
  sessionData: any;
  assignmentData: any;
  servingData: any;
  isLoad = false;
  slideConfig: any;
  recipeImg: string;
  defaultRecipeImg: string;
  lessonData : any;
  viewFrom :any;
  content :any;
  constructor(private router: Router, private toast: ToasterService,
     private studentService: StudentService, private utilityService: UtilityService,
     private teacherService : TeacherService) {
    this.defaultRecipeImg = './assets/images/nsima-bent-icon.png';
    this.lessonHederConfig['stepBoard'] = {
      stepNumber: 'Step 8',
      stepTitle: 'Serving',
      stepLogo: './assets/images/plate-icon.png'
    }
  }

  ngOnInit(): void {
    this.teacherService.setTeachersHeader(true);
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId')
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.lessonData = this.teacherService.getAssignLessonData();
    this.viewFrom = this.teacherService.getViewFrom();
    if(this.viewFrom == "View"){
      this.content = this.lessonData.customSetting.content;
    }else{
      this.content = this.lessonData.activities;
    }
    this.getServingData(this.lessonData);
    // this.updateLessonProgress();

  }
  ngOnDestroy(){
    this.teacherService.setTeachersHeader(false);
  }

  getServingData(data) {
   
          this.recipeImg = data.recipe.recipeImage ? data.recipe.recipeImage : this.defaultRecipeImg;
          // this.servingData = _.map(data.recipe.servingSteps, item => {
          //   let obj = {
          //     id: item.id,
          //     text: item.text ? item.text : undefined,
          //     image: item.image ? item.image : undefined
          //   }
          //   return obj;
          // });

          this.servingData = data.recipe.servingSteps[0].text ? data.recipe.servingSteps[0].text.match(/.{1,154}(\s|$)/g) : undefined;
          this.getSlideConfig();
       
  }

  getSlideConfig(): void {
    this.slideConfig = {
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow: false,
      nextArrow: false,
      // nextArrow: '<div class=\'nav-btn next-slide\'>>></div>',
      // prevArrow: '<div class=\'nav-btn prev-slide\'><<</div>',
      dots: true,
      infinite: false,
    };
    this.isLoad = true;
  }

  showFunActivity(): void {
    //this.router.navigate(['student/fun-activity']);
  }

  onPrevious(): void {
    this.router.navigate(['teacher/cleaning']);
  }

  // onNext(): void {
  //   this.router.navigate(['teacher/assessment-question']);
  //   
  // }

  onNext(): void {
    if (this.content) {
      for (let ob of this.content) {
        if (ob.title === 'Assessments' && ob.status === true) {
          this.router.navigate(['/teacher/assessment-question']);
          break;
        } else if(ob.title === 'Assessments' && ob.status === false){
          this.router.navigate(['/teacher/linguistic-details']);
        }
      }
    } 
  }
}
