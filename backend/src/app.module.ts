import { Module } from '@nestjs/common';
import { AmbushLocationModule } from './ambush-location/ambush-location.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AmbushLocationModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'mysql',
      database: 'apex_ambush',
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule {}
