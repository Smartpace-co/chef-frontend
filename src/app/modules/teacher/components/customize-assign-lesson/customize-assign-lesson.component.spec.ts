import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeAssignLessonComponent } from './customize-assign-lesson.component';

describe('CustomizeAssignLessonComponent', () => {
  let component: CustomizeAssignLessonComponent;
  let fixture: ComponentFixture<CustomizeAssignLessonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizeAssignLessonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeAssignLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
