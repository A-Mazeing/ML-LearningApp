import React, { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";

const TeachableMachine = ({ modelUrl }) => {
    const [predictions, setPredictions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const webcamRef = useRef(null);
    const labelContainerRef = useRef(null);
    const modelRef = useRef(null);
    const maxPredictionsRef = useRef(0);

    useEffect(() => {
        const initModel = async () => {
            try {
                setIsLoading(true);

                // Lade das Modell und die Metadaten
                const modelURL = modelUrl + "model.json";
                const metadataURL = modelUrl + "metadata.json";
                modelRef.current = await tmImage.load(modelURL, metadataURL);

                // Max. Klassenanzahl
                maxPredictionsRef.current = modelRef.current.getTotalClasses();

                // Webcam einrichten
                const flip = true; // Kamera spiegeln
                webcamRef.current = new tmImage.Webcam(300, 300, flip); // Breite, Höhe, Flip
                await webcamRef.current.setup();
                await webcamRef.current.play();

                // Webcam ins DOM einfügen
                document.getElementById("webcam-container").appendChild(webcamRef.current.canvas);

                // Label-Container mit Klassen initialisieren
                const labelContainer = labelContainerRef.current;
                labelContainer.innerHTML = ""; // Leeren, falls schon existierend
                for (let i = 0; i < maxPredictionsRef.current; i++) {
                    const labelElement = document.createElement("div");
                    labelContainer.appendChild(labelElement);
                }

                setIsLoading(false);
                window.requestAnimationFrame(loop);
            } catch (error) {
                console.error("Fehler beim Laden des Modells oder der Webcam:", error);
                setIsLoading(false);
            }
        };

        const loop = async () => {
            if (webcamRef.current) {
                webcamRef.current.update(); // Webcam-Frame aktualisieren
                await predict();
                window.requestAnimationFrame(loop);
            }
        };

        const predict = async () => {
            if (modelRef.current && webcamRef.current) {
                const prediction = await modelRef.current.predict(webcamRef.current.canvas);
                setPredictions(prediction.map((p) => ({
                    className: p.className,
                    probability: (p.probability * 100).toFixed(2), // Prozentanzeige
                })));

                // Label-Container aktualisieren
                prediction.forEach((p, index) => {
                    labelContainerRef.current.childNodes[index].innerHTML = `${p.className}: ${(
                        p.probability * 100
                    ).toFixed(2)}%`;
                });
            }
        };

        initModel();
    }, [modelUrl]);

    return (
        <div style={{ textAlign: "center", color: "#fff" }}>
            <h2>Teachable Machine Modell</h2>
            {isLoading ? <p>Modell wird geladen...</p> : null}
            <div id="webcam-container" style={{ margin: "20px auto" }}></div>
            <div id="label-container" ref={labelContainerRef}></div>
            <div style={{ marginTop: "20px" }}>
                {predictions.map((p, index) => (
                    <p key={index}>
                        {p.className}: <strong>{p.probability}%</strong>
                    </p>
                ))}
            </div>
        </div>
    );
};

export default TeachableMachine;
