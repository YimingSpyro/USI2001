let cards = [];
let currentIndex = 0;
let currentLang = "en";

fetch("data/cards.json")
  .then(res => res.json())
  .then(data => {
    cards = shuffle(data);
    showCard();
  });

function showCard() {
  const card = cards[currentIndex];

  document.getElementById("card-image").src = card.image;
  document.getElementById("card-title").textContent =
    card.title[currentLang] || card.title.en;

  document.getElementById("card-prompt").textContent =
    card.prompt[currentLang] || card.prompt.en;
}

document.getElementById("next").onclick = () => {
  currentIndex = (currentIndex + 1) % cards.length;
  showCard();
};

document.getElementById("prev").onclick = () => {
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  showCard();
};

document.getElementById("language").onchange = e => {
  currentLang = e.target.value;
  showCard();
};

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
