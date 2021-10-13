import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicExperimentComponent } from './dynamic-experiment.component';

describe('DynamicExperimentComponent', () => {
  let component: DynamicExperimentComponent;
  let fixture: ComponentFixture<DynamicExperimentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicExperimentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicExperimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
