import "./BelowHero.css";
import img1 from "./assets/img1.jpg";
import img2 from "./assets/img2.jpeg";
import img3 from "./assets/img3.jpeg";

function App() {
  return (
    <>
      <div className="container">
        <div className="box">
          <img src={img1} alt="Item 1" className="box-image" />
          <button className="view-album-button">Event 1</button>
        </div>
        <div className="box">
          <img src={img2} alt="Item 1" className="box-image" />
          <button className="view-album-button">Event 2</button>
        </div>
        <div className="box">
          <img src={img3} alt="Item 1" className="box-image" />
          <button className="view-album-button">Event 3</button>
        </div>
      </div>
    </>
  );
}

export default App;
