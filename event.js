let player = new Player("Knight", 100, 100, [], 3, 3);

player.loadPlayerFromStorage();

function updatePlayerGold(goldAmount) {
  globalSettings.playerGold += goldAmount;
}

let sprite;
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("current-deck").addEventListener("click", () => {
    player.showDeck();
  });
  document.getElementById("close-deck-btn").addEventListener("click", () => {
    document.getElementById("weapon-deck-screen").classList.add("hidden");
  });
  let eventType = loadData("RandomEvent");

  document.getElementById(eventType).classList.remove("hidden");

  const goldDisplay = document.getElementById("playerGold");
  goldDisplay.textContent = "Gold: " + globalSettings.playerGold;
  sprite = document.querySelector(".sprite");

  resetToIdleAnimation();

  initializeHealthBars();
});

//returning to map after leaving

document.addEventListener("DOMContentLoaded", function () {
  const leaveButtons = document.querySelectorAll(".textbox-btn");

  leaveButtons.forEach((button) => {
    if (button.textContent.trim() === "Leave") {
      button.addEventListener("click", function () {
        window.location.href = "map.html";
      });
    }
  });
});

//Thors Hammer Code

document.addEventListener("DOMContentLoaded", function () {
  const thorsHammerBtn = document.querySelector(".thorsHammer-btn");
  const thorsHammerBox = document.getElementById("thorsHammer");
  const thorsHammerTakenBox = document.getElementById("thorsHammerTaken");

  if (thorsHammerBtn) {
    thorsHammerBtn.addEventListener("click", function () {
      thorsHammerBox.classList.add("hidden");
      thorsHammerTakenBox.classList.remove("hidden");
      player.takeDamage(15);
      player.addWeapon(new ThorsHammer());
      updateHealthBar(player);
      player.savePlayerToStorage();
    });
  }
});

//Found Gold Code

document.addEventListener("DOMContentLoaded", function () {
  const foundGoldButton = document.querySelector(".foundGold");
  if (foundGoldButton) {
    foundGoldButton.addEventListener("click", function () {
      updatePlayerGold(50);

      window.location.href = "map.html";
    });
  }
});

//Gamble Code

document.addEventListener("DOMContentLoaded", function () {
  const acceptGambleButton = document.querySelector(".acceptGamble");

  acceptGambleButton.addEventListener("click", function () {
    const gambleAmount = Math.floor(globalSettings.playerGold / 2);

    if (gambleAmount <= 1) {
      alert("You dont have enough gold to gamble");
      return;
    }

    updatePlayerGold(-gambleAmount);

    const outcome = Math.random() < 0.5 ? "lost" : "won";

    document.getElementById("gambling").classList.add("hidden");

    if (outcome === "won") {
      updatePlayerGold(gambleAmount);
      updatePlayerGold(gambleAmount);

      document.getElementById("gamblingWon").classList.remove("hidden");
    } else {
      document.getElementById("gamblingLost").classList.remove("hidden");
    }
  });

  function updatePlayerGold(goldAmount) {
    globalSettings.playerGold += goldAmount;
    console.log(`Player now has ${globalSettings.playerGold} gold`);

    const goldDisplay = document.getElementById("playerGold");
    if (goldDisplay) {
      goldDisplay.textContent = `Gold: ${globalSettings.playerGold}`;
    }
  }
});

//rest event

document.addEventListener("DOMContentLoaded", function () {
  let eventType = loadData("RandomEvent");

  if (eventType === "rest") {
    document.getElementById("rest").classList.remove("hidden");

    const leaveButton = document.getElementById("leaveRest");

    leaveButton.addEventListener("click", function () {
      player.heal(20);
      updateHealthBar(player);
      player.savePlayerToStorage();
    });
  }
});

//upgrade Weapon

function populateWeaponList() {
  const weaponList = document.getElementById("weapon-list");

  weaponList.innerHTML = "";

  player.deck.forEach((weapon) => {
    const weaponItem = document.createElement("li");
    weaponItem.textContent = weapon.name;
    weaponItem.setAttribute("data-id", weapon.id);
    weaponList.appendChild(weaponItem);
  });
}

function upgradeWeapon(weapon) {
  console.log(`Upgrading weapon: ${weapon.name}`);

  weapon.upgrade();

  player.savePlayerToStorage();
  displayTurnMessage(`Upgraded ${weapon.name}`);

  window.location.href = "map.html";
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("current-deck-upgrade")
    .addEventListener("click", () => {
      document.getElementById("weapon-deck-screen").classList.remove("hidden");

      populateWeaponList();
    });
});

const weaponList = document.getElementById("weapon-list");
if (weaponList) {
  weaponList.addEventListener("click", (e) => {
    const selectedWeapon = e.target;
    if (selectedWeapon.tagName === "LI") {
      const weaponId = selectedWeapon.getAttribute("data-id");
      const weapon = player.deck.find((w) => w.id === weaponId);

      if (weapon) {
        upgradeWeapon(weapon);
      }
    }
  });
}

// document.addEventListener("DOMContentLoaded", () => {
//   document
//     .getElementById("current-deck-upgrade")
//     .addEventListener("click", () => {
//       player.showDeck();
//     });
//   document.getElementById("close-deck-btn").addEventListener("click", () => {
//     document.getElementById("weapon-deck-screen").classList.add("hidden");
//   });
// });

// const weaponList = document.getElementById("weapon-list");

// if (weaponList) {
//   weaponList.addEventListener("click", (e) => {
//     const selectedWeapon = e.target;

//     if (selectedWeapon.tagName === "LI") {
//       const weaponId = selectedWeapon.getAttribute("data-id");
//       const weapon = player.deck.find((w) => w.id === weaponId);

//       if (weapon) {
//         upgradeWeapon(weapon);
//       }
//     }
//   });
// }

// function upgradeWeapon(weapon) {
//   weapon.upgrade();
//   player.savePlayerToStorage();

//   displayTurnMessage(`Upgraded ${weapon.name}!`);

//   window.location.href = "map.html";
// }
