import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './container';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { RoleGuard } from './guards';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalGuards(new RoleGuard(new Reflector()));

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  app.use(
    session({
      secret: process.env.SESSION_SECRET_KEY,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Mark Management API')
    .setDescription(
      'This documentations is showing routes of mark management api',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/doc', app, swaggerDoc);

  await app.listen(process.env.PORT);
}
bootstrap();
