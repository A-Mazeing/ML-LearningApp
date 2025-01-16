import {useLocation, useNavigate} from "react-router-dom";
import SelectCard from "./SelectCard.jsx"; // Importiere useNavigate
import PlaceHolderImgSrc from "../assets/Placeholder.png"
import PlaceHolderImgSrc2 from "../assets/Placeholder2.png"
import {Col, Row} from "react-grid-system";
import {useState} from "react";
import {Alert, AlertTitle, Container} from "@mui/material";

export default function Select() {
    const [warningMessage, setWarningMessage] = useState(null);

    const ThrowWarning = (message) => {
        console.warn(message);
        setWarningMessage(message);

        // Entferne die Warnung nach 5 Sekunden
        setTimeout(() => {
            setWarningMessage(null);
        }, 5000);
    };

    const navigate = useNavigate(); // Verwende useNavigate
    const { state } = useLocation();
    const modelUrl = (() => {
        const inputUrl = state?.modelUrl || 0;
        if (inputUrl === 0) {
            ThrowWarning("Ungültiges Modell-Format");
            return;
        } else {
            const regex = /(?:https:\/\/teachablemachine\.withgoogle\.com\/models\/)?([\w-]+)/;

            const match = inputUrl.match(regex);

            if (match) {
                const url = match[1];
                return "https://teachablemachine.withgoogle.com/models/" + url + "/";
            }
            ThrowWarning("Ungültiges Modell-Format");
        }
    })();

    return (
        <Container>
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
                        text={"Hier kannst du dein zuvor eingebundenes Modell eigenst\u00e4ndig testen."}
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
            <Row style={{ justifyContent: 'center', width: '100%', marginBottom: '20px'}}>
                {warningMessage && (
                    <Alert
                        severity="warning"
                        sx={{
                            backgroundColor: "#160b0b",
                            color: "white",
                            position: "fixed",
                            bottom: 0,
                            marginBottom: "20px",
                        }}
                        onClose={() => setWarningMessage(null)}
                    >
                        <AlertTitle>Warning</AlertTitle>
                        {warningMessage}
                    </Alert>
                )}
            </Row>

        </Container>
    );
}