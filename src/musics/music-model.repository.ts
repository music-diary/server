import { Injectable } from '@nestjs/common';
import { MusicKey, MusicModel } from './schema/music.type';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { ConditionInitializer } from 'dynamoose/dist/Condition';

@Injectable()
export class MusicModelRepository {
  constructor(
    @InjectModel('Music')
    private readonly model: Model<MusicModel, MusicKey>,
  ) {}

  async findMany(query?: ConditionInitializer): Promise<MusicModel[]> {
    return await this.model.scan().exec();
  }

  async findBySongId(query: string): Promise<MusicModel> {
    // FIXME: FIX title to songId
    query = '바람이 분다';
    return await this.model.get({ title: query });
  }
}
