import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherBookmarkComponent } from './teacher-bookmark.component';

describe('TeacherBookmarkComponent', () => {
  let component: TeacherBookmarkComponent;
  let fixture: ComponentFixture<TeacherBookmarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherBookmarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherBookmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
