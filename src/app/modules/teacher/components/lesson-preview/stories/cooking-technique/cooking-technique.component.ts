import { Component, OnInit, Input,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import * as _ from 'lodash';
import { ToasterService } from '@appcore/services/toaster.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';
@Component({
  selector: 'app-cooking-technique',
  templateUrl: './cooking-technique.component.html',
  styleUrls: ['./cooking-technique.component.scss']
})
export class CookingTechniqueComponent implements OnInit,OnDestroy {

  index: number;
  lessonHederConfig = {};
  activatedRoute: any;
  cookingTechnique: any;
  assignmentList: any;
  assignmentId: string;
  sessionData: any;
  cookingTechniqueList = [];
  videoUrl: string;
  isLoad = false;
  lessonData :any;
  constructor(private router: Router, private toast: ToasterService, 
    private sanitizer: DomSanitizer, private studentService: StudentService, 
    private utilityService: UtilityService,
    private teacherService : TeacherService) {
    this.lessonHederConfig['stepBoard'] = {
      stepNumber: 'Step 5',
      stepTitle: 'Cooking Technique',
      stepLogo: './assets/images/culinary-icon.png'
    }
  }

  ngOnInit(): void {
    this.teacherService.setTeachersHeader(true);
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId')
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.lessonData = this.teacherService.getAssignLessonData();
    if (this.lessonData.recipe.recipeTechniques[0].dialogue) {
      // let stringDialogue = response.data.recipe.recipeTechniques[0].dialogue.replace(/<[^>]+>/g, '');
      this.cookingTechniqueList.push(this.lessonData.recipe.recipeTechniques[0].dialogue);// stringDialogue.match(/.{1,220}/g);
    }
    if (this.lessonData.recipe.recipeTechniques[0].animationLink) {
      this.videoUrl = this.lessonData.recipe.recipeTechniques[0].animationLink;
      this.isLoad = true;
    }
  }

  ngOnDestroy(){
    this.teacherService.setTeachersHeader(false);
  }
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: '<div class=\'nav-btn next-slide\'></div>',
    prevArrow: '<div class=\'nav-btn prev-slide\'></div>',
    dots: true,
    infinite: false,
  };


  onPrevious(): void {
    if (this.lessonData) {
      if (!_.isEmpty(this.lessonData.recipe.preparationSteps))
        this.router.navigate(['teacher/cooking-preparation']);
    } else {
      this.router.navigate(['teacher/ingredient-list']);
    }
  }
  onNext(): void {
    this.router.navigate(['teacher/cooking-steps']);
  }

  getSanitizeUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
  }
}

