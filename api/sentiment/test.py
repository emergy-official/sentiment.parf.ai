import pickle
import json
import numpy as np
import tensorflow as tf  
tf.config.set_visible_devices([], 'GPU')

from tensorflow import keras
import os


# with open("./artifacts/model.pkl", "rb") as file:  
#     model = pickle.load(file)  
  
# with open("./artifacts/tokenizer.pkl", "rb") as file:  
#     tokenizer = pickle.load(file)
    
# params = json.load(open("./artifacts/params.json", 'r', encoding='utf-8'))

# def pad_sequences(sequence, maxlen, value=0):  
#     return np.array([np.pad(s[:maxlen], (max(0, maxlen-len(s)), 0), 'constant', constant_values=value) if len(s) < maxlen else s[:maxlen] for s in sequence])  
  

# def predict(text_to_predict):
#     # Tokenizing and padding  
#     sequence = tokenizer.texts_to_sequences(text_to_predict)
#     # We need to pad sequences to ensure uniform input size  
#     padded_sequence = pad_sequences(sequence, maxlen=int(params["input_length"]))
    
#     prediction = model.predict(padded_sequence)
#     sentiment = prediction.astype(float)[0][0]
#     return sentiment.item()
  
# def handler(event, context):
#     body = json.loads(event['body'])
#     # Preprocess the input text  
#     text = body['text']
#     print("Predicting...", text)
#     return {
#         'statusCode': 200,
#         'body': json.dumps({'sentiment': predict([text])})
#     }

with open("./artifacts/model.pkl", "rb") as file:  
    model = pickle.load(file)  
  
with open("./artifacts/tokenizer.pkl", "rb") as file:  
    tokenizer = pickle.load(file)
    
params = json.load(open("./artifacts/params.json", 'r', encoding='utf-8'))
    
  
def pad_sequences(sequence, maxlen, value=0):  
    return np.array([np.pad(s[:maxlen], (max(0, maxlen-len(s)), 0), 'constant', constant_values=value) if len(s) < maxlen else s[:maxlen] for s in sequence])  
  
def predict(text_to_predict):
    # Tokenizing and padding  
    sequence = tokenizer.texts_to_sequences(text_to_predict)
    # We need to pad sequences to ensure uniform input size  
    padded_sequence = pad_sequences(sequence, maxlen=int(params["input_length"]))
    print(padded_sequence)
    
    prediction = model.predict(padded_sequence)
    sentiment = prediction.astype(float)[0][0]
    return sentiment.item()

print(predict(["I am so sad, this is very bad news, terrible!"]))
