import { Location, LocationSchema, User, UserSchema } from '@app/common';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { LocationRepository } from './locations.repository';
import { UserRepository } from 'src/users/users.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [LocationsController],
  providers: [LocationsService, LocationRepository, UserRepository],
  exports: [LocationsService],
})
export class LocationsModule {}
