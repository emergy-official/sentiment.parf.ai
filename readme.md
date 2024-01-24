```sh

eval $(aws sts assume-role --profile 818028758633 --role-arn "arn:aws:iam::258317103062:role/provision" --role-session-name AWSCLI-Session | jq -r '.Credentials | "export AWS_ACCESS_KEY_ID=\(.AccessKeyId)\nexport AWS_SECRET_ACCESS_KEY=\(.SecretAccessKey)\nexport AWS_SESSION_TOKEN=\(.SessionToken)\n"') 

export DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[*].{id:Id,origin:Origins.Items[1].Id}[?origin=='sentiment.parf.ai'].id" --output text)
```