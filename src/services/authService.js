import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: process.env.REACT_APP_USER_POOL_ID || 'us-east-1_XXXXXXXXX',
  ClientId: process.env.REACT_APP_CLIENT_ID || 'XXXXXXXXXXXXXXXXXXXXXXXXXX'
};

const userPool = new CognitoUserPool(poolData);

export const authService = {
  signUp: (email, password, attributes = {}) => {
    return new Promise((resolve, reject) => {
      const attributeList = Object.keys(attributes).map(key => ({
        Name: key,
        Value: attributes[key]
      }));

      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) reject(err);
        else resolve(result.user);
      });
    });
  },

  signIn: (email, password) => {
    return new Promise((resolve, reject) => {
      const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password
      });

      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool
      });

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => resolve({
          accessToken: result.getAccessToken().getJwtToken(),
          idToken: result.getIdToken().getJwtToken(),
          refreshToken: result.getRefreshToken().getToken()
        }),
        onFailure: (err) => reject(err)
      });
    });
  },

  signOut: () => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) cognitoUser.signOut();
  },

  getCurrentUser: () => {
    return new Promise((resolve, reject) => {
      const cognitoUser = userPool.getCurrentUser();
      if (!cognitoUser) return resolve(null);

      cognitoUser.getSession((err, session) => {
        if (err) reject(err);
        else if (!session.isValid()) resolve(null);
        else {
          cognitoUser.getUserAttributes((err, attributes) => {
            if (err) reject(err);
            else resolve({
              username: cognitoUser.getUsername(),
              attributes: attributes.reduce((acc, attr) => {
                acc[attr.Name] = attr.Value;
                return acc;
              }, {}),
              token: session.getIdToken().getJwtToken()
            });
          });
        }
      });
    });
  },

  getToken: () => {
    return new Promise((resolve, reject) => {
      const cognitoUser = userPool.getCurrentUser();
      if (!cognitoUser) return resolve(null);

      cognitoUser.getSession((err, session) => {
        if (err) reject(err);
        else resolve(session.getIdToken().getJwtToken());
      });
    });
  }
};
