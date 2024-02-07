import { handler } from "./index"
import { handler as sendEmail } from "./sendEmailAlert"

// tsx localTest.ts

const testGet = async () => {
    const response = await handler({
        body: ``,
        httpMethod: "GET"
    },
        {
            fail: (error: any) => {
                console.log("ERROR", error);
            },
        })

    return response
}
const testPost = async () => {
    const response = await handler({
        body: `{"text": "Third item", "sentiment": 0.88, "feedback": false}`,
        httpMethod: "POST"
    },
        {
            fail: (error: any) => {
                console.log("ERROR", error);
            },
        })

    return response
}

const main = async () => {
    // const response = await testPost()
    // const response = await testGet()
    const response = await sendEmail()
    console.log("RESPONSE", response)
}

main()