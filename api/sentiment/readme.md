```sh

cd api/sentiment

export DEV_ACCOUNT_ID=267341338450
export PROD_ACCOUNT_ID=258317103062
export ACCOUNT_ID=$DEV_ACCOUNT_ID


eval $(aws sts assume-role --profile 818028758633 --role-arn "arn:aws:iam::"$ACCOUNT_ID":role/provision" --role-session-name AWSCLI-Session | jq -r '.Credentials | "export AWS_ACCESS_KEY_ID=\(.AccessKeyId)\nexport AWS_SECRET_ACCESS_KEY=\(.SecretAccessKey)\nexport AWS_SESSION_TOKEN=\(.SessionToken)\n"')

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin "$ACCOUNT_ID".dkr.ecr.us-east-1.amazonaws.com/

export IMG_VERSION=latest
docker logout public.ecr.aws
docker build --platform linux/amd64 -t python-scikit-learn:$IMG_VERSION .

docker tag python-scikit-learn:$IMG_VERSION "$ACCOUNT_ID".dkr.ecr.us-east-1.amazonaws.com/python-scikit-learn:latest
docker push "$ACCOUNT_ID".dkr.ecr.us-east-1.amazonaws.com/python-scikit-learn:latest

aws lambda update-function-code --function-name sentiment_api --image-uri "$ACCOUNT_ID".dkr.ecr.us-east-1.amazonaws.com/python-scikit-learn:latest --region us-east-1

# docker run --platform linux/amd64 -p 9000:8080 python-scikit-learn:$IMG_VERSION
# curl "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"body": "{\"text\":\"I am so happy this is great news, congrats!\"}"}'  


# Download the file
rm -rf artifacts
export FILE_PATH="394184632525356578/a92235a047b64f03893d849cca9044b8"
aws s3 cp "s3://artifact-dev.sentiment.parf.ai/$FILE_PATH" ./ --recursive

# export FILE_PATH="553495617669467156/3a09d01665a841c2a42e2ea3a58ba05a"
```