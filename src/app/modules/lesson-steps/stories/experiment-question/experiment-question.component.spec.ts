import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentQuestionComponent } from './experiment-question.component';

describe('ExperimentQuestionComponent', () => {
  let component: ExperimentQuestionComponent;
  let fixture: ComponentFixture<ExperimentQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperimentQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
