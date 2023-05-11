const config = require(`../env.json`);
const amqp = require("amqplib");
var channel, connection;


(async () => {
    try {
        connection = await amqp.connect(config.QUEUES.SERVER);
        channel = await connection.createChannel()
        //connect to 'test-queue', create one if doesnot exist already
        await channel.assertQueue(config.QUEUES.QUEUE_TEST)
        for (let index = 0; index < config.QUEUES.COUNT_MESSAGES; index++) {
            sendData(config.QUEUES.EXAMPLE_MESSAGE)
        }
        //close the channel and connection
        await channel.close();
        await connection.close();
    } catch (error) {
        console.log("Con: " + error)
    }
})();

const sendData = async (data) => {
    try {
        await channel.sendToQueue(config.QUEUES.QUEUE_TEST, Buffer.from(JSON.stringify(data)));
    } catch (error) {
        console.log("Send Data: " + error)
    }
}