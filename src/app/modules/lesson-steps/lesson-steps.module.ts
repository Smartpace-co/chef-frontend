import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LearningObjectiveComponent } from './stories/learning-objective/learning-objective.component';
import { SummaryViewComponent } from './stories/summary-view/summary-view.component';
import { GreetingComponent } from './stories/greeting/greeting.component';
import { IntroductionComponent } from './stories/introduction/introduction.component';
import { FindCountryComponent } from './stories/find-country/find-country.component';
import { CountryLocationComponent } from './stories/country-location/country-location.component';
import { RecipeFactComponent } from './stories/recipe-fact/recipe-fact.component';
import { RecipeContentComponent } from './stories/recipe-content/recipe-content.component';
import { ConversationalSentenceComponent } from './stories/conversational-sentence/conversational-sentence.component';
import { SafetyHygieneComponent } from './stories/safety-hygiene/safety-hygiene.component';
import { IngredientListComponent } from './stories/ingredient-list/ingredient-list.component';
import { IngredientComponent } from './stories/ingredient/ingredient.component';
import { CookingTechniqueComponent } from './stories/cooking-technique/cooking-technique.component';
import { CookingStepsComponent } from './stories/cooking-steps/cooking-steps.component';
import { ExperimentComponent } from './stories/experiment/experiment.component';
import { AssessmentQuestionComponent } from './stories/assessment-question/assessment-question.component';
import { CookingPreparationComponent } from './stories/cooking-preparation/cooking-preparation.component';
import { ServingComponent } from './stories/serving/serving.component';
import { CleaningComponent } from './stories/cleaning/cleaning.component';
import { LessonsHeaderbarComponent } from './lessons-headerbar/lessons-headerbar.component';
import { LessonsFooterComponent } from './lessons-footer/lessons-footer.component';
import { SharedModule } from '@shared/shared.module';
import { ScrollDownComponent } from './scroll-down/scroll-down.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicExperimentQuestionsComponent } from './dynamic-experiment-questions/dynamic-experiment-questions.component';
import { LinguisticDetailsComponent } from './stories/linguistic-details/linguistic-details.component';
import { LetStartComponent } from './stories/let-start/let-start.component';
import { StudentActionActivityComponent } from './stories/student-action-activity/student-action-activity.component';
import { ExperimentObservationsComponent } from './stories/experiment-observations/experiment-observations.component';
import { ExperimentDescriptionComponent } from './stories/experiment-description/experiment-description.component';
import { StartExperimentComponent } from './stories/start-experiment/start-experiment.component';
import { ExperimentStepsComponent } from './stories/experiment-steps/experiment-steps.component';
import { ExperimentQuestionComponent } from './stories/experiment-question/experiment-question.component';
import { DynamicActivityQuestionsComponent } from './dynamic-activity-questions/dynamic-activity-questions.component';
import { ActionActivityQuestionComponent } from './stories/action-activity-question/action-activity-question.component';
import { SensoryExerciseComponent } from './stories/sensory-exercise/sensory-exercise.component';
import { StampsComponent } from './stories/stamps/stamps.component';
import { StudentRatingComponent } from './stories/student-rating/student-rating.component';
import { CountryImageComponent } from './stories/country-image/country-image.component';
import { ChefIntroductionComponent } from './stories/chef-introduction/chef-introduction.component';
import { ReferenceComponent } from './stories/reference/reference.component';
@NgModule({
  declarations: [LessonsHeaderbarComponent, LessonsFooterComponent, CookingPreparationComponent,
    CleaningComponent, ServingComponent,
    LearningObjectiveComponent, SummaryViewComponent,
    GreetingComponent, IntroductionComponent,
    FindCountryComponent, CountryLocationComponent,
    RecipeFactComponent,
    RecipeContentComponent, ConversationalSentenceComponent,
    SafetyHygieneComponent, IngredientListComponent,
    IngredientComponent,
    CookingTechniqueComponent, StudentRatingComponent,
    CookingStepsComponent, ExperimentComponent, ExperimentStepsComponent,
    AssessmentQuestionComponent, StudentActionActivityComponent, ScrollDownComponent, DynamicFormComponent, DynamicExperimentQuestionsComponent, LinguisticDetailsComponent, LetStartComponent, ExperimentObservationsComponent, ExperimentDescriptionComponent, StartExperimentComponent, ExperimentQuestionComponent, DynamicActivityQuestionsComponent, ActionActivityQuestionComponent, SensoryExerciseComponent, StampsComponent, CountryImageComponent, ChefIntroductionComponent, ReferenceComponent],

  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule
  ],
  exports: [LessonsFooterComponent, LessonsHeaderbarComponent]
})
export class LessonStepsModule { }
