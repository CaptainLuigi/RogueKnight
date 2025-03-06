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

function displayTurnMessage(message) {
  const turnMessage = document.getElementById("turn-message");

  if (!turnMessage) {
    console.error("Turn message element not found!");
    return;
  }

  console.log("Displaying turn message:", message);
  turnMessage.textContent = message;
  turnMessage.style.display = "block"; // Show the message

  // Hide the message after 2 seconds (you can adjust this delay)
  setTimeout(() => {
    turnMessage.style.display = "none"; // Hide the message
  }, 2000);
}

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

document.addEventListener("DOMContentLoaded", () => {
  let upgradeMode = false; // Track upgrade mode

  const upgradeButton = document.getElementById("current-deck-upgrade");
  const weaponDeckScreen = document.getElementById("weapon-deck-screen");
  const closeDeckButton = document.getElementById("close-deck-btn");

  upgradeButton?.addEventListener("click", () => {
    console.log("Upgrade button clicked");
    weaponDeckScreen?.classList.remove("hidden");
    player.showDeck("upgrade"); // This should generate .weapon elements
    upgradeMode = true;

    document.body.classList.add("upgrade-mode");
  });

  // Listen for clicks on #weapon-deck-screen and check if it was a .weapon (not .weapon-item)
  weaponDeckScreen?.addEventListener("click", (event) => {
    // Check if the click target is a .weapon (using index class for selection)
    const weaponElement = event.target.closest(".weapon");

    if (weaponElement) {
      console.log("Weapon clicked");

      // Get the index of the clicked weapon
      const weaponIndex = Array.from(
        weaponDeckScreen.querySelectorAll(".weapon")
      ).indexOf(weaponElement);
      console.log("Weapon clicked, index:", weaponIndex); // Debugging the index

      if (weaponIndex === -1) {
        console.error("Weapon index not found!");
        return;
      }

      const weapon = player.deck[weaponIndex]; // Get weapon by index
      console.log("Weapon found:", weapon); // Debugging the weapon object

      if (weapon) {
        console.log("Upgrading weapon:", weapon.name); // Confirm weapon to be upgraded
        if (typeof upgradeWeapon === "function") {
          upgradeWeapon(weapon); // Upgrade weapon
        } else {
          console.error("upgradeWeapon is not defined or is not a function.");
        }
        upgradeMode = false;
      } else {
        console.error("Weapon not found in player's deck");
      }
    }
  });

  closeDeckButton?.addEventListener("click", () => {
    console.log("Closing deck");
    weaponDeckScreen?.classList.add("hidden");
    upgradeMode = false;
  });

  function upgradeWeapon(weapon) {
    console.log(`Upgrading weapon: ${weapon.name}`);

    if (weapon.level >= 3) {
      displayTurnMessage(`${weapon.name} is already max level.`);
      return;
    }

    weapon.upgrade();
    player.savePlayerToStorage();

    displayTurnMessage(`Upgraded ${weapon.name}`);

    window.location.href = "map.html";
  }
});
