import { IsNotEmpty, IsNumber } from 'class-validator';

export class createSessionRequest {
  @IsNotEmpty()
  @IsNumber()
  setNumber: number;

  @IsNotEmpty()
  @IsNumber()
  playersPerTeam: number;

  @IsNotEmpty()
  @IsNumber()
  timeDuration: number;

  @IsNotEmpty()
  @IsNumber()
  minsPerSet: number;

  @IsNotEmpty()
  @IsNumber()
  startTime: number;

  @IsNotEmpty()
  @IsNumber()
  winningDecider: number;
}
