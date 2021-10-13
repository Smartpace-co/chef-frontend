import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreAllLessonComponent } from './explore-all-lesson.component';

describe('ExploreAllLessonComponent', () => {
  let component: ExploreAllLessonComponent;
  let fixture: ComponentFixture<ExploreAllLessonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreAllLessonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreAllLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
