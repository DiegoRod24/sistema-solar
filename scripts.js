const planets = ["sol", "marte", "jupiter", "saturno", "venus", "neptuno", "mercurio", "urano"];
let level = 1;
let gameBoard = document.getElementById("game-board");
let restartBtn = document.getElementById("restart");
let levelText = document.getElementById("level");

restartBtn.addEventListener("click", () => {
  level = 1;
  startGame();
});

function startGame() {
  levelText.textContent = "Nivel: " + level;
  gameBoard.innerHTML = "";

  const numPairs = 2 + level; // Ej: nivel 1 = 3 pares, nivel 2 = 4 pares...
  const selectedPlanets = planets.slice(0, numPairs);
  const cardsArray = [...selectedPlanets, ...selectedPlanets];

  shuffle(cardsArray);

  gameBoard.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(cardsArray.length))}, 110px)`;

  cardsArray.forEach(planet => {
    const card = createCard(planet);
    gameBoard.appendChild(card);
  });
}

function createCard(planet) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.planet = planet;

  const inner = document.createElement("div");
  inner.classList.add("card-inner");

  const front = document.createElement("div");
  front.classList.add("card-front");

  const back = document.createElement("div");
  back.classList.add("card-back");

  const img = document.createElement("img");
  img.src = `assets/${planet}.jpg`;
  img.alt = planet;

  back.appendChild(img);
  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  card.addEventListener("click", flipCard);
  return card;
}

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;

function flipCard() {
  if (lockBoard || this === firstCard) return;

  this.classList.add("flip");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
}

function checkMatch() {
  let isMatch = firstCard.dataset.planet === secondCard.dataset.planet;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();

  matchedPairs++;
  if (matchedPairs === (2 + level)) {
    setTimeout(() => {
      alert("¡Bien hecho! Vamos al siguiente nivel 🌟");
      level++;
      matchedPairs = 0;
      startGame();
    }, 1000);
  }
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

startGame();
