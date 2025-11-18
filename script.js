// Données des parcs et des énigmes
const parksData = {
    "Jardin extraordinaire": {
        clue: "Indice : Cherche près de la sculpture en forme de nuage !",
        answer: "nuage"
    },
    "Jardin des Plantes": {
        clue: "Indice : Regarde sous le grand palmier dans la serre tropicale !",
        answer: "palmier"
    },
    "Île de Versailles": {
        clue: "Indice : Le trésor est caché près du pont rouge !",
        answer: "pont"
    },
    "Parc Floral de la Beaujoire": {
        clue: "Indice : Cherche près de la fontaine en forme de fleur !",
        answer: "fleur"
    },
    "Parc de l’Arboretum": {
        clue: "Indice : Le trésor est caché sous le plus grand chêne !",
        answer: "chene"
    }
};

const parksCoordinates = {
    "Jardin extraordinaire": [47.2002721, -1.5856774,17],
    "Jardin des Plantes": [47.2193911, -1.54],
    "Île de Versailles": [47.225611, -1.5644606,15],
    "Parc Floral de la Beaujoire": [47.2621822, -1.5320338,17],
    "Parc de l’Arboretum": [47.2694346, -1.5886027]
};

// Variable pour suivre la section actuelle
let currentSection = "intro";

// Initialisation de la carte
let map;

// Fonction: Initialiser la carte avec tous les parcs (pour le bouton "Voir la carte")
function initMap() {
    // Toujours supprimer l'ancienne instance de carte avant d'en créer une nouvelle
    if (map) {
        map.remove();
        map = null;
    }

    // Rétablir le titre et le paragraphe par défaut de la section carte
    document.getElementById("mapSection").querySelector('h2').textContent = `Carte des parcs à explorer`;
    document.getElementById("mapSection").querySelector('p').innerHTML = `Clique sur un marqueur pour commencer l'énigme !`;

    map = L.map('map').setView([47.2184, -1.5536], 13); // Centré sur Nantes

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Ajout des marqueurs pour chaque parc
    Object.keys(parksCoordinates).forEach(park => {
        const [lat, lng] = parksCoordinates[park];
        L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`<b>${park}</b><br><button onclick="startParkGame('${park}')">Commencer l'énigme !</button>`)
            .openPopup();
    });
}


