import { useState } from "preact/hooks";
import { sendPredictRequest } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Greeting() {
  const [text, setText] = useState("Now the wine producers join the revolt destroying foreign wine shipments which undercut locally produced wine, which is subject to agricultural net zero taxes! ‘Global equality’ really means local collapse! The farmers know it 👀");
  const [prediction, setPrediction] = useState(-10);

  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [loadingApproval, setLoadingApproval] = useState(false);
  const [loadingRefusal, setLoadingRefusal] = useState(false);

  const isPositive = Math.round(prediction) == 1

  const handleInput = (e) => {
    const target = e.target as HTMLTextAreaElement;
    setText(target.value);
  };

  const handlePredictBtn = async () => {

    setLoadingPrediction(true)
    const res = await sendPredictRequest(text)
    if(res?.sentiment) {
      setPrediction(res.sentiment)
    }
    setLoadingPrediction(false)

    console.log(text)
  };

  return (
    <div class="form">
      <h1>Sentiment analyzer</h1>
      <textarea onInput={handleInput} value={text} disabled={prediction > -10}></textarea>
      {prediction == -10 ?

        <button class={`predict ${loadingPrediction ? "icon-visible" : ""}`} disabled={loadingPrediction} onClick={handlePredictBtn}>
          {loadingPrediction ? "" : "Predict"}
          <i class="fa-solid fa-spinner-scale fa-spin-pulse"></i>
        </button> :

        <div class="prediction">
          <span class={`prediction-value`}>
            Text is {isPositive ? `positive` : `negative`} ({prediction})
          </span>
          <div class="feedback">
            <button class="agree">Correct</button>
            <button class="disagree">Incorrect</button>
          </div>
        </div>}
    </div>
  );
}
