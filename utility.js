function getAllGetters(instance) {
  const getters = {};

  // Get all properties in the prototype chain
  let proto = Object.getPrototypeOf(instance);

  while (proto) {
    // Get all property descriptors for this prototype level
    const descriptors = Object.getOwnPropertyDescriptors(proto);

    // Find all getter methods (i.e., those with 'get' in the descriptor)
    for (let key in descriptors) {
      if (descriptors[key].get) {
        let getter = descriptors[key].get;
        if (!(key in getters)) getters[key] = getter;
      }
    }

    // Move to the next prototype (in case the class extends another class)
    proto = Object.getPrototypeOf(proto);
  }

  delete getters["__proto__"];
  return getters;
}

document.addEventListener("DOMContentLoaded", () => {
  const pauseBtn = document.getElementById("pause-menu-button");
  const menu = document.getElementById("pause-menu");

  if (pauseBtn && menu) {
    pauseBtn.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
  }
});

function closePauseMenu() {
  document.getElementById("pause-menu").classList.add("hidden");
}

function saveAndExit() {
  player.savePlayerToStorage();
  window.location.href = "index.html";
}

function deleteProgressAndExit(exit = true) {
  localStorage.removeItem("playerState");
  localStorage.removeItem("MapState");
  localStorage.removeItem("triggeredEvents");
  localStorage.removeItem("eventAssignments");

  localStorage.removeItem("shopWeapons");
  localStorage.removeItem("shopRelics");

  localStorage.removeItem("boughtShopWeapons");
  localStorage.removeItem("boughtShopRelics");

  localStorage.removeItem("selectedFightIndex");

  localStorage.removeItem("selectedRelicName");

  localStorage.removeItem("comingFromBoss");
  localStorage.removeItem("selectedRelic1");
  localStorage.removeItem("selectedRelic2");

  localStorage.setItem("weaponRemoved", "false");

  for (let key of [...Object.keys(localStorage)]) {
    if (key.startsWith("relic_")) {
      localStorage.removeItem(key);
    }
  }

  globalSettings.relicGroup = "chest";
  globalSettings.redirectToChest = false;
  globalSettings.currentAct = 1;

  if (exit === true) {
    window.location.href = "index.html";
  }
}

function applyActVisuals() {
  const bg = document.getElementById("StartscreenBackground");
  const playerSprite = document.querySelector(".sprite-player");
  const genericSprites = document.querySelectorAll(".sprite");
  const enemySprites = document.querySelectorAll(".sprite-enemie");

  // Change background if possible
  if (bg) {
    switch (globalSettings.currentAct) {
      case 2:
        bg.src = "Assets/cave-background.png";
        break;
      default:
        bg.src = "Assets/background_forest.png";
        break;
    }
  }

  // Apply darkness to player sprite if it exists
  if (playerSprite) {
    if (globalSettings.currentAct === 2) {
      playerSprite.classList.add("dark-cave-effect");
    } else {
      playerSprite.classList.remove("dark-cave-effect");
    }
  }

  genericSprites.forEach((sprite) => {
    if (globalSettings.currentAct === 2) {
      sprite.classList.add("dark-cave-effect");
    } else {
      sprite.classList.remove("dark-cave-effect");
    }
  });

  // Always apply darkness to enemy sprites, even if playerSprite doesn't exist
  enemySprites.forEach((enemy) => {
    if (globalSettings.currentAct === 2) {
      enemy.classList.add("dark-cave-effect");
    } else {
      enemy.classList.remove("dark-cave-effect");
    }
  });
}

function updatePlayerGold(goldAmount) {
  globalSettings.playerGold += goldAmount;
}

function openMap() {
  document.getElementById("mapFrame").src = "map.html?viewonly=true";
  document.getElementById("mapOverlay").style.display = "block";
}

function closeMap() {
  document.getElementById("mapOverlay").style.display = "none";
}

window.addEventListener("message", (event) => {
  if (event.data.type === "updateDifficulty") {
    console.log(
      "Updated difficulty from map iframe:",
      globalSettings.difficulty
    );
  }
});

function saveUnlockedDecks(unlockedDecks) {
  localStorage.setItem("unlockedDecks", JSON.stringify(unlockedDecks));
}

// einkommentieren nachdem custom knight getestet wurde
function loadUnlockedDecks() {
  const data = localStorage.getItem("unlockedDecks");
  return data ? JSON.parse(data) : [0];
}

// entfernen wenn custom knight getestet wurde
// function loadUnlockedDecks() {
//   const saved = JSON.parse(localStorage.getItem("unlockedCharacters")) || [];

//   if (!saved.includes("Custom Knight")) saved.push("Custom Knight");

//   return starterDecks
//     .map((deck, index) => deck.name)
//     .map((name, i) => (saved.includes(name) ? i : null))
//     .filter((i) => i !== null);
// }

function preventMobileImgDownload(img) {
  img.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
}
