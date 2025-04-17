import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { SessionsService } from './sessions.service';
import { CurrentUser, User } from '@app/common';
import { createSessionRequest } from './dto/sessions.dto';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Get('nearby-sessions')
  async findNearbySessionMatches(@Body() data: { lng: number; lat: number }) {
    return this.sessionsService.findNearbySessionMatches(data.lng, data.lat);
  }

  @Get('all')
  async viewAllSessions() {
    return this.sessionsService.viewAllSessions();
  }

  @Post('start')
  async startSession(
    @Body() data: { locationId: string },
    @CurrentUser() user: User,
  ) {
    return this.sessionsService.startSession(
      user._id.toString(),
      data.locationId,
    );
  }

  @Post('create/:sessionId')
  async createSession(
    @Param('sessionId') sessionId: string,
    @Body() data: createSessionRequest,
    @CurrentUser() user: User,
  ) {
    return this.sessionsService.createSession(
      data,
      user._id.toString(),
      sessionId,
    );
  }

  @Post('join/:sessionId')
  async joinSession(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: User,
  ) {
    return this.sessionsService.joinSession(user._id.toString(), sessionId);
  }

  @Get(':sessionId')
  async viewSession(@Param('sessionId') sessionId: string) {
    return this.sessionsService.viewSession(sessionId);
  }

  @Get('members/:sessionId')
  async viewSessionMembers(@Param('sessionId') sessionId: string) {
    return this.sessionsService.viewSessionMembers(sessionId);
  }

  @Delete('leave/:sessionId')
  async leaveSession(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: User,
  ) {
    return this.sessionsService.leaveSession(user._id.toString(), sessionId);
  }

  @Post('end/:sessionId')
  async endSession(@Param('sessionId') sessionId: string) {
    return this.sessionsService.endSession(sessionId);
  }

  @Delete('delete/:sessionId')
  async deleteSession(@Param('sessionId') sessionId: string) {
    return this.sessionsService.deleteSession(sessionId);
  }

  @Patch('reschedule/:sessionId')
  async rescheduleSession(
    @Param('sessionId') sessionId: string,
    @Body() data: { startTime: Date; timeDuration: number },
  ) {
    return this.sessionsService.recheduleSession(
      sessionId,
      data.startTime,
      data.timeDuration,
    );
  }
}
