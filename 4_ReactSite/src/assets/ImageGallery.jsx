import React from "react";
import CircleButton from "./CircleButton";

function ImageGallery({ imagePaths, currentImageIndex, handlePreviousImage, handleNextImage, imageRef }) {
  return (
    <div
      style={{
        position: "absolute",
        right: "0",
        top: "50%",
        transform: "translateY(-50%)", // Vertikale Zentrierung
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "40%", // Maximal 40% der Breite
        height: "70vh", // 70% der Bildschirmhöhe
      }}
    >
      {imagePaths.length > 0 ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            aspectRatio: "1 / 1", // Seitenverhältnis 1:1
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // Bild im Mittelpunkt
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
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          />

          {/* Button: Nächstes Bild */}
          <CircleButton direction="next" onClick={handleNextImage} />
        </div>
      ) : (
        <p>Bilder werden geladen...</p>
      )}
    </div>
  );
}

export default ImageGallery;