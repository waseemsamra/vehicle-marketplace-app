#!/bin/bash

echo "🚀 Deploying Vehicle Marketplace with Authentication..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo "Please create .env with your Cognito configuration"
    exit 1
fi

# Build React app
echo -e "${YELLOW}📦 Building React application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"

# Create S3 bucket with timestamp
TIMESTAMP=$(date +%s)
BUCKET_NAME="vehicle-marketplace-auth-${TIMESTAMP}"
echo -e "${YELLOW}📁 Creating S3 bucket: ${BUCKET_NAME}${NC}"

aws s3 mb s3://${BUCKET_NAME} --region us-east-1

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to create S3 bucket${NC}"
    exit 1
fi

# Enable static website hosting
aws s3 website s3://${BUCKET_NAME} \
    --index-document index.html \
    --error-document index.html

# Set bucket policy for public access
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy \
    --bucket ${BUCKET_NAME} \
    --policy file://bucket-policy.json

# Upload build files
echo -e "${YELLOW}📤 Uploading files to S3...${NC}"
aws s3 sync build/ s3://${BUCKET_NAME} --delete

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to upload files${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Files uploaded successfully${NC}"

# Get S3 website URL
S3_URL="http://${BUCKET_NAME}.s3-website-us-east-1.amazonaws.com"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${YELLOW}📊 S3 Bucket:${NC} s3://${BUCKET_NAME}"
echo -e "${YELLOW}🌎 Website URL:${NC} ${S3_URL}"
echo ""
echo -e "${YELLOW}Authentication Status:${NC}"
echo "  • Cognito User Pool: ${REACT_APP_USER_POOL_ID}"
echo "  • Cognito Client ID: ${REACT_APP_CLIENT_ID:0:10}...${REACT_APP_CLIENT_ID: -5}"
echo ""
echo -e "${YELLOW}Test your app:${NC}"
echo "  • Open: ${S3_URL}"
echo "  • Sign up with your email"
echo "  • Check email for verification code"
echo "  • Sign in and browse vehicles"
echo -e "${GREEN}========================================${NC}"

# Clean up
rm -f bucket-policy.json
