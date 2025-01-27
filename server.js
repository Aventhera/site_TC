const express = require("express");
const cors = require("cors");

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

// Route principale
app.get("/", (req, res) => {
    res.send("Bienvenue sur l'API TechCare ! Accédez à /api/weekly-color avec une requête POST pour voir la couleur de la semaine.");
});

// Endpoint pour la couleur hebdomadaire
app.post("/api/weekly-color", (req, res) => {
    const currentWeek = getCurrentWeek();

    // Mise à jour si la semaine a changé
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

    res.json({ color: colorData.color, history: colorData.history });
});

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
}
