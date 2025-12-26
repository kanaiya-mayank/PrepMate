const React = require('react');
const { createContext, useContext, useEffect, useState } = React;
const { auth } = require('../firebase/firebaseConfig');
const { onAuthStateChanged } = require('firebase/auth');

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        setUser(user);
        setToken(idToken);
      } else {
        setUser(null);
        setToken(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return React.createElement(
    AuthContext.Provider,
    { value: { user, token } },
    children
  );
};

const useAuth = () => useContext(AuthContext);

module.exports = { AuthProvider, useAuth };