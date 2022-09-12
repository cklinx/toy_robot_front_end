import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { CARDINAL_POINTS } from 'src/app/models/models';
import { ToastComponent } from '../toast/toast.component';
import { ToyRobotComponent } from '../toy-robot/toy-robot.component';

import { ChessBoardComponent } from './chess-board.component';

describe('ChessBoardComponent', () => {
  let component: ChessBoardComponent;
  let fixture: ComponentFixture<ChessBoardComponent>;
  let bPlace: DebugElement;
  let bLeft: DebugElement;
  let bMove: DebugElement;
  let bRight: DebugElement;
  let xCoords: DebugElement;
  let yCoords: DebugElement;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChessBoardComponent, ToastComponent, ToyRobotComponent, NgbToast ],
      providers: [
        FormBuilder,
      ],
      imports: [
        ReactiveFormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChessBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    bPlace = fixture.debugElement.query(By.css('[data-testid="bPlaceRobot"]'));
    bLeft = fixture.debugElement.query(By.css('[data-testid="bLeft"]'));
    bMove = fixture.debugElement.query(By.css('[data-testid="bMove"]'));
    bRight = fixture.debugElement.query(By.css('[data-testid="bRight"]'));
    xCoords = fixture.debugElement.query(By.css('[data-testid="xCoords"]'));
    yCoords = fixture.debugElement.query(By.css('[data-testid="yCoords"]'));

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should show the error message with a wrong place robot position`, () => {    
    
    const maxValue = 5;
    xCoords.nativeElement.value = maxValue;
    yCoords.nativeElement.value = 0;
    xCoords.nativeElement.dispatchEvent(new Event('input'));
    yCoords.nativeElement.dispatchEvent(new Event('input'));

    bPlace.triggerEventHandler('click');
    fixture.detectChanges();

    const toyRobot: DebugElement = fixture.debugElement.query(By.directive(ToyRobotComponent));
    const toast: DebugElement = fixture.debugElement.query(By.directive(ToastComponent));
    const toastMsg: DebugElement = fixture.debugElement.query(By.css('toast'));

    //robot value must be null
    expect(component.robotState$.value).toBeNull(); 
    //robot must not exist
    expect(toyRobot).toBeNull();
    //toast must be showed
    expect(toast).not.toBeNull();
    expect(toastMsg).not.toBeNull();

  });

  it(`should show the robot`, () => {
    
    const maxValue = 2;
    xCoords.nativeElement.value = maxValue;
    yCoords.nativeElement.value = 0;
    xCoords.nativeElement.dispatchEvent(new Event('input'));
    yCoords.nativeElement.dispatchEvent(new Event('input'));

    bPlace.triggerEventHandler('click');
    fixture.detectChanges();

    const toyRobot: DebugElement = fixture.debugElement.query(By.directive(ToyRobotComponent));
    const toast: DebugElement = fixture.debugElement.query(By.directive(ToastComponent));
    const toastMsg: DebugElement = fixture.debugElement.query(By.css('bg-danger'));

    //robot value must NOT be null
    expect(component.robotState$.value).not.toBeNull(); 
    //robot must exist
    expect(toyRobot).not.toBeNull();
    //toast must NOT be showed
    expect(toast).not.toBeNull();
    expect(toastMsg).toBeNull();
    
  });

  it(`should manage the wrong robot commands`, () => {
    
    bPlace.triggerEventHandler('click');
    fixture.detectChanges();
  
    const toyRobot: DebugElement = fixture.debugElement.query(By.directive(ToyRobotComponent));

    //robot value must NOT be null
    expect(component.robotState$.value).not.toBeNull();
    expect(component.robotState$.value?.direction).toEqual(CARDINAL_POINTS.NORTH); 
    //robot must exist
    expect(toyRobot).not.toBeNull();

    //robot goes to up
    const maxValue = 5;
    for(let i = 0; i < maxValue; i++) {
      bMove.triggerEventHandler('click');
    }
    fixture.detectChanges();

    let toast: DebugElement = fixture.debugElement.query(By.directive(ToastComponent));
    let toastMsg: DebugElement = fixture.debugElement.query(By.css('bg-danger'));
    //toast must NOT be showed
    expect(toast).not.toBeNull();
    expect(toastMsg).toBeNull();
    //Y value must be like max value-1
    expect(component.robotState$.value?.Y).toEqual(maxValue-1); 
    
    bMove.triggerEventHandler('click');
    fixture.detectChanges();
    //Y value must be like max value-1
    expect(component.robotState$.value?.Y).toEqual(maxValue-1);
    bLeft.triggerEventHandler('click');
    expect(component.robotState$.value?.direction).toEqual(CARDINAL_POINTS.WEST); 
    bMove.triggerEventHandler('click');
    expect(component.robotState$.value?.X).toEqual(0);
    bLeft.triggerEventHandler('click');
    bMove.triggerEventHandler('click');
    bLeft.triggerEventHandler('click');
    bMove.triggerEventHandler('click');
    expect(component.robotState$.value?.X).toEqual(1);
    expect(component.robotState$.value?.Y).toEqual(maxValue-2);
    
  });

  it(`should not consider the commands`, () => {
    
    expect(component.robotState$.value).toBeNull();
    bLeft.triggerEventHandler('click');
    bRight.triggerEventHandler('click');
    bMove.triggerEventHandler('click');

    expect(component.robotState$.value).toBeNull();
    
  });

});
