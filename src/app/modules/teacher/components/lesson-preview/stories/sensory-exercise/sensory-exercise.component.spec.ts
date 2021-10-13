import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensoryExerciseComponent } from './sensory-exercise.component';

describe('SensoryExerciseComponent', () => {
  let component: SensoryExerciseComponent;
  let fixture: ComponentFixture<SensoryExerciseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensoryExerciseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensoryExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
