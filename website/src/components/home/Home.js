import "./home.css";
import axios from "axios";
import { Link } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const serverFirst = async (e) => {
    /*
    try {
      const res = await axios.post("http://localhost:80/api/game/1");
      console.log("serverfirst", res.data);
      toast.success("başarılı");
    } catch (err) {
      toast.error("Hata");
    }*/
  };
   
  const serverSecond = async (e) => {
    /*
    try {
      const res = await axios.post("http://localhost:80/api/game/2");
      console.log("serversecond", res.data);
      toast.success("başarılı");
    } catch (err) {
      toast.error("Hata");

    }*/
  };

  return (
    <div className="home">
      <div className="homeWrapper">
        <div className="homeLeft">
          <h3 className="homeLogo">Pixel Arena</h3>
          <span className="homeDesc">
            2D Pixel Survival Games
          </span>
        </div>
        <div className="homeRight">
          < div className="homeBox" >

            
            <div className="homeButtons">
              <div className="homeSerFirst">
                <Link to="/">
                  <button className="homeSerFirstButton"  onClick={serverFirst}>
                    Server1
                  </button>
                </Link>
              </div>
              <div className="homeSerSec">
                <Link to="/" >
                  <button className="homeSerSecButton" onClick={serverSecond}> 
                  Server2 </button>
                </Link>
              </div>


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