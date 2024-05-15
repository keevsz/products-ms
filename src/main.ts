import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { envs, msConfig, validationPipe } from './config';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    msConfig,
  );

  app.useGlobalPipes(validationPipe);

  logger.log(`Products Microservice running on port ${envs.port}`);
}
bootstrap();
