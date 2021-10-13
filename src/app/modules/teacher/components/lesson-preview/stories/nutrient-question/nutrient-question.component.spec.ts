import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NutrientQuestionComponent } from './nutrient-question.component';

describe('NutrientQuestionComponent', () => {
  let component: NutrientQuestionComponent;
  let fixture: ComponentFixture<NutrientQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NutrientQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NutrientQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
