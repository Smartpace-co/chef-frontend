import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicExperimentQuestionsComponent } from './dynamic-experiment-questions.component';

describe('DynamicExperimentQuestionsComponent', () => {
  let component: DynamicExperimentQuestionsComponent;
  let fixture: ComponentFixture<DynamicExperimentQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicExperimentQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicExperimentQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
