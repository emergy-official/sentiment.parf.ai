import pickle
import json

# Load the trained model and CountVectorizer object  
with open('./simple_sentiment_model.pkl', 'rb') as file:  
    model = pickle.load(file)  
  
with open('./simple_count_vectorizer.pkl', 'rb') as file:  
    vectorizer = pickle.load(file)  
  
def handler(event, context):
    body = json.loads(event['body'])
    print(body)

    # Preprocess the input text  
    text = body['text'].lower()
  
    # Convert the preprocessed text into numerical features  
    X = vectorizer.transform([text])  
  
    # Make sentiment prediction  
    prediction = model.predict(X)  
    print(prediction)
    # Return the predicted sentiment  
    return {
        'statusCode': 200,
        # 'body': json.dumps({'sentiment': round(prediction[0], 2)})
    }