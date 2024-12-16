import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mime from "mime";

// Express App
const app = express();
const PORT = 4000;

// Workaround f�r __dirname (bei ES-Module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Logging-Utility f�r Debugging
const debug = (message) => console.log(`[DEBUG] ${message}`);

// **CORS konfigurieren**
// Besucher nur von bestimmten Domains erlauben (z.B. http://localhost:5173)
app.use(
    cors({
        origin: "http://localhost:5173", // Erlaubte Urspr�nge
        methods: ["GET"], // Nur GET-Methoden erlauben
        optionsSuccessStatus: 200, // F�r �ltere Browser-Kompatibilit�t
    })
);

// **Ratenbegrenzung**
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minuten Zeitfenster
    max: 50, // Maximal 50 Anfragen pro IP innerhalb dieses Intervalls
    message: "Zu viele Anfragen ? bitte versuchen Sie es sp�ter erneut.",
});
app.use(limiter);

// API-Endpunkt f�r das Abrufen der Bilddateien
app.get("/api/files", (req, res) => {
    const directory = path.join(__dirname, "../public/Testdaten"); // Absoluter Pfad

    debug(`Pfad zum Verzeichnis: ${directory}`);

    // **Verzeichnis-Existenz pr�fen**
    if (!fs.existsSync(directory) || !fs.lstatSync(directory).isDirectory()) {
        console.error("Verzeichnis nicht gefunden:", directory);
        return res.status(404).json({ error: "Verzeichnis nicht gefunden" });
    }

    const files = [];

    // **Rekursives Einlesen von Dateien**
    const readDirRecursively = (dir) => {
        fs.readdirSync(dir).forEach((file) => {
            const filePath = path.join(dir, file);

            // Ist es ein Unterverzeichnis?
            if (fs.lstatSync(filePath).isDirectory()) {
                readDirRecursively(filePath);
            } else {
                // Nur bestimmte Dateitypen zulassen
                const mimeType = mime.getType(filePath);
                if (mimeType && ["image/jpeg", "image/png"].includes(mimeType)) {
                    const relativePath = path.relative(path.resolve(__dirname, "../public"), filePath);
                    files.push("/" + relativePath.replace(/\\/g, "/")); // Plattformunabh�ngigen Pfad generieren
                }
            }
        });
    };

    // Verzeichnislesung durchf�hren
    readDirRecursively(directory);

    res.json(files);
});

// **Statische Dateien nur aus dem �ffentlichen Verzeichnis bereitstellen**
app.use(express.static(path.join(__dirname, "../public")));

// **404-Handler** f�r unbekannte Routen
app.use((req, res) => {
    res.status(404).json({ error: "Die angeforderte Ressource existiert nicht." });
});

// **Server starten**
app.listen(PORT, () => {
    console.log(`? Backend l�uft sicher auf: http://localhost:${PORT}`);
});