import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

const ENABLE_DEBUG_MESSAGES = process.env.ENABLE_DEBUG_MESSAGES || false;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Beev API')
    .setDescription('API documentation for Beev project')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      enableDebugMessages: ENABLE_DEBUG_MESSAGES ? true : false,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
