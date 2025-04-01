import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, Set } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SetRepository extends AbstractRepository<Set> {
  protected readonly logger = new Logger(SetRepository.name);

  constructor(@InjectModel(Set.name) SetModel: Model<Set>) {
    super(SetModel);
  }
}
