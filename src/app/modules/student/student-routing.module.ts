import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudentAuthGuard } from './guards/student-auth-guard';
import { StudentComponent } from './student.component';
import { ClassInfoComponent } from './components/class-info/class-info.component';
import { ClassDetailsComponent } from './components/class-details/class-details.component';
import { SettingsComponent } from './components/settings/settings.component';
import { StudentLandingComponent } from './components/student-landing/student-landing.component';
import { StudentAssignmentsComponent } from './components/student-assignments/student-assignments.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { LearningObjectiveComponent } from '../lesson-steps/stories/learning-objective/learning-objective.component';
import { SummaryViewComponent } from '../lesson-steps/stories/summary-view/summary-view.component';
import { GreetingComponent } from '../lesson-steps/stories/greeting/greeting.component';
import { IntroductionComponent } from '../lesson-steps/stories/introduction/introduction.component';
import { FindCountryComponent } from '../lesson-steps/stories/find-country/find-country.component';
import { CountryLocationComponent } from '../lesson-steps/stories/country-location/country-location.component';
import { CookingTechniqueComponent } from '../lesson-steps/stories/cooking-technique/cooking-technique.component';
import { RecipeFactComponent } from '../lesson-steps/stories/recipe-fact/recipe-fact.component';
// import { RecipeContentComponent } from '../lesson-steps/stories/recipe-content/recipe-content.component';
import { ConversationalSentenceComponent } from '../lesson-steps/stories/conversational-sentence/conversational-sentence.component';
import { SafetyHygieneComponent } from '../lesson-steps/stories/safety-hygiene/safety-hygiene.component';
import { IngredientListComponent } from '../lesson-steps/stories/ingredient-list/ingredient-list.component';
import { IngredientComponent } from '../lesson-steps/stories/ingredient/ingredient.component';
import { CookingStepsComponent } from '../lesson-steps/stories/cooking-steps/cooking-steps.component';
import { AssessmentQuestionComponent } from '../lesson-steps/stories/assessment-question/assessment-question.component';
import { CleaningComponent } from '../lesson-steps/stories/cleaning/cleaning.component';
import { ServingComponent } from '../lesson-steps/stories/serving/serving.component';
import { ExperimentComponent } from '../lesson-steps/stories/experiment/experiment.component';
import { CookingPreparationComponent } from '../lesson-steps/stories/cooking-preparation/cooking-preparation.component';
import { ExploreLessonComponent } from './components/explore-lesson/explore-lesson.component';
import { LinguisticDetailsComponent } from '@modules/lesson-steps/stories/linguistic-details/linguistic-details.component';
import { RecipeIngredientsComponent } from './components/recipe-ingredients/recipe-ingredients.component';
import { NewLessonComponent } from './components/new-lesson/new-lesson.component';
import { PerformanceComponent } from './components/performance/performance.component';
import { GamesListingComponent } from './components/games-listing/games-listing.component';
import { ProfilePictureComponent } from './components/profile-picture/profile-picture.component';
import { ProfileInfoComponent } from './components/profile-info/profile-info.component';
import { LockerRoomComponent } from './components/locker-room/locker-room.component';
import { StudentRatingComponent } from '../lesson-steps/stories/student-rating/student-rating.component';
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
// import { LetStartComponent } from '@modules/lesson-steps/stories/let-start/let-start.component';
import { StudentActionActivityComponent } from '@modules/lesson-steps/stories/student-action-activity/student-action-activity.component';
import { StartExperimentComponent } from '@modules/lesson-steps/stories/start-experiment/start-experiment.component';
import { ExperimentDescriptionComponent } from '@modules/lesson-steps/stories/experiment-description/experiment-description.component';
import { ExperimentObservationsComponent } from '@modules/lesson-steps/stories/experiment-observations/experiment-observations.component';
import { ExperimentStepsComponent } from '@modules/lesson-steps/stories/experiment-steps/experiment-steps.component';
import { ExperimentQuestionComponent } from '@modules/lesson-steps/stories/experiment-question/experiment-question.component';
import { ActionActivityQuestionComponent } from '@modules/lesson-steps/stories/action-activity-question/action-activity-question.component';
import { MembershipDetailsComponent } from './components/membership-details/membership-details.component'
import { SensoryExerciseComponent } from '@modules/lesson-steps/stories/sensory-exercise/sensory-exercise.component';
import { StampsComponent } from '@modules/lesson-steps/stories/stamps/stamps.component';
import { HealthHygieneQuestionExerciseComponent } from '@modules/student/components/health-hygiene-question-exercise/health-hygiene-question-exercise.component';
import { HealthHygieneFruitAndVeggiesComponent } from './components/health-hygiene-fruit-and-veggies/health-hygiene-fruit-and-veggies.component';
import { LessonReportComponent } from './components/lesson-report/lesson-report.component';
import { FlipGamesComponent } from './components/flip-games/flip-games.component';
import { OrderIngredientsComponent } from './components/order-ingredients/order-ingredients.component';
import { CountryImageComponent } from '@modules/lesson-steps/stories/country-image/country-image.component';
import { ChefIntroductionComponent } from '@modules/lesson-steps/stories/chef-introduction/chef-introduction.component';
import { ReferenceComponent } from '@modules/lesson-steps/stories/reference/reference.component';
import { ToolListComponent } from '@modules/lesson-steps/stories/tool-list/tool-list.component';
import { ToolComponent } from '@modules/lesson-steps/stories/tool/tool.component';


