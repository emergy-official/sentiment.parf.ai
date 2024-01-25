
FROM public.ecr.aws/lambda/python:3.12

# Copy requirements.txt
RUN echo "scikit-learn==1.4.0" > ${LAMBDA_TASK_ROOT}/requirements.txt

# Install the specified packages
RUN pip install -r requirements.txt

# Copy function code
COPY lambda_function.py ${LAMBDA_TASK_ROOT}
COPY simple_count_vectorizer.pkl ${LAMBDA_TASK_ROOT}
COPY simple_sentiment_model.pkl ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "lambda_function.handler" ]

