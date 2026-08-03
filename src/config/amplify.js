import * as mongoAuth from '../services/mongoAuth';

// Auth facade backed by MongoDB + JWT instead of AWS Cognito. The named
// exports are intentionally identical to the old Amplify shim so that
// hooks/useAuth.js, Login.js and services/vehicleApi.js keep working unchanged.
const signIn = (params) => mongoAuth.signin(params);
const signUp = (params) => mongoAuth.signup(params);
const signOut = () => mongoAuth.signout();
const getCurrentUser = () => mongoAuth.getCurrentUser();
const confirmSignUp = (params) => mongoAuth.confirmSignUp(params);
const fetchAuthSession = () => mongoAuth.fetchAuthSession();

export { signIn, signUp, signOut, getCurrentUser, confirmSignUp, fetchAuthSession };
