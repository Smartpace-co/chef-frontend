import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagGameComponent } from './mini-games1.component';

describe('FlagGameComponent', () => {
  let component: FlagGameComponent;
  let fixture: ComponentFixture<FlagGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlagGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
