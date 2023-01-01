import { Injectable } from "@nestjs/common/decorators";
import { Scope } from "@nestjs/common/interfaces";
import { Connection, Channel, connect } from "amqplib";
import { IRabbitMqService } from "./irabbitmq.service";

@Injectable({ scope: Scope.DEFAULT })
export class RabbitMqService implements IRabbitMqService {
  private _connection: Connection;
  private _channel: Channel;
  private _channelConsumer: Channel;

  constructor(private readonly _url: string) {}

  async startAsync(): Promise<void> {
    console.log("Start RabbitMq");
    this._connection = this._connection ?? await connect(this._url);
    this._channel = this._channel ?? await this._connection.createChannel();
    this._channelConsumer = this._channelConsumer ?? await this._connection.createChannel();
  }

  async createQueueAsync(name: string): Promise<void> {
    await this._channel.assertQueue(name);
  }

  async createExchangeAsync(
    name: string,
    type: "direct" | "topic" | "fanout"
  ): Promise<void> {
    await this._channel.assertExchange(name, type);
  }

  async bindQueueAsync(
    queue: string,
    exchange: string,
    routingKey: string
  ): Promise<void> {
    this._channel.bindQueue(queue, exchange, routingKey);
  }

  async publishToQueueAsync<TContent>(
    exchange: string,
    routingKey: string,
    content: TContent
  ): Promise<void> {
    const contentJson = JSON.stringify(content);
    this._channel.publish(exchange, routingKey, Buffer.from(contentJson));
  }

  async sendToQueueAsync<TContent>(
    queue: string,
    content: TContent
  ): Promise<void> {
    const contentJson = JSON.stringify(content);
    this._channel.sendToQueue(queue, Buffer.from(contentJson));
  }

  async createConsumerAsync(queue: string): Promise<void> {
    this._channelConsumer.consume(queue, (message) => {
      try {
        console.log(message.content.toString());
        this._channelConsumer.ack(message);
      } catch {
        this._channelConsumer.nack(message);
      }
    });
  }
}
