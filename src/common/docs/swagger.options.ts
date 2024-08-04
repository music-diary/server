import { DocumentBuilder } from '@nestjs/swagger';

const PORT = process.env.PORT || 5000;
const SERVER_DOMAIN = process.env.SERVER_DOMAIN;

const localInfo = {
  url: `http://localhost:${PORT}/api/v1`,
  description: 'Local Server',
};
const developInfo = {
  url: `https://dev.${SERVER_DOMAIN}/api/v1`,
  description: 'Develop Server',
};

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Muda Service API')
  .setDescription('Muda Service API v1 description')
  .setVersion('1.0')
  .addServer(localInfo.url, localInfo.description)
  .addServer(developInfo.url, developInfo.description)
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    in: 'header',
    name: 'Authorization',
    description: 'Enter your Bearer token',
  })
  .build();
