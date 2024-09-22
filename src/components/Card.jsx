import "./styles/Card.css";
import { useNavigate } from "react-router-dom";

export default function Card(Props) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/" + Props.url);
  };

  const style = {
    backgroundImage: `url(${Props.imageUrl})`,
  };

  return (
    <div className="card" style={style}>
      <div className="card-content">
        <h2 className="card-title">{Props.title}</h2>
        <p className="card-copy">{Props.copy}</p>
        <button className="card-btn" onClick={handleClick}>
          Iniciar
        </button>
      </div>
    </div>
  );
}
