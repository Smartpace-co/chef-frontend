import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistSettingsComponent } from './dist-settings.component';

describe('DistSettingsComponent', () => {
  let component: DistSettingsComponent;
  let fixture: ComponentFixture<DistSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
