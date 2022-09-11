import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToyRobotComponent } from './toy-robot.component';

describe('ToyRobotComponent', () => {
  let component: ToyRobotComponent;
  let fixture: ComponentFixture<ToyRobotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToyRobotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToyRobotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
