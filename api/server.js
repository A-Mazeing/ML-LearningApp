import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mime from "mime";
import { createServer } from "http";

// Debug-Nachricht beim Start
console.log("Server wird gestartet...");
const app = express();
app.use(cors());

// Workaround für __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// **Rate Limiting**
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minuten
    max: 50, // Maximale Anfragen pro IP
    message: "Zu viele Anfragen - bitte später erneut versuchen.",
});
app.use(limiter);

// **Ordner 'Testdaten' zur Verfügung stellen**
const directoryPath = path.resolve(process.cwd(), "Testdaten"); // Absolut basierend auf dem Arbeitsverzeichnis

console.log("Bereitgestelltes Directory:", directoryPath);

// Route für statische Dateien im Ordner 'Testdaten'
app.use("/Testdaten", express.static(directoryPath));

// Dynamische API, um Dateinamen aus dem Ordner abzurufen
app.get("/api/files", (req, res) => {
    try {
        if (!fs.existsSync(directoryPath) || !fs.lstatSync(directoryPath).isDirectory()) {
            console.error("Verzeichnis nicht gefunden:", directoryPath);
            return res.status(404).json({ error: "Verzeichnis nicht gefunden" });
        }

        const files = fs.readdirSync(directoryPath)
            .filter((file) => {
                const filePath = path.join(directoryPath, file);
                const mimeType = mime.getType(filePath);
                return mimeType && ["image/jpeg", "image/png"].includes(mimeType);
            })
            .map((file) => `/Testdaten/${file}`);

        res.status(200).json(files);
    } catch (error) {
        console.error("Fehler beim Abrufen der Dateien:", error);
        res.status(500).json({ error: "Fehler beim Abrufen der Dateien" });
    }
});

// **Server lokal starten**
if (process.env.NODE_ENV !== "production") {
    const PORT = 3000; // Lokaler Server-Standardport
    app.listen(PORT, () => {
        console.log(`Server läuft lokal auf Port ${PORT}`);
        console.log(`Testdaten unter http://localhost:${PORT}/Testdaten verfügbar`);
    });
}

// **Express-App für Vercel bereitstellen**
export default async function handler(req, res) {
    const server = createServer(app);
    server.emit("request", req, res);
}