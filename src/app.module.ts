import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { RabbitMqService } from './services/rabbitmq.service';

const RABBITMQ_PROVIDER_CONFIG: Provider<any> = {
  provide: RabbitMqService,
  useFactory: async () => {
    const service = new RabbitMqService(process.env.CONNECTIONSTRING_RABBITMQ);
    await service.startAsync();
    return service;
  }
};

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [RABBITMQ_PROVIDER_CONFIG],
})
export class AppModule {}
