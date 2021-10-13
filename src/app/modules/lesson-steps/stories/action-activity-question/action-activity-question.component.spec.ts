import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionActivityQuestionComponent } from './action-activity-question.component';

describe('ActionActivityQuestionComponent', () => {
  let component: ActionActivityQuestionComponent;
  let fixture: ComponentFixture<ActionActivityQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionActivityQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionActivityQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
