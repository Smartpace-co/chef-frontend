import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicActivityQuestionsComponent } from './dynamic-activity-questions.component';

describe('DynamicActivityQuestionsComponent', () => {
  let component: DynamicActivityQuestionsComponent;
  let fixture: ComponentFixture<DynamicActivityQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicActivityQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicActivityQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
