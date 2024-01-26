import axios from 'axios';

const getAPIURL = () => {
    return document.location.host.includes("localhost") ? "https://dev.sentiment.parf.ai/api" : "/api"
}

export const sendPredictRequest = async (text: string) => {
    try {
        const res: any = await axios.post(`${getAPIURL()}/sentiment`, { text })
        return res?.data
    } catch (e) {
        console.error("Error", e)
        alert(`Error response of the API ${e.message}`)
        return null
    }
}