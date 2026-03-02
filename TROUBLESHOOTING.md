# Network Error Troubleshooting Guide

## ❌ "Network Error" - Common Causes & Solutions

### 1. **CORS Not Enabled on API Gateway**

**Problem**: API Gateway blocking requests from browser

**Solution**: Enable CORS in API Gateway

```javascript
// Lambda Response Format (REQUIRED)
{
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
}
```

**AWS Console Steps**:
1. Go to API Gateway
2. Select your API
3. Select Resource → Actions → Enable CORS
4. Check all methods (GET, POST, PUT, DELETE)
5. Click "Enable CORS and replace existing CORS headers"
6. Deploy API to stage

---

### 2. **API Not Deployed**

**Problem**: Changes not deployed to stage

**Solution**: Deploy API
1. API Gateway → Select API
2. Actions → Deploy API
3. Select stage (dev/prod)
4. Click Deploy

---

### 3. **Wrong API URL**

**Problem**: Incorrect API endpoint

**Solution**: Verify URL format

```bash
# Correct format:
https://[api-id].execute-api.[region].amazonaws.com/[stage]

# Example:
https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev
```

**Update .env**:
```bash
REACT_APP_API_URL=https://YOUR-ACTUAL-API-ID.execute-api.us-east-1.amazonaws.com/dev
```

---

### 4. **Lambda Function Not Returning Proper Response**

**Problem**: Lambda not returning correct format

**Solution**: Update Lambda response

```javascript
// ❌ WRONG
return { id: '123', name: 'John' };

// ✅ CORRECT
return {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ id: '123', name: 'John' })
};
```

---

### 5. **API Gateway Integration Not Configured**

**Problem**: API Gateway not connected to Lambda

**Solution**: Configure Integration
1. API Gateway → Select Resource
2. Integration Request
3. Integration type: Lambda Function
4. Select your Lambda function
5. Save and Deploy

---

## 🔧 Quick Fixes

### Fix 1: Update API URL

```bash
cd /tmp/customer-app
echo "REACT_APP_API_URL=https://YOUR-ACTUAL-API-ID.execute-api.us-east-1.amazonaws.com/dev" > .env
npm start
```

### Fix 2: Test API Directly

```bash
# Test with curl
curl https://YOUR-API-URL/dev/customers

# Should return JSON, not HTML or error
```

### Fix 3: Check Browser Console

```javascript
// Open DevTools (F12) → Network tab
// Look for:
// - Request URL
// - Status Code
// - Response Headers
// - CORS errors
```

### Fix 4: Temporary CORS Bypass (Development Only)

```javascript
// src/services/customerApi.js
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add this for testing
  withCredentials: false,
});
```

---

## 🧪 Test Your API

### Test Script

```javascript
// test-api.js
const axios = require('axios');

const API_URL = 'https://YOUR-API-URL/dev';

async function testAPI() {
  try {
    console.log('Testing GET /customers...');
    const response = await axios.get(`${API_URL}/customers`);
    console.log('✅ Success:', response.data);
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('Response:', error.response?.data);
    console.log('Status:', error.response?.status);
    console.log('Headers:', error.response?.headers);
  }
}

testAPI();
```

Run:
```bash
node test-api.js
```

---

## 📋 Checklist

- [ ] API Gateway CORS enabled
- [ ] API deployed to correct stage
- [ ] Lambda returns correct response format
- [ ] Lambda has CORS headers
- [ ] API URL is correct in .env
- [ ] Integration configured in API Gateway
- [ ] Lambda has permissions
- [ ] DynamoDB table exists
- [ ] Lambda can access DynamoDB

---

## 🔍 Debug Steps

### Step 1: Check API URL
```bash
# In browser console
console.log(process.env.REACT_APP_API_URL);
```

### Step 2: Check Network Tab
- Open DevTools (F12)
- Go to Network tab
- Try to fetch customers
- Look at failed request
- Check Response Headers for CORS

### Step 3: Test with Postman/curl
```bash
curl -X GET https://YOUR-API-URL/dev/customers \
  -H "Content-Type: application/json"
```

### Step 4: Check Lambda Logs
```bash
# AWS Console → CloudWatch → Log Groups
# Find /aws/lambda/YOUR-FUNCTION-NAME
# Check recent logs for errors
```

---

## 💡 Common Error Messages

### "Network Error"
- CORS not enabled
- API not deployed
- Wrong URL

### "Failed to fetch"
- CORS issue
- API Gateway down
- Network connectivity

### "404 Not Found"
- Wrong endpoint
- API not deployed
- Resource doesn't exist

### "500 Internal Server Error"
- Lambda function error
- DynamoDB error
- Check CloudWatch logs

### "403 Forbidden"
- API key required
- IAM permissions issue
- Authorizer failing

---

## 🚀 Quick Solution

**Most common fix**:

1. **Enable CORS in API Gateway**:
   - API Gateway Console
   - Select your API
   - Actions → Enable CORS
   - Enable for all methods
   - Deploy API

2. **Update Lambda Response**:
```javascript
exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ items: [] })
  };
};
```

3. **Restart React App**:
```bash
# Stop app (Ctrl+C)
npm start
```

---

## 📞 Still Not Working?

1. Share the exact error from browser console
2. Share API Gateway URL
3. Share Lambda function code
4. Check CloudWatch logs for Lambda errors

---

## ✅ Working Example

```javascript
// Lambda Function (GET /customers)
exports.handler = async (event) => {
  const AWS = require('aws-sdk');
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  
  try {
    const result = await dynamodb.scan({
      TableName: 'customers'
    }).promise();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: result.Items,
        lastKey: result.LastEvaluatedKey
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: error.message })
    };
  }
};
```

This should resolve your Network Error!
