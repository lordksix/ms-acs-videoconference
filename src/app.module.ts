import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AzureModule } from './azure/azure.module';

@Module({
  imports: [AzureModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
