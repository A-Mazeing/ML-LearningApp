import React, { useState } from "react";

const BlurComponent = ({ accuracyResults, calculateResults }) => {
    // State für das Anzeigen/Verstecken des Blur-Overlays
    const [showOverlay, setShowOverlay] = useState(true);
    const [results, setResults] = useState(accuracyResults);

    // Funktion, die das Overlay beim Klicken versteckt und Berechnungen durchführt
    const handleOverlayClick = async () => {
        setShowOverlay(false); // Overlay ausblenden

        // Führe die Berechnungen aus und aktualisiere anschließend die Ergebnisse
        const newResults = await calculateResults(); // Klassifikation & Ergebnisberechnung
        setResults(newResults);
    };

    return (
        <div style={{ position: "relative", maxWidth: "50%", width: "100%" }}>
            {/* Blur-Overlay mit Schrift */}
            {showOverlay && (
                <div
                    onClick={handleOverlayClick} // Overlay verschwinden lassen & Berechnungen starten
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
                        textAlign: "center",
                        padding: "10px",
                        cursor: "pointer", // Klick-Symbol
                    }}
                >
                    Berechnung Starten
                </div>
            )}

            {/* Darunterliegendes Div */}
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    justifyContent: "space-between",
                    display: "flex", // Flex-Anordnung
                    flexWrap: "wrap", // Umbruch bei kleinen Bildschirmen
                    padding: "20px",
                    gap: "20px",
                    border: "2px solid #ffffff",
                    borderRadius: "8px",
                    textAlign: "left",
                    zIndex: "0",
                    boxSizing: "border-box", // Korrekte Größenberechnung
                }}
            >
                {/* Anzeige der Ergebnisse */}
                <div style={{ flex: "1", textAlign: "center" }}>
                    <strong>Overall Accuracy:</strong>
                    <br />
                    {results.accuracy || "N/A"}%
                </div>
                <div style={{ flex: "1", textAlign: "center" }}>
                    <strong>Precision:</strong>
                    {results.precision
                        ? Object.entries(results.precision).map(([className, precision]) => (
                            <div key={className}>
                                {className}: {precision}%
                            </div>
                        ))
                        : "N/A"}
                </div>
                <div style={{ flex: "1", textAlign: "center" }}>
                    <strong>Recall:</strong>
                    {results.recall
                        ? Object.entries(results.recall).map(([className, recall]) => (
                            <div key={className}>
                                {className}: {recall}%
                            </div>
                        ))
                        : "N/A"}
                </div>
            </div>
        </div>
    );
};

export default BlurComponent;