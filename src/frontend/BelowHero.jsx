import "./BelowHero.css";
import img1 from "./assets/img1.jpg";
import img2 from "./assets/img2.jpeg";
import img3 from "./assets/img3.jpeg";
import { useNavigate } from "react-router-dom";

function BelowHero() {
  const navigate = useNavigate();

  // Function to navigate to gallery with selected event filter
  const handleViewAlbum = (eventName) => {
    navigate(`/gallery?event=${encodeURIComponent(eventName)}`);
  };

  return (
    <div className="container">
      <div className="box">
        <img src={img1} alt="Item 1" className="box-image" />
        <button className="view-album-button" onClick={() => handleViewAlbum("Exodia")}>
          Exodia - Cultural Fest
        </button>
      </div>
      <div className="box">
        <img src={img2} alt="Item 2" className="box-image" />
        <button className="view-album-button" onClick={() => handleViewAlbum("Xpecto")}>
          Xpecto - Tech Fest
        </button>
      </div>
      <div className="box">
        <img src={img3} alt="Item 3" className="box-image" />
        <button className="view-album-button" onClick={() => handleViewAlbum("General")}>
          General Photos
        </button>
      </div>
    </div>
  );
}

export default BelowHero;
