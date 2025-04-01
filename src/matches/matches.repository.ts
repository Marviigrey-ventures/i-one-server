import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, Match } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MatchRepository extends AbstractRepository<Match> {
  protected readonly logger = new Logger(MatchRepository.name);

  constructor(@InjectModel(Match.name) MatchModel: Model<Match>) {
    super(MatchModel);
  }
}
