import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentDescriptionComponent } from './experiment-description.component';

describe('ExperimentDescriptionComponent', () => {
  let component: ExperimentDescriptionComponent;
  let fixture: ComponentFixture<ExperimentDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperimentDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
