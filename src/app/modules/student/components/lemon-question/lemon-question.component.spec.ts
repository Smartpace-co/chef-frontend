import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LemonQuestionComponent } from './lemon-question.component';

describe('LemonQuestionComponent', () => {
  let component: LemonQuestionComponent;
  let fixture: ComponentFixture<LemonQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LemonQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LemonQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
