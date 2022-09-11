import { Injectable } from '@angular/core';
import { CARDINAL_POINTS } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class SharedFuncsService {

  constructor() { }

  /**
   * set the new robot direction after rotate command
   */
   public setNewDirection = (degrees: number): string => {
    switch(degrees) {
      case 0:
        console.log("_setNewRobotDirection", 0);
        
        return CARDINAL_POINTS.NORTH;
      case 90:
        console.log("_setNewRobotDirection", 1);
        return CARDINAL_POINTS.WEST;
      case -90:
      case 270:
        console.log("_setNewRobotDirection", 2);
        return CARDINAL_POINTS.EAST;
      case 180:
      case -180:
        console.log("_setNewRobotDirection", 3);
        return CARDINAL_POINTS.SOUTH;
      default:
        console.log("_setNewRobotDirection", 4, degrees);
        return CARDINAL_POINTS.NORTH;
      
    }
  }

  /**
   * check if must reset the degrees
   * @param degrees 
   */
   public checkDegrees = (degrees: number): number => {
    if(degrees > 270 || degrees < -270) {
      return 0;
    } else {
      return degrees;
    }
  }
  
}
