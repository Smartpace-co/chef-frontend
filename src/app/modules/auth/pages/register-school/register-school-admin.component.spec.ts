import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAdminComponent } from './register-school-admin.component';

describe('RegisterAdminComponent', () => {
  let component: RegisterAdminComponent;
  let fixture: ComponentFixture<RegisterAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
