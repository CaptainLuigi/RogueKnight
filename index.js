const deckModal = document.getElementById("deck-selection-modal");
const deckContainer = document.getElementById("starter-deck-container");
const confirmButton = document.getElementById("confirm-deck");

let selectedDeckIndex = null;

// vorerst auskommentiert für patch 1.7
// zum weiteren testen einkommentieren und click listener in index html entfernen
// document.querySelector(".start-button").addEventListener("click", () => {
//   const savedState = loadData("playerState");

//   if (savedState) {
//     window.location.href = "map.html";
//   } else {
//     deckModal.classList.remove("hidden");
//     renderStarterDecks();
//   }
// });

function renderStarterDecks() {
  deckContainer.innerHTML = "";

  starterDecks.forEach((deck, index) => {
    const deckDiv = document.createElement("div");
    deckDiv.classList.add("starter-deck");
    deckDiv.innerHTML = `
        <h3>${deck.name}<h3>
        <button onclick="viewDeckWeapons(${index})">View Weapons</button>
        <button onclick="selectDeck(${index})">Select Deck</button>
        `;
    deckContainer.appendChild(deckDiv);
  });
}

function viewDeckWeapons(index) {
  const weapons = starterDecks[index].weapons.map(
    (w) => w.name || w.constructor.name
  );
  alert(`Weapons in ${starterDecks[index].name}:\n- ${weapons.join("\n- ")}`);
}

function selectDeck(index) {
  selectedDeckIndex = index;
  confirmButton.disabled = false;
}

confirmButton.addEventListener("click", () => {
  if (selectedDeckIndex === null) return;

  const deck = starterDecks[selectedDeckIndex].weapons;
  const relics = starterDecks[selectedDeckIndex].relics ?? [];

  const player = new Player("Player", 100, 100, deck, 3, 3);

  relics.forEach((r) => player.foundRelic(r, true));

  player.savePlayerToStorage();

  window.location.href = "map.html";
});
