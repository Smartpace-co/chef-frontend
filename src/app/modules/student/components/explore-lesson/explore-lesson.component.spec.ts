import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreLessonComponent } from './explore-lesson.component';

describe('ExploreLessonComponent', () => {
  let component: ExploreLessonComponent;
  let fixture: ComponentFixture<ExploreLessonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreLessonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
