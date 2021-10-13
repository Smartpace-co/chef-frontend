import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagGameActivityComponent } from './flag-game-activity.component';

describe('FlagGameActivityComponent', () => {
  let component: FlagGameActivityComponent;
  let fixture: ComponentFixture<FlagGameActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlagGameActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagGameActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
