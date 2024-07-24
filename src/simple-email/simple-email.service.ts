import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogService } from 'src/common/log.service';
import { ContactTypesDto } from 'src/users/dto/contact.dto';
import { sendContactEmailTemplate } from './templates/contact.template';

@Injectable()
export class SimpleEmailService {
  private readonly sesClient: SESClient;
  constructor(
    private readonly configService: ConfigService,
    private readonly logService: LogService,
  ) {
    this.sesClient = new SESClient({
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async sendContactEmail(
    senderEmail: string,
    contactType: ContactTypesDto,
    message: string,
  ): Promise<void> {
    const contactEmail = sendContactEmailTemplate(
      senderEmail,
      contactType.label,
      message,
    );
    const command = {
      Destination: {
        ToAddresses: [this.configService.get<string>('CONTACT_EMAIL')],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: contactEmail,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `[Muda] Contact Email - ${contactType.label}`,
        },
      },
      Source: this.configService.get<string>('CONTACT_EMAIL'),
    };
    const sendEmailCommand = new SendEmailCommand(command);
    const response = await this.sesClient.send(sendEmailCommand);

    if (response.$metadata.httpStatusCode !== 200) {
      throw new ServiceUnavailableException('Failed to send SES email');
    }
    this.logService.verbose(
      `Successfully send contact email by ${senderEmail}`,
      SimpleEmailService.name,
    );
    return;
  }
}
