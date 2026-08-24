import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Préfixe global pour toutes les routes de l'API
  app.setGlobalPrefix('api');

  // Validation globale des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non déclarées dans le DTO
      forbidNonWhitelisted: true, // Lève un erreur 400 si des propriété non déclarées dans le DTO sont présentes
      transform: true, // Convertit les types des données d'entrée
    }),
  );

  // Activation de CORS pour permettre la communication avec le front-end React
  app.enableCors();

  // Configuration de Swagger
  const configSwagger = new DocumentBuilder()
    .setTitle('ChâTop API')
    .setDescription(
      'API back-end du projet ChâTop : gestion des locations, utilisateurs et messages',
    )
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
