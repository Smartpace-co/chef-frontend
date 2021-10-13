import { Component, OnInit,OnDestroy, HostListener,Renderer2, Input } from '@angular/core';
import { ToasterService } from '@appcore/services/toaster.service';
import { faAngleLeft, faCartPlus, faEye, faInfoCircle, faStickyNote } from '@fortawesome/free-solid-svg-icons';
import { TeacherService } from '@modules/teacher/services/teacher.service';

@Component({
  selector: 'app-teacher-instructions',
  templateUrl: './teacher-instructions.component.html',
  styleUrls: ['./teacher-instructions.component.scss']
})
export class TeacherInstructionsComponent implements OnInit,OnDestroy {

   leftArrow = faAngleLeft;
   stickyNote = faStickyNote;
   eye = faEye;
   cart = faCartPlus;
   info = faInfoCircle;
   instructionsSteps =[];
   lessonData :any;
   recipeTitle : any;
    constructor(private teacherService: TeacherService,
   private toast: ToasterService,) {
    
  }

  ngOnInit(): void {
      // this.teacheService.setTeachersHeader(true);
      this.teacherService.setTeachersHeader(true);
      this.lessonData = this.teacherService.getLessonData();
      this.recipeTitle = this.lessonData.recipe.recipeTitle;
      this.getInstructions();
     
  }
 
  ngOnDestroy(){
    this.teacherService.setTeachersHeader(false);
  }
  getInstructions(){
   this.teacherService.teacherInstructions(this.lessonData.lesson.id).subscribe((data: any) => {
      this.instructionsSteps = data.data.instructionData;
      this.instructionsSteps.forEach((element)=>{
        element.text = element.text.replace(/&nbsp;|<[^>]+>/g, '');
      })
      
    },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      });
  }

}
