let cards = [];
let currentIndex = 0;
let currentLang = "en";

fetch("data/cards.json")
  .then(response => response.json())
  .then(data => {
    cards = shuffle(data);
    showCard();
  });

function showCard() {
  const card = cards[currentIndex];
  document.getElementById("card-image").src = card.image;
  document.getElementById("card-prompt").textContent =
    card.prompt[currentLang] || card.prompt.en;
}

document.getElementById("next").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % cards.length;
  showCard();
});

document.getElementById("language").addEventListener("change", (e) => {
  currentLang = e.target.value;
  showCard();
});

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
