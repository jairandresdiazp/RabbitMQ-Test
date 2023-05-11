const config = require(`../env.json`);
const amqp = require("amqplib");
var channel, connection;

(async () => {
    try {
        connection = await amqp.connect(config.QUEUES.SERVER);
        channel = await connection.createChannel()
        //connect to 'test-queue', create one if doesnot exist already
        await channel.assertQueue(config.QUEUES.QUEUE_TEST)

        channel.consume(config.QUEUES.QUEUE_TEST, data => {
            if (data !== null) {
                console.log(`Data received ${Date.now()}: ${Buffer.from(data.content)}`);
                channel.ack(data)
            } else {
                console.log('Consumer cancelled by server');
            }
        })

    } catch (error) {
        console.log(error)
    }
})();
