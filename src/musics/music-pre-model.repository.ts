import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Condition, ConditionInitializer } from 'dynamoose/dist/Condition';
import {
  MusicPreprocessKey,
  MusicPreprocessModel,
} from './schema/music-preprocess.type';

@Injectable()
export class MusicPreModelRepository {
  constructor(
    @InjectModel('MusicPreprocess')
    private readonly model: Model<MusicPreprocessModel, MusicPreprocessKey>,
  ) {}

  async findMany(
    query?: ConditionInitializer,
  ): Promise<MusicPreprocessModel[]> {
    return await this.model.scan(query).exec();
  }

  async findBySongId(query: Condition): Promise<MusicPreprocessModel[]> {
    return await this.model.scan(query).all().exec();
  }
}
