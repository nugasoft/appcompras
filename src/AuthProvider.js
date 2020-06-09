import React, { useState} from "react";
import { AsyncStorage} from 'react-native';

export const AuthContext = React.createContext({
  User: null,
  login: () => {},
  logout: () => {}
});


export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  return <AuthContext.Provider value={{
    user,
    login: (data) => {
        setUser(data);
        AsyncStorage.setItem("User", JSON.stringify(data));
    },
    logout: () => {
      setUser(null);
      AsyncStorage.removeItem("User");
    }
   }}>
  {children}
  </AuthContext.Provider>
}