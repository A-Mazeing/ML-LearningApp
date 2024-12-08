import {useEffect, useRef, useState} from "react";
import {GetCamDevices, LoadModel} from "./TM_Model.js";
import BarComponent from "./BarCompnent.jsx";
import PropTypes from "prop-types";
import GradientButton from "./GradientButton.jsx";
import UploadButton from "./UploadButton.jsx";

export default function KameraLoadModel({ width = 300, height = 300, model = "https://teachablemachine.withgoogle.com/models/i865Oq6Cd/" }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [photo, setPhoto] = useState(null);
    const [devices, setDevices] = useState([]);
    const [currentDeviceId, setCurrentDeviceId] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [modelInstance, setModelInstance] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(true);
    const streamRef = useRef(null);

    //Modell von TM mit URL laden:
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

    async function startCam  (){
        if (currentDeviceId && videoRef.current) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: { exact: currentDeviceId } },
                });
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
            } catch (error) {
                console.error("Error accessing the camera:", error);
            }
        }
    }

    async function stopCam(){
        if (streamRef.current) {
            const tracks = streamRef.current.getTracks();
            tracks.forEach(track => track.stop()); // Stoppt alle Tracks des Streams
            videoRef.current.srcObject = null; // Entfernt den Stream aus dem Video-Element
            streamRef.current = null; // Löscht den gespeicherten Stream
        }
    }

    useEffect(() => {startCam();}, [currentDeviceId]);

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

    return (
        <div>
            <h1>Kamera-Komponente</h1>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                {isCameraActive ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        style={{
                            width: `${width}px`,
                            height: `${height}px`,
                        }}
                    />
                ) : (
                    <img
                        src={photo}
                        alt="Aufgenommenes Foto"
                        style={{
                            width: `${width}px`,
                            height: `${height}px`,
                            objectFit: "cover",
                            marginBottom: "10px",
                        }}
                    />
                )}
                <canvas ref={canvasRef} style={{display: "none"}}/>
                <GradientButton
                    event={toggleCam}
                    text={isCameraActive ? "Foto aufnehmen" : "Kamera aktivieren"}
                />
                {devices.length > 1 && <button onClick={handleSwitchCamera}>Kamera wechseln</button>}
                <UploadButton eventClick={handleImageUpload} text={"Bild hochladen"}></UploadButton>

                {predictions.length > 0 && (
                    <div style={{marginTop: "20px", textAlign: "center", width: "300px"}}>
                        <h2>Vorhersagen:</h2>
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
            </div>
        </div>
    );
}

KameraLoadModel.propTypes = {
    model: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
};
