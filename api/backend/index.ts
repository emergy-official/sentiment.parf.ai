// index.ts  
import { getFeedbacks } from './getFeedbacks';
import { helperFunction, returnData } from './helper';
import { submitFeedback } from './submitFeedback';

export async function handler(event: any, context: any) {
  console.log("INPUT", event);

  if (event.httpMethod == "POST") {
    // Submit feedback
    const params = JSON.parse(event.body);
    return submitFeedback(params)
  } else if (event.httpMethod == "GET") {
    // Get latest feedback
    return getFeedbacks()
  }

  return returnData({
    message: "Nothing to say"
  })
}  