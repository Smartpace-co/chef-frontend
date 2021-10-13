import { Component, Input, OnInit ,OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';
@Component({
  selector: 'app-recipe-fact',
  templateUrl: './recipe-fact.component.html',
  styleUrls: ['./recipe-fact.component.scss']
})
export class RecipeFactComponent implements OnInit,OnDestroy {

  lessonHederConfig = {};
  assignmentId: string;
  sessionData: any;
  assignmentData: any;
  recipeImg: string;
  defaultRecipeImg: string;
  lessonData:any;
  isLoad = false;
   countryBgImg;
  constructor(private toast: ToasterService, private router: Router, 
    private studentService: StudentService, private utilityService: UtilityService,
    private teacherService: TeacherService) {
    this.lessonHederConfig['stepBoard'] = null;
    this.defaultRecipeImg = './assets/images/nsima-bent-icon.png';
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.assignmentId = localStorage.getItem('assignmentId')
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.lessonData = this.teacherService.getAssignLessonData();
    this.assignmentData = this.lessonData.lesson;
    this.recipeImg = this.lessonData.recipe.recipeImage ? this.lessonData.recipe.recipeImage : this.defaultRecipeImg;
    this.countryBgImg = this.lessonData.recipe.country.backgroundImage;
    this.isLoad = true;
    this.teacherService.setTeachersHeader(true);
  }


  ngOnDestroy(){
    this.teacherService.setTeachersHeader(false);
  }
  /**
  * on Next click event
 */
  onNext(): void {
    this.router.navigate(['teacher/recipe-content']);
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.router.navigate(['teacher/greeting']);
  }

}
