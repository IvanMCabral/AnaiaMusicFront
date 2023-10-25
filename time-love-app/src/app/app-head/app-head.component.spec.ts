import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppHeadComponent } from './app-head.component';

describe('AppHeadComponent', () => {
  let component: AppHeadComponent;
  let fixture: ComponentFixture<AppHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppHeadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
