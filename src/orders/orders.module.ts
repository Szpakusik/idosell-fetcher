import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          store: redisStore,
          host: configService.get<string>('redisHost'),
          port: configService.get<number>('redisPort'),
          ttl: 86400,
        };
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
