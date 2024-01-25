from lambda_function import handler  
  
event = {  
    # 'text': 'im meeting up with one of my besties tonight! Cant wait!'  
    # 'text': 'my whole body feels itchy and like its on fire '  
    'body': '{"text": "I am so happy this is great news, congrats!"}'
}

result = handler(event, None)  
print(result)