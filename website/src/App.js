import Login from "./components/login/Login";


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
        <Route path="/login" element={<Login/>}/>
        
       
      </Routes>
      </>
    </Router>
  
  );
}

export default App;
