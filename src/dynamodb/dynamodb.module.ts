import { DynamicModule, FactoryProvider, Module } from '@nestjs/common';
import {
  OPTIONS_TYPE,
  ConfigurableModuleClass,
} from './dynamodb.module-definition';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';

@Module({})
export class DynamodbModule extends ConfigurableModuleClass {
  static forRootAsync(options: typeof OPTIONS_TYPE): DynamicModule {
    const definition = super.forRootAsync(options);

    const ddbDocClientProvider: FactoryProvider<DynamoDBDocumentClient> = {
      provide: DynamoDBDocumentClient,
      inject: options.inject || [],
      useFactory: (...args) => {
        let ddbClientConfig: DynamoDBClientConfig = {};

        if (options.useFactory) {
          ddbClientConfig = options.useFactory(...args);
        }
        const ddbClient = new DynamoDBClient(ddbClientConfig);

        return DynamoDBDocumentClient.from(ddbClient, {
          marshallOptions: {
            removeUndefinedValues: true,
          },
        });
      },
    };

    return {
      ...definition,
      providers: [ddbDocClientProvider],
    };
  }
}
