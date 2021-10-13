import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosterGroupTabsComponent } from './roster-group-tabs.component';

describe('RosterGroupTabsComponent', () => {
  let component: RosterGroupTabsComponent;
  let fixture: ComponentFixture<RosterGroupTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RosterGroupTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterGroupTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
