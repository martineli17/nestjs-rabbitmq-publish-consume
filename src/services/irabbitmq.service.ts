export interface IRabbitMqService {
    startAsync(): Promise<void>;
    createQueueAsync(name: string): Promise<void>;
    createExchangeAsync(
      name: string,
      type: "direct" | "topic" | "fanout"
    ): Promise<void>;
    bindQueueAsync(
      queue: string,
      exchange: string,
      routingKey: string
    ): Promise<void>;
    publishToQueueAsync<TContent>(
      exchange: string,
      routingKey: string,
      content: TContent
    ): Promise<void>;
    sendToQueueAsync<TContent>(queue: string, content: TContent): Promise<void>;
    createConsumerAsync(queue: string): Promise<void>;
  }