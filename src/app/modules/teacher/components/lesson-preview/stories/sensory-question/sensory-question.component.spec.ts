import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensoryQuestionComponent } from './sensory-question.component';

describe('SensoryQuestionComponent', () => {
  let component: SensoryQuestionComponent;
  let fixture: ComponentFixture<SensoryQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensoryQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensoryQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
