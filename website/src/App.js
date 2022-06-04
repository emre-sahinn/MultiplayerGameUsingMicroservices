import Login from "./components/login/Login";
import Register from "./components/register/Register";


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
  
  return (
    
    <Router>
      <>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        
       
      </Routes>
      </>
    </Router>
  
  );
}

export default App;
