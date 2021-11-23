import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AppRepository } from './app.repository';

@Module({
  imports: [MongooseModule.forRoot('mongodb://mongodb:27017/nest')],
  controllers: [AppController],
  providers: [AppService, AppRepository, Logger],
})
export class AppModule {}
