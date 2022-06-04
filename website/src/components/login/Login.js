import "./login.css";
import {useRef} from "react";
import axios from "axios";
//import {loginCall} from "../../apiCalls";
import { CircularProgress } from "@material-ui/core";
import {Link} from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const email= useRef();
  const password= useRef();
  
  
 // const { user,isFetching,error,dispatch}=useContext(AuthContext);

  const handleClick= (e)=>{
    e.preventDefault(); //logine basınca sayfa yenilenmesin diye
   
    //loginCall({email:email.current.value,password:password.current.value},dispatch);
    
  };
  
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Pixel Arena</h3>
          <span className="loginDesc">
            2D Pixel Survival Games
          </span>
        </div>
        <div className="loginRight">
          < form className="loginBox" onSubmit={handleClick}>
            
            <input 
            placeholder="Email" 
            type="email" 
            className="loginInput"  
            required 
            ref={email} />
            <input 
            placeholder="Password" 
            type="password" 
            className="loginInput" 
            minLength="6"
            required
            ref={password} />
            <div className="LogRegbuttons">
            <button className="loginButton" type="submit">
            Log In
            </button>
            
            <button className="loginRegisterButton">  Create a New Account </button>
            
           
            </div>
            <ToastContainer
                hideProgressBar
                position="bottom-center"
                pauseOnHover={true}
                autoClose={1000}
              />
           
          </form>
        </div>
      </div>
    </div>
  );
}