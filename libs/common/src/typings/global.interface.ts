export interface TokenPayload {
  userId: string;
}

export interface SessionI {
  location: LocationI;
  playersPerTeam: number;
  setNumber: number;
  minsPerSet: number;
  timeDuration: number;
  startTime: Date;
  stopTime: Date;
  winningDecider: string;
  inProgress: boolean;
  finished: boolean;
  captain: UserI;
  members: UserI[];
  maxNumber: number;
  isFull: boolean;
}

export interface LocationI {}

export interface UserI {
  nickname: string;
}
