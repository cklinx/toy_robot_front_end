export enum CARDINAL_POINTS {
    NORTH = 'North',
    SOUTH = 'South',
	EAST = 'East',
	WEST = 'West',
}

export enum ROBOT_COMMANDS {
    LEFT = "left",
    RIGHT = "right",
    MOVE = "move",
    PLACE = "place"
}

// export interface cardinalPoints {
//     NORTH: number,
//     SOUTH: number,
//     EAST: number,
//     OWEST: number
// }

export interface robotCoordinates {
    X: number,
    Y: number
}

export interface robotState extends robotCoordinates {
    direction: string,
    command: string,
    degrees: number | null
}