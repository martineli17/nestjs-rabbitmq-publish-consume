import { Body, Controller, HttpStatus, Inject, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { IRabbitMqService } from "./services/irabbitmq.service";
import { RabbitMqService } from "./services/rabbitmq.service";

@Controller()
export class AppController {
  constructor(@Inject(RabbitMqService) private readonly _rabbitMqService: IRabbitMqService) {
    this.setConfigurationRabbitMq();
  }

  private async setConfigurationRabbitMq(){
    await this._rabbitMqService.createExchangeAsync("exchange-direct", "direct");
    await this._rabbitMqService.createQueueAsync("test-01");
    await this._rabbitMqService.bindQueueAsync("test-01", "exchange-direct", "test-01");
    await this._rabbitMqService.createConsumerAsync("test-01");
  }

  @Post("new-message")
  async newMessge(@Body() content: any, @Res() response: Response) {
    await this._rabbitMqService.publishToQueueAsync(
      "exchange-direct",
      "test-01",
      content
    );

    response.status(HttpStatus.CREATED).send();
    return response;
  }
}
