import { Component, OnInit, Input,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import {
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { StudentService } from '@modules/student/services/student.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-safety-hygiene',
  templateUrl: './safety-hygiene.component.html',
  styleUrls: ['./safety-hygiene.component.scss']
})
export class SafetyHygieneComponent implements OnInit,OnDestroy {

  lessonHederConfig = {};
  check = faCheck;
  index: number;
  selectedItem;
  isVisibleNext = true;
  assignmentId: string;
  sessionData: any;
  assignmentData: any;
  hygieneList = [];
  lessonData :any;

  isVisiblePrevious = true;
  showPrevious = true;
  viewFrom :any;
  content:any;
  constructor(private router: Router, private studentService: StudentService, 
    private toast: ToasterService, private utilityService: UtilityService,
    private teacherService:TeacherService) {
    this.lessonHederConfig['stepBoard'] = {
      stepNumber: 'Step 2',
      stepTitle: 'Safety and Hygiene',
      stepLogo: './assets/images/wash-your-hands.png'
    }
  }

  ngOnInit(): void {
    this.teacherService.setTeachersHeader(true);
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId')
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.viewFrom = this.teacherService.getViewFrom();
    this.lessonData = this.teacherService.getAssignLessonData();
    if(this.viewFrom === "View"){
      this.content = this.lessonData.customSetting.content;
    }else {
      this.content = this.lessonData.activities;
    }

    this.isVisiblePrevious = false;
    if (this.content) {
      for (let ob of this.content) {
        if (ob.title === 'Story' && ob.status === false) {
          this.showPrevious = false;
        }
      }
    }
    this.hygieneList = _.map(this.lessonData.lesson.safetySteps, item => {
      let obj = {
        id: item.id,
        desc: item.text ? item.text.replace(/&nbsp;|<[^>]+>/g, '') : undefined
        
      }
      return obj;
    });
  }
  
  ngOnDestroy(){
    this.teacherService.setTeachersHeader(false);
  }

  onItemChange(item: any): void {
    if (item) {
      this.isVisibleNext = false;
    }
  }

  // onPrevious(): void {
  //   this.router.navigate(['teacher/conversional-sentence']);
  // }

  // onPrevious(): void {
  //   if (this.content) {
  //     for (let ob of this.content) {
  //       if (ob.title === 'Story' && ob.status === true) {
  //         this.router.navigate(['/teacher/conversional-sentence']);
  //       } else if(this.viewFrom === "Setting"){
  //         this.router.navigate(['/teacher/explore-lessons-setting', this.lessonData.lesson.id]);
  //         // this.router.navigate(['/teacher/upcoming']);
  //       }else{
  //         this.router.navigate(['/teacher/upcoming-assignment']);
  //       }
  //     }
  //   } 
  //   // else if (this.lesson === 'Explore') {
  //   //   this.router.navigate(['/student/conversional-sentence']);
  //   // }
  // }

  onPrevious(): void {
    if (this.content) {
      for (let ob of this.content) {
        if (ob.title === 'Story' && ob.status === true) {
          this.router.navigate(['/teacher/conversional-sentence']);
          break;
        }else if(ob.title === 'Story' && ob.status === false && this.viewFrom === "Setting"){
          this.router.navigate(['/teacher/explore-lessons-setting', this.lessonData.lesson.id]);
          break;
        }else if(ob.title === 'Story' && ob.status === false && this.viewFrom === "View"){
          this.router.navigate(['/teacher/upcoming-assignment']);
          break;
        }
      }
    } 
    // else if (this.lesson === 'Explore') {
    //   this.router.navigate(['/student/conversional-sentence']);
    // }
  }

  onNext(): void {
    this.router.navigate(['teacher/ingredient-list']);
  }

}
