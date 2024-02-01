import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth';
import { CategoryController, CategoryModule } from './category';
import { ClassroomController, ClassroomModule } from './classroom';
import { ExamController, ExamModule } from './exam';
import { ProfileController, ProfileModule } from './profile';
import { RoleController, RoleModule } from './role';
import { StatisticalController, StatisticalModule } from './statistical';
import { SubjectController, SubjectModule } from './subject';
import { JwtModule } from '@nestjs/jwt';
import { AuthorizationMiddleware } from 'src/middlewares';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET_KEY }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      database: process.env.DATABASE_NAME,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD || '',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    CategoryModule,
    ClassroomModule,
    ExamModule,
    ProfileModule,
    RoleModule,
    StatisticalModule,
    SubjectModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthorizationMiddleware)
      .forRoutes(
        { path: '/auth/change-password', method: RequestMethod.PUT },
        CategoryController,
        ClassroomController,
        ExamController,
        ProfileController,
        RoleController,
        StatisticalController,
        SubjectController,
      );
  }
}
