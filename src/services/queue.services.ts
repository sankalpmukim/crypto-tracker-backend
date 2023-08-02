import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

interface QueueService {
  publishMessage(messageBody: string): Promise<void>;
}

class SQSService implements QueueService {
  private sqsClient: SQSClient;
  private queueUrl: string;

  constructor() {
    this.queueUrl = process.env.AWS_SQS_URL as string;
    this.sqsClient = new SQSClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? ``,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ``,
      },
    });
  }

  async publishMessage(messageBody: string): Promise<void> {
    const params = {
      QueueUrl: this.queueUrl,
      MessageBody: messageBody,
    };

    try {
      const result = await this.sqsClient.send(new SendMessageCommand(params));
      console.log("Message sent successfully, MessageId:", result.MessageId);
    } catch (error) {
      console.error("Error sending SQS message", error);
    }
  }
}

const queueClient = new SQSService();

export default queueClient;
