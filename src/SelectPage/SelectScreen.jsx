import {useLocation, useNavigate} from "react-router-dom";
import SelectCard from "./SelectCard.jsx"; // Importiere useNavigate
import PlaceHolderImgSrc from "../assets/Placeholder.png"
import PlaceHolderImgSrc2 from "../assets/Placeholder2.png"
import {Col, Row} from "react-grid-system";
import HomeButton from "../assets/HomeButtonComponent.jsx";

export default function Select() {
    const navigate = useNavigate(); // Verwende useNavigate
    const { state } = useLocation();
    const modelUrl = state?.modelUrl || ""; // Empfange die Modell-URL

    return (
        <Row
            justify="center"
            gutterWidth={40}
            style={{
                marginTop: "20px",
                width: "100%", // Überschreiten der Breite verhindern
                overflow: "hidden", // Entfernt überfließende Inhalte
            }}
        >
            {/* Karte zum freien Testen */}
            <Col xs={12} sm={6} md={5} lg={4}> {/* Konfiguration für responsives Layout */}
                <SelectCard
                    titel={"Freies Testen"}
                    text={"Hier kannst du dein zuvor eingebundenes Modell eigenständig testen."}
                    buttonText={"Zum Testen"}
                    imgSrc={PlaceHolderImgSrc}
                    // Modell-URL wird mitgegeben
                    onClick={() => navigate("/freeTestSite", { state: { modelUrl } })}
                />
            </Col>

            {/* Karte für Testdaten/Bias */}
            <Col xs={12} sm={6} md={5} lg={4}> {/* Konfiguration für responsives Layout */}
                <SelectCard
                    titel={"Testdaten und Bias"}
                    text={"Hier wird dein Modell mit speziellen Testdaten getestet."}
                    buttonText={"Zum Testen"}
                    imgSrc={PlaceHolderImgSrc2}
                    // Modell-URL wird mitgegeben
                    onClick={() => navigate("/autoTestSite", { state: { modelUrl } })}
                />
            </Col>
        </Row>
    );
}