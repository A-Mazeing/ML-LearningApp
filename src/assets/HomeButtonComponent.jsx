import { useNavigate } from "react-router-dom";
import HomeImgSrc from "./Home.png";
import {Row} from "react-grid-system"; // Home-Button-Bild importieren

export default function HomeButton() {
    const navigate = useNavigate(); // Router f�r Navigation

    const handleClick = () => {
        navigate("/"); // Zur Hauptseite (App.jsx) navigieren
    };

    return (
        <Row
            style={{
                //position: "fixed", // Fixieren
                left: "50%", // Horizontal zentrieren
                justifyContent: "center",
                bottom: 0,
                marginBottom: "20px",
                cursor: "pointer",
                zIndex: 1000, // �berlagert andere Elemente
            }}
            onClick={handleClick}
        >
            <img
                src={HomeImgSrc}
                alt="Home"
                style={{
                    width: "60px", // Gr��e des Home-Icons
                    height: "60px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Schatten f�r 3D-Effekt
                }}
            />
        </Row>
    );
}