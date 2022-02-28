import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-cooking-preparation',
  templateUrl: './cooking-preparation.component.html',
  styleUrls: ['./cooking-preparation.component.scss']
})
export class CookingPreparationComponent implements OnInit,OnDestroy {

  lessonHederConfig = {};
  recipesPreparationList: any;
  assignmentList: any;
  assignmentId: string;
  sessionData: any;
  lessonData : any;
  defaultLessonImage: string;
  viewFrom :any;
  content:any;
  isCooking = false;
  constructor(private router: Router,private toast:ToasterService,
    private studentService: StudentService, private utilityService: UtilityService,
    private teacherService:TeacherService) {
    this.lessonHederConfig['stepBoard'] = {
      stepNumber: 'Step 4',
      stepTitle: 'Cooking Preparation',
      stepLogo: './assets/images/knife.png'
    };
    this.defaultLessonImage = './assets/images/default-lesson.png';
   }


  ngOnInit(): void {
    this.teacherService.setTeachersHeader(true);
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId')
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.viewFrom = this.teacherService.getViewFrom();
    this.lessonData = this.teacherService.getAssignLessonData();
    if (this.viewFrom === "View") {
      this.content = this.lessonData.customSetting.content;
    } else {
      this.content = this.lessonData.activities;
    }
    this.recipesPreparationList = _.map(this.lessonData.recipe.preparationSteps, item => {
      let obj = {
        id: item.id,
        info: item.text,
        image: item.image ? item.image : this.defaultLessonImage,
        isBigChef: item.isApplicableForBigChef === true ? './assets/images/profile-icon-2.png' : undefined,
        isLittleChef: item.isApplicableForLittleChef === true ? './assets/images/profile-icon-2.png' : undefined,
      }
      return obj;
    });
 
  }
  ngOnDestroy(){
    this.teacherService.setTeachersHeader(false);
  }

 

  onPrevious(): void {
    if (this.content) {
      for (let ob of this.content) {
        if (ob.title === 'Cooking' && ob.status === true) {
          this.isCooking = true;
        }
        else if (ob.title != 'Story' && this.isCooking) {
          this.router.navigate(['teacher/ingredient-list']);
          break;
        }
      }
    } else {
      this.router.navigate(['teacher/ingredient-list']);
    }
  }

  onNext(): void {
    if (this.content) {
      for (let ob of this.content) {
        let isCulinary = _.find(ob.cooking, function (item) { return item.culinaryTechniqueTitle === 'Culinary Technique'; });
        if (isCulinary && isCulinary.status === true) {
          this.router.navigate(['/teacher/cooking-technique']);
          break;
        } else {
          this.router.navigate(['/teacher/cooking-steps']);
        }
      }
    } else  {
      this.router.navigate(['/teacher/cooking-technique']);
    }
  }
}
