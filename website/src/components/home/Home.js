import "./home.css";
import axios from "axios";
import { Link } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState,useContext } from "react";
import {AuthContext} from "../../context/AuthContext";

export default function Home() {
  const [serverList, setServerList] = useState([]);
  const {dispatch} = useContext(AuthContext);

  useEffect(() => {
    const fetchServerList = async () => {
      try {
        const res = await axios.get("http://localhost:80/api/game/serverList");
        console.log("serverList", res.data);
        setServerList(res.data);
      } catch (err) { }
    };
    fetchServerList();
  }, []);

  
  const handleClick = (server) => {
  
    console.log("server",server);
    window.location.assign(server.IP + ":" + server.port);
 
 };
 const LogOut = () => {
  dispatch({type: "LOGOUT"});
};


  return (
    <div className="home">
        
      <div className="homeWrapper">
        <div className="homeLeft">
          <h3 className="homeLogo">Pixel Arena</h3>
          <span className="homeDesc">
            2D Pixel Survival Games
          </span>
          <Link to="/" >
          <button className="homeLogOutButton" onClick={() => LogOut()}>
              Log Out
         </button>
         </Link>
        </div>
        <div className="homeRight">
          < div className="homeBox" >
            <div className="homeButtons">
              {(serverList.length > 0) && serverList.map((server) => (
                <div className="homeServer" key= {server._id}>

                  <button className="homeServerButton" onClick={() => handleClick(server)}>
                    server  {serverList.indexOf(server) + 1}

                  </button>


                </div>
              ))
              }


            </div>
            <ToastContainer
              hideProgressBar
              position="bottom-center"
              pauseOnHover={true}
              autoClose={1000}
            />

          </div>
        </div>
      </div>
    </div>
  );
}