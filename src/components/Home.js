import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
    const [link, setLink] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (link.startsWith("https://teachablemachine.withgoogle.com/models/")) {
            navigate("/results", { state: { teachableLink: link } });
        } else {
            alert("Bitte füge einen gültigen Teachable Machine Link ein.");
        }
    };

    return (
        <div className="home-container">
            <div className="left-section">
                <h1>
                    <span className="highlight">K</span>unst <br />
                    <span className="highlight">I</span>nteraktiv
                </h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Link einfügen"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className="input-field"
                    />
                    <button type="submit" className="submit-button">
                        Projekt starten
                    </button>
                </form>
            </div>
            <div className="right-section">
                <img
                    src="path/to/your/image.png" // Bildpfad für dein hochgeladenes Bild
                    alt="Kunst Interaktiv"
                    className="design-image"
                />
            </div>
        </div>
    );
};

export default Home;
