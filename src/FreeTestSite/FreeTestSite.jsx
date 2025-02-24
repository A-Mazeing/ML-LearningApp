import BarComponent from "../assets/BarCompnent.jsx";
import PropTypes from "prop-types";
import SelectMode from "../assets/SelectMode.jsx";
import {Alert, AlertTitle, Container} from "@mui/material";
import * as tmImage from "@teachablemachine/image";
import WhiteButton from "../assets/WhiteButton.jsx";
import {useEffect, useRef, useState} from "react";
import {Col, Row} from "react-grid-system";
import UploadButton from "../assets/UploadButton.jsx";
import {useLocation} from "react-router-dom";
import HomeButton from "../assets/HomeButtonComponent.jsx";


export default function FreeTestPage() {
    const { state } = useLocation();
    const modelUrl = state?.modelUrl || "";
    const [predictions, setPredictions] = useState([]);
    const [modelInstance, setModelInstance] = useState(null);
    async function LoadModel() {
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
        else{
            ThrowError("Kein Modell gefunden");
        }
    }

    // Modell von TM mit URL laden:
    useEffect(() => {
        const loadModel = async () => {
            const loadedModel = await LoadModel();
            setModelInstance(loadedModel);
        };
        loadModel();
    }, [modelUrl]); // Richtige Abh�ngigkeit

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


    const [devices, setDevices] = useState([]);
    const [currentDeviceId, setCurrentDeviceId] = useState(null);
    //Funktion f�r Kamera-Devices -> returned alle KameraDevices
    async function GetCamDevices() {
        try {
            // Get all Devices
            const devices = await navigator.mediaDevices.enumerateDevices();

            const videoInputs = devices.filter((device) => device.kind === "videoinput");

            if(videoInputs.length === 0){
                ThrowError(`Keine Kamera gefunden`);
            }
            // Filter nach Cam-Inputs
            return videoInputs;
        } catch (error) {
            ThrowError(`Fehler beim Abrufen der Ger�te: ${error.message}`);
        }
    }


    // Get available camera devices
    useEffect(() => {
        const fetchDevices = async () => {
            const cams = await GetCamDevices();
            setDevices(cams);
            if (cams.length > 0) setCurrentDeviceId(cams[0].deviceId);

        };
        fetchDevices();
    }, []);


    const streamRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    async function stopCam() {
        if (streamRef.current) {
            const tracks = streamRef.current.getTracks();
            tracks.forEach(track => track.stop()); // Stoppt alle Tracks des Streams
            videoRef.current.srcObject = null; // Entfernt den Stream aus dem Video-Element
            streamRef.current = null; // L�scht den gespeicherten Stream
        }
    }
    useEffect(() => {
        const requestCameraPermission = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });

                // Kamera nur starten, wenn Berechtigung erteilt wurde
                if (stream) {
                    const cams = await GetCamDevices();
                    setDevices(cams);
                    if (cams.length > 0) {
                        setCurrentDeviceId(cams[0].deviceId);
                    }
                }
            } catch (error) {
                ThrowError(`Kamera-Berechtigung verweigert: ${error.message}`);
            }
        };

        requestCameraPermission();
    }, []);

    const [isCameraActive, setIsCameraActive] = useState(true);
    useEffect(() => {
        if (currentDeviceId && isCameraActive) {
            startCam();
        }
    }, [currentDeviceId, isCameraActive]);

    async function startCam() {
        try {

            // Berechtigungsanfrage f�r Kamera
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: currentDeviceId ? { exact: currentDeviceId } : undefined },
            });

            // Setze den Stream auf das Video-Element
            videoRef.current.srcObject = stream;

            // Speichere den Stream, um ihn sp�ter zu stoppen
            streamRef.current = stream;
        } catch (error) {
            if (error.name === "OverconstrainedError") {
                try {
                    // Fallback: Versuche ohne Einschr�nkungen ohne dieses Fallback kommt es trotzdem zu einem Error
                    // welcher in der Altert Komponente angezeigt wird
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    videoRef.current.srcObject = stream;
                    streamRef.current = stream;
                } catch (fallbackError) {
                    ThrowError(`Kamera-Fehler: ${fallbackError.message}`);
                }
            } else {
                ThrowError(`Kamera-Fehler: ${error.message}`);
            }
        }
    }

    useEffect(() => {
        if (isCameraActive) {
            startCam();
        } else {
            stopCam();
        }
        return () => {
            stopCam();
        };
    }, [isCameraActive]);

    const [photo, setPhoto] = useState(null);
    const captureLastFrame = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const video = videoRef.current;

        // Set canvas size to match video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current video frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get the image data from the canvas and save it as base64
        const dataUrl = canvas.toDataURL("image/png");
        setPhoto(dataUrl); // Save the captured image as the last photo
    };

    const toggleCam = async () => {
        if (isCameraActive) {
            captureLastFrame();
            stopCam();
            setIsCameraActive(false);
        } else {
            startCam();
            setIsCameraActive(true);
        }
    };

    // KameraDevice wechseln
    const handleSwitchCamera = async () => {
        if (!devices.length) {
            ThrowError("Keine Devices gefunden");
            return;
        }
        const currentIndex = devices.findIndex((d) => d.deviceId === currentDeviceId);
        const nextIndex = (currentIndex + 1) % devices.length;
        //console.log(`Wechsele zu Kamera: ${devices[nextIndex].label}`);
        setCurrentDeviceId(devices[nextIndex].deviceId);
    };
    // Upload-Button
    const handleImageUpload = async () => {
        // Kamera deaktivieren und Live-Ansicht verlassen
        if (isCameraActive) {
            stopCam();
            setIsCameraActive(false);
        }

        // Dateiauswahl-Dialog �ffnen
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/png, image/jpeg"; // Nur .png und .jpg zulassen
        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                // Bild laden und auf Canvas zeichnen
                const reader = new FileReader();
                reader.onload = async () => {
                    const img = new Image();
                    img.onload = async () => {
                        // Das Canvas und den Kontext vorbereiten
                        const canvas = canvasRef.current;
                        const context = canvas.getContext("2d");

                        // Canvas-Gr��e auf Bildgr��e setzen
                        canvas.width = img.width;
                        canvas.height = img.height;

                        // Bild auf das Canvas zeichnen
                        context.drawImage(img, 0, 0, img.width, img.height);

                        // Das Bild im State speichern (falls gew�nscht)
                        setPhoto(reader.result); // Das Bild speichern, falls es sp�ter angezeigt werden soll

                        // Klassifizierung des Bildes durchf�hren
                        if (modelInstance) {
                            const predictions = await modelInstance.predict(canvas); // Teachable Machine Vorhersage auf dem Canvas
                            setPredictions(predictions.slice(0, 4)); // Maximal 4 Klassen speichern
                        }
                    };
                    img.src = reader.result; // Bild von der Base64-Daten-URL laden
                };
                reader.readAsDataURL(file); // Bild als Base64 lesen
            }
        };
        input.click(); // Dialog �ffnen
    };

    // Kontinuierliche Klassifikation im Hintergrund
    useEffect(() => {
        let intervalId;

        const Klassifizieren = async () => {
            if (modelInstance && isCameraActive && videoRef.current) {
                const predictions = await modelInstance.predict(videoRef.current); // Teachable Machine Vorhersage
                setPredictions(predictions.slice(0, 4)); // Maximal 4 Klassen speichern
            }
        };

        if (isCameraActive) {
            // Wiederholte Klassifikation starten
            intervalId = setInterval(Klassifizieren, 1000); // Alle 1000ms (1 Sekunde)
        }

        return () => {
            if (intervalId) clearInterval(intervalId); // Intervall bereinigen, wenn Komponente zerst�rt wird
        };
    }, [modelInstance, isCameraActive, videoRef]);

    const modie = [
        { value: 1, label: 'Alles Anzeigen' },
        { value: 2, label: 'Klasse und Prozente' },
        { value: 3, label: 'Klasse' }
    ];

    const [selectedMode, setSelectedMode] = useState(1);
    const renderPredictions = () => {
        if (selectedMode === 1) {
            return predictions.map((prediction, index) => (
                <div key={index} style={{ marginBottom: '5px' }}>
                    <BarComponent
                        label={prediction.className}
                        value={Math.round(prediction.probability * 100)}
                        classIndex={index}
                    />
                </div>
            ));
        } else if (selectedMode === 2) {
            if (predictions.length > 0) {
                const topPrediction = predictions.reduce((max, prediction) =>
                    prediction.probability > max.probability ? prediction : max, predictions[0]
                );
                return (
                    <div style={{ marginBottom: '5px' }}>
                        <span style={{ fontSize: '18px', marginRight: '5px' }}>{topPrediction.className}</span>
                        <BarComponent
                            label={topPrediction.className}
                            value={Math.round(topPrediction.probability * 100)}
                            classIndex={0}
                        />
                    </div>
                );
            }
        } else if (selectedMode === 3) {
            if (predictions.length > 0) {
                const topPrediction = predictions.reduce((max, prediction) =>
                    prediction.probability > max.probability ? prediction : max, predictions[0]
                );
                return <h3>{topPrediction.className}</h3>;
            }
        }
        return null;
    };

    return (
        <Container>
            <Row style={{ marginTop: '20px' }}>
                {/* Left Column */}
                <Col sm={6} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginLeft: '0',
                    marginTop: '80px',
                    justifyContent: 'space-between',
                }}>
                    {/* Mode selection */}
                    <div style={{ marginBottom: '20px' }}>
                        <SelectMode
                            items={modie}
                            eventFunc={(mode) => setSelectedMode(mode)}
                            style={{ fontSize: '32px' }}
                        />
                    </div>

                    {/* Predictions rendering */}
                    {predictions.length > 0 && (
                        <div style={{ marginBottom: '20px', textAlign: 'left', width: '100%' }}>
                            {renderPredictions()}
                        </div>
                    )}

                    {/* Take Photo Button */}
                    <div>
                        <WhiteButton
                            event={toggleCam}
                            text={isCameraActive ? 'Foto aufnehmen' : 'Kamera aktivieren'}
                        />
                    </div>
                </Col>

                {/* Right Column */}
                <Col sm={6} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between' }}>
                    {/* Upload Button */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <UploadButton event={handleImageUpload} text={"Bild hochladen"} />
                    </div>

                    {/* Canvas for video/image display */}
                    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                        {isCameraActive ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                style={{
                                    width: '600px',
                                    height: '600px',
                                    borderRadius: '15px',
                                }}
                            />
                        ) : (
                            <img
                                src={photo}
                                alt="Aufgenommenes Foto"
                                style={{
                                    width: '600px',
                                    height: '600px',
                                    maxWidth: '700px',
                                    objectFit: 'cover',
                                    borderRadius: '15px',
                                }}
                            />
                        )}
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>

                    {/* Switch Camera Button */}
                    <div>
                        {devices.length > 1 && (
                            <WhiteButton
                                event={handleSwitchCamera}
                                text={"Kamera Wechseln"}
                            />
                        )}
                    </div>
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


FreeTestPage.propTypes = {
    model: PropTypes.string,
};
