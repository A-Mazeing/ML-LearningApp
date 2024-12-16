import { useNavigate } from "react-router-dom";
import SelectCard from "./SelectCard.jsx"; // Importiere useNavigate
import PlaceHolderImgSrc from "../assets/Placeholder.png"
import PlaceHolderImgSrc2 from "../assets/Placeholder2.png"
import {Col, Row} from "react-grid-system";

export default function Select() {
    const navigate = useNavigate(); // Verwende useNavigate

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
                    text={"Hier kannst du dein zuvor eingebundenes Modell eigenst\u00E4ndig testen."}
                    buttonText={"Zum Testen"}
                    imgSrc={PlaceHolderImgSrc}
                    onClick={() => navigate("/freeTestSite")} // Link zur FreeTestSite
                />
            </Col>

            {/* Karte für Testdaten/Bias */}
            <Col xs={12} sm={6} md={5} lg={4}> {/* Konfiguration für responsives Layout */}
                <SelectCard
                    titel={"Testdaten und Bias"}
                    text={"Hier wird dein Modell mit speziellen Testdaten getestet."}
                    buttonText={"Zum Testen"}
                    imgSrc={PlaceHolderImgSrc2}
                    onClick={() => navigate("/autoTestSite")} // Link zur AutoTestSite
                />
            </Col>
        </Row>
    );
}