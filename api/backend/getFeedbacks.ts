
import {
    QueryCommand,
} from "@aws-sdk/client-dynamodb";

import { dynamoDBClient, cloudWatchClient, wait, returnData } from "./helper"

export const getFeedbacks = async () => {
    const tableName = process.env.TABLE_NAME || "sentiment-feedback";

    const command = new QueryCommand({
        "TableName": tableName,
        "Limit": 20,
        "KeyConditionExpression": "#kn0 = :kv0",
        "ScanIndexForward": false,
        "ExpressionAttributeNames": {
            "#kn0": "partition"
        },
        "ExpressionAttributeValues": {
            ":kv0": {
                "N": "2024"
            }
        },
        "Select": "ALL_ATTRIBUTES"
    });

    let response;
    try {
        const results = await dynamoDBClient.send(command);
        response = {
            success: true, items: results.Items?.map(e => ({
                text: e.text.S,
                timestamp: e.timestamp.N,
                sentiment: e.sentiment.N,
                feedback: e.feedback.BOOL
            }))
        }
    } catch (err: any) {
        console.error("Error fetching latest items:", err);
        response = { success: true, message: err.message }
    }

    return returnData(response)
}