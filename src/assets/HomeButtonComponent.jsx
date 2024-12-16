import { useNavigate } from "react-router-dom";
import HomeImgSrc from "./Home.png"; // Home-Button-Bild importieren

export default function HomeButton() {
    const navigate = useNavigate(); // Router f�r Navigation

    const handleClick = () => {
        navigate("/"); // Zur Hauptseite (App.jsx) navigieren
    };

    return (
        <div
            style={{
                position: "fixed", // Am unteren Rand positionieren
                bottom: "20px",
                right: "20px",
                cursor: "pointer",
                zIndex: 1000, // �ber allen anderen Elementen sichtbar
            }}
            onClick={handleClick}
        >
            <img
                src={HomeImgSrc}
                alt="Home"
                style={{
                    width: "60px", // Gr��e des Home-Icons
                    height: "60px",
                    borderRadius: "50%", // Rundes Icon
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Schatten
                }}
            />
        </div>
    );
}