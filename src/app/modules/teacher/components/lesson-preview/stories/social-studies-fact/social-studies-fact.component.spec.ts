import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialStudiesFactComponent } from './social-studies-fact.component';

describe('SocialStudiesFactComponent', () => {
  let component: SocialStudiesFactComponent;
  let fixture: ComponentFixture<SocialStudiesFactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialStudiesFactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialStudiesFactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
