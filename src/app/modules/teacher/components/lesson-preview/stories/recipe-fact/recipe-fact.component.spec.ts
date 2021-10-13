import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeFactComponent } from './recipe-fact.component';

describe('RecipeFactComponent', () => {
  let component: RecipeFactComponent;
  let fixture: ComponentFixture<RecipeFactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeFactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeFactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
