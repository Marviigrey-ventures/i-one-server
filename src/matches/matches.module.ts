import { Match, MatchSchema, Set, SetSchema } from '@app/common';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchRepository } from 'src/matches/matches.repository';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { SetRepository } from 'src/sets/sets.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
      { name: Set.name, schema: SetSchema },
    ]),
  ],
  controllers: [MatchesController],
  providers: [MatchesService, MatchRepository, SetRepository],
  exports: [MatchesService],
})
export class MatchesModule {}
