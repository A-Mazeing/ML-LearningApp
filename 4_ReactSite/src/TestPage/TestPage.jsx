import { useEffect, useRef, useState } from "react";
import BarComponent from "../assets/BarCompnent.jsx";
import PropTypes from "prop-types";
import { Alert, AlertTitle } from "@mui/material";
import * as tmImage from "@teachablemachine/image";
import srcPic from "../Testdaten/Delfin_1.jpeg";

export default function AutoFreeTestPage({ model = "" }) {
    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const [predictions, setPredictions] = useState([]);
    const [modelInstance, setModelInstance] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imagePaths, setImagePaths] = useState([]);

    const ThrowError = (message) => {
        console.error(message);
        setErrorMessage(true);

        // Entferne den Fehler nach 5 Sekunden
        setTimeout(() => {
            setErrorMessage(false);
        }, 5000);
    };

    async function LoadModel(modelUrl) {
        if (modelUrl) {
            try {
                // Model Scripts laden
                const modelURL = modelUrl + "model.json";
                const metadataURL = modelUrl + "metadata.json";
                return await tmImage.load(modelURL, metadataURL);
            } catch (error) {
                ThrowError(`Fehler beim Laden des Modells: ${error.message}`);
            }
            return null;
        }
    }

    async function LoadAllPics() {
        const directoryPath = "../../public/Testdaten";
        try {
            const response = await fetch(`/api/files?directory=${encodeURIComponent(directoryPath)}`);
            if (response.ok) {
                const files = await response.json();
                const imageFiles = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));
                setImagePaths(imageFiles.map(file => `${directoryPath}/${file}`));
            } else {
                ThrowError("Fehler beim Abrufen der Bilddateien");
            }
        } catch (error) {
            ThrowError(`Fehler beim Abrufen der Bilddateien: ${error.message}`);
        }
    }

    useEffect(() => {
        LoadAllPics();
    }, []);

    // Modell von TM mit URL laden:
    useEffect(() => {
        const loadModel = async () => {
            const loadedModel = await LoadModel(model);
            setModelInstance(loadedModel);
        };
        loadModel();
    }, [model]);

    const Klassifizieren = async () => {
        if (modelInstance && videoRef.current) {
            const predictions = await modelInstance.predict(videoRef.current); // Teachable Machine Vorhersage
            setPredictions(predictions.slice(0, 4)); // Maximal 4 Klassen speichern
        }
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagePaths.length);
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? imagePaths.length - 1 : prevIndex - 1
        );
    };

    const renderPredictions = () => {
        return predictions.map((prediction, index) => (
            <BarComponent
                key={index}
                label={prediction.className}
                value={Math.round(prediction.probability * 100)}
                classIndex={index}
            />
        ));
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
            }}
        >
            {/* Anzeige oben mit Bildnamen */}
            <div
                style={{
                    textAlign: "center",
                    marginBottom: "20px",
                }}
            >
                <h2>{imagePaths[currentImageIndex]?.split("/").slice(-2).join("/")}</h2>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <button onClick={handlePreviousImage} style={{ marginRight: "10px" }}>
                        &lt;-
                    </button>
                    <img
                        src={srcPic}
                        alt="Test Image"
                        style={{ width: "300px", height: "300px", objectFit: "cover" }}
                    />
                    <button onClick={handleNextImage} style={{ marginLeft: "10px" }}>
                        -&gt;
                    </button>
                </div>
            </div>

            {/* Vorhersage und Klassifizierungsanpassung links */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: "20px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                    }}
                >

                    {predictions.length > 0 && (
                        <div
                            style={{
                                marginTop: "20px",
                                textAlign: "left",
                                width: "300px",
                            }}
                        >
                            {/* Text linksbündig */}
                            <h2 style={{ fontSize: "28px" }}>Klassifikationen:</h2>
                            {/* Schriftgröße erhöhen */}
                            {renderPredictions()}
                        </div>
                    )}

                    <button onClick={Klassifizieren} style={{ marginTop: "20px", padding: "10px" }}>
                        Klassifizieren
                    </button>
                </div>

                {/* Canvas */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <canvas ref={canvasRef} />
                    <video ref={videoRef} autoPlay playsInline muted style={{ display: "none" }} />
                    <div id="ErrorContainer">
                        {errorMessage ? (
                            <Alert
                                severity="error"
                                sx={{
                                    backgroundColor: "#160b0b", // Hintergrundfarbe setzen
                                    color: "white", // Textfarbe anpassen
                                }}
                            >
                                <AlertTitle>Error</AlertTitle>
                                {errorMessage}
                            </Alert>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

AutoFreeTestPage.propTypes = {
    model: PropTypes.string,
};
