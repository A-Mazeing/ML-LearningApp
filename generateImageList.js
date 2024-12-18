import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname und __filename in ES Module-Umgebung definieren
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pfad zu deinem Testdaten-Ordner
const testDataFolder = path.join(__dirname, "public/Testdaten");

// Generiere eine JSON-Liste der Bilder
const generateImageList = () => {
    try {
        const files = fs.readdirSync(testDataFolder);

        // Filtere nur Bilddateien
        const imageFiles = files.filter((file) =>
            /\.(jpe?g|png)$/i.test(file)
        );

        // Schreib die Liste in eine JSON-Datei
        fs.writeFileSync(
            path.join(__dirname, "src/imageList.json"),
            JSON.stringify(imageFiles, null, 2)
        );

        console.log("Image-Liste erfolgreich erstellt.");
    } catch (error) {
        console.error("Fehler beim Generieren der Bilddateiliste:", error.message);
    }
};

generateImageList();