import { Injectable } from '@nestjs/common';
import { MusicKey, MusicModel } from './schema/music.type';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Condition, ConditionInitializer } from 'dynamoose/dist/Condition';

@Injectable()
export class MusicModelRepository {
  constructor(
    @InjectModel('Music')
    private readonly model: Model<MusicModel, MusicKey>,
  ) {}

  async findMany(query?: ConditionInitializer): Promise<MusicModel[]> {
    return await this.model.scan().exec();
  }

  async findBySongId(query: Condition): Promise<MusicModel[]> {
    return await this.model.scan(query).all().exec();
  }
}
