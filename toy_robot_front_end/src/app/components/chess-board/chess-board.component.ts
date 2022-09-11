import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { isNil } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { CARDINAL_POINTS, robotCoordinates, robotState, ROBOT_COMMANDS } from 'src/app/models/models';
import { SharedFuncsService } from 'src/app/services/shared-funcs.service';

@Component({
  selector: 'chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.scss']
})
export class ChessBoardComponent implements OnInit {

  public numberOfSquares: number = 25;
  public defaultNumberOfSquares: number = 25;
  public title:string = 'Control Panel';
  public robotCoordinates: robotCoordinates | null = null;
  public cardinalPoints: string[] = [];
  public formControl: FormGroup = new FormGroup({});
  //BehaviorSubject
  // public robotCommand$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public robotState$: BehaviorSubject<robotState | null> = new BehaviorSubject<robotState | null>(null);

  constructor(
    private formBuilder: FormBuilder,
    private sharedFuncsService: SharedFuncsService
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
   * create a cardinal points array to show in the mask
   * @param cardinalPoints 
   */
  private _setCardinalPoints = (cardinalPoints: string[]) => {
    if(!isNil(this.cardinalPoints)){
      for (const [key, value] of Object.entries(CARDINAL_POINTS)) {
        console.log(`${key}: ${value}`);
        cardinalPoints.push(value);
      }
    }
  }

  /**
   * get the table's columns and rows
   */
  public getNumberOfColumns = (): number[] => {
    console.log("sssssssssss",Math.sqrt(this.numberOfSquares));
    let squares: number = 0; 
    if(this._isNumberOfSquaresCorrect(this.numberOfSquares)) {
      
      squares = Math.sqrt(this.numberOfSquares);
    } else {
      squares = Math.sqrt(this.defaultNumberOfSquares);
    }

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
    // this.robotPosition = 20;
    this.robotCoordinates = {
      X: this.formControl.controls['X'].value as number,
      Y: this.formControl.controls['Y'].value as number,
    }
    // this.userChangePosition
    console.log('place', this.robotCoordinates);
    this.robotState$.next({
      ...this.robotCoordinates,
      direction: this.formControl.controls['direction'].value as string,
      command: ROBOT_COMMANDS.PLACE
    })
    // this.defaultPosition = 0;
    // this.way = Compass.SOUTH;
  }

  /**
   * rotate/move the robot
   */
  moveRobot(command: string) {

    // this.userChangePosition
    console.log('moveRobot', command, this.robotState$.value?.direction);
    

    if(command === ROBOT_COMMANDS.MOVE && !isNil(this.robotCoordinates)){
      
      switch(this.robotState$.value?.direction) {
        case CARDINAL_POINTS.NORTH:
          console.log('norddddddd', this.robotCoordinates.Y);
          
          this.robotCoordinates.Y = this.robotCoordinates.Y+1;
        break;
        case CARDINAL_POINTS.SOUTH:
          this.robotCoordinates.Y = this.robotCoordinates.Y-1;
        break;
        case CARDINAL_POINTS.EAST:
          this.robotCoordinates.X = this.robotCoordinates.X-1;
        break;
        case CARDINAL_POINTS.WEST:
          this.robotCoordinates.X = this.robotCoordinates.X+1;
        break;
        // this.reset.emit(null);
        // this.setWay();
        
      }
      this.robotState$.next({
        ...this.robotState$.value as robotState,
        // direction
      })
    } else { //RIGHT or LEFT command
      console.log('antaniiii', command, this.robotState$.value);
      // let robotDegrees = 
      // if(command === ROBOT_COMMANDS.LEFT){

      // } else if(command === ROBOT_COMMANDS.RIGHT){

      // }
      // this.robotCommand$.next(command);
      const newDirection = this._setNewRobotDirection(this.robotState$.value?.direction, command);
      console.log('antaniii222', newDirection);
      
      this.robotState$.next({
        ...this.robotState$.value as robotState,
        command,
        direction: newDirection
      })
      // let newDirection: string | null = null;
      

    }
    // this.defaultPosition = 0;
    // this.way = Compass.SOUTH;
  }

   /**
   * set the new robot direction after rotate command
   */
  private _setNewRobotDirection = (direction: string | null | undefined, command: string): string => {
    if(!isNil(direction)){
      let degrees: number = 0; 
      switch(direction) {
        case CARDINAL_POINTS.NORTH:
          degrees = 0;
        break;
        case CARDINAL_POINTS.WEST:
          degrees = 90;
        break;
        case CARDINAL_POINTS.EAST:
          degrees = 270;
        break;
        case CARDINAL_POINTS.SOUTH:
          degrees = 180;
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
      console.log("_setNewRobotDirection OOOOO", degrees, newDirection);
      return newDirection;
    } else return CARDINAL_POINTS.NORTH;
    
  }

}
