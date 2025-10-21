const deckModal = document.getElementById("deck-selection-modal");
const deckContainer = document.getElementById("starter-deck-container");
const confirmButton = document.getElementById("confirm-deck");
const backButton = document.getElementById("back-to-menu");
const deleteButton = document.getElementById("deleteCharacter");
const deleteModal = document.getElementById("delete-confirmation-modal");
const confirmDelete = document.getElementById("confirm-delete");
const cancelDelete = document.getElementById("cancel-delete");
const customModal = document.getElementById("custom-deck-modal");

let selectedDeckIndex = null;

document.querySelector(".start-button").addEventListener("click", () => {
  const savedState = loadData("playerState");

  if (savedState) {
    window.location.href = "map.html";
  } else {
    deckModal.classList.remove("hidden");
    renderStarterDecks();
  }
});

backButton.addEventListener("click", () => {
  deckModal.classList.add("hidden");
});

deleteButton.addEventListener("click", () => {
  deleteModal.classList.remove("hidden");
});

cancelDelete.addEventListener("click", () => {
  deleteModal.classList.add("hidden");
  closePauseMenu();
});

confirmDelete.addEventListener("click", () => {
  saveUnlockedDecks([0]);
  deleteModal.classList.add("hidden");
  closePauseMenu();
});

function tooltipForDeck(index, characterNames) {
  if (index === 0) return "";
  return "Win a run with " + characterNames[index - 1] + " to unlock.";
}

function renderStarterDecks() {
  deckContainer.innerHTML = "";

  const unlockedDecks = loadUnlockedDecks();
  const characterNames = starterDecks.map((deck) => deck.name);

  starterDecks.forEach((deck, index) => {
    const deckDiv = document.createElement("div");
    deckDiv.classList.add("starter-deck");

    const isUnlocked = unlockedDecks.includes(index);

    deckDiv.innerHTML = `
        <h3>${deck.name}<h3>
        <button onclick="viewDeckWeapons(${index})"
        ${!isUnlocked ? "disabled" : ""}>View Equipement</button>
         <button onclick="selectDeck(${index})" ${
      !isUnlocked ? "disabled" : ""
    }>
          ${
            isUnlocked
              ? "Select Character"
              : "Win with " + characterNames[index - 1]
          }
        </button>
        `;

    if (!isUnlocked) {
      deckDiv.classList.add("locked-deck");

      const tooltipText = tooltipForDeck(index, characterNames);
      if (tooltipText) {
        deckDiv.setAttribute("title", tooltipText);
      }
    }
    deckContainer.appendChild(deckDiv);
  });
}

function viewDeckWeapons(index) {
  const deck = starterDecks[index];

  document.getElementById("deck-details-name").textContent = deck.name;
  document.getElementById("deck-details-hp").textContent = deck.maxHP ?? 100;
  document.getElementById("deck-details-gold").textContent = deck.gold ?? 150;
  document.getElementById("deck-details-relics").textContent =
    (deck.relics ?? []).join(", ") || "None";

  const weaponsList = document.getElementById("deck-details-weapons");
  weaponsList.innerHTML = "";
  deck.weapons.forEach((w) => {
    const li = document.createElement("li");
    li.textContent = w.name || w.constructor.name;
    weaponsList.appendChild(li);
  });

  document.getElementById("deck-details").classList.remove("hidden");
}

function closeDeckDetails() {
  document.getElementById("deck-details").classList.add("hidden");
}

function selectDeck(index) {
  if (starterDecks[index].name === "Custom Knight") {
    openCustomDeckModal();
    return;
  }

  selectedDeckIndex = index;
  confirmButton.disabled = false;

  document.querySelectorAll(".starter-deck").forEach((deck, i) => {
    if (i === index) {
      deck.classList.add("selected-deck");
    } else {
      deck.classList.remove("selected-deck");
    }
  });
}

function resetPlayerProgress() {
  localStorage.removeItem("playerState");
  localStorage.removeItem("unlockedCharacters");

  const unlocked = ["True Knight"];
  localStorage.setItem("unlockedCharacters", JSON.stringify(unlocked));

  location.reload();
}

confirmButton.addEventListener("click", () => {
  if (selectedDeckIndex === null) return;

  const deckData = starterDecks[selectedDeckIndex];

  const deck = deckData.weapons;
  const relics = deckData.relics ?? [];
  const maxHP = deckData.maxHP ?? 100;
  const gold = deckData.gold ?? 150;

  const player = new Player("Player", maxHP, maxHP, deck, 3, 3);

  player.gold = gold;
  globalSettings.playerGold = gold;

  relics.forEach((r) => player.foundRelic(r, true));

  player.currentDeckIndex = selectedDeckIndex;

  player.savePlayerToStorage();

  window.location.href = "map.html";
});

function populateWeaponDropdown() {
  const weaponsSelect = document.getElementById("custom-weapons");
  weaponsSelect.innerHTML = "";

  const availableWeapons = getAvailableWeapons();

  availableWeapons.forEach((weapon) => {
    const option = document.createElement("option");
    option.value = weapon.constructor.name;
    option.textContent = weapon.name || weapon.constructor.name;
    weaponsSelect.appendChild(option);
  });
}

function populateRelicDropdown() {
  const relicsSelect = document.getElementById("custom-relics");
  relicsSelect.innerHTML = "";

  Object.values(relicList)
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((relic) => {
      const option = document.createElement("option");
      option.value = relic.name;
      option.textContent = relic.name;
      relicsSelect.appendChild(option);
    });
}

function openCustomDeckModal() {
  populateWeaponDropdown();
  populateRelicDropdown();

  document.getElementById("custom-maxhp").value = 100;
  document.getElementById("custom-gold").value = 150;

  customModal.classList.remove("hidden");
}

document.getElementById("confirm-custom-deck").addEventListener("click", () => {
  const maxHP = parseInt(document.getElementById("custom-maxhp").value) || 100;
  const gold = parseInt(document.getElementById("custom-gold").value) || 150;

  // Weapons
  const selectedWeaponsNames = Array.from(
    document.getElementById("custom-weapons").selectedOptions
  ).map((o) => o.value);

  const weapons = selectedWeaponsNames
    .map((name) => {
      const weapon = getAvailableWeapons().find(
        (w) => w.constructor.name === name
      );
      return weapon
        ? Object.assign(Object.create(Object.getPrototypeOf(weapon)), weapon)
        : null;
    })
    .filter(Boolean); // remove nulls

  // Player creation
  const player = new Player("Custom Knight", maxHP, maxHP, weapons, 3, 3);
  player.gold = gold;
  globalSettings.playerGold = gold;

  // Relics
  const selectedRelics = Array.from(
    document.getElementById("custom-relics").selectedOptions
  ).map((o) => o.value);

  selectedRelics.forEach((rName) => {
    const relicObj = relicList.find((rel) => rel.name === rName);
    if (relicObj) player.foundRelic(relicObj, true);
  });

  player.savePlayerToStorage();
  window.location.href = "map.html";
});
