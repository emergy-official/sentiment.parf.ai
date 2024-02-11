const { getFeedbacks } = require("./getFeedbacks")
const { submitFeedback } = require("./submitFeedback")
const { handler: sendMail } = require("./sendEmailAlert")

// Test feedback values
test('Get feedback', async () => {
    const response = await getFeedbacks();
    const feedbacks: any = JSON.parse(response.body);
    expect(feedbacks.items.length).toBeGreaterThan(1)
});

// Test sending feedback values
test('Send feedback', async () => {
    const response = await submitFeedback({ text: "Test text", sentiment: 0.3, feedback: false });
    const body: any = JSON.parse(response.body)
    expect(body.success).toBe(true)
});

// Test sending an email
test('Send email alert', async () => {
    const response = await sendMail();
    expect(response.status).toBe("SUCCESS")
});
