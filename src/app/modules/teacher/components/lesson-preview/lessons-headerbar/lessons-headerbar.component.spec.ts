import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonsHeaderbarComponent } from './lessons-headerbar.component';

describe('LessonsHeaderbarComponent', () => {
  let component: LessonsHeaderbarComponent;
  let fixture: ComponentFixture<LessonsHeaderbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessonsHeaderbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonsHeaderbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
