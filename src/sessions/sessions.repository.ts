import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, Session, Set } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SessionRepository extends AbstractRepository<Session> {
  protected readonly logger = new Logger(SessionRepository.name);

  constructor(@InjectModel(Session.name) SessionModel: Model<Session>) {
    super(SessionModel);
  }
}
