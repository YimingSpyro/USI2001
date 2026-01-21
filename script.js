let cards = [];
let currentIndex = 0;
let currentLang = "en";

fetch("data/cards.json")
  .then(res => res.json())
  .then(data => {
    cards = shuffle(data);
    showCard();
  })
  .catch(err => {
    console.error("Failed to load cards.json", err);
    document.getElementById("card-title").textContent = "Error";
    document.getElementById("card-prompt").textContent =
      "Could not load data/cards.json";
  });

function showCard() {
  const card = cards[currentIndex];

  document.getElementById("card-image").src = card.image;
  document.getElementById("card-title").textContent =
    card.title[currentLang] || card.title.en;

  document.getElementById("card-prompt").textContent =
    card.prompt[currentLang] || card.prompt.en;
}

document.getElementById("next").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % cards.length;
  showCard();
});

document.getElementById("prev").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  showCard();
});

document.getElementById("language").addEventListener("change", (e) => {
  currentLang = e.target.value;
  showCard();
});

function shuffle(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}
