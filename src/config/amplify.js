import { Amplify } from 'aws-amplify';
import { signIn, signUp, signOut, getCurrentUser, fetchAuthSession, confirmSignUp } from 'aws-amplify/auth';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_USER_POOL_ID || 'us-east-1_XXXXXXXXX',
      userPoolClientId: process.env.REACT_APP_CLIENT_ID || 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true
      }
    }
  },
  API: {
    REST: {
      VehicleAPI: {
        endpoint: process.env.REACT_APP_API_URL || 'https://4peif882l0.execute-api.us-east-1.amazonaws.com/dev',
        region: 'us-east-1'
      }
    }
  }
};

Amplify.configure(amplifyConfig);

export { signIn, signUp, signOut, getCurrentUser, fetchAuthSession, confirmSignUp };
export default amplifyConfig;
