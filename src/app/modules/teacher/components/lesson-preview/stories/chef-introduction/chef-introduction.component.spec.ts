import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefIntroductionComponent } from './chef-introduction.component';

describe('ChefIntroductionComponent', () => {
  let component: ChefIntroductionComponent;
  let fixture: ComponentFixture<ChefIntroductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChefIntroductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChefIntroductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
