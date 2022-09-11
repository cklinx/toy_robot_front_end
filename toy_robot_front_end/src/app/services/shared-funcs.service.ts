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
      case 180:
      case -180:
        return CARDINAL_POINTS.NORTH;
      case 90:
      case -270:
        return CARDINAL_POINTS.WEST;
      case -90:
      case 270:
        return CARDINAL_POINTS.EAST;
      case 0:
        return CARDINAL_POINTS.SOUTH;
      default:
        return CARDINAL_POINTS.NORTH;
    }
  }

  /**
   * check if must reset the degrees
   * @param degrees 
   */
   public checkDegrees = (degrees: number): number => {
    if(degrees > 270 || degrees < -270) {
      return 180;
    } else {
      return degrees;
    }
  }
  
}
