import { useEffect, useRef, useState } from "react";
import BarComponent from "../assets/BarCompnent.jsx";
import PropTypes from "prop-types";
import GradientButton from "../assets/GradientButton.jsx";
import SelectMode from "../assets/SelectMode.jsx";
import {Alert, AlertTitle} from "@mui/material";
import * as tmImage from "@teachablemachine/image";

export default function FreeTestPage({ model = "" }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [photo, setPhoto] = useState(null);
    const [devices, setDevices] = useState([]);
    const [currentDeviceId, setCurrentDeviceId] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [modelInstance, setModelInstance] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(true);
    const streamRef = useRef(null);
    const [selectedMode, setSelectedMode] = useState(1);
    const [errorMessage, setErrorMessage] = useState(null);

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


//Funktion für Kamera-Devices -> returned alle KameraDevices
    async function GetCamDevices() {
        try {
            // Get all Devices
            const devices = await navigator.mediaDevices.enumerateDevices();

            const videoInputs = devices.filter((device) => device.kind === "videoinput");

            if(videoInputs.length === 0){
                throw new Error("Keine Videoinputs gefunden!");
            }
            // Filter nach Cam-Inputs
            return videoInputs;
        } catch (error) {
            ThrowError(`Fehler beim Abrufen der Geräte: ${error.message}`);
        }
    }


    const ThrowError = (message) => {
        console.error(message);
        setErrorMessage(true);

        // Entferne den Fehler nach 5 Sekunden
        setTimeout(() => {
            setErrorMessage(false);
        }, 5000);
    };

    // Modell von TM mit URL laden:
    useEffect(() => {
        const loadModel = async () => {
            const loadedModel = await LoadModel(model);
            setModelInstance(loadedModel);
        };
        loadModel();
    }, [model]);

    // Get available camera devices
    useEffect(() => {
        const fetchDevices = async () => {
            const cams = await GetCamDevices();
            setDevices(cams);
            if (cams.length > 0) setCurrentDeviceId(cams[0].deviceId);

        };
        fetchDevices();
    }, []);

    async function startCam() {
        if (currentDeviceId && videoRef.current) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: { exact: currentDeviceId } },
                });
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
            } catch (error) {
                ThrowError(`Fehler beim Starten der Kamera: ${error.message}`);
            }
        }
    }


    async function stopCam() {
        if (streamRef.current) {
            const tracks = streamRef.current.getTracks();
            tracks.forEach(track => track.stop()); // Stoppt alle Tracks des Streams
            videoRef.current.srcObject = null; // Entfernt den Stream aus dem Video-Element
            streamRef.current = null; // Löscht den gespeicherten Stream
        }
    }

    useEffect(() => { startCam(); }, [currentDeviceId]);

    useEffect(() => {
        if (isCameraActive) {
            startCam();
        } else {
            stopCam();
        }

        return () => {
            stopCam();
        };
    }, [currentDeviceId, isCameraActive]);

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
        const currentIndex = devices.findIndex((d) => d.deviceId === currentDeviceId);
        const nextIndex = (currentIndex + 1) % devices.length;
        setCurrentDeviceId(devices[nextIndex].deviceId);
    };

    // Upload-Button
    const handleImageUpload = async () => {
        // Kamera deaktivieren und Live-Ansicht verlassen
        if (isCameraActive) {
            stopCam();
            setIsCameraActive(false);
        }

        // Dateiauswahl-Dialog öffnen
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

                        // Canvas-Größe auf Bildgröße setzen
                        canvas.width = img.width;
                        canvas.height = img.height;

                        // Bild auf das Canvas zeichnen
                        context.drawImage(img, 0, 0, img.width, img.height);

                        // Das Bild im State speichern (falls gewünscht)
                        setPhoto(reader.result); // Das Bild speichern, falls es später angezeigt werden soll

                        // Klassifizierung des Bildes durchführen
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
        input.click(); // Dialog öffnen
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
            if (intervalId) clearInterval(intervalId); // Intervall bereinigen, wenn Komponente zerstört wird
        };
    }, [modelInstance, isCameraActive, videoRef]);

    const modie = [
        { value: 1, label: 'Alles Anzeigen' },
        { value: 2, label: 'Klasse und Prozente' },
        { value: 3, label: 'Klasse' }
    ];

    const renderPredictions = () => {
        if (selectedMode === 1) {
            return predictions.map((prediction, index) => (
                <BarComponent
                    key={index}
                    label={prediction.className}
                    value={Math.round(prediction.probability * 100)}
                    classIndex={index}
                />
            ));
        } else if (selectedMode === 2) {
            if (predictions.length > 0) {
                const topPrediction = predictions.reduce((max, prediction) =>
                    prediction.probability > max.probability ? prediction : max, predictions[0]
                );
                return (
                    <BarComponent
                        label={topPrediction.className}
                        value={Math.round(topPrediction.probability * 100)}
                        classIndex={0}
                    />
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
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px'}}>
            {/* Vorhersage und Klassifizierungsanpassung links */}
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                <SelectMode
                    items={modie}
                    eventFunc={(mode) => setSelectedMode(mode)} // Modus auswählen
                    style={{fontSize: '32px'}} // Schriftgröße vergrößern
                />

                {predictions.length > 0 && (
                    <div style={{marginTop: "20px", textAlign: "left", width: "300px"}}> {/* Text linksbündig */}
                        <h2 style={{fontSize: '28px'}}>Klassifikationen:</h2> {/* Schriftgröße erhöhen */}
                        {renderPredictions()}
                    </div>
                )}
            </div>

            {/* Kamera Canvas mit Video und Fotoaufnahme Buttons */}
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                {isCameraActive ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        style={{
                            width: '700px',
                            height: '700px',
                            borderRadius: '15px', // Canvas abgerundet
                        }}
                    />
                ) : (
                    <img
                        src={photo}
                        alt="Aufgenommenes Foto"
                        style={{
                            width: '700px',
                            height: '700px',
                            objectFit: 'cover',
                            marginBottom: '10px',
                            borderRadius: '15px', // Canvas abgerundet
                        }}
                    />
                )}
                <canvas ref={canvasRef} style={{display: 'none'}}/>
                <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                    <GradientButton
                        event={toggleCam}
                        text={isCameraActive ? 'Foto aufnehmen' : 'Kamera aktivieren'}
                    />
                    <GradientButton event={handleImageUpload} text={"Bild hochladen"}/>
                    {devices.length > 1 ? <GradientButton
                        event={handleSwitchCamera}
                        text={"Kamera Wechseln"}
                    /> : null}
                </div>
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
                    ): null}
                </div>

            </div>
        </div>
    );
}


FreeTestPage.propTypes = {
    model: PropTypes.string,
};
