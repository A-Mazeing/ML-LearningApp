import {useCallback, useEffect, useRef, useState} from "react";
import { useLocation } from "react-router-dom";
import BarComponent from "../assets/BarCompnent.jsx";
import PropTypes from "prop-types";
import * as tmImage from "@teachablemachine/image";
import CircleButton from "../assets/CircleButton.jsx";
import { Row, Col } from "react-grid-system";
import {Container} from "@mui/material";
import SelectMode from "../assets/SelectMode.jsx";
import HomeButton from "../assets/HomeButtonComponent.jsx";
import imageList from "../imageList.json";



export default function AutoFreeTestPage() {


    const { state } = useLocation();
    const model = state?.modelUrl || ""; // Extrahiere modelUrl, falls vorhanden

    const imageRef = useRef(null);
    const [accuracyResults, setAccuracyResults] = useState({});
    const [predictions, setPredictions] = useState([]);
    const [modelInstance, setModelInstance] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imagePaths, setImagePaths] = useState([]);
    const [showBlur, setShowBlur] = useState(true);
    const [selectedModel, setSelectedModel] = useState(model); // Standard auf Eingabemodell

    const onSelectChange = (selectedValue) => {
        switch (selectedValue) { // Verwende den Parameter 'selectedValue', NICHT 'model'
            case "userModel":
                setSelectedModel(selectedValue); // Benutzerdefiniertes Modell
                break;
            case "biasModel1":
                setSelectedModel("Modelle/Bias 1/"); // Bias Modell 1 Front-Löwe
                break;
            case "biasModel2":
                setSelectedModel("Modelle/Bias 2/"); // Bias Modell 2 Hintergrund
                break;
            case "biasModel3":
                setSelectedModel("Modelle/Bias 3/"); // Bias Modell 3 Wasser
                break;
            case "biasModel4":
                setSelectedModel("Modelle/Bias 4/"); // Bias Modell 4 Wenige Kängurus
                break;
            default:
                console.error("Unbekanntes Modell ausgewählt");
        }
    };
    const handleDivClick = () => {
        setShowBlur(false); // Blur-Effekt ausschalten
        classifyAllImages(); // Berechnungen durchführen
    };

    // **Modell laden**
    async function LoadModel(modelUrl) {
        let isMounted = true; // Abbruch-Flag

        if (modelUrl) {
            try {
                const modelURL = modelUrl + "model.json";
                const metadataURL = modelUrl + "metadata.json";
                const loadedModel = await tmImage.load(modelURL, metadataURL);

                if (isMounted) return loadedModel;
            } catch (error) {
                if (isMounted) {
                    console.error(`Fehler beim Laden des Modells: ${error.message}`);
                }
                return null;
            }
        }

        return () => {
            isMounted = false; // Cleanup
        };
    }



    // **Klassifizieren**
    const Klassifizieren = useCallback(async () => {
        if (!modelInstance) {
            console.error("Das Modell wurde nicht geladen!");
            return;
        }

        if (!imageRef.current) {
            console.warn("Kein Bild gefunden, das klassifiziert werden kann.");
            return;
        }

        try {
            const predictions = await modelInstance.predict(imageRef.current);
            const topPredictions = predictions.slice(0, 4);
            console.log("Vorhersagen:", topPredictions);
            setPredictions(topPredictions);
        } catch (error) {
            console.error("Fehler bei der Klassifizierung:", error.message);
        }
    }, [modelInstance]);

    useEffect(() => {
        console.log("useEffect trigger: Klassifizieren für das erste Bild");
        if (imagePaths.length > 0 && imageRef.current && modelInstance) {
            Klassifizieren();
        }
    }, [imagePaths, modelInstance, Klassifizieren]);

    // **Bildwechsel-Handler mit Klassifizieren integriert**
    const handleNextImage = () => {
        const nextIndex = (currentImageIndex + 1) % imagePaths.length;
        setCurrentImageIndex(nextIndex);
        Klassifizieren(); // Klassifizieren nach Bildwechsel
    };

    const handlePreviousImage = () => {
        const prevIndex = currentImageIndex === 0 ? imagePaths.length - 1 : currentImageIndex - 1;
        setCurrentImageIndex(prevIndex);
        Klassifizieren(); // Klassifizieren nach Bildwechsel
    };

    // **Bilder vom Server laden**
    async function LoadAllPics() {
        try {
            // Füge die Basis-URL für die Produktion hinzu

            // Generiere die vollständigen Bild-URLs basierend auf der JSON-Liste
            const files = imageList.map((file) => `/Testdaten/${file}`);

            // Setze die Bildpfade in den State
            if (files.length > 0) {
                setImagePaths(files);
                console.log("Bilder geladen:", files);
            } else {
                console.error("Keine Bilder gefunden in der JSON-Liste.");
            }
        } catch (error) {
            console.error("Fehler beim Laden der Bilder:", error.message);
        }
    }

    //Calc Acc, Prec, Rec:
    const extractClassName = (filePath) => {
        const fileName = filePath.split("/").pop(); // Nur Dateiname extrahieren
        return fileName.split("_")[0]; // Teile am "_" auf, um den Klassennamen zu bekommen
    };
    const classifyAllImages = async () => {
        if (!modelInstance || imagePaths.length === 0) {
            console.error("Kein Modell geladen oder keine Bilder vorhanden!");
            return;
        }

        const results = {}; // Ergebnisse initialisieren
        const confusionMatrix = {}; // Speichere Vorhersagen pro Klasse

        for (const imagePath of imagePaths) {
            // Klassennamen aus Dateipfad extrahieren
            const className = extractClassName(imagePath).toLowerCase(); // Normalisiere Klassenname
            const image = new Image();
            image.src = imagePath;

            try {
                // Bild laden
                await new Promise((resolve, reject) => {
                    image.onload = () => resolve();
                    image.onerror = (e) => reject(e);
                });

                // Vorhersagen abrufen und sortieren
                const predictions = await modelInstance.predict(image);
                const topPrediction = predictions
                    .sort((a, b) => b.probability - a.probability)[0]
                    .className.trim()
                    .toLowerCase(); // Normalisiere Vorhersage

                // Initialisiere Datenstrukturen für Ergebnisse und Konfusionsmatrix
                if (!(className in results)) {
                    results[className] = { correct: 0, total: 0 };
                }

                if (!(className in confusionMatrix)) {
                    confusionMatrix[className] = { predicted: {}, actual: 0 };
                }

                results[className].total += 1;
                confusionMatrix[className].actual += 1;

                // Korrekte Vorhersagen
                if (topPrediction === className) {
                    results[className].correct += 1;
                }

                // Konfusionsmatrix aktualisieren
                if (!confusionMatrix[className].predicted[topPrediction]) {
                    confusionMatrix[className].predicted[topPrediction] = 0;
                }
                confusionMatrix[className].predicted[topPrediction] += 1;

            } catch (error) {
                console.error(`Fehler beim Klassifizieren von ${imagePath}:`, error.message);
            }
        }

        // Berechnungen nach Sammlung der Ergebnisse
        const accuracyResults = CalcAccuracy(results);
        console.log("Accuracy:", accuracyResults);

        const precisionResults = CalcPrecision(confusionMatrix);
        console.log("Precision:", precisionResults);

        const recallResults = CalcRecall(confusionMatrix);
        console.log("Recall:", recallResults);

        // Ergebnisse im State speichern
        setAccuracyResults({
            accuracy: accuracyResults,
            precision: precisionResults,
            recall: recallResults,
        });
    };
    const CalcAccuracy = (results) => {
        let totalCorrect = 0;
        let totalImages = 0;

        for (const className in results) {
            totalCorrect += results[className].correct;
            totalImages += results[className].total;
        }

        return totalImages
            ? ((totalCorrect / totalImages) * 100).toFixed(2) // Prozentwert
            : 0; // Falls keine Bilder vorhanden
    };
    const CalcPrecision = (confusionMatrix) => {
        const precisionResults = {};

        for (const className in confusionMatrix) {
            const truePositives = confusionMatrix[className].predicted[className] || 0;
            let totalPredicted = 0;

            // Zähle alle Vorhersagen für diese Klasse (True Positives + False Positives)
            for (const predictedClass in confusionMatrix) {
                totalPredicted += confusionMatrix[predictedClass].predicted[className] || 0;
            }

            precisionResults[className] = totalPredicted
                ? ((truePositives / totalPredicted) * 100).toFixed(2)
                : 0; // Falls keine Vorhersagen vorhanden sind
        }

        return precisionResults;
    };
    const CalcRecall = (confusionMatrix) => {
        const recallResults = {};

        for (const className in confusionMatrix) {
            const truePositives = confusionMatrix[className].predicted[className] || 0;
            const totalActual = confusionMatrix[className].actual; // Tatsächliche Gesamtanzahl dieser Klasse

            recallResults[className] = totalActual
                ? ((truePositives / totalActual) * 100).toFixed(2) // Prozentwert
                : 0; // Falls keine Instanzen in der Klasse vorhanden
        }

        return recallResults;
    };


    //Effect-Functions:
    useEffect(() => {
        const loadModel = async () => {
            if (!selectedModel) {
                console.error("Kein Modell-URL angegeben!");
                return;
            }

            const abortController = new AbortController();

            try {
                const loadedModel = await LoadModel(selectedModel);
                if (loadedModel) {
                    setModelInstance(loadedModel);
                }
            } catch (error) {
                if (error.name === "AbortError") {
                    console.log("Laden des Modells wurde abgebrochen");
                } else {
                    console.error("Fehler beim Laden des Modells:", error.message);
                }
            }

            return () => {
                abortController.abort(); // Cleanup
            };
        };
        loadModel();
    }, [selectedModel]); // Trigger bei Änderung von selectedModel


    useEffect(() => {
        if (model) {
            console.log("Model wird geladen von:", model);
            // Modell laden...
        }
    }, [model]);

    useEffect(() => {
        LoadAllPics();
    }, []);

    useEffect(() => {
        // Klassifizieren für das erste Bild
        if (imagePaths.length > 0 && imageRef.current && modelInstance) {
            Klassifizieren();
        }
    }, [imagePaths, modelInstance, Klassifizieren]);


    return (
        <Container style={{ margin: "20px", maxWidth: "90%" }} >
                {/* Bereich für Modell-Leistungsmetriken */}
                <Row style={{ marginTop: "20px" }}>
                    <Col lg={12}>
                        <div style={{ position: "relative", maxWidth: "50%", width: "100%" }}>
                            {/* Blur Overlay mit Schrift */}
                            {showBlur && ( // Bedingte Anzeige des Blur-Divs
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "0",
                                        left: "0",
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "rgba(255, 255, 255, 0.5)", // Halbtransparenter Hintergrund
                                        backdropFilter: "blur(10px)", // Blur
                                        display: "flex",
                                        alignItems: "center", // Vertikal zentrieren
                                        justifyContent: "center", // Horizontal zentrieren
                                        zIndex: "1",
                                        color: "#000",
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                        boxSizing: "border-box",
                                        textAlign: "center", // Text zentrieren
                                        overflow: "hidden", // Keine Überlappung
                                        wordWrap: "break-word", // Umbruch des Textes
                                        padding: "10px", // Abstand innen
                                        cursor: "pointer", // Zeiger für Klick
                                    }}
                                    onClick={handleDivClick} // Event-Handler für Klick
                                >
                                    Berechnung Anzeigen
                                </div>
                            )}

                            {/* Darunterliegendes Div */}
                            <div
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    justifyContent: "space-between",
                                    display: "flex", // Flex-Anordnung
                                    flexWrap: "wrap", // Elemente umbrechen, falls nötig
                                    padding: "20px",
                                    gap: "20px",
                                    border: "2px solid #ffffff",
                                    borderRadius: "8px",
                                    textAlign: "left",
                                    zIndex: "0",
                                    boxSizing: "border-box",
                                }}
                            >
                                <div style={{ flex: "1", textAlign: "center" }}>
                                    <strong>Overall Accuracy:</strong>
                                    <br />
                                    {accuracyResults.accuracy}%
                                </div>
                                <div style={{ flex: "1", textAlign: "center" }}>
                                    <strong>Precision:</strong>
                                    {Object.entries(accuracyResults.precision || {}).map(([className, precision]) => (
                                        <div key={className}>
                                            {className}: {precision}%
                                        </div>
                                    ))}
                                </div>
                                <div style={{ flex: "1", textAlign: "center" }}>
                                    <strong>Recall:</strong>
                                    {Object.entries(accuracyResults.recall || {}).map(([className, recall]) => (
                                        <div key={className}>
                                            {className}: {recall}%
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Abstand von oben (50px) */}
            <Row style={{ marginTop: "50px" }} gutterWidth={80}>
                {/* Linke Spalte */}
                <Col xs={12} md={6} style={{ paddingRight: "40px" }}>
                    <SelectMode
                        eventFunc={onSelectChange}
                        items={[
                            { value: "userModel", label: "Eingef\u00FCgtes Modell" },
                            { value: "biasModel1", label: "Bias Modell 1" },
                            { value: "biasModel2", label: "Bias Modell 2" },
                            { value: "biasModel3", label: "Bias Modell 3" },
                            { value: "biasModel4", label: "Bias Modell 4" },
                        ]}
                    />
                    {/* Linke Spalte für Klassifikationen */}
                    {predictions.length > 0 && (
                        <div style={{ marginLeft: "10px" }}>
                            <h2 style={{ marginBottom: "20px" }}>Klassifikationen:</h2>
                            {predictions.map((prediction, index) => (
                                <BarComponent
                                    key={index}
                                    label={prediction.className}
                                    value={Math.round(prediction.probability * 100)}
                                    classIndex={index}
                                />
                            ))}
                        </div>
                    )}
                </Col>

                {/* Rechte Spalte */}
                <Col xs={12} md={6} style={{ paddingLeft: "50px" }}>
                    {/* Rechte Spalte für Bild */}
                    {imagePaths.length > 0 ? (
                        <div
                            style={{
                                display: "flex", // Buttons und Bild in einer Reihe
                                alignItems: "center",
                                justifyContent: "flex-end", // Bild und Buttons rechtsbündig
                                gap: "20px", // Abstand zwischen den Elementen
                                width: "100%", // Volle Breite ausnutzen
                            }}
                        >
                            {/* Button: Vorheriges Bild */}
                            <CircleButton direction="previous" onClick={handlePreviousImage} />

                            {/* Bild */}
                            <img
                                ref={imageRef}
                                src={imagePaths[currentImageIndex]}
                                alt="Test Image"
                                style={{
                                    maxWidth: "90%",
                                    height: "auto",
                                    maxHeight: "85vh",
                                    objectFit: "contain",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                                }}
                            />

                            {/* Button: Nächstes Bild */}
                            <CircleButton direction="next" onClick={handleNextImage}/>
                        </div>
                    ) : (
                        <p style={{color: "#999", textAlign: "right"}}>Bilder werden geladen...</p>
                    )}
                </Col>
            </Row>
                <HomeButton />
            </Container>
        );
}




AutoFreeTestPage.propTypes = {
    model: PropTypes.string,
};