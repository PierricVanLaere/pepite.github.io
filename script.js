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
        answer: "chêne"
    }
};

// Coordonnées des 5 parcs (latitude, longitude)
const parksCoordinates = {
    "Jardin extraordinaire": [47.2095, -1.5536],
    "Jardin des Plantes": [47.2181, -1.5596],
    "Île de Versailles": [47.2044, -1.5769],
    "Parc Floral de la Beaujoire": [47.2611, -1.5222],
    "Parc de l’Arboretum": [47.2583, -1.5194]
};

// Variable pour suivre la section actuelle
let currentSection = "intro";

// Initialisation de la carte
let map;
function initMap() {
    map = L.map('map').setView([47.2184, -1.5536], 13); // Centré sur Nantes

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Ajout des marqueurs pour chaque parc
    Object.keys(parksCoordinates).forEach(park => {
        const [lat, lng] = parksCoordinates[park];
        L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`<b>${park}</b><br><button onclick="selectParkFromMap('${park}')">Choisir ce parc</button>`)
            .openPopup();
    });
}

// Fonction pour sélectionner un parc depuis la carte
function selectParkFromMap(park) {
    document.getElementById("mapSection").style.display = "none";
    document.getElementById("gameSection").style.display = "block";
    currentSection = "game";
    updateBackButton();
    document.getElementById("selectedPark").textContent = park;
    document.getElementById("clueText").textContent = parksData[park].clue;
    document.getElementById("userAnswer").value = "";
    document.getElementById("feedback").textContent = "";
}

// Gestion du bouton "Retour" global
function updateBackButton() {
    const backButtonContainer = document.getElementById("backButtonContainer");
    if (currentSection === "intro") {
        backButtonContainer.style.display = "none";
    } else {
        backButtonContainer.style.display = "block";
    }
}

document.getElementById("backButton").addEventListener("click", () => {
    if (currentSection === "parks" || currentSection === "map") {
        document.getElementById(currentSection + "Section").style.display = "none";
        document.getElementById("introSection").style.display = "block";
        currentSection = "intro";
    } else if (currentSection === "game") {
        document.getElementById("gameSection").style.display = "none";
        document.getElementById("parksSection").style.display = "block";
        currentSection = "parks";
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

// Navigation vers la carte
document.getElementById("showMapButton").addEventListener("click", () => {
    document.getElementById("introSection").style.display = "none";
    document.getElementById("mapSection").style.display = "block";
    currentSection = "map";
    updateBackButton();
    if (!map) {
        initMap();
    }
});

// Navigation vers le jeu depuis la liste des parcs
document.querySelectorAll(".park-card").forEach(card => {
    card.addEventListener("click", () => {
        const selectedPark = card.getAttribute("data-park");
        document.getElementById("parksSection").style.display = "none";
        document.getElementById("gameSection").style.display = "block";
        currentSection = "game";
        updateBackButton();
        document.getElementById("selectedPark").textContent = selectedPark;
        document.getElementById("clueText").textContent = parksData[selectedPark].clue;
        document.getElementById("userAnswer").value = "";
        document.getElementById("feedback").textContent = "";
    });
});

// Vérification de la réponse
document.getElementById("checkAnswer").addEventListener("click", () => {
    const userAnswer = document.getElementById("userAnswer").value.toLowerCase();
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

// Fonction pour obtenir la voix "Microsoft Julie - French (France)"
function getJulieVoice() {
    const voices = window.speechSynthesis.getVoices();
    return voices.find(voice => voice.name === "Microsoft Julie - French (France)");
}

// Fonction pour lire le texte avec la voix de Julie
function speakWithJulie(text) {
    if (!voicesLoaded) {
        console.log("Les voix ne sont pas encore chargées. Patientons...");
        setTimeout(() => speakWithJulie(text), 100); // Réessaye après un court délai
        return;
    }

    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';

    const julieVoice = getJulieVoice();
    if (julieVoice) {
        utterance.voice = julieVoice;
        console.log("Voix Julie utilisée :", julieVoice.name);
    } else {
        console.log("Voix Julie non trouvée. Voici les voix disponibles :", window.speechSynthesis.getVoices());
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
        // Lire le texte avec la voix de Julie
        readButton.innerHTML = '<span class="icon">❚❚</span> Arrêter';
        isReading = true;
        speakWithJulie(instructionsText);
    }
});

// Attendre que les voix soient chargées
window.speechSynthesis.onvoiceschanged = () => {
    voicesLoaded = true;
    console.log("Voices loaded. Julie available:", !!getJulieVoice());
};

// Forcer le chargement des voix (nécessaire pour certains navigateurs)
function loadVoices() {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
        voicesLoaded = true;
        console.log("Voices already loaded. Julie available:", !!getJulieVoice());
    }
}

// Appeler une première fois pour vérifier si les voix sont déjà chargées
loadVoices();

