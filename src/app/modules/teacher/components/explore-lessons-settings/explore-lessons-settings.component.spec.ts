import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreLessonsSettingsComponent } from './explore-lessons-settings.component';

describe('ExploreLessonsSettingsComponent', () => {
  let component: ExploreLessonsSettingsComponent;
  let fixture: ComponentFixture<ExploreLessonsSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreLessonsSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreLessonsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
