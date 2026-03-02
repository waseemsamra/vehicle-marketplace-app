import { useState, useEffect, createContext, useContext } from 'react';
import { signIn, signUp, signOut, getCurrentUser } from '../config/amplify';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email, password, attributes = {}) => {
    try {
      await signUp({ 
        username: email, 
        password, 
        options: { 
          userAttributes: { 
            email,
            given_name: attributes.given_name || email.split('@')[0],
            family_name: attributes.family_name || 'User',
            phone_number: attributes.phone_number || '+10000000000'
          } 
        } 
      });
      toast.success('Sign up successful! Check your email for confirmation code.');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const handleSignIn = async (email, password) => {
    try {
      const result = await signIn({ username: email, password });
      await checkUser();
      toast.success('Signed in successfully!');
      return result;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      toast.success('Signed out successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp: handleSignUp, signIn: handleSignIn, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};
