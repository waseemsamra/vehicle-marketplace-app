#!/bin/bash

# Get Cognito User Pool ID
echo "Fetching Cognito User Pools..."
aws cognito-idp list-user-pools --max-results 10 --query 'UserPools[*].[Id,Name]' --output table

echo ""
echo "Copy the User Pool ID and update .env file:"
echo "REACT_APP_USER_POOL_ID=us-east-1_XXXXXXXXX"
