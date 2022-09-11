import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { isNil } from 'lodash';
import { BehaviorSubject, filter, map, tap } from 'rxjs';
import { CARDINAL_POINTS, robotState, ROBOT_COMMANDS } from 'src/app/models/models';
import { SharedFuncsService } from 'src/app/services/shared-funcs.service';

@Component({
  selector: 'toy-robot',
  templateUrl: './toy-robot.component.html',
  styleUrls: ['./toy-robot.component.scss'],
})
export class ToyRobotComponent implements OnInit {

  @ViewChild('toyRobot', {static: true}) toyRobot: ElementRef = new ElementRef(null);

  @Input()robotState$: BehaviorSubject<robotState | null> = new BehaviorSubject<robotState | null>(null);
  @Input()robotCommand$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  // @Output()resetPosition = new EventEmitter();
  // @Output()changePosition = new EventEmitter();
  // @Output()changeDirection = new EventEmitter();
  
  private _direction: string | null = null;
  private _degrees: number = 0;

    // rotate() {
    //     this.state = (this.state === 'default' ? 'left' : 'default');
    // }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private sharedFuncsService: SharedFuncsService
    ) { }

  ngOnInit(): void {
  
  }

  ngAfterViewInit() {
    this._manageInput();
  }

//   ngOnChanges(changes: SimpleChanges) {
//     console.log('hhhhhhhhhhhh2222', this.toyRobot);
    
//     console.log("robot ngOnChanges", {changes}, ('robotState' || 'robotCommand') in changes);
// console.log('-----------', changes['robotCommand']);

//     if (!isNil(changes) && !!changes['robotCommand'])  {
//     // if (!isNil(changes) && changes['robotCommand']) {
//       // console.log("robot ngOnChanges 22", changes, changes['robotState'], !changes['robotState'].firstChange);
//       // // if(!changes['robotState'].firstChange){
//       this._setDirection(changes['robotCommand'].currentValue)
//         // this.setDegrees(changes.userInput);
//         // this.toyRobot.nativeElement.style.transform = 'rotate('+ this.degrees +'deg)';
//       // } 
//       // else {
//       //   this.degrees = this.defaultPosition;
//       //   this.robot.nativeElement.style.transform = 'rotate('+ this.defaultPosition +'deg)';
//       // }
//     }

    
//     // switch(changes){
//     //   case: ROBOT_COMMANDS.LEFT {

//     //   }
//     // }
//     // if (('userInput' || 'defaultPosition') in changes) {
//     //   if(!changes.userInput.firstChange){
//     //     this.setDegrees(changes.userInput);
//     //     this.robot.nativeElement.style.transform = 'rotate('+ this.degrees +'deg)';
//     //   } else {
//     //     this.degrees = this.defaultPosition;
//     //     this.robot.nativeElement.style.transform = 'rotate('+ this.defaultPosition +'deg)';
//     //   }
//     // }
//   }

  /**
   * allow to the component manage the input
   */
   _manageInput = (): void => {
    
    
    // this.robotCommand$.pipe(
    //   tap((val) => console.log('lllllllllllllllll2222', val)),
    //   filter((val) => !isNil(val)),
    //   tap((val) => console.log('lllllllllllllllll', val)),
    //   map((robotCommand: string | null) => this._setDirection(robotCommand)),
    //   tap(() => this._rotate(this._degrees))
    //   // tap(() => this._setDirection('val')),
    //   // tap(() => this.toyRobot.nativeElement.style.transform = 'rotate(-90deg)'),
    // )
    // .subscribe()

    //manage the commands
    this.robotState$.pipe(
      filter((val) => !isNil(val)),
      tap((val) => console.log('ddddddd33333', val)),
      map((robotState: robotState | null) => this._setDirection(robotState?.direction)),
      tap((val) => console.log('ddddddd33333wwwwww', val, this._degrees)),
      tap(() => this._rotate(this._degrees))
    )
    .subscribe()
  }

  /**
   * rotate the robot direction in the html
   */
  private _rotate = (degrees: number) => {
    this.toyRobot.nativeElement.style.transform = 'rotate('+degrees+'deg)';
  }
  
  /**
   * set the robot direction
   * @param direction 
   */
  private _setDirection = (direction: string | null | undefined): number => {
    if(!isNil(direction)){
      this._direction = direction;
      
      switch(direction) {
        case CARDINAL_POINTS.NORTH:
          console.log('left', this._degrees);
          // this.rotate()
          this._degrees = 0;
          // this.state = this._degrees;
          // this.toyRobot.nativeElement.style.transform = 'rotate('+ this.degrees +'deg)'
          // this._degrees = this._degrees + 90;
          // this._degrees = this._checkDegrees(this._degrees);
        break;
        case CARDINAL_POINTS.SOUTH:
          this._degrees = -180;
          // this.state = this._degrees;
          // this._degrees = this._degrees - 90;
          // this._degrees = this._checkDegrees(this._degrees);
        break;
        case CARDINAL_POINTS.EAST:
          this._degrees = -90;
          // this.changePosition.emit(this.degrees);
        break;
        case CARDINAL_POINTS.WEST:
          this._degrees = 90;
          // this.changePosition.emit(this.degrees);
        break;
        case ROBOT_COMMANDS.LEFT:
          this._degrees -= 90;
          this._degrees = this.sharedFuncsService.checkDegrees(this._degrees);
          this.sharedFuncsService.setNewDirection(this._degrees);
          // this.changePosition.emit(this.degrees);
        break;
        case ROBOT_COMMANDS.RIGHT:
          this._degrees += 90;
          this._degrees = this.sharedFuncsService.checkDegrees(this._degrees);
          this.sharedFuncsService.setNewDirection(this._degrees);
          // this.changePosition.emit(this.degrees);
        break;
        // this.reset.emit(null);
        // this.setWay();
        
      }

      console.log('_setDirection', direction, this._degrees);
      
    }
    return this._degrees;
  }

  // /**
  //  * check if must reset the degrees
  //  * @param degrees 
  //  */
  // private _checkDegrees = (degrees: number): number => {
  //   if(degrees > 270 || degrees < -270) {
  //     return 0;
  //   } else {
  //     return degrees;
  //   }
  // }

  // /**
  //  * set the new robot direction after rotate command
  //  */
  // private _setNewDirection = (degrees: number): string => {
  //   switch(degrees) {
  //     case 0:
  //       return CARDINAL_POINTS.NORTH;
  //     case 90:
  //       return CARDINAL_POINTS.WEST;
  //     case -90:
  //     case 270:
  //       return CARDINAL_POINTS.EAST;
  //     case 180:
  //     case -180:
  //       return CARDINAL_POINTS.SOUTH;
  //     default:
  //       return CARDINAL_POINTS.NORTH;
      
  //   }
  // }

  // export enum Compass {
  //   NORTH = "North",
  //   SOUTH = "South",
  //   EAST = "East",
  //   WEST = "West"
  // }
}
