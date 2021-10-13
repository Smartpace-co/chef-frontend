import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonsFooterComponent } from './lessons-footer.component';

describe('LessonsFooterComponent', () => {
  let component: LessonsFooterComponent;
  let fixture: ComponentFixture<LessonsFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessonsFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonsFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
