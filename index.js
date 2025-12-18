const deckModal = document.getElementById("deck-selection-modal");
const deckContainer = document.getElementById("starter-deck-container");
const confirmButton = document.getElementById("confirm-deck");
const backButton = document.getElementById("back-to-menu");
const deleteButton = document.getElementById("deleteCharacter");
const deleteAchievements = document.getElementById("deleteAchievements");
const deleteModal = document.getElementById("delete-confirmation-modal");
const deleteAchievementsModal = document.getElementById(
  "delete-achievements-confirmation-modal"
);
const confirmDelete = document.getElementById("confirm-delete");
const confirmAchievementsDelete = document.getElementById(
  "confirm-achievements-delete"
);
const cancelDelete = document.getElementById("cancel-delete");
const cancelAchievementsDelete = document.getElementById(
  "cancel-achievements-delete"
);
const customModal = document.getElementById("custom-deck-modal");

let selectedDeckIndex = null;

document.querySelector(".start-button").addEventListener("click", () => {
  const savedState = loadData("playerState");

  if (savedState) {
    window.location.href = "map.html";
  } else {
    selectedDeckIndex = null;
    confirmButton.disabled = true;
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

deleteAchievements.addEventListener("click", () => {
  deleteAchievementsModal.classList.remove("hidden");
});

cancelDelete.addEventListener("click", () => {
  deleteModal.classList.add("hidden");
  closePauseMenu();
});

cancelAchievementsDelete.addEventListener("click", () => {
  deleteAchievementsModal.classList.add("hidden");
});

confirmDelete.addEventListener("click", () => {
  saveUnlockedDecks([0]);
  deleteModal.classList.add("hidden");
  closePauseMenu();
});

confirmAchievementsDelete.addEventListener("click", () => {
  resetAchievementProgress();
  deleteAchievementsModal.classList.add("hidden");
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

  // Check if it's the Custom Knight
  if (deck.name === "Custom Knight") {
    const maxHP =
      parseInt(document.getElementById("custom-maxhp").value) || 100;
    const gold = parseInt(document.getElementById("custom-gold").value) || 150;

    document.getElementById("deck-details-name").textContent = "Custom Knight";
    document.getElementById("deck-details-hp").textContent = maxHP;
    document.getElementById("deck-details-gold").textContent = gold;

    // --- Relics as <li> like weapons ---
    const relicsList = document.getElementById("deck-details-relics");
    relicsList.innerHTML = "";

    relicsList.style.columns = "2";
    relicsList.style.columnGap = "10vw";

    Array.from(customSelectedRelics).forEach((rName) => {
      const li = document.createElement("li");
      const relic = relicList[rName];

      if (relic && relic.icon) {
        const img = document.createElement("img");
        img.src = relic.icon;
        img.alt = rName;
        img.classList.add("deck-details-img");
        li.appendChild(img);
      }

      li.append(` ${rName}`);
      relicsList.appendChild(li);
    });

    // --- Weapons ---
    const weaponsList = document.getElementById("deck-details-weapons");
    weaponsList.innerHTML = "";

    Object.values(customSelectedWeapons).forEach(({ weapon, count }) => {
      const li = document.createElement("li");

      if (weapon.sprite) {
        const img = document.createElement("img");
        img.src = weapon.sprite;
        img.alt = weapon.name;
        img.classList.add("deck-details-img");
        li.appendChild(img);
      }

      li.append(` ${weapon.name} x${count}`);
      weaponsList.appendChild(li);
    });

    document.getElementById("deck-details").classList.remove("hidden");
    return;
  }

  // --- For all other characters ---
  document.getElementById("deck-details-name").textContent = deck.name;
  document.getElementById("deck-details-hp").textContent = deck.maxHP ?? 100;
  document.getElementById("deck-details-gold").textContent = deck.gold ?? 150;

  const relicsList = document.getElementById("deck-details-relics");
  relicsList.innerHTML = "";
  (deck.relics ?? []).forEach((rName) => {
    const li = document.createElement("li");
    const relic = relicList[rName];

    if (relic && relic.icon) {
      const img = document.createElement("img");
      img.src = relic.icon;
      img.alt = rName;
      img.classList.add("deck-details-img");
      li.appendChild(img);
    }

    li.append(` ${rName}`);
    relicsList.appendChild(li);
  });

  const weaponsList = document.getElementById("deck-details-weapons");
  weaponsList.innerHTML = "";
  deck.weapons.forEach((w) => {
    const li = document.createElement("li");

    if (w.sprite) {
      const img = document.createElement("img");
      img.src = w.sprite;
      img.classList.add("deck-details-img");
      li.appendChild(img);
    }

    li.append(` ${w.name || w.constructor.name}`);
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

function resetAchievementProgress() {
  localStorage.removeItem("achievementsUnlocked");

  location.reload();
}

confirmButton.addEventListener("click", () => {
  if (selectedDeckIndex === null) return;

  const deckData = starterDecks[selectedDeckIndex];
  let deck, relics, maxHP, gold, playerName;

  if (deckData.name === "Custom Knight") {
    // Custom deck
    playerName = "Custom Knight";
    deck = [];
    relics = Array.from(customSelectedRelics);
    maxHP = parseInt(document.getElementById("custom-maxhp").value) || 100;
    gold = parseInt(document.getElementById("custom-gold").value) || 150;

    player = new Player(playerName, maxHP, maxHP, [], 3, 3);
    player.gold = gold;
    globalSettings.playerGold = gold;

    // Add selected weapons & relics
    for (let name in customSelectedWeapons) {
      for (let i = 0; i < customSelectedWeapons[name].count; i++) {
        player.addWeapon(customSelectedWeapons[name].weapon);
      }
    }

    relics.forEach((rName) => player.foundRelic(rName, true)); // ✅ keep only one
  } else {
    // Normal starter deck
    playerName = deckData.name;
    deck = deckData.weapons;
    relics = deckData.relics ?? [];
    maxHP = deckData.maxHP ?? 100;
    gold = deckData.gold ?? 150;

    player = new Player(playerName, maxHP, maxHP, deck, 3, 3);
    player.gold = gold;
    globalSettings.playerGold = gold;

    relics.forEach((r) => player.foundRelic(r, true)); // ✅ keep only one
  }

  player.currentDeckIndex = selectedDeckIndex;
  player.savePlayerToStorage();

  window.location.href = "map.html";
});

function populateWeaponsContainer() {
  const container = document.getElementById("custom-weapons-container");
  container.innerHTML = "";

  const allWeapons = Object.values(weaponClassMapping)
    .map((WeaponClass) => new WeaponClass())
    .filter((w) => w.rarity !== undefined && w.rarity !== null)
    .sort((a, b) => a.name.localeCompare(b.name));

  allWeapons.forEach((weapon) => {
    const btn = document.createElement("button");
    btn.classList.add("weapon-btn");

    // Create icon image
    if (weapon.sprite) {
      const img = document.createElement("img");

      preventMobileImgDownload(img);

      img.src = weapon.sprite; // should be a valid URL or path
      img.alt = weapon.name;
      img.classList.add("weapon-icon");
      img.style.width = "2vw"; // adjust size
      img.style.height = "2vw";
      img.style.marginRight = "1vw";
      btn.appendChild(img);
    }

    // Add weapon name
    const span = document.createElement("span");
    span.textContent = weapon.name;
    btn.appendChild(span);

    btn.addEventListener("click", () => addWeaponToCustomDeck(weapon));
    container.appendChild(btn);
  });
}

function populateRelicsContainer() {
  const container = document.getElementById("custom-relics-container");
  container.innerHTML = "";

  Object.values(relicList)
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((relic) => {
      const btn = document.createElement("button");
      btn.classList.add("relic-btn");

      // Create icon image
      if (relic.icon) {
        const img = document.createElement("img");

        preventMobileImgDownload(img);

        img.src = relic.icon; // should be a valid URL or path
        img.alt = relic.name;
        img.classList.add("relic-icon");
        img.style.width = "2vw";
        img.style.height = "2vw";
        img.style.marginRight = "1vw";
        btn.appendChild(img);
      }

      // Add relic name
      const span = document.createElement("span");
      span.textContent = relic.name;
      btn.appendChild(span);

      btn.addEventListener("click", () => addRelicToCustomDeck(relic));
      container.appendChild(btn);
    });
}

const customSelectedWeapons = {};
const customSelectedRelics = new Set();

function addWeaponToCustomDeck(weapon) {
  let key = weapon.name;
  if (!customSelectedWeapons[key])
    customSelectedWeapons[key] = { weapon, count: 0 };
  customSelectedWeapons[key].count++;
  updateCustomDeckPreview();
}

function addRelicToCustomDeck(relic) {
  if (!customSelectedRelics.has(relic.name)) {
    customSelectedRelics.add(relic.name);
    updateCustomDeckPreview();
  }
}

function openCustomDeckModal() {
  populateWeaponsContainer();
  populateRelicsContainer();

  document.getElementById("custom-maxhp").value = 100;
  document.getElementById("custom-gold").value = 150;

  customModal.classList.remove("hidden");
}

document.getElementById("confirm-custom-deck").addEventListener("click", () => {
  // Close the custom deck modal
  customModal.classList.add("hidden");

  // Pretend as if the "Custom Knight" deck was selected
  const customIndex = starterDecks.findIndex((d) => d.name === "Custom Knight");
  selectedDeckIndex = customIndex;
  confirmButton.disabled = false;

  // Highlight Custom Knight as selected
  document.querySelectorAll(".starter-deck").forEach((deck, i) => {
    if (i === customIndex) {
      deck.classList.add("selected-deck");
    } else {
      deck.classList.remove("selected-deck");
    }
  });
});

function createPreviewElement(div) {
  if (!div) {
    div = document.querySelector("#template-nodes > .selected-preview-element");
    div = div.cloneNode(true);
  }
  const removeBtn = div.querySelector(".remove-btn");
  const img = div.querySelector(".element-img");
  const span = div.querySelector(".element-desc");
  return [div, img, span, removeBtn];
}

function updateCustomDeckPreview() {
  const weaponsItems = document.querySelector("#custom-selected-weapons");
  const relicsItems = document.querySelector("#custom-selected-relics");

  // Weapons
  Object.values(customSelectedWeapons).forEach((weaponData) => {
    let { weapon, count } = weaponData;
    let [div, img, span, removeBtn] = createPreviewElement(weaponData.div);
    if (!weaponData.div) {
      weaponData.div = div;

      removeBtn.addEventListener("click", function () {
        weaponData.count--;
        if (weaponData.count <= 0) {
          delete customSelectedWeapons[weapon.name];
          div.remove();
        }
        updateCustomDeckPreview();
      });
    }

    if (weapon.sprite) {
      img.src = weapon.sprite;
      img.alt = weapon.name;
    }

    span.textContent = `${weapon.name} `;
    span.innerHTML += `x&nbsp;${count}`;

    weaponsItems.appendChild(div);
  });

  // Relics
  customSelectedRelics.forEach((relicName) => {
    let [div, img, span, removeBtn] = createPreviewElement(
      document.querySelector(`[relicname = "${relicName}"]`)
    );

    const relic = relicList[relicName];
    if (relic && relic.icon) {
      img.src = relic.icon;
      img.alt = relic.name;
    }

    span.textContent = relicName;
    div.setAttribute("relicname", relicName);

    removeBtn.addEventListener("click", () => {
      div.remove();
      customSelectedRelics.delete(relicName);
      updateCustomDeckPreview();
    });

    relicsItems.appendChild(div);
  });
}
