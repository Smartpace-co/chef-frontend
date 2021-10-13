import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabularNotificationsComponent } from './tabular-notifications.component';

describe('TabularNotificationsComponent', () => {
  let component: TabularNotificationsComponent;
  let fixture: ComponentFixture<TabularNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabularNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabularNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
