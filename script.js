let allDecks = [];
let selectedDeckId = "";
let activeDeck = null;

let cards = [];
let currentIndex = 0;
let currentLang = "en";

/* ---------- Helpers ---------- */
function getBasePath() {
    // Works on localhost and GitHub Pages project sites
    let p = window.location.pathname;
    if (p.endsWith("/")) return p;
    return p + "/";
}

function textByLang(obj, lang) {
    if (!obj) return "";
    if (obj[lang]) return obj[lang];
    if (obj.en) return obj.en;
    return "";
}

function shuffle(arr) {
    return arr.slice().sort(function() {
        return Math.random() - 0.5;
    });
}

/* ---------- Elements ---------- */
const screenDeck = document.getElementById("screen-deck");
const screenGame = document.getElementById("screen-game");

const deckOptionsEl = document.getElementById("deck-options");
const startDeckBtn = document.getElementById("start-deck");

const deckSelectTitleEl = document.getElementById("deck-select-title");
const deckSelectHintEl = document.getElementById("deck-select-hint");

const titleEl = document.getElementById("card-title");
const promptEl = document.getElementById("card-prompt");
const imageEl = document.getElementById("card-image");
const counterEl = document.getElementById("card-counter");

const langSelect = document.getElementById("language");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const changeDeckBtn = document.getElementById("change-deck");

/* ---------- Load decks ---------- */
function loadDecks() {
    const base = getBasePath();

    fetch(base + "data/decks.json")
        .then(function(res) {
            if (!res.ok) throw new Error("HTTP " + res.status);
            return res.json();
        })
        .then(function(data) {
            allDecks = data.decks || [];
            renderDeckPicker();
        })
        .catch(function(err) {
            console.error("Failed to load decks:", err);
            deckSelectTitleEl.textContent = "Failed to load decks.json";
            deckSelectHintEl.textContent = "Check path: data/decks.json and JSON format.";
        });
}

/* ---------- Deck picker UI ---------- */
function renderDeckPicker() {
    deckOptionsEl.innerHTML = "";

    // Title/Hint per language (simple)
    const titles = {
        en: "Select a Deck",
        zh: "选择卡组",
        ms: "Pilih Dek",
        ta: "ஒரு டெக்கை தேர்வு செய்யவும்"
    };
    const hints = {
        en: "Tip: Pick Neighbourhood for hyper-local talk, or Story Swap for memories.",
        zh: "提示：选“社区探索”聊本地生活，或选“故事交换”分享回忆。",
        ms: "Tip: Pilih Kejiranan untuk perbualan setempat, atau Tukar Cerita untuk kenangan.",
        ta: "குறிப்பு: உள்ளூர் உரையாடலுக்கு ‘உள்ளூர் பகுதிகள்’, நினைவுகளுக்கு ‘கதை பரிமாற்றம்’."
    };

    deckSelectTitleEl.textContent = titles[currentLang] || titles.en;
    deckSelectHintEl.textContent = hints[currentLang] || hints.en;

    for (let i = 0; i < allDecks.length; i++) {
        const deck = allDecks[i];

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "deck-option";

        const name = textByLang(deck.name, currentLang);
        const desc = textByLang(deck.description, currentLang);

        btn.innerHTML =
            '<div class="name">' + escapeHtml(name) + "</div>" +
            '<div class="desc">' + escapeHtml(desc) + "</div>";

        if (deck.id === selectedDeckId) {
            btn.classList.add("active");
        }

        btn.addEventListener("click", function() {
            selectedDeckId = deck.id;
            startDeckBtn.disabled = false;
            renderDeckPicker();
        });

        deckOptionsEl.appendChild(btn);
    }

    // If only one deck, auto-select
    if (!selectedDeckId && allDecks.length === 1) {
        selectedDeckId = allDecks[0].id;
        startDeckBtn.disabled = false;
        renderDeckPicker();
    }
}

startDeckBtn.addEventListener("click", function() {
    if (!selectedDeckId) return;

    activeDeck = null;
    for (let i = 0; i < allDecks.length; i++) {
        if (allDecks[i].id === selectedDeckId) {
            activeDeck = allDecks[i];
            break;
        }
    }
    if (!activeDeck) return;

    cards = shuffle(activeDeck.cards || []);
    currentIndex = 0;

    screenDeck.classList.add("d-none");
    screenGame.classList.remove("d-none");

    renderCard();
});

/* ---------- Game ---------- */
function renderCard() {
    const card = cards[currentIndex];
    if (!card) return;

    const title = textByLang(card.title, currentLang);
    const prompt = textByLang(card.prompt, currentLang);

    titleEl.textContent = title;
    promptEl.textContent = prompt;
    imageEl.src = card.image;

    counterEl.textContent = "Card " + (currentIndex + 1) + " / " + cards.length;
}

nextBtn.addEventListener("click", function() {
    if (!cards.length) return;
    currentIndex = (currentIndex + 1) % cards.length;
    renderCard();
});

prevBtn.addEventListener("click", function() {
    if (!cards.length) return;
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    renderCard();
});

changeDeckBtn.addEventListener("click", function() {
    screenGame.classList.add("d-none");
    screenDeck.classList.remove("d-none");
});

/* ---------- Language changes both screens ---------- */
langSelect.addEventListener("change", function(e) {
    currentLang = e.target.value;

    // Update deck picker texts/options
    renderDeckPicker();

    // Update card if in game
    if (!screenGame.classList.contains("d-none")) {
        renderCard();
    }
});

function escapeHtml(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ---------- Start ---------- */
loadDecks();