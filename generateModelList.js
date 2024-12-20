import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname und __filename in ES Module-Umgebung definieren
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pfad zu deinem /Modelle-Verzeichnis
const modelFolder = path.join(__dirname, "public/Modelle");

// Generiere eine JSON-Liste der Modelle (Verzeichnisse)
const generateModelList = () => {
    try {
        // Lese alle Verzeichnisse im Ordner /Modelle
        const items = fs.readdirSync(modelFolder, { withFileTypes: true });

        // Filtere nur Verzeichnisse (die Modelle enthalten)
        const modelDirectories = items
            .filter((item) => item.isDirectory())
            .map((dir) => dir.name); // Nur den Namen des Verzeichnisses speichern

        // Schreib die Liste in eine JSON-Datei
        fs.writeFileSync(
            path.join(__dirname, "src/modelList.json"),
            JSON.stringify(modelDirectories, null, 2)
        );

        console.log("Modell-Liste erfolgreich erstellt.");
    } catch (error) {
        console.error("Fehler beim Erstellen der Modell-Liste:", error.message);
    }
};

// Rufe die Funktion auf, um die Liste zu generieren
generateModelList();