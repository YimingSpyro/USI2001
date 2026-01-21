let cards = [];
let currentIndex = 0;

fetch("data/cards.json")
  .then(res => res.json())
  .then(data => {
    cards = shuffle(data);
    showCard();
  });

function showCard() {
  const card = cards[currentIndex];
  document.getElementById("card-image").src = card.image;
  document.getElementById("card-prompt").textContent = card.prompt;
}

document.getElementById("next").onclick = () => {
  currentIndex = (currentIndex + 1) % cards.length;
  showCard();
};

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
