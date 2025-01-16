import {useCallback, useEffect, useRef, useState} from "react";
import {useLocation} from "react-router-dom";
import BarComponent from "../assets/BarCompnent.jsx";
import PropTypes from "prop-types";
import * as tmImage from "@teachablemachine/image";
import CircleButton from "../assets/CircleButton.jsx";
import {Col, Row} from "react-grid-system";
import {Alert, AlertTitle, Container} from "@mui/material";
import SelectMode from "../assets/SelectMode.jsx";
import HomeButton from "../assets/HomeButtonComponent.jsx";
import imageList from "../imageList.json";
import modelList from "../modelList.json"; // Modell-Liste importieren

export default function AutoFreeTestPage() {
    const { state } = useLocation();
    const [userModelInstance] = useState(state?.modelUrl); // Eigene Instanz für User-Modelle
    const imageRef = useRef(null);
    const [accuracyResults, setAccuracyResults] = useState({});
    const [predictions, setPredictions] = useState([]);
    const [modelInstance, setModelInstance] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imagePaths, setImagePaths] = useState([]);
    const [showBlur, setShowBlur] = useState(true);
    const [selectedModel, setSelectedModel] = useState(userModelInstance); // Standard auf Eingabemodell
    const [availableModels, setAvailableModels] = useState([]); // Verfügbare Modelle


    const [errorMessage, setErrorMessage] = useState(null);
    const ThrowError = (message) => {
        console.error(message);
        setErrorMessage(message);

        // Entferne den Fehler nach 5 Sekunden
        setTimeout(() => {
            setErrorMessage(null);
        }, 5000);
    };

    const [warningMessage, setWarningMessage] = useState(null);
    const ThrowWarning = (message) => {
        console.warn(message);
        setWarningMessage(message);

        // Entferne die Warnung nach 5 Sekunden
        setTimeout(() => {
            setWarningMessage(null);
        }, 5000);
    };

    // **Modell laden**
    async function LoadModel(modelUrl) {
        if (modelUrl) {
            try {
                const modelURL = modelUrl + "model.json";
                const metadataURL = modelUrl + "metadata.json";
                return await tmImage.load(modelURL, metadataURL);
            } catch (error) {
                ThrowError(`Fehler beim Laden des Modells: ${error.message}`);
                return null;
            }
        }
        return null;
    }

    const loadSelectedModel = async () => {
        if (!selectedModel) {
            ThrowWarning("Kein Modell ausgewählt.");
            return;
        }
        if (selectedModel === "userModel") {
            setModelInstance(userModelInstance);
            return;
        }
        // Andere Modelle laden
        try {
            console.log("Lade Modell:", selectedModel);
            const loadedModel = await LoadModel(selectedModel);
            setModelInstance(loadedModel);
            console.log("Modell erfolgreich geladen:", selectedModel);
        } catch (error) {
            ThrowError(`Fehler beim Laden des Modells (${selectedModel}):`, error.message);
        }
    };

    useEffect(() => {
        loadSelectedModel();
    }, [selectedModel, userModelInstance]);


    async function LoadAllModels() {
        try {
            const models = modelList.map((modelName) => `/Modelle/${modelName}/`);
            if (models.length > 0) {
                setAvailableModels(models);
                console.log("Modelle geladen:", models);
            } else {
                ThrowError("Keine Modelle in der JSON-Liste gefunden.");
            }
        } catch (error) {
            ThrowError("Fehler beim Laden der Modelle:", error.message);
        }
    }

    useEffect(() => {
        LoadAllModels();
    }, []);

    const Klassifizieren = useCallback(async () => {
        if (!modelInstance) {
            ThrowError("Das Modell wurde nicht geladen!");
            return;
        }

        if (typeof modelInstance.predict !== 'function') {
            ThrowError("Die Methode 'predict' ist nicht verfügbar auf dem geladenen Modell!");
            return;
        }

        if (!imageRef.current) {
            ThrowWarning("Kein Bild gefunden, das klassifiziert werden kann.");
            return;
        }

        try {
            const predictions = await modelInstance.predict(imageRef.current);
            const topPredictions = predictions.slice(0, 4);
            console.log("Vorhersagen:", topPredictions);
            setPredictions(topPredictions);
        } catch (error) {
            ThrowError("Fehler bei der Klassifizierung:", error.message);
        }
    }, [modelInstance]);

    useEffect(() => {
        if (imagePaths.length > 0 && imageRef.current && modelInstance) {
            Klassifizieren();
        }
    }, [imagePaths, modelInstance, Klassifizieren]);

    async function LoadAllPics() {
        try {
            const files = imageList.map((file) => `/Testdaten/${file}`);
            if (files.length > 0) {
                setImagePaths(files);
                console.log("Bilder geladen:", files);
            } else {
                ThrowError("Keine Bilder gefunden in der JSON-Liste.");
            }
        } catch (error) {
            ThrowError("Fehler beim Laden der Bilder:", error.message);
        }
    }

    useEffect(() => {
        LoadAllPics();
    }, []);

    const extractClassName = (filePath) => {
        const fileName = filePath.split("/").pop();
        return fileName.split("_")[0];
    };

    const classifyAllImages = async () => {
        if (!modelInstance || imagePaths.length === 0) {
            ThrowError("Kein Modell geladen oder keine Bilder vorhanden!");
            return;
        }

        const results = {};
        const confusionMatrix = {};

        for (const imagePath of imagePaths) {
            const className = extractClassName(imagePath).toLowerCase();
            const image = new Image();
            image.src = imagePath;

            try {
                await new Promise((resolve, reject) => {
                    image.onload = () => resolve();
                    image.onerror = (e) => reject(e);
                });

                const predictions = await modelInstance.predict(image);
                const topPrediction = predictions
                    .sort((a, b) => b.probability - a.probability)[0]
                    .className.trim()
                    .toLowerCase();

                if (!(className in results)) {
                    results[className] = { correct: 0, total: 0 };
                }

                if (!(className in confusionMatrix)) {
                    confusionMatrix[className] = { predicted: {}, actual: 0 };
                }

                results[className].total += 1;
                confusionMatrix[className].actual += 1;

                if (topPrediction === className) {
                    results[className].correct += 1;
                }

                if (!confusionMatrix[className].predicted[topPrediction]) {
                    confusionMatrix[className].predicted[topPrediction] = 0;
                }
                confusionMatrix[className].predicted[topPrediction] += 1;

            } catch (error) {
                ThrowError(`Fehler beim Klassifizieren von ${imagePath}:`, error.message);
            }
        }

        const accuracyResults = CalcAccuracy(results);
        console.log("Accuracy:", accuracyResults);

        const precisionResults = CalcPrecision(confusionMatrix);
        console.log("Precision:", precisionResults);

        const recallResults = CalcRecall(confusionMatrix);
        console.log("Recall:", recallResults);

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
            ? ((totalCorrect / totalImages) * 100).toFixed(2)
            : 0;
    };

    const CalcPrecision = (confusionMatrix) => {
        const precisionResults = {};

        for (const className in confusionMatrix) {
            const truePositives = confusionMatrix[className].predicted[className] || 0;
            let totalPredicted = 0;

            for (const predictedClass in confusionMatrix) {
                totalPredicted += confusionMatrix[predictedClass].predicted[className] || 0;
            }

            precisionResults[className] = totalPredicted
                ? ((truePositives / totalPredicted) * 100).toFixed(2)
                : 0;
        }

        return precisionResults;
    };

    const CalcRecall = (confusionMatrix) => {
        const recallResults = {};

        for (const className in confusionMatrix) {
            const truePositives = confusionMatrix[className].predicted[className] || 0;
            const totalActual = confusionMatrix[className].actual;

            recallResults[className] = totalActual
                ? ((truePositives / totalActual) * 100).toFixed(2)
                : 0;
        }

        return recallResults;
    };

    useEffect(() => {
        if (imagePaths.length > 0 && imageRef.current && modelInstance) {
            Klassifizieren();
        }
    }, [imagePaths, modelInstance, Klassifizieren]);

    const onSelectChange = (selectedValue) => {
        if (selectedValue === "userModel") {
            console.log("Benutzerdefiniertes Modell ausgewählt.");
            setSelectedModel(userModelInstance);
        } else {
            console.log("Neues Modell ausgewählt:", selectedValue);
            setSelectedModel(selectedValue);
        }
    };

    const handleDivClick = () => {
        if (modelInstance && modelInstance.getTotalClasses) {
            const totalClasses = modelInstance.getTotalClasses();
            if (totalClasses < 4) {
                ThrowWarning("Dein Custom-Model enth\u00E4lt weniger als vier Klassen!");
                return;
            }

            const expectedClasses = [
                ["loewe", "löwe"],
                ["delfin"],
                ["kaenguru", "känguru"],
                ["oktopus"]
            ];

            const modelClasses = modelInstance.getClassLabels().map(label => label.toLowerCase());

            const missingClasses = expectedClasses.filter(
                classGroup => !classGroup.some(expectedClass => modelClasses.includes(expectedClass))
            );

            if (missingClasses.length > 0) {
                ThrowWarning("Dein Custom-Model enth\u00E4lt nicht die erwarteten Klassen: L\u00F6we, Delfin, K\u00E4nguru und Oktopus!");
                return;
            }
        }

        setShowBlur(false);
        classifyAllImages();
    };


    const handleNextImage = () => {
        const nextIndex = (currentImageIndex + 1) % imagePaths.length;
        setCurrentImageIndex(nextIndex);
        Klassifizieren();
    };

    const handlePreviousImage = () => {
        const prevIndex = currentImageIndex === 0 ? imagePaths.length - 1 : currentImageIndex - 1;
        setCurrentImageIndex(prevIndex);
        Klassifizieren();
    };

    return (
        <Container style={{ margin: "20px", maxWidth: "90%" }} >
            <Row style={{ marginTop: "20px" }}>
                <Col lg={12}>
                    <div style={{ position: "relative", maxWidth: "50%", width: "100%" }}>
                        {showBlur && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "0",
                                    left: "0",
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                                    backdropFilter: "blur(10px)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    zIndex: "1",
                                    color: "#000",
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    boxSizing: "border-box",
                                    textAlign: "center",
                                    overflow: "hidden",
                                    wordWrap: "break-word",
                                    padding: "10px",
                                    cursor: "pointer",
                                }}
                                onClick={handleDivClick}
                            >
                                Berechnung Anzeigen
                            </div>
                        )}
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                justifyContent: "space-between",
                                display: "flex",
                                flexWrap: "wrap",
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

            <Row style={{ marginTop: "50px" }} gutterWidth={80}>
                <Col xs={12} md={6} style={{ paddingRight: "40px" }}>
                    <SelectMode
                        eventFunc={onSelectChange}
                        items={[
                            { value: "userModel", label: "Eingef\u00FCgtes Modell" },
                            ...availableModels.map((modelPath, index) => ({
                                value: modelPath,
                                label: `Modell ${index + 1}: ${modelPath.split("/")[2]}`
                            }))
                        ]}
                    />
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

                <Col xs={12} md={6} style={{ paddingLeft: "50px" }}>
                    {imagePaths.length > 0 ? (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                                gap: "20px",
                                width: "100%",
                            }}
                        >
                            <CircleButton direction="previous" onClick={handlePreviousImage} />
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
                            <CircleButton direction="next" onClick={handleNextImage}/>
                        </div>
                    ) : (
                        <p style={{color: "#999", textAlign: "right"}}>Bilder werden geladen...</p>
                    )}
                </Col>
            </Row>
            <Row style={{ justifyContent: 'center', width: '100%', marginBottom: '20px'}}>
                {/* Error Display */}
                {errorMessage && (
                    <Alert
                        severity="error"
                        sx={{
                            backgroundColor: "#160b0b",
                            color: "white",
                        }}
                        onClose={() => setErrorMessage(null)}
                    >
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                )}
            </Row>
            <Row style={{ justifyContent: 'center', width: '100%', marginBottom: '20px'  }}>
                {warningMessage && (
                    <Alert
                        severity="warning"
                        sx={{
                            backgroundColor: "#160b0b",
                            color: "white",
                        }}
                        onClose={() => setWarningMessage(null)}
                    >
                        <AlertTitle>Warning</AlertTitle>
                        {warningMessage}
                    </Alert>
                )}
            </Row>
            <HomeButton />
        </Container>
    );
}

AutoFreeTestPage.propTypes = {
    model: PropTypes.string,
};