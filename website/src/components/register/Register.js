import "./register.css";
import { useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();


  const handleClick = async (e) => {
    e.preventDefault(); //logine basınca sayfa yenilenmesin diye
    /*
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("password dont match");
      toast.error("parolalar eşleşmiyor")
      console.log("abc")
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        const res = await axios.post("/auth/activateAccount/", user); //current chat varsa önemli
        console.log("buraya girildi")
        
        toast.success("please check your email");

      } catch (err) {
        console.log(err);
        toast.error("işlem başarısız")
      }
    }*/
  };

  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">Pixel Arena</h3>
          <span className="registerDesc">
          2D Pixel Survival Games
          </span>
        </div>
        <div className="registerRight">
          <form className="registerBox" onSubmit={handleClick}>
            <input placeholder="Username" required ref={username} className="registerInput" />
            <input placeholder="Email" required type="email" ref={email} className="registerInput" />
            <input placeholder="Password" required minLength="6" type="password" ref={password} className="registerInput" />
            <input placeholder="Password Again" required type="password" ref={passwordAgain} className="registerInput" />
            
            <div className="RegLogbuttons">
            <button className="registerButton" type="submit">Sign Up</button>
           
              <button className="RegistersLoginButton">
             Log into Account  
              </button>
           
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