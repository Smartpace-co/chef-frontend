import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { StudentService } from '@modules/student/services/student.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';

@Component({
  selector: 'app-let-start',
  templateUrl: './let-start.component.html',
  styleUrls: ['./let-start.component.scss']
})
export class LetStartComponent implements OnInit,OnDestroy {
  lessonHederConfig = {};
  assignmentId: string;
  sessionData: any;
  textMsg: string;
  isLoad = false;
  lessonData:any;
   countryBgImg;
  constructor(private router: Router,private studentService:StudentService,
    private toast:ToasterService,
    private teacherService : TeacherService) {
    this.lessonHederConfig['stepBoard'] = null;
  }

  ngOnInit(): void {
    this.teacherService.setTeachersHeader(true);
    window.scroll(0, 0);
    this.textMsg = "Now we know about today's recipe,let's get cooking!"
    this.assignmentId = localStorage.getItem('assignmentId');
    this.lessonData = this.teacherService.getAssignLessonData();
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.countryBgImg = this.lessonData.recipe.country.backgroundImage;
    this.isLoad = true;

  }

  ngOnDestroy(){
    this.teacherService.setTeachersHeader(false);
  }
  /**
  * on Next click event
 */
  onNext(): void {
    this.router.navigate(['teacher/conversional-sentence']);
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.router.navigate(['teacher/recipe-content']);
  }
}