const routes: Routes = [
  {
    path: '',
    component: StudentComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'class-info',
        component: ClassInfoComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'class-details/:id',
        component: ClassDetailsComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'assignment',
        component: StudentAssignmentsComponent,
        canActivate: [StudentAuthGuard]
      },

      {
        path: 'notifications',
        component: NotificationsComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'student-landing',
        component: StudentLandingComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'explore-lesson',
        component: ExploreLessonComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'learning-objective',
        component: LearningObjectiveComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'country-image',
        component: CountryImageComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'chef-introduction',
        component: ChefIntroductionComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'summary-view',
        component: SummaryViewComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'greeting',
        component: GreetingComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'introduction',
        component: IntroductionComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'find-country',
        component: FindCountryComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'country-location',
        component: CountryLocationComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'recipe-fact',
        component: RecipeFactComponent,
        canActivate: [StudentAuthGuard]
      },
      // {
      //   path: 'recipe-content',
      //   component: RecipeContentComponent,
      //   canActivate: [StudentAuthGuard]
      // },
      {
        path: 'linguistic-details',
        component: LinguisticDetailsComponent,
        canActivate: [StudentAuthGuard]
      },
      // {
      //   path: 'let-start',
      //   component: LetStartComponent,
      //   canActivate: [StudentAuthGuard]
      // },
      {
        path: 'conversional-sentence',
        component: ConversationalSentenceComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'safety-hygiene',
        component: SafetyHygieneComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'ingredient-list',
        component: IngredientListComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'ingredient/:id',
        component: IngredientComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'tool-list',
        component: ToolListComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'tool/:id',
        component: ToolComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'cooking-preparation',
        component: CookingPreparationComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'cooking-technique',
        component: CookingTechniqueComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'cooking-steps',
        component: CookingStepsComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'experiment',
        component: ExperimentComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'experiment-steps',
        component: ExperimentStepsComponent,
        canActivate: [StudentAuthGuard]
      }, {
        path: 'experiment-observation',
        component: ExperimentObservationsComponent,
        canActivate: [StudentAuthGuard]
      }, {
        path: 'experiment-description',
        component: ExperimentDescriptionComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'start-experiment',
        component: StartExperimentComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'experiment-question',
        component: ExperimentQuestionComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'cleaning',
        component: CleaningComponent,
        canActivate: [StudentAuthGuard]
      }
      ,
      {
        path: 'serving',
        component: ServingComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'assessment-question',
        component: AssessmentQuestionComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'action-activities',
        component: StudentActionActivityComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'action-activity-question',
        component: ActionActivityQuestionComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'games-listing',
        component: GamesListingComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'profile-picture',
        component: ProfilePictureComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'profile-info',
        component: ProfileInfoComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'sensory-exercise',
        component: SensoryExerciseComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'locker-room',
        component: LockerRoomComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'lesson-report/:id',
        component: LessonReportComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'order-ingredient/:id',
        component: OrderIngredientsComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'ratings',
        component: StudentRatingComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'stamps',
        component: StampsComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'reference',
        component: ReferenceComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'assessment-dragndrop',
        component: AssessmentDragndropComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'flag-match',
        component: FlagGameActivityComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'safety-dragndrop',
        component: SafetyDragndropComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'flag-game',
        component: FlagGameComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'health-hygiene-question-water',
        component: HealthHygieneWaterQuestionComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'health-hygiene-question-exercise',
        component: HealthHygieneQuestionExerciseComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'health-hygiene-fruit-veggie',
        component: HealthHygieneFruitAndVeggiesComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'membership-details',
        component: MembershipDetailsComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'flip-games',
        component: FlipGamesComponent,
        canActivate: [StudentAuthGuard]
      },
      // following are unused component.
      {
        path: 'student-feedback4',
        component: StudentFeedback4Component,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'student-feedback5',
        component: StudentFeedback5Component,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'pint-cup',
        component: PintCupComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'lemon-question',
        component: LemonQuestionComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'explore-catagories',
        component: ExploreCatagoriesComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'recipe-ingredients',
        component: RecipeIngredientsComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'new-lesson',
        component: NewLessonComponent,
        canActivate: [StudentAuthGuard]
      },
      {
        path: 'performance',
        component: PerformanceComponent,
        canActivate: [StudentAuthGuard]
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
