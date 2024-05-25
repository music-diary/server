import {
  PublishCommand,
  PublishCommandInput,
  SNSClient,
} from '@aws-sdk/client-sns';
import { fromSSO } from '@aws-sdk/credential-providers';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogService } from 'src/common/log.service';

@Injectable()
export class SimpleNotificationService {
  private readonly snsClient: SNSClient;
  private readonly snsAwsRegion: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly logService: LogService,
  ) {
    // this.snsAwsRegion = this.configService.get<string>('SNS_AWS_REGION');
    this.snsClient = new SNSClient({
      credentials: fromSSO({
        profile: this.configService.get<string>('AWS_PROFILE'),
      }),
      defaultsMode: 'cross-region',
      region: this.configService.get<string>('SNS_AWS_REGION'),
    });
  }

  async publishSms(
    phoneNumber: string = '+8201030276006',
    code: string,
  ): Promise<void> {
    const message = `Your verification code is ${code}`;
    const input: PublishCommandInput = {
      Message: message,
      PhoneNumber: phoneNumber,
    };
    const response = await this.snsClient.send(new PublishCommand(input));

    if (response.$metadata.httpStatusCode !== 200) {
      throw new ServiceUnavailableException('Failed to publish SMS');
    }
    this.logService.verbose(
      `Successfully published SMS to ${phoneNumber} with code ${code}`,
      SimpleNotificationService.name,
    );
    return;
  }
}
