import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { StudentRoutingModule } from './student-routing.module';
import { StudentComponent } from './student.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScaffoldModule } from '@modules/scaffold/scaffold.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClassInfoComponent } from './components/class-info/class-info.component';
import { StudentNavComponent } from './components/student-nav/student-nav.component';
import { ClassDetailsComponent } from './components/class-details/class-details.component';
import { SettingsComponent } from './components/settings/settings.component';
import { StudentAssignmentsComponent } from './components/student-assignments/student-assignments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ProfileComponent } from './components/profile/profile.component';
import { StudentLandingComponent } from './components/student-landing/student-landing.component';
import { ExploreLessonComponent } from './components/explore-lesson/explore-lesson.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FilterAlphabetPipe } from './components/explore-lesson/filter-alphabet.pipe';
import { LessonStepsModule } from '@modules/lesson-steps/lesson-steps.module';
import { GamesListingComponent } from './components/games-listing/games-listing.component';
import { RecipeIngredientsComponent } from './components/recipe-ingredients/recipe-ingredients.component';
import { NewLessonComponent } from './components/new-lesson/new-lesson.component';
import { PerformanceComponent } from './components/performance/performance.component';
import { ProfilePictureComponent } from './components/profile-picture/profile-picture.component';
import { ProfileInfoComponent } from './components/profile-info/profile-info.component';
import { LockerRoomComponent } from './components/locker-room/locker-room.component';
import { StudentFeedback4Component } from './components/student-feedback4/student-feedback4.component';
import { StudentFeedback5Component } from './components/student-feedback5/student-feedback5.component';
import { PintCupComponent } from './components/pint-cup/pint-cup.component';
import { LemonQuestionComponent } from './components/lemon-question/lemon-question.component';
import { AssessmentDragndropComponent } from './components/assessment-dragndrop/assessment-dragndrop.component';
import { FlagGameActivityComponent } from './components/flag-game-activity/flag-game-activity.component';
import { SafetyDragndropComponent } from './components/safety-dragndrop/safety-dragndrop.component';
import { ExploreCatagoriesComponent } from './components/explore-catagories/explore-catagories.component';
import { FlagGameComponent } from '../lesson-steps/stories/flag-game/flag-game.component';
import { HealthHygieneWaterQuestionComponent } from './components/health-hygiene-water-question/health-hygiene-water-question.component';
import { MembershipDetailsComponent } from './components/membership-details/membership-details.component'
import { HealthHygieneQuestionExerciseComponent } from './components/health-hygiene-question-exercise/health-hygiene-question-exercise.component';
import { ImageFlipComponent } from './components/image-flip/image-flip.component';
import { HealthHygieneFruitAndVeggiesComponent } from './components/health-hygiene-fruit-and-veggies/health-hygiene-fruit-and-veggies.component';
import { LessonReportComponent } from './components/lesson-report/lesson-report.component';
import { JournalComponent } from './components/journal/journal.component';
import { PassportComponent } from './components/passport/passport.component';
import { FlipGamesComponent } from './components/flip-games/flip-games.component';
import { OrderIngredientsComponent } from './components/order-ingredients/order-ingredients.component';
@NgModule({
  declarations: [StudentComponent, DashboardComponent, JournalComponent, ClassInfoComponent, MembershipDetailsComponent, StudentNavComponent, ClassDetailsComponent, SettingsComponent, StudentAssignmentsComponent, NotificationsComponent, ProfileComponent, StudentLandingComponent, ExploreLessonComponent, FilterAlphabetPipe, GamesListingComponent, ProfilePictureComponent, ProfileInfoComponent, LockerRoomComponent, LessonReportComponent, StudentFeedback4Component, StudentFeedback5Component, PintCupComponent, LemonQuestionComponent, RecipeIngredientsComponent, NewLessonComponent, PerformanceComponent, AssessmentDragndropComponent, FlagGameActivityComponent, SafetyDragndropComponent, ExploreCatagoriesComponent, FlagGameComponent, HealthHygieneQuestionExerciseComponent, HealthHygieneWaterQuestionComponent, ImageFlipComponent, HealthHygieneFruitAndVeggiesComponent, PassportComponent, FlipGamesComponent, OrderIngredientsComponent],
  imports: [
    CommonModule,
    CKEditorModule,
    StudentRoutingModule,
    SharedModule,
    LessonStepsModule,
    ScaffoldModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule
  ],
  entryComponents: [JournalComponent, PassportComponent]
})
export class StudentModule { }
