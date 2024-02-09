import pickle
import json
import numpy as np

with open("./artifacts/model.pkl", "rb") as file:  
    model = pickle.load(file)
    
with open("./artifacts/tokenizer.pkl", "rb") as file:  
    tokenizer_w2vec = pickle.load(file)

params = json.load(open("./artifacts/params.json", 'r', encoding='utf-8'))
def pad_sequences(sequence, maxlen, value=0):  
    return np.array([np.pad(s[:maxlen], (max(0, maxlen-len(s)), 0), 'constant', constant_values=value) if len(s) < maxlen else s[:maxlen] for s in sequence])  
  
def predict(comment, model, vector_model):
    # We need to pad sequences to ensure uniform input size  
    sequence = tokenizer_w2vec.texts_to_sequences([comment])
    padded_sequence = pad_sequences(sequence, maxlen=int(params["input_length"]))

    prediction = model.predict(padded_sequence)
    # print(prediction)
    sentiment = prediction.astype(float)[0][0]
    return sentiment.item()
    
def comment_to_vec(comment, model):
    vec = np.zeros(100)
    num_words = 0
    for word in comment:
        if word in model.wv:
            vec += model.wv[word]
            num_words += 1
    if num_words > 0:
        vec /= num_words
    return vec

print(predict("I am so sad, this is very bad news, terrible!", model, tokenizer_w2vec))
print(predict("I am so happy, this is very good news, congrats!", model, tokenizer_w2vec))
print(predict("Our newsfeed is full of sadness today as this absolutely #devastating news broke.", model, tokenizer_w2vec))
