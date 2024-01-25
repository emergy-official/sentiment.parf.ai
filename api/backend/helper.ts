// helper.ts  
export function helperFunction(): string {
    return "Hello from helper!";
}

import {
    SESClient,
} from "@aws-sdk/client-ses";
import {
    DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import {
    CloudWatchClient,
} from "@aws-sdk/client-cloudwatch";

export const dynamoDBClient = new DynamoDBClient({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        sessionToken: process.env.AWS_SESSION_TOKEN!,
    },
});

export const cloudWatchClient = new CloudWatchClient({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        sessionToken: process.env.AWS_SESSION_TOKEN!,
    },
});
export const sesClient = new SESClient({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        sessionToken: process.env.AWS_SESSION_TOKEN!,
    },
});


export const wait = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const returnData = (data: any) => {
    const output = {
        statusCode: 200,
        body: JSON.stringify(data)
    };

    console.log("OUTPUT", output)
    return output
}