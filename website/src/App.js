import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Home from "./components/home/Home";

import { AuthContext } from "./context/AuthContext";
import { useContext} from "react";


import {
  BrowserRouter as Router,
  Switch,//routes diger adı
  Route,
  Routes,
  Link,
  Redirect,
} from "react-router-dom";
import { useEffect,useState } from "react";


function App() {
  
  const { token } = useContext(AuthContext);
  console.log("token",token);
  return (
    
    <Router>
      <>
      <Routes>
        <Route path="/" element={token ? <Home/> : <Login/> }/>
        <Route path="/register" element={!token && <Register/>}/>
      
        
       
      </Routes>
      </>
    </Router>
  
  );
}

export default App;
