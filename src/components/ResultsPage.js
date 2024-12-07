import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as tmImage from "@teachablemachine/image";
import "./Resultspage.css";

const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const teachableLink = location.state?.teachableLink || "";

    const [predictions, setPredictions] = useState([]);
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState("");
    const videoRef = useRef(null);
    const modelRef = useRef(null);

    // Kameras abrufen
    useEffect(() => {
        const initWebcams = async () => {
            try {
                const allDevices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = allDevices.filter((device) => device.kind === "videoinput");
                setDevices(videoDevices);

                if (videoDevices.length > 0) {
                    setSelectedDevice(videoDevices[0].deviceId);
                    console.log("Gefundene Kameras:", videoDevices);
                } else {
                    console.warn("Keine Kameras gefunden!");
                }
            } catch (error) {
                console.error("Fehler beim Abrufen der Kameras:", error);
            }
        };

        initWebcams();
    }, []);

    // Kamera starten
    useEffect(() => {
        const startCamera = async () => {
            if (!selectedDevice) {
                console.warn("Keine Kamera ausgewählt!");
                return;
            }

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: { exact: selectedDevice } },
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    console.log("Kamera läuft.");
                }
            } catch (error) {
                console.error("Fehler beim Starten der Kamera:", error);
            }
        };

        startCamera();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
                console.log("Kamera gestoppt.");
            }
        };
    }, [selectedDevice]);

    // Modell laden
    useEffect(() => {
        const loadModel = async () => {
            if (!teachableLink) {
                console.error("Kein Modell-Link angegeben!");
                return;
            }

            try {
                const modelURL = `${teachableLink}model.json`;
                const metadataURL = `${teachableLink}metadata.json`;

                modelRef.current = await tmImage.load(modelURL, metadataURL);
                console.log("Modell erfolgreich geladen:", modelRef.current);
            } catch (error) {
                console.error("Fehler beim Laden des Modells:", error);
            }
        };

        loadModel();
    }, [teachableLink]);

    // Vorhersagen abrufen
    useEffect(() => {
        const predictLoop = async () => {
            if (videoRef.current && modelRef.current) {
                try {
                    const predictions = await modelRef.current.predict(videoRef.current);
                    console.log("Vorhersagen erhalten:", predictions);
                    setPredictions(predictions);
                } catch (error) {
                    console.error("Fehler beim Abrufen der Vorhersagen:", error);
                }
            }
            requestAnimationFrame(predictLoop);
        };

        if (modelRef.current) {
            predictLoop();
        } else {
            console.error("Modell nicht geladen.");
        }
    }, [modelRef]);

    // Kamera wechseln
    const handleDeviceChange = (e) => {
        setSelectedDevice(e.target.value);
        console.log("Kamera gewechselt zu:", e.target.value);
    };

    return (
        <div className="results-container">
            <div className="main-content">
                {/* Linke Seite: Balken */}
                <div className="left">
                    <h2>Modell Ergebnisse</h2>
                    <div id="results">
                        {predictions && predictions.length > 0 ? (
                            predictions.map((p, index) => (
                                <div className="result-row" key={index}>
                                    <span className="class-label">{p.className}</span>
                                    <div className="progress-container">
                                        <div
                                            className="progress-bar"
                                            style={{
                                                width: `${Math.min(Math.max(p.probability * 100, 0), 100)}%`,
                                                backgroundColor:
                                                    p.probability > 0.8
                                                        ? "limegreen"
                                                        : p.probability > 0.3
                                                            ? "orange"
                                                            : "red",
                                                transition: "width 0.5s ease-in-out",
                                            }}
                                        ></div>
                                        <span className="percentage">
                                        {(p.probability * 100).toFixed(2)}%
                                    </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Keine Vorhersagen verfügbar</p>
                        )}
                    </div>
                </div>

                {/* Rechte Seite: Kamera */}
                <div className="right">
                    <div className="video-wrapper">
                        <video ref={videoRef} className="video" autoPlay muted></video>
                    </div>
                    <select
                        className="device-select"
                        onChange={handleDeviceChange}
                        value={selectedDevice}
                    >
                        {devices.map((device, index) => (
                            <option key={index} value={device.deviceId}>
                                {device.label || `Kamera ${index + 1}`}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="footer">
                <button className="home-button" onClick={() => navigate("/")}>
                    <img src="/home.png" alt="Home"/>
                </button>
            </div>

        </div>
    );

};

export default ResultsPage;
