import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentObservationsComponent } from './experiment-observations.component';

describe('ExperimentObservationsComponent', () => {
  let component: ExperimentObservationsComponent;
  let fixture: ComponentFixture<ExperimentObservationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperimentObservationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentObservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
