import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-sensory-exercise',
  templateUrl: './sensory-exercise.component.html',
  styleUrls: ['./sensory-exercise.component.scss']
})
export class SensoryExerciseComponent implements OnInit,OnDestroy {

  descriptiveAnswer;
  lessonHederConfig = {};
  currentAssignedLesson;
  assignmentId: string;
  isVisibleNext = true;
  questionData;
  lessonData:any;
  viewFrom :any;
  content:any;
  constructor(private router: Router, private utilityService: UtilityService, 
    private studentService: StudentService, private toast: ToasterService,
    private teacherService: TeacherService) {
    this.lessonHederConfig['stepBoard'] = {
      // stepNumber: 'Step 3',
      stepTitle: 'Sensory Exercise',
      stepLogo: './assets/images/bulb.png'
    }
  }

  ngOnInit(): void {
    this.teacherService.setTeachersHeader(true);
    this.assignmentId = localStorage.getItem('assignmentId');
    // let previousTime = this.utilityService.calculateTimeBetweenDates();
    this.viewFrom = this.teacherService.getViewFrom();
    this.lessonData = this.teacherService.getAssignLessonData();
    this.currentAssignedLesson = this.lessonData;
    if(this.viewFrom === "View"){
      this.content = this.currentAssignedLesson.customSetting.content;
    }else {
      this.content = this.currentAssignedLesson.activities;
    }
    this.questionData = this.lessonData.lesson.multiSensoryQuestions;
    
  }
  ngOnDestroy(){
    this.teacherService.setTeachersHeader(false);
  }



  /**
   * To get entered text from textarea field.
   * @param data 
   */
  onInputValueChange(data) {
    this.descriptiveAnswer = data;
  }


  onPrevious(): void {
    if (this.content) {
      for (let ob of this.content) {
        if (ob.title === 'Cooking' && ob.status === true) {
          this.router.navigate(['/teacher/ingredient-list']);
          break;
        } else if (ob.title === 'Story' && ob.status === true) {
          this.router.navigate(['/teacher/conversional-sentence'])
        }
      }
    } else{
      this.router.navigate(['/teacher/ingredient-list']);
    }
  }

  /**
   * on click of next
   */
  onNext(): void {
    if (this.content) {
      for (let ob of this.content) {
        if (ob.title === 'Cooking' && ob.status === true) {
          if (!_.isEmpty(this.currentAssignedLesson.recipe.preparationSteps)) {
            this.router.navigate(['/teacher/cooking-preparation']);
          } else {
            this.router.navigate(['/teacher/cooking-technique']);
          }
          break;
        }
      }
    } else{
      if (!_.isEmpty(this.currentAssignedLesson.recipe.preparationSteps)) {
        this.router.navigate(['/teacher/cooking-preparation']);
      } else {
        this.router.navigate(['/teacher/cooking-technique']);
      }
    }
  }
}

