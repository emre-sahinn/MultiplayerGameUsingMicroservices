import { createContext,useState} from "react";

const INITIAL_STATE = {
  token:"",
  tokenHandler: () => {}
};


export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState("");

  const tokenHandler = (token) => {
    setToken(token);
  };

  
  return (
    <AuthContext.Provider
    value={{ token: token, tokenHandler: tokenHandler }}
    >
      {children}
    </AuthContext.Provider>
  );
};