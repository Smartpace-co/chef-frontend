import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreLessonsSidebarComponent } from './explore-lessons-sidebar.component';

describe('ExploreLessonsSidebarComponent', () => {
  let component: ExploreLessonsSidebarComponent;
  let fixture: ComponentFixture<ExploreLessonsSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreLessonsSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreLessonsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
