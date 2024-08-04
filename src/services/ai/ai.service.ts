import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RecommendMusicToAIBodyDto,
  RecommendMusicToAIResponseDto,
} from './dto/recommend-ai.dto';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import aws4Interceptor from 'aws4-axios';
import { LogService } from '@common/log.service';

@Injectable()
export class AIService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logService: LogService,
  ) {}

  async recommendMusicsToAI(
    data: RecommendMusicToAIBodyDto,
  ): Promise<RecommendMusicToAIResponseDto> {
    try {
      const aiUrl = this.configService.get<string>('AI_URL');
      const config = {
        method: 'POST',
        url: aiUrl,
        data,
        headers: {
          'Content-Type': 'text/plain',
        },
      };
      const result = await this.aws4Axios(config);
      this.logService.verbose(
        `Successfully request recommendation musics`,
        AIService.name,
      );
      return result.data;
    } catch (error) {
      this.logService.error(JSON.stringify(error), AIService.name);
      throw error;
    }
  }

  private async aws4Axios(config: AxiosRequestConfig): Promise<AxiosResponse> {
    const interceptor = aws4Interceptor({
      options: {
        region: this.configService.get<string>('AWS_REGION'),
        service: 'sagemaker',
      },
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
    axios.interceptors.request.use(interceptor);
    return axios(config);
  }
}
