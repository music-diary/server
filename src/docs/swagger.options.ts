import { DocumentBuilder } from '@nestjs/swagger';

const PORT = process.env.PORT || 5000;
const localInfo = {
  url: `http://localhost:${PORT}/api/v1`,
  description: 'Local Server',
};
const developInfo = {
  url: `http://localhost:${PORT}/api/v1`,
  description: 'Develop Server',
};

export const swaggerConfig = new DocumentBuilder()
  .setTitle('API Example')
  .setDescription('The API description')
  .setVersion('1.0')
  .addServer(localInfo.url, localInfo.description)
  .addServer(developInfo.url, developInfo.description)
  .build();
