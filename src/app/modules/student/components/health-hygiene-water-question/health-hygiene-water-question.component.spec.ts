import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthHygieneWaterQuestionComponent } from './health-hygiene-water-question.component';

describe('HealthHygieneWaterQuestionComponent', () => {
  let component: HealthHygieneWaterQuestionComponent;
  let fixture: ComponentFixture<HealthHygieneWaterQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthHygieneWaterQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthHygieneWaterQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