// Nouvelle Fonction: Afficher la carte centrée sur un seul parc (après un clic sur une carte)
function showSingleParkMap(parkName) {
    // Toujours supprimer l'ancienne instance de carte avant d'en créer une nouvelle
    if (map) {
        map.remove();
        map = null;
    }

    const [lat, lng] = parksCoordinates[parkName];

    // 1. Mettre à jour le titre et le bouton de la section
    document.getElementById("mapSection").querySelector('h2').textContent = `Localisation du ${parkName}`;
    const mapParagraph = document.getElementById("mapSection").querySelector('p');
    mapParagraph.innerHTML = `Tu es sur place ? <button id="startGameButton" onclick="startParkGame('${parkName}')">Commencer l'énigme !</button>`;

    // 2. Initialiser la nouvelle carte sur le parc sélectionné
    map = L.map('map').setView([lat, lng], 20); // Zoom plus proche

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<b>${parkName}</b>`)
        .openPopup();
}


// Fonction: Démarrer le jeu (utilisée par les popups de la carte ou le bouton "Commencer l'énigme")
function startParkGame(park) {
    document.getElementById("mapSection").style.display = "none";
    document.getElementById("gameSection").style.display = "block";
    currentSection = "game";
    updateBackButton();
    document.getElementById("selectedPark").textContent = park;
    document.getElementById("clueText").textContent = parksData[park].clue;
    document.getElementById("userAnswer").value = "";
    document.getElementById("feedback").textContent = "";
}


// Gestion du bouton "Retour" global (MODIFIÉ)
function updateBackButton() {
    const backButtonContainer = document.getElementById("backButtonContainer");
    // Afficher le bouton si nous ne sommes pas à la page d'intro
    backButtonContainer.style.display = (currentSection === "intro") ? "none" : "block";
}

document.getElementById("backButton").addEventListener("click", () => {
    // Cacher l'élément courant
    const currentElement = document.getElementById(currentSection + "Section");
    if (currentElement) {
        currentElement.style.display = "none";
    }
    document.getElementById('mapSection').style.display = 'none';

    // Déterminer la prochaine section
    if (currentSection === "map" || currentSection === "parks") {
        // Depuis la liste des parcs ou la carte "tous parcs", revenir à l'intro
        document.getElementById("introSection").style.display = "block";
        currentSection = "intro";
    } else if (currentSection === "map_single" || currentSection === "game") {
        // Depuis la carte d'un seul parc ou le jeu, revenir à la liste des parcs
        document.getElementById("parksSection").style.display = "block";
        currentSection = "parks";

        // Nettoyer la section carte (titre/bouton) si on la quitte
        document.getElementById("mapSection").querySelector('h2').textContent = `Carte des parcs à explorer`;
        document.getElementById("mapSection").querySelector('p').innerHTML = `Clique sur un marqueur pour choisir un parc !`;
    }

    updateBackButton();
});

// Navigation vers la liste des parcs
document.getElementById("startButton").addEventListener("click", () => {
    document.getElementById("introSection").style.display = "none";
    document.getElementById("parksSection").style.display = "block";
    currentSection = "parks";
    updateBackButton();
});

// Navigation vers la carte complète
document.getElementById("showMapButton").addEventListener("click", () => {
    document.getElementById("introSection").style.display = "none";
    document.getElementById("mapSection").style.display = "block";
    currentSection = "map";
    updateBackButton();
    initMap(); // Initialisation de la carte complète
});

// Navigation vers la carte d'un seul parc depuis la liste (MODIFIÉ)
document.querySelectorAll(".park-card").forEach(card => {
    card.addEventListener("click", () => {
        const selectedPark = card.getAttribute("data-park");

        document.getElementById("parksSection").style.display = "none";
        document.getElementById("mapSection").style.display = "block";
        currentSection = "map_single"; // Nouvel état : carte d'un seul parc
        updateBackButton();

        // Affiche la carte centrée sur ce parc
        showSingleParkMap(selectedPark);
    });
});

// Vérification de la réponse
document.getElementById("checkAnswer").addEventListener("click", () => {
    const userAnswer = document.getElementById("userAnswer").value.toLowerCase().replace(/é/g, 'e'); // Traiter l'accent
    const selectedPark = document.getElementById("selectedPark").textContent;
    const correctAnswer = parksData[selectedPark].answer;

    if (userAnswer === correctAnswer) {
        document.getElementById("feedback").textContent = "Bravo ! Tu as trouvé le trésor !";
    } else {
        document.getElementById("feedback").textContent = "Presque ! Essaie encore.";
    }
});

// Carousel des avis
const reviews = document.querySelectorAll('.review');
const prevButton = document.getElementById('prevReview');
const nextButton = document.getElementById('nextReview');
let currentReview = 0;

function showReview(index) {
    reviews.forEach((review, i) => {
        review.classList.toggle('active', i === index);
    });
}

prevButton.addEventListener('click', () => {
    currentReview = (currentReview - 1 + reviews.length) % reviews.length;
    showReview(currentReview);
});

nextButton.addEventListener('click', () => {
    currentReview = (currentReview + 1) % reviews.length;
    showReview(currentReview);
});

showReview(currentReview);

// Texte prédéfini à lire
const instructionsText = "Riri le canari rêve de devenir le capitaine de la Beaujoire, mais pour cela il doit former une équipe exceptionnelle. Il part alors dans le parc à la recherche de ses amis aide le à les retrouver: Anne, la Duchesse des Roses, Octo la pieuvre, Shiba le chien samouraï et flou le fantôme. Ensemble, ils unissent leurs talents pour surmonter les épreuves et avancer dans l’aventure. Leur mission : retrouver le ballon d’or secret, caché quelque part dans le parc";

// Bouton pour lire/arrêter les instructions
const readButton = document.getElementById("readInstructionsButton");
let isReading = false;
let utterance = null;
let voicesLoaded = false;

// Fonction pour obtenir la voix "Microsoft Julie - French (France)" (ou une autre voix FR si Julie n'est pas dispo)
function getJulieVoice() {
    const voices = window.speechSynthesis.getVoices();
    return voices.find(voice => voice.name.includes("Julie") && voice.lang === "fr-FR") ||
        voices.find(voice => voice.lang === "fr-FR"); // Fallback
}

// Fonction pour lire le texte avec la voix de Julie
function speakWithJulie(text) {
    if (!voicesLoaded) {
        setTimeout(() => speakWithJulie(text), 100);
        return;
    }

    // Annuler la lecture précédente si elle est en cours
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }

    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';

    const julieVoice = getJulieVoice();
    if (julieVoice) {
        utterance.voice = julieVoice;
    }

    utterance.onend = () => {
        readButton.innerHTML = '<span class="icon">▶</span> Écouter les instructions';
        isReading = false;
    };

    window.speechSynthesis.speak(utterance);
}

readButton.addEventListener("click", () => {
    if (isReading) {
        // Arrêter la lecture
        window.speechSynthesis.cancel();
        readButton.innerHTML = '<span class="icon">▶</span> Écouter les instructions';
        isReading = false;
    } else {
        // Lire le texte
        readButton.innerHTML = '<span class="icon">❚❚</span> Arrêter';
        isReading = true;
        speakWithJulie(instructionsText);
    }
});

// Attendre que les voix soient chargées
window.speechSynthesis.onvoiceschanged = () => {
    voicesLoaded = true;
    // Vérification initiale du bouton "Retour" au chargement
    updateBackButton();
};


// Fonction pour forcer le chargement des voix (nécessaire pour certains navigateurs)
function loadVoices() {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
        voicesLoaded = true;
    }
}

// Appeler une première fois pour vérifier si les voix sont déjà chargées
loadVoices();