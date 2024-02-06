import axios from 'axios';

const getAPIURL = () => {
    return document.location.host.includes("localhost") ? "https://dev.sentiment.parf.ai/api" : "/api"
}

export const getRandomElement = (arr: any) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

export const getLatestFeedbacks = async (feedbackStore: any, showFeedbackLoading: any) => {
    try {
        showFeedbackLoading.set(true)
        const res: any = await axios.get(`${getAPIURL()}/sentiment/feedback`)
        if (res?.data?.items) {
            feedbackStore.set(res?.data?.items)
        }
        showFeedbackLoading.set(false)
    } catch (e) {
        console.error("Error", e)
        alert(`Error response of the feedback API ${e.message}`)
        return null
    }
}

export const startLambda = async (isStarted: any, setIsStarted: any) => {
    try {
        if (isStarted) return;
        const res: any = await sendPredictRequest("any text here to start the lambda to improve speed for future request")
        if (res?.sentiment > -1) {
            setIsStarted(true)
        }
    } catch (e) {
        console.error("Error", e)
        alert(`Error response of the API ${e.message}`)
        return null
    }
}
export const sendPredictRequest = async (text: string) => {
    try {
        const res: any = await axios({
            method: "post",
            url: `${getAPIURL()}/sentiment`,
            data: { text },
            timeout: 180000
        })
        return res?.data
    } catch (e) {
        console.error("Error", e)
        alert(`Error response of the API ${e.message}`)
        return null
    }
}

export const sendFeedbackRequest = async (text: string, sentiment: number, feedback: boolean) => {
    try {
        const res: any = await axios.post(`${getAPIURL()}/sentiment/feedback`, { text, sentiment, feedback })
        return res?.data
    } catch (e) {
        console.error("Error", e)
        alert(`Error response of the API ${e.message}`)
        return null
    }
}