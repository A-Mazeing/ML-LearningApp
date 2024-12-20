import { useNavigate } from "react-router-dom";
import HomeImgSrc from "./Home.png"; // Home-Button-Bild importieren

export default function HomeButton() {
    const navigate = useNavigate(); // Router für Navigation

    const handleClick = () => {
        navigate("/"); // Zur Hauptseite (App.jsx) navigieren
    };

    return (
        <div
            style={{
                position: "fixed", // Fixieren
                bottom: "20px", // Abstand vom unteren Rand
                left: "50%", // Position horizontal in der Mitte
                transform: "translateX(-50%)", // Korrektur, um das Element mittig auszurichten
                cursor: "pointer",
                zIndex: 1000, // Überlagert andere Elemente
            }}
            onClick={handleClick}
        >
            <img
                src={HomeImgSrc}
                alt="Home"
                style={{
                    width: "60px", // Größe des Home-Icons
                    height: "60px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Schatten für 3D-Effekt
                }}
            />
        </div>
    );
}