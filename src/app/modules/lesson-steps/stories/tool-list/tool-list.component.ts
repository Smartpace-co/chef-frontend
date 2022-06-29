import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';

import { StudentService } from '@modules/student/services/student.service';
import { TranslationService } from '@appcore/services/translation.service';

@Component({
  selector: 'app-tool-list',
  templateUrl: './tool-list.component.html',
  styleUrls: ['./tool-list.component.scss']
})
export class ToolListComponent implements OnInit {
  lessonHederConfig = {};
  assignmentId!: number;
  lesson: string;
  isVisibleNext = true;

  toolsList: any[] = [];
  defaultIngredientImg: string;

  constructor(
    private router: Router,
    private studentService: StudentService,
    private translate: TranslationService
    ) {
    this.defaultIngredientImg = './assets/images/nsima-bent-icon.png';
  }

  ngOnInit(): void {

    this.setHeaderConfig();

    this.assignmentId = parseInt(localStorage.getItem('assignmentId'));
    this.lesson = localStorage.getItem('lessonType');
    this.getToolsList();
  }

  private setHeaderConfig(){
    this.lessonHederConfig['stepBoard'] = {
      stepNumber: this.translate.getStringFromKey('student.assigned-lessons.lesson-steps.summary-view.step')+' 4',
      stepTitle: this.translate.getStringFromKey('student.assigned-lessons.lesson-steps.summary-view.tools'),
      stepLogo: './assets/images/Vegetarian_Stew.png'
    }
  }

  getToolsList() {
    this.studentService.getAssignedLessonById(this.assignmentId).subscribe((res) => {
      let bigChef = _.map(res.data.recipe.bigChefTools, item => {
        if (item && item.tools) {
          let obj = {
            type: "Big Chef Tool",
            id: item.id,
            icon: this.defaultIngredientImg,
            name: item.tools.toolTitle,
          }
          return obj;
        }
      });

      let littleChef = _.map(res.data.recipe.littleChefTools, item => {
        if (item && item.tools) {
          let obj = {
            type: "Little Chef Tool",
            id: item.id,
            icon: item.tools.images[0] ? item.tools.images[0] :  this.defaultIngredientImg,
            name: item.tools.toolTitle,
          }
          return obj;
        }
      });

      this.toolsList = bigChef.concat(littleChef);
    });
  }

  onNext(){
    this.router.navigate(['/student/sensory-exercise']);
  }

  onPrevious(){
    this.router.navigate(['/student/ingredient-list']);
  }
}
