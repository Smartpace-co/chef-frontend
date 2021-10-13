import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreCatagoriesComponent } from './explore-catagories.component';

describe('ExploreCatagoriesComponent', () => {
  let component: ExploreCatagoriesComponent;
  let fixture: ComponentFixture<ExploreCatagoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreCatagoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreCatagoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
