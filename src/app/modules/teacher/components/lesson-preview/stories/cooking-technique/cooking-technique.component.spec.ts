import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookingTechniqueComponent } from './cooking-technique.component';

describe('CookingTechniqueComponent', () => {
  let component: CookingTechniqueComponent;
  let fixture: ComponentFixture<CookingTechniqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookingTechniqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookingTechniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
