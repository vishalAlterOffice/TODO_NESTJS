import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './shared/database/database.module';
import { AuthModule } from './module/auth/auth.module';
import { SeedsModule } from './shared/seed/seed.module';
import { TodoModule } from './module/tasks/task.module';
import { UsersModule } from './module/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MYSQL_HOST: Joi.string().required(),
        MYSQL_PORT: Joi.number().required(),
        MYSQL_USER: Joi.string().required(),
        MYSQL_PASSWORD: Joi.string().required(),
        MYSQL_DB: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES: Joi.string().default('3600s'),
      }),
    }),
    DatabaseModule,
    SeedsModule,
    UsersModule,
    AuthModule,
    TodoModule,
  ],
})
export class AppModule {}
