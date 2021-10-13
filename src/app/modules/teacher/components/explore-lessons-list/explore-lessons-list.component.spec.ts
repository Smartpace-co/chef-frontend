import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreLessonsListComponent } from './explore-lessons-list.component';

describe('ExploreLessonsListComponent', () => {
  let component: ExploreLessonsListComponent;
  let fixture: ComponentFixture<ExploreLessonsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreLessonsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreLessonsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
