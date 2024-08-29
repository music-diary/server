import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Condition, ConditionInitializer } from 'dynamoose/dist/Condition';
import { MusicAiKey, MusicAiModel } from './schema/music-ai.type';

@Injectable()
export class MusicAiModelRepository {
  constructor(
    @InjectModel('MusicAiModel')
    private readonly model: Model<MusicAiModel, MusicAiKey>,
  ) {}

  async findMany(query?: ConditionInitializer): Promise<MusicAiModel[]> {
    return await this.model.scan(query).exec();
  }

  async findBySongId(query: Condition): Promise<MusicAiModel[]> {
    return await this.model.scan(query).all().exec();
  }
}
