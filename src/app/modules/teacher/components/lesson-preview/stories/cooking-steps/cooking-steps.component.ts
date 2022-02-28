import { Component, OnInit, HostListener, Renderer2, Input,OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-cooking-steps',
  templateUrl: './cooking-steps.component.html',
  styleUrls: ['./cooking-steps.component.scss']
})
export class CookingStepsComponent implements OnInit,OnDestroy {

  lessonHederConfig = {};
  scrollTop = 0;
  isChecked: boolean;
  cookingSteps: any;
  assignmentList: any;
  assignmentId: string;
  sessionData: any;
  isVisibleNext: boolean;
  lessonData :any;
  defaultLessonImage: string;
  viewFrom :any;
  content:any;
  isCooking = false;
  constructor(private router: Router, private sanitizer: DomSanitizer, 
    private toast: ToasterService, private activatedRoute: ActivatedRoute, 
    private studentService: StudentService, private utilityService: UtilityService,
    private teacherService : TeacherService) {
    this.lessonHederConfig['stepBoard'] = {
      stepNumber: 'Step 6',
      stepTitle: 'Cooking Steps',
      stepLogo: './assets/images/knife.png'
    };
    this.defaultLessonImage = './assets/images/default-lesson.png';
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.isVisibleNext = false;
    }
  }

  ngOnInit(): void {
    this.teacherService.setTeachersHeader(true);
    window.scroll(0, 0);
    this.isVisibleNext = true;
    this.assignmentId = localStorage.getItem('assignmentId')
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.viewFrom = this.teacherService.getViewFrom();
    this.lessonData = this.teacherService.getAssignLessonData();
    if(this.viewFrom === "View"){
      this.content = this.lessonData.customSetting.content;
    }else {
      this.content = this.lessonData.activities;
    }
    let cnt = 1;
    this.cookingSteps = _.map(this.lessonData.recipe.cookingSteps, item => {
      let obj = {
        id: cnt,
        info: item.text,
        image: item.image ? item.image : this.defaultLessonImage,
        video: item.link,
        isBigChef: item.isApplicableForBigChef === true ? './assets/images/profile-icon-2.png' : undefined,
        isLittleChef: item.isApplicableForLittleChef === true ? './assets/images/profile-icon-2.png' : undefined,
      }
      cnt = cnt + 1;
      return obj;
    });
   
  }

  ngOnDestroy(){
    this.teacherService.setTeachersHeader(false);
  }
 

  

  getSanitizeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onPrevious(): void {
    if (this.content) {
      for (let ob of this.content) {
        let isCulinary = _.find(ob.cooking, function (item) { return item.culinaryTechniqueTitle === 'Culinary Technique'; });
        if (isCulinary && isCulinary.status === true) {
          this.router.navigate(['/teacher/cooking-technique']);
          break;
        } else if (!_.isEmpty(this.lessonData.recipe.preparationSteps)) {
          this.router.navigate(['/teacher/cooking-preparation']);
        } else {
          this.router.navigate(['teacher/ingredient-list']);
        }
      }
    } else  {
      this.router.navigate(['teacher/cooking-technique']);
    }
  }

  onNext(): void {
    if (this.content) {
      for (let ob of this.content) {
        if (ob.title === 'Cooking' && ob.status === true) {
          this.isCooking = true;
        } else if (ob.title === 'Learning Activities' && ob.status === true) {
          let isExperiment = _.find(ob.Activities, function (item) { return item.lable === 'Science Experiment'; });
          if (isExperiment && isExperiment.status === true) {
            this.router.navigate(['/teacher/experiment']);
            break;
          }
        } else if (ob.title != 'Story' && this.isCooking) {
          this.router.navigate(['/teacher/cleaning']);
          break;
        } else if (ob.title === 'Assessments' && ob.status === true) {
          this.router.navigate(['/teacher/assessment-question']);
          break;
        } else {
          this.router.navigate(['/teacher/action-activities']);
        }
      }
    } else {
      this.router.navigate(['/teacher/experiment']);
    }
  }
}

 