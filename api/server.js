import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mime from "mime";
import { createServer } from "http";

// **Express App einrichten**
const app = express();
app.use(cors());

// Workaround für __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const debug = (message) => console.log(`[DEBUG] ${message}`);

// **CORS-Konfiguration**
app.use(
    cors({
        origin: "*", // Erlaube alle Ursprünge (anpassen, falls nötig)
        methods: ["GET"],
        optionsSuccessStatus: 200,
    })
);

// **Rate Limiting**
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minuten
    max: 50,
    message: "Zu viele Anfragen - bitte später erneut versuchen.",
});
app.use(limiter);

// **API-Endpunkt für das Abrufen der Bilddateien**
app.get("/api/files", (req, res) => {
    const directory = path.join(__dirname, "../public/Testdaten");

    debug(`Pfad zum Verzeichnis: ${directory}`);

    if (!fs.existsSync(directory) || !fs.lstatSync(directory).isDirectory()) {
        console.error("Verzeichnis nicht gefunden:", directory);
        return res.status(404).json({ error: "Verzeichnis nicht gefunden" });
    }

    const files = [];

    const readDirRecursively = (dir) => {
        fs.readdirSync(dir).forEach((file) => {
            const filePath = path.join(dir, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                readDirRecursively(filePath);
            } else {
                const mimeType = mime.getType(filePath);
                if (mimeType && ["image/jpeg", "image/png"].includes(mimeType)) {
                    const relativePath = path.relative(path.resolve(__dirname, "../public"), filePath);
                    files.push("/" + relativePath.replace(/\\/g, "/"));
                }
            }
        });
    };

    readDirRecursively(directory);
    res.json(files);
});

// **Statische Dateien bereitstellen**
app.use(express.static(path.join(__dirname, "../public")));

// **404-Handler**
app.use((req, res) => {
    res.status(404).json({ error: "Die angeforderte Ressource existiert nicht." });
});

// **Express-App für Vercel exportieren**
export default async function handler(req, res) {
    const server = createServer(app);
    server.emit("request", req, res);
}