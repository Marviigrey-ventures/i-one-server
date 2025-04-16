import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { SessionsService } from "./sessions.service";
import { CurrentUser, User } from "@app/common";

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
	constructor(private sessionsService: SessionsService){}

	@Get('nearby-sessions')
	async findNearbySessionMatches(
		@Body() data : {lng: number, lat:number }
	){
		return this.sessionsService.findNearbySessionMatches(data.lng, data.lat)
	}

	@Get('all')
	async viewAllSessions(){
		return this.sessionsService.viewAllSessions()
	}

	@Post('start')
	async startSession(
		@Body() data: { locationId: string },
		@CurrentUser() user: User
	) {
		return this.sessionsService.startSession(user._id.toString(), data.locationId)
	}

	@Post('create/:sessionId')
	async createSession(
		@Param('sessionId') sessionId: string
	) {
	}
}