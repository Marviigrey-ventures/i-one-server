import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { MatchesService } from './matches.service';

@Controller('match')
@UseGuards(JwtAuthGuard)
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @Post('matchup/:sessionId')
  async matchUp(@Param('sessionId') sessionId: string) {
    return this.matchesService.matchUp(sessionId);
  }

  @Get('matchups/:sessionId')
  async viewSessionMatchUps(@Param('sessionId') sessionId: string) {
    return this.matchesService.viewSessionMatchUps(sessionId);
  }

  @Post('start/:matchId')
  async startMatchInSession(@Param('matchId') matchId: string) {
    return this.matchesService.startMatch(matchId);
  }

  @Get('details/:matchId')
  async viewMatchDetails(@Param('matchId') matchId: string) {
    return this.matchesService.viewMatchDetails(matchId);
  }

  @Post('end/:matchId')
  async endMatchInSession(@Param('matchId') matchId: string) {
    return this.matchesService.endMatch(matchId);
  }
}
