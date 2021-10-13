import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookingPreparationComponent } from './cooking-preparation.component';

describe('CookingPreparationComponent', () => {
  let component: CookingPreparationComponent;
  let fixture: ComponentFixture<CookingPreparationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookingPreparationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookingPreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
