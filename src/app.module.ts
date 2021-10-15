import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGO_USER: Joi.string().required(),
        MONGO_PASS: Joi.string().required(),
        MONGO_DATABASE: Joi.string().required(),
        MONGO_HOST: Joi.string().required(),
        MONGO_PORT: Joi.number().required().default(27017),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.number().required().default(3600),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const username = configService.get('MONGO_USER');
        const password = configService.get('MONGO_PASS');
        const database = configService.get('MONGO_DATABASE');
        const host = configService.get('MONGO_HOST');
        const port = configService.get('MONGO_PORT');
        console.log(
          `mongodb://${username}:${password}@${host}:${port}`,
          database,
        );
        return {
          type: 'mongodb',
          url: `mongodb://${username}:${password}@${host}`,
          database,
          entities: [`${__dirname}/**/*.entity{.ts,.js}`],
          synchronize: true,
        };
      },
    }),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => {
    //     const user = configService.get('MONGO_USER');
    //     const pass = configService.get('MONGO_PASS');
    //     const database = configService.get('MONGO_DATABASE');
    //     const host = configService.get('MONGO_HOST');
    //     return {
    //       uri: `mongodb://${user}:${pass}@${host}`,
    //       dbName: database,
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
