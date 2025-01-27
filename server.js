const express = require("express");
const cors = require("cors");
const path = require("path"); // Nécessaire pour gérer les fichiers statiques

const app = express();
app.use(cors());
app.use(express.json());

// Base de données simulée (mémoire)
let colorData = {
    week: null,
    color: null,
    history: []
};

// Liste des couleurs possibles
const colors = ["red", "blue", "yellow", "green", "purple", "orange", "pink", "teal", "brown", "cyan"];

// Récupération de la semaine actuelle
const getCurrentWeek = () => {
    const now = new Date();
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Mise à jour de la couleur hebdomadaire
const updateWeeklyColor = () => {
    const currentWeek = getCurrentWeek();
    if (colorData.week !== currentWeek) {
        const newColor = colors[Math.floor(Math.random() * colors.length)];
        if (colorData.color) {
            colorData.history.push({ week: colorData.week, color: colorData.color });
        }
        colorData = {
            week: currentWeek,
            color: newColor,
            history: colorData.history
        };
    }
};

// Servir le fichier HTML pour la route `/`
app.get("/", (req, res) => {
    updateWeeklyColor(); // Met à jour la couleur avant de servir la page
    res.sendFile(path.join(__dirname, "index.html")); // Envoie le fichier HTML
});

// Endpoint pour l'API (couleur et historique)
app.post("/api/weekly-color", (req, res) => {
    updateWeeklyColor(); // Met à jour la couleur si nécessaire
    res.json({ color: colorData.color, history: colorData.history });
});

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});
