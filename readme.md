```sh

eval $(aws sts assume-role --profile 818028758633 --role-arn "arn:aws:iam::258317103062:role/provision" --role-session-name AWSCLI-Session | jq -r '.Credentials | "export AWS_ACCESS_KEY_ID=\(.AccessKeyId)\nexport AWS_SECRET_ACCESS_KEY=\(.SecretAccessKey)\nexport AWS_SESSION_TOKEN=\(.SessionToken)\n"') 

export DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[*].{id:Id,origin:Origins.Items[1].Id}[?origin=='sentiment.parf.ai'].id" --output text)
```

## API Sentiment

Example to publish a docker image to AWS ECR from your local machine

```sh
export IMG_VERSION=latest
docker build --platform linux/amd64 -t python-scikit-learn:$IMG_VERSION .
docker run --platform linux/amd64 -p 9000:8080 python-scikit-learn:$IMG_VERSION

export JSON=""
curl "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"body": "{\"text\":\"I am so happy this is great news, congrats!\"}"}'  

# Login

export DEV_ACCOUNT_ID=267341338450
export PROD_ACCOUNT_ID=258317103062
export ACCOUNT_ID=$PROD_ACCOUNT_ID

## Assme dev role
eval $(aws sts assume-role --profile 818028758633 --role-arn "arn:aws:iam::"$ACCOUNT_ID":role/provision" --role-session-name AWSCLI-Session | jq -r '.Credentials | "export AWS_ACCESS_KEY_ID=\(.AccessKeyId)\nexport AWS_SECRET_ACCESS_KEY=\(.SecretAccessKey)\nexport AWS_SESSION_TOKEN=\(.SessionToken)\n"')

aws ecr create-repository
## Docker login
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin "$ACCOUNT_ID".dkr.ecr.us-east-1.amazonaws.com/

docker tag python-scikit-learn:$IMG_VERSION "$ACCOUNT_ID".dkr.ecr.us-east-1.amazonaws.com/python-scikit-learn:latest
docker push "$ACCOUNT_ID".dkr.ecr.us-east-1.amazonaws.com/python-scikit-learn:latest

# docker image inspect python-scikit-learn:$IMG_VERSION --format='{{.Size}}' | awk '{size=$1/1024/1024/1024; printf "%.2f GB\n", size}'  

```

## API Feedback

Example to test the feedback api from your local machine (to the dev API).  
The feedback API write data to dynamodb and publish an event in cloudwatch.  

The local test talk directly to the DEV environment and required to be logged in.

```sh
# First login in your AWS Organisation
aws sso login --profile EmergyInfra

# Second login from the infra account to your dev account (security ++)

export DEV_ACCOUNT_ID=267341338450
export PROD_ACCOUNT_ID=258317103062
export INFRA_ACCOUNT_ID=818028758633

eval $(aws sts assume-role --profile $INFRA_ACCOUNT_ID --role-arn "arn:aws:iam::"$DEV_ACCOUNT_ID":role/provision" --role-session-name AWSCLI-Session | jq -r '.Credentials | "export AWS_ACCESS_KEY_ID=\(.AccessKeyId)\nexport AWS_SECRET_ACCESS_KEY=\(.SecretAccessKey)\nexport AWS_SESSION_TOKEN=\(.SessionToken)\n"')

# You can check the role you are assuming
aws sts get-caller-identity

# Now you can run the script and act as it's from the DEV environment
cd api/feedback
tsx localTest.ts
```

To prepare the lambda locally for terraform:
```
cd api/feedback
npm run prepare:all
```