import {
  DynamoDBClient,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import {
  CloudWatchClient,
  PutMetricDataCommand,
} from "@aws-sdk/client-cloudwatch";

const dbClient = new DynamoDBClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  },
});
const cloudWatchClient = new CloudWatchClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  },
});

const sendMetric = async () => {
  const params = {
    MetricData: [
      {
        MetricName: "NoResponses",
        Dimensions: [
          {
            Name: "AppName",
            Value: "YourApplication",
          },
        ],
        Unit: "Count",
        Value: 1,
      },
    ],
    Namespace: "YourApplicationMetrics",
  };
  console.log("EE");
  const command = new PutMetricDataCommand(params);

  try {
    console.log("Test");
    const data = await cloudWatchClient.send(command);
    console.log("Success", data);
  } catch (err) {
    console.error("An error occurred", err);
  }
};

const submitFeedback = async (
  text = "undefined",
  sentiment = -1,
  feedback = false
) => {
  console.log(text, sentiment, feedback);
  const input = {
    RequestItems: {
      ["sentiment-feedback"]: [
        {
          PutRequest: {
            Item: {
              timestamp: {
                N: new Date().getTime().toString(),
              },
              text: {
                S: text || "",
              },
              sentiment: {
                N: sentiment.toString() || "",
              },
              feedback: {
                BOOL: feedback,
              },
            },
          },
        },
      ],
    },
  };

  const command = new BatchWriteItemCommand(input);
  const max_retry = 3;
  for (let retry = 1; retry <= max_retry; retry++) {
    try {
      await dbClient.send(command);
      console.log("Done adding feedback");
      return { success: true };
    } catch (error) {
      console.log(`BatchWriteItem failed on retry ${retry}.`);

      await delay(2000); // Wait for 2 seconds before retrying
      if (retry >= max_retry) {
        return { success: false, message: error?.message };
      }
    }
  }
};

export const handler = async (event, context) => {
  try {
    await sendMetric();
    // const { t, s, f } = JSON.parse(event.body);
    // const result = await submitFeedback(t, s, f);

    // const response = {
    //   statusCode: 200,
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Headers": "Content-Type,Authorization",
    //     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    //   },
    //   body: JSON.stringify(result),
    // };

    // console.log(result);
    // return response;
  } catch (error) {
    context.fail(error);
  }
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/*
LAMBDA TEST
{
  "body": "{\"t\": \"good news\", \"s\":0.2, \"f\":false}"
}

POSTMAN TEST
{
    "s": "post"
}
*/
