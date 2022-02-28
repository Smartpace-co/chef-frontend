import { Component, Input, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-conversational-sentence',
  templateUrl: './conversational-sentence.component.html',
  styleUrls: ['./conversational-sentence.component.scss']
})
export class ConversationalSentenceComponent implements OnInit,OnDestroy{

  lessonHederConfig = {}; 
  isVisibleNext = false;
  assignmentId: any;
  conversationText: string;
  lessonData:any;
  viewFrom :any
  content :any;
  isLoad=false;
  countryBgImg;
  constructor(private toast: ToasterService, private router: Router, 
    private studentService: StudentService,
    private teacherService : TeacherService) {
    this.lessonHederConfig['stepBoard'] = null;
  }

  ngOnInit(): void {
    this.teacherService.setTeachersHeader(true);
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId')
    this.lessonData = this.teacherService.getAssignLessonData();
    this.viewFrom = this.teacherService.getViewFrom();
    if(this.viewFrom == "View"){
      this.conversationText = this.lessonData.conversationSentence.conversationSentence ? this.lessonData.conversationSentence.conversationSentence : undefined;
      this.content = this.lessonData.customSetting.content;
    }else{
      this.conversationText = this.lessonData.lesson.conversationSentence.conversationSentence ? this.lessonData.lesson.conversationSentence.conversationSentence : undefined;
      this.content = this.lessonData.activities;
    }
    if (!this.conversationText) {
      this.toast.showToast('There is no conversation sentence.', '', 'warning');
    }
    this.countryBgImg = this.lessonData.recipe.country.backgroundImage;
    this.isLoad = true;
     this.isVisibleNext = false;
  }

  ngOnDestroy(){
    this.teacherService.setTeachersHeader(false);
  }
  onFirstPage(): void {
    this.router.navigate(['teacher/learning-objective']);
  }

  /**
  * on Next click event
 */
  // onNext(): void {
  //   this.router.navigate(['teacher/safety-hygiene']);
  // }
  onNext(): void {
    if (this.isVisibleNext === false) {
      // if (this.lessonData.customSetting && this.lessonData.customSetting.content) {
      if (this.content) {
        for (let ob of this.content) {
          if (ob.title === 'Cooking' && ob.status === true) {
            this.router.navigate(['/teacher/safety-hygiene']);
            break;
          } else if (ob.title === 'Learning Activities' && ob.status === true) {
            let isSensoryExercise = _.find(ob.Activities, function (item) { return item.lable === 'Sensory Learning Exercise'; });
            let isExperiment = _.find(ob.Activities, function (item) { return item.lable === 'Science Experiment'; });
            if (isSensoryExercise && isSensoryExercise.status === true) {
              this.router.navigate(['/teacher/sensory-exercise']);
              break;
            } else if (isExperiment && isExperiment.status === true) {
              this.router.navigate(['/teacher/experiment'])
              break;
            }
          } else if (ob.title === 'Assessments' && ob.status === true) {
            this.router.navigate(['/teacher/assessment-question']);
            break;
          } else {
            this.router.navigate(['/teacher/linguistic-details']);
          }
        }
      } 
      // else if (this.lesson === 'Explore') {
      //   this.router.navigate(['/student/safety-hygiene']);
      // }
    }
  }
  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.router.navigate(['teacher/recipe-fact']);
  }

}
