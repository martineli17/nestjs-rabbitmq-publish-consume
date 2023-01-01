# Utilizando o RabbitMq no NestJS
Este repositório tem como objetivo exemplificar, de maneira simples, um serviço que abstrai a utilização do RabbitMq, promovendo o gerenciamento de filas, exchanges, publicações e consumo de mensagens

## Pacotes a serem instalados
O único pacote necessário a ser instalado é o [amqpli](https://amqp-node.github.io/amqplib/channel_api.html), que é o responsável por fornecer uma insterface de comunicação com o servidor do RabbitMq</p>
Este pacote contém alguns métodos importantes (e que foram utilizados neste exemplo). São eles:
-  connect: Método responsável por criar uma conexão com o servidor
```js
import { connect } from "amqplib";
await connect(URL_DO_SERVIDOR);
```
-  createChannel: Método responsável por criar um canal de conexão
```js
await this._connection.createChannel();
```
-  assertQueue: Método responsável por criar e retornar informações sobre uma determinada fila
```js
await this._channel.assertQueue(name);
```

-  assertExchange: Método responsável por criar e retornar informações sobre uma determinada exchange
```js
await this._channel.assertExchange(name);
```

-  bindQueue: Método responsável por definir a relação entre uma exchange e uma fila
```js
await this._channel.bindQueue(queue, exchange, routingKey);
```

-  publish: Método responsável por publicar uma nova mensagem na exchange e assim distribuir para as filas
```js
const contentJson = JSON.stringify(content);
this._channel.publish(exchange, routingKey, Buffer.from(contentJson));
```

-  consume: Método responsável por registrar um handler a ser executado quando uma determinada fila receber uma nova mensagem
```js
this._channelConsumer.consume(queue, (message) => {
 try {
   console.log(message.content.toString());
   this._channelConsumer.ack(message);
  } catch {
    this._channelConsumer.nack(message);
  }
});
```

## Classe de serviço de abstração
A classe [RabbitMqService](https://github.com/martineli17/nestjs-rabbitmq-publish-consume/blob/master/src/services/rabbitmq.service.ts) é resposável por conter métodos que abstraem o funcionamento do pacote 'amqplib' para cada uma das funções necessárias.
</br>
Esta classe tem o seu scope, referente a Dependency Injection, como Singleton a fim de evitar a criação de múltiplas conexões e canais com o servidor do RabbitMq.
