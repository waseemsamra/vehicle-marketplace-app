const awsConfig = {
  Auth: {
    region: process.env.REACT_APP_REGION || 'us-east-1',
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_CLIENT_ID,
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  },
  API: {
    endpoints: [
      {
        name: 'VehicleAPI',
        endpoint: process.env.REACT_APP_API_URL,
        region: process.env.REACT_APP_REGION || 'us-east-1'
      }
    ]
  }
};

export default awsConfig;
