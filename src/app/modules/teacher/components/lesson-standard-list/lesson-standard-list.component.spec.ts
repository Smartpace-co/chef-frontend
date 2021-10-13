import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonStandardListComponent } from './lesson-standard-list.component';

describe('LessonStandardListComponent', () => {
  let component: LessonStandardListComponent;
  let fixture: ComponentFixture<LessonStandardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessonStandardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonStandardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
