import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentStepsComponent } from './experiment-steps.component';

describe('ExperimentStepsComponent', () => {
  let component: ExperimentStepsComponent;
  let fixture: ComponentFixture<ExperimentStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperimentStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
