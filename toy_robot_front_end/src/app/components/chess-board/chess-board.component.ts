import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { isNil } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { CARDINAL_POINTS, robotCoordinates, robotState, ROBOT_COMMANDS } from 'src/app/models/models';
import { SharedFuncsService } from 'src/app/services/shared-funcs.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.scss']
})
export class ChessBoardComponent implements OnInit {

  public numberOfSquares: number = 100;
  public defaultNumberOfSquares: number = 25;
  public title:string = 'toy_robot_front_end';
  public robotCoordinates: robotCoordinates | null = null;
  public cardinalPoints: string[] = [];
  public formControl: FormGroup = new FormGroup({});
  public showReport: boolean = false;

  private _maxSquaresForSide: number = 0;

  //BehaviorSubject
  public robotState$: BehaviorSubject<robotState | null> = new BehaviorSubject<robotState | null>(null);

  constructor(
    private formBuilder: FormBuilder,
    private sharedFuncsService: SharedFuncsService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this._setCardinalPoints(this.cardinalPoints);
    this.formControl = this.formBuilder.group({
      X: new FormControl(0),
      Y: 0,
      direction: CARDINAL_POINTS.NORTH
    });
  }

  /**
   * create the cardinal points array to show in the mask
   * @param cardinalPoints 
   */
  private _setCardinalPoints = (cardinalPoints: string[]) => {
    if(!isNil(this.cardinalPoints)){
      for (const [key, value] of Object.entries(CARDINAL_POINTS)) {
        cardinalPoints.push(value);
      }
    }
  }

  /**
   * get the table's columns and rows
   */
  public getNumberOfColumns = (): number[] => {
    let squares: number = 0; 
    if(this._isNumberOfSquaresCorrect(this.numberOfSquares)) {
      squares = Math.sqrt(this.numberOfSquares);
    } else {
      squares = Math.sqrt(this.defaultNumberOfSquares);
    }
    this._maxSquaresForSide = squares -1;
    return [].constructor(squares);
  }

  /**
   * check if number of chess's squares is correct
   * @param squares total number of squares
   */
  private _isNumberOfSquaresCorrect = (squares: number): boolean => {
    if(Number.isInteger(Math.sqrt(squares))){
      return true;
    } else {
      return false;
    }
  }

  /**
   * place the robot on the chessboard
   */
  placeRobot() {
    const robotCoordinates = {
      X: this.formControl.controls['X'].value as number,
      Y: this.formControl.controls['Y'].value as number,
    }
    const wrongPosition = this._checkRobotPosition(robotCoordinates);
    if(wrongPosition) {
      this.toastService.show(`Wrong robot position: max position is ${this._maxSquaresForSide} x ${this._maxSquaresForSide}`, { classname: 'bg-danger text-light', delay: 2000 });
    } else {
      const newRobotState = this._setNewRobotDirection(this.formControl.controls['direction'].value, ROBOT_COMMANDS.PLACE);
      this.robotCoordinates = robotCoordinates;
      this.robotState$.next({
        ...this.robotCoordinates,
        direction: this.formControl.controls['direction'].value as string,
        command: ROBOT_COMMANDS.PLACE,
        degrees: !isNil(newRobotState) ? newRobotState.degrees : 180
      })
    }

  }

  /**
   * check if the robot has inside the chessboard
   */
  private _checkRobotPosition = (robotCoordinates: robotCoordinates): boolean => {
    if(!isNil(robotCoordinates)) {
      return robotCoordinates.X > this._maxSquaresForSide || robotCoordinates.X < 0 || robotCoordinates.Y > this._maxSquaresForSide || robotCoordinates.Y < 0
    } else {
      return false
    };
    
  };

  /**
   * rotate/move the robot and manage errors
   */
  moveRobot(command: string) {

    if(isNil(this.robotState$.value)){
      this.toastService.show(`You must place the robot before move it`, { classname: 'bg-danger text-light', delay: 2000 });
    } else {
      let newRobotState: robotState | null = null;
      if(command === ROBOT_COMMANDS.MOVE && !isNil(this.robotCoordinates)){
        let robotCoordinates: robotCoordinates = {
          ...this.robotCoordinates
        }
        switch(this.robotState$.value?.direction) {
          case CARDINAL_POINTS.NORTH:            
            robotCoordinates.Y = robotCoordinates.Y+1;
          break;
          case CARDINAL_POINTS.SOUTH:
            robotCoordinates.Y = robotCoordinates.Y-1;
          break;
          case CARDINAL_POINTS.EAST:
            robotCoordinates.X = robotCoordinates.X+1;
          break;
          case CARDINAL_POINTS.WEST:
            robotCoordinates.X = robotCoordinates.X-1;
          break;
          
        }
  
        const wrongPosition = this._checkRobotPosition(robotCoordinates);
        if(wrongPosition) {
          this.toastService.show(`Wrong robot position: max position is ${this._maxSquaresForSide} x ${this._maxSquaresForSide}`, { classname: 'bg-danger text-light', delay: 2000 });
        } else {
          this.robotCoordinates = robotCoordinates;
          newRobotState = this._setNewRobotDirection(this.robotState$.value?.direction, command);
  
          this.robotState$.next({
            ...this.robotCoordinates,
            command,
            direction: !isNil(newRobotState) ? newRobotState.direction : CARDINAL_POINTS.NORTH,
            degrees: !isNil(newRobotState) ? newRobotState.degrees : 180
          })
        }
      } else if(command === ROBOT_COMMANDS.LEFT || command === ROBOT_COMMANDS.RIGHT){ //RIGHT or LEFT command

        newRobotState = this._setNewRobotDirection(this.robotState$.value?.direction, command);
        
        this.robotState$.next({
          ...this.robotState$.value as robotState,
          command,
          direction: !isNil(newRobotState) ? newRobotState.direction : CARDINAL_POINTS.NORTH,
          degrees: !isNil(newRobotState) ? newRobotState.degrees : 180
        })
      }
    }
    
    
  }

   /**
   * set the new robot direction
   */
  private _setNewRobotDirection = (direction: string | null | undefined, command: string): robotState | null => {
   
    let robotState: robotState = {
      command,
      degrees: 180,
      X: 0,
      Y: 0,
      direction: CARDINAL_POINTS.NORTH
    };
    if(!isNil(direction)){
      
      let degrees: number = 0; 
      switch(direction) {
        case CARDINAL_POINTS.NORTH:
          degrees = 180;
        break;
        case CARDINAL_POINTS.WEST:
          degrees = 90;
        break;
        case CARDINAL_POINTS.EAST:
          degrees = -90;
        break;
        case CARDINAL_POINTS.SOUTH:
          degrees = 0;
        break;
        default:
          degrees = 0;
        break;
      }

      if(command === ROBOT_COMMANDS.LEFT){
        degrees -=90;
      } else if(command === ROBOT_COMMANDS.RIGHT) {
        degrees +=90;
      }
      degrees = this.sharedFuncsService.checkDegrees(degrees);
      const newDirection = this.sharedFuncsService.setNewDirection(degrees);
      robotState.direction = newDirection;
      robotState.degrees = degrees;

    }
    return robotState;
  }

  /**
   * toggle the report status
   */
  public toggleReport = () => {
    this.showReport = !this.showReport;
  }
    

}
