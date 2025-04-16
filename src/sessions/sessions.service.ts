import { HttpStatus, Injectable } from '@nestjs/common';
import { SessionRepository } from '../sessions/sessions.repository';
import { LocationRepository } from '../locations/locations.repository';
import { MatchRepository } from '../matches/matches.repository';
import { UserRepository } from '../users/users.repository';
import { CustomHttpException, Session, User } from '@app/common';
import { UpdateQuery } from 'mongoose';

@Injectable()
export class SessionsService {
	
	constructor(
		private readonly sessionRepository: SessionRepository, 
		private readonly locationRepository: LocationRepository,
		private readonly matchRepository: MatchRepository,
		private readonly userRepository: UserRepository
	){}
	
	async findNearbySessionMatches(lng: number, lat: number) {
		const nearbyLocations = await this.locationRepository.find({
			location: {
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [lng, lat]
					},
					$maxDistance: 5000
				}
			}
		});
		const locationIds = nearbyLocations.map(loc => loc._id);
		const locatedSessions = await this.sessionRepository.find({ location: { $in: locationIds } });
		const sessionIds = locatedSessions.map(session => session._id);
		
		return this.matchRepository.findAndPopulate(
			{ session: { $in: sessionIds }},
			['teamOne', 'teamTwo']
		)
	}
	
	async startSession(userId: string, locationId: string) {
		const user = await this.userRepository.findOne({ _id: userId });
		
		if (user == null) {
			throw new CustomHttpException('User not found', HttpStatus.NOT_FOUND)
		}
		
		await this.userRepository.findOneAndUpdate({
			_id: userId
		}, { isCaptain: true })
		
		const session = await this.sessionRepository.create({ location: locationId, captain: userId });
		
		await this.userRepository.findOneAndUpdate(
			{ _id: userId },
			{ currentSession: session._id }
		)
		
		return session;
	}
	
	async endSession(sessionId: string) {
		const session: Session = await this.sessionRepository.findOne({ _id: sessionId });
		if (!session) throw new CustomHttpException("Session not found", HttpStatus.NOT_FOUND);
		
		await Promise.all(
			session.members.map(async (memberId) => {
				const user = await this.userRepository.findOne({ _id: memberId.toString() });
				if (user !== null) {
					await this.userRepository.findOneAndUpdate(
						{ _id: memberId.toString() },
						{ currentSession: null, isCaptain: false }
					)
				}
			})
		);
		
		await this.sessionRepository.findOneAndUpdate({
			_id: session._id.toString()
		},
		{ captain: null, inProgress: false})
		
		return { message: 'Session ended successfully', session };
		
	}
	
	async joinSession(userId: string, sessionId: string) {
		const session = await this.sessionRepository.findOne({ _id: sessionId });
		if (!session) throw new CustomHttpException('Session not found', HttpStatus.NOT_FOUND);
	  
		if (session.members.includes(userId)) {
		  throw new CustomHttpException('User is already in the session', HttpStatus.CONFLICT);
		}
	  
		if (session.isFull) {
		  throw new CustomHttpException('Session is full', HttpStatus.BAD_REQUEST);
		}
	  
		const updatedSession = await this.sessionRepository.findOneAndUpdate(
		  { _id: sessionId },
		  { $push: { members: userId }, $set: { isFull: session.members.length + 1 >= session.maxNumber } },
		);
	  
		await this.userRepository.findOneAndUpdate(
		  { _id: userId },
		  { currentSession: sessionId }
		);
	  
		return { message: 'User successfully joined session', session: updatedSession };
	  }
	
	async leaveSession(userId: string, sessionId: string) {
		const session: Session = await this.sessionRepository.findOne({ _id: sessionId });
		if (!session) throw new CustomHttpException('Session not found', HttpStatus.NOT_FOUND);
	  
		const user = await this.userRepository.findOne({ _id: userId });
		if (!user) throw new CustomHttpException('User not found', HttpStatus.NOT_FOUND);
	  
		try {

		  await this.sessionRepository.findOneAndUpdate(
			{ _id: sessionId },
			{
			  $pull: { members: userId },
			  $set: { isFull: session.members.length - 1 >= session.maxNumber },
			}
		  );
	  
		  await this.userRepository.findOneAndUpdate(
			{ _id: userId },
			{ currentSession: null }
		  );
	  
		  const updatedSession = await this.sessionRepository.findOne({ _id: sessionId });
		  return { message: 'User successfully left session', session: updatedSession };
		} catch (error) {
		  throw new CustomHttpException('Failed to leave session', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	  }

	  async viewAllSessions() {
		return this.sessionRepository.findAndPopulate(
			{ finished: false },
			['captain', 'members', 'location']
		)
	  }
	
	  async deleteSession(sessionId: string) {
		const session: Session = await this.sessionRepository.findOne({ _id: sessionId });
		if (!session) throw new CustomHttpException('Session not found', HttpStatus.NOT_FOUND);

		const updateQuery: UpdateQuery<User> = {
			$set: { currentSession: null, isCaptain: false }
		  };
	  
		await this.userRepository.updateMany(
		  { _id: { $in: session.members } },
		  updateQuery
		);

		await this.sessionRepository.delete(session._id);
	  
		return { message: 'Session deleted successfully' };
	  }

	  async recheduleSession(sessionId: string, startTime: Date, timeDuration: number) {
		const session = await this.sessionRepository.findOne({ _id: sessionId })
		if (!session) {
			throw new CustomHttpException('Session not found', HttpStatus.NOT_FOUND);
		}

		const addedStopTime = new Date(
			new Date(startTime).getTime() + timeDuration * 60000
		);

		const existingSchedule = await this.sessionRepository.findOne({
			startTime,
			stopTime: addedStopTime,
		});

		if (existingSchedule) {
			throw new CustomHttpException(
			  'Session Time already exists',
			  HttpStatus.CONFLICT
			);
		}

		const overlappingSchedule = await this.sessionRepository.findOne({
			_id: { $ne: sessionId },
			startTime: { $lt: addedStopTime },
			stopTime: { $gt: startTime },
		});

		if (overlappingSchedule) {
			throw new CustomHttpException(
			  'This session overlaps with another one',
			  HttpStatus.CONFLICT
			);
		  }

		const updatedSession = await this.sessionRepository.findOneAndUpdate(
			{ _id: sessionId },
			{
			  startTime,
			  timeDuration,
			  stopTime: addedStopTime,
			}
		  );
		
		  return {
			message: 'Session rescheduled successfully',
			session: updatedSession,
		  };

	  }
}
