import "./login.css";
import { useRef, useState,useContext,useEffect} from "react";
import axios from "axios";
import { Link } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {AuthContext} from "../../context/AuthContext";

export default function Login() {
  const username = useRef();
  const password = useRef();
  const token = useContext(AuthContext);
  

  useEffect(() => {
    console.log("abc");
    /*
      const fetchServerList = async () => {
        try {
          const res = await axios.get("http://localhost:80/api/game/serverList");
          console.log("serverList",res.data);
          setServerList(res.data);
        } catch (err) {}
      };
      fetchServerList(); */
  }, []);

  const handleClick = async (e) => {
     e.preventDefault();
     try {
      const res = await axios.post("http://localhost:80/api/database/login", { username: username.current.value, password: password.current.value });
      console.log("res", res.data);
      token.tokenHandler(res.data);
  
      toast.success("başarılı");
    } catch (err) {

      toast.error("lütfen bilgilerinizi kontrol edin");

    }
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
              placeholder="Username"
              className="loginInput"
              required
              ref={username} />
            <input
              placeholder="Password"
              type="password"
              className="loginInput"
              minLength="6"
              required
              ref={password} />
            <div className="LogRegbuttons">
              <div className="loginButCon">
                <Link to="/">
                  <button className="loginButton" type="submit">
                    Log In
                  </button>
                </Link>
              </div>
              <div className="RegisterbutCon">
                <Link to="/register" >
                  <button className="loginRegisterButton">  Create a New Account </button>
                </Link>
              </div>


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