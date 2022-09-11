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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should show the error message with a wrong place robot position`, () => {
    const fixture = TestBed.createComponent(ChessBoardComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    
    const button: DebugElement = fixture.debugElement.query(By.css('[data-testid="bPlaceRobot"]'));
    const xCoords: DebugElement = fixture.debugElement.query(By.css('[data-testid="xCoords"]'));
    const yCoords: DebugElement = fixture.debugElement.query(By.css('[data-testid="yCoords"]'));

    const maxValue = 5;
    xCoords.nativeElement.value = maxValue;
    yCoords.nativeElement.value = 0;
    xCoords.nativeElement.dispatchEvent(new Event('input'));
    yCoords.nativeElement.dispatchEvent(new Event('input'));

    button.triggerEventHandler('click');
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
    const fixture = TestBed.createComponent(ChessBoardComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    
    const button: DebugElement = fixture.debugElement.query(By.css('[data-testid="bPlaceRobot"]'));
    const xCoords: DebugElement = fixture.debugElement.query(By.css('[data-testid="xCoords"]'));
    const yCoords: DebugElement = fixture.debugElement.query(By.css('[data-testid="yCoords"]'));

    const maxValue = 2;
    xCoords.nativeElement.value = maxValue;
    yCoords.nativeElement.value = 0;
    xCoords.nativeElement.dispatchEvent(new Event('input'));
    yCoords.nativeElement.dispatchEvent(new Event('input'));

    button.triggerEventHandler('click');
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
    const fixture = TestBed.createComponent(ChessBoardComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    
    const bPlace: DebugElement = fixture.debugElement.query(By.css('[data-testid="bPlaceRobot"]'));
    const bLeft: DebugElement = fixture.debugElement.query(By.css('[data-testid="bLeft"]'));
    const bMove: DebugElement = fixture.debugElement.query(By.css('[data-testid="bMove"]'));
    const bRight: DebugElement = fixture.debugElement.query(By.css('[data-testid="bRight"]'));

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
    const fixture = TestBed.createComponent(ChessBoardComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    
    const bLeft: DebugElement = fixture.debugElement.query(By.css('[data-testid="bLeft"]'));
    const bMove: DebugElement = fixture.debugElement.query(By.css('[data-testid="bMove"]'));
    const bRight: DebugElement = fixture.debugElement.query(By.css('[data-testid="bRight"]'));

    expect(component.robotState$.value).toBeNull();
    bLeft.triggerEventHandler('click');
    bRight.triggerEventHandler('click');
    bMove.triggerEventHandler('click');

    expect(component.robotState$.value).toBeNull();
    
  });

});
