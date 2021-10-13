import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageFlipComponent } from './image-flip.component';

describe('ImageFlipComponent', () => {
  let component: ImageFlipComponent;
  let fixture: ComponentFixture<ImageFlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageFlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageFlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
