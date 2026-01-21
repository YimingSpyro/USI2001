let cards = [];
let currentIndex = 0;
let currentLang = "en";

const basePath = window.location.pathname.endsWith("/") ?
    window.location.pathname :
    window.location.pathname + "/";

fetch(basePath + "data/cards.json")
    .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
    })
    .then((data) => {
        cards = shuffle(data);
        render();
    })
    .catch((err) => {
        console.error("Failed to load cards:", err);
        document.getElementById("card-title").textContent = "Error loading cards";
        document.getElementById("card-prompt").textContent =
            "Check data/cards.json path";
    });


function render() {
    const card = cards[currentIndex];
    if (!card) return;

    const titleObj = card.title || {};
    const promptObj = card.prompt || {};

    let title = "";
    if (titleObj[currentLang]) {
        title = titleObj[currentLang];
    } else if (titleObj.en) {
        title = titleObj.en;
    }

    let prompt = "";
    if (promptObj[currentLang]) {
        prompt = promptObj[currentLang];
    } else if (promptObj.en) {
        prompt = promptObj.en;
    }

    document.getElementById("card-title").textContent = title;
    document.getElementById("card-prompt").textContent = prompt;

    const img = document.getElementById("card-image");
    img.src = card.image;

    document.getElementById("card-counter").textContent =
        "Card " + (currentIndex + 1) + " / " + cards.length;
}


document.getElementById("next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % cards.length;
    render();
});

document.getElementById("prev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    render();
});

document.getElementById("language").addEventListener("change", (e) => {
    currentLang = e.target.value;
    render();
});

function shuffle(arr) {
    return arr.slice().sort(() => Math.random() - 0.5);
}