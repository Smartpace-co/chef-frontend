import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherInstructionsComponent } from './teacher-instructions.component';

describe('TeacherInstructionsComponent', () => {
  let component: TeacherInstructionsComponent;
  let fixture: ComponentFixture<TeacherInstructionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
