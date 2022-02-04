import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrablecerContrasenaComponent } from './restrablecer-contrasena.component';

describe('RestrablecerContrasenaComponent', () => {
  let component: RestrablecerContrasenaComponent;
  let fixture: ComponentFixture<RestrablecerContrasenaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestrablecerContrasenaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestrablecerContrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
