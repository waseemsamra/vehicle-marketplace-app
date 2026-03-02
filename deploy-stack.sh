#!/bin/bash

# Deploy CloudFormation stack
echo "Deploying CloudFormation stack..."

aws cloudformation deploy \
  --template-file cloudformation-template.yaml \
  --stack-name vehicle-marketplace-stack \
  --capabilities CAPABILITY_IAM \
  --region us-east-1

# Get outputs
echo ""
echo "Getting stack outputs..."
aws cloudformation describe-stacks \
  --stack-name vehicle-marketplace-stack \
  --query 'Stacks[0].Outputs' \
  --output table

echo ""
echo "Update your .env file with these values:"
echo "REACT_APP_USER_POOL_ID=<UserPoolId from above>"
echo "REACT_APP_CLIENT_ID=<UserPoolClientId from above>"
echo "REACT_APP_API_URL=<ApiUrl from above>"
