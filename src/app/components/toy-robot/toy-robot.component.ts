import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { isNil } from 'lodash';
import { BehaviorSubject, filter, tap } from 'rxjs';
import { robotState } from 'src/app/models/models';

@Component({
  selector: 'toy-robot',
  templateUrl: './toy-robot.component.html',
  styleUrls: ['./toy-robot.component.scss'],
})
export class ToyRobotComponent implements OnInit {

  @ViewChild('toyRobot', {static: true}) toyRobot: ElementRef = new ElementRef(null);

  @Input()robotState$: BehaviorSubject<robotState | null> = new BehaviorSubject<robotState | null>(null);

  constructor() { }

  ngOnInit(): void {
  
  }

  ngAfterViewInit() {
    this._manageInput();
  }

  /**
   * allow to the component manage the input
   */
   _manageInput = (): void => {
    
    //manage the commands
    this.robotState$.pipe(
      filter((val: robotState | null) => !isNil(val)),
      tap((val) => this._rotate(val?.degrees))
    )
    .subscribe()
  }

  /**
   * rotate the robot direction in the html
   */
  private _rotate = (degrees: number | null | undefined) => {
    if(!isNil(degrees)){
      this.toyRobot.nativeElement.style.transform = 'rotate('+degrees+'deg)';
    }

  }

}