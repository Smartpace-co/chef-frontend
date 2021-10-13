import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthHygieneQuestionExerciseComponent } from './health-hygiene-question-exercise.component';

describe('HealthHygieneQuestionExerciseComponent', () => {
  let component: HealthHygieneQuestionExerciseComponent;
  let fixture: ComponentFixture<HealthHygieneQuestionExerciseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthHygieneQuestionExerciseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthHygieneQuestionExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
