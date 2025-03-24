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

// Function to drop the selected weapon by index
function dropWeapon(indexToDrop) {
  console.log(`Dropping weapon at index: ${indexToDrop}`);

  let currentDeck = player.deck; // Get a copy of the deck (since the getter returns a copy)

  if (
    indexToDrop === undefined ||
    indexToDrop < 0 ||
    indexToDrop >= currentDeck.length
  ) {
    console.error("Invalid weapon index!");
    return;
  }

  // Log deck before removing weapon
  console.log("Player deck before removing weapon:", currentDeck);

  // Create a new deck with the selected weapon removed
  let updatedDeck = currentDeck.filter((_, index) => index !== indexToDrop);

  // Log the updated deck after removing the weapon
  console.log("Updated Player Deck:", updatedDeck);

  player.deck = updatedDeck;

  // Manually override the player's deck by calling savePlayerToStorage
  player.savePlayerToStorage = function () {
    let state = {
      name: player.name,
      health: player.health,
      maxHealth: player.maxHealth,
      maxEnergy: player.maxEnergy,
      deck: updatedDeck.map((weapon) => weapon.getWeaponInfo()), // Save new deck
    };
    storeData("playerState", state);
  };

  // Call savePlayerToStorage to update storage with new deck
  player.savePlayerToStorage();

  console.log("Player deck saved to storage.");
}

//returning to map after leaving

document.addEventListener("DOMContentLoaded", function () {
  const leaveButtons = document.querySelectorAll(".textbox-btn");

  leaveButtons.forEach((button) => {
    if (button.classList.contains("leave-btn")) {
      button.addEventListener("click", function () {
        window.location.href = "map.html";
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  let eventType = loadData("RandomEvent");

  //rest event

  if (eventType === "rest") {
    document.getElementById("rest").classList.remove("hidden");

    const leaveButton = document.getElementById("leaveRest");

    leaveButton.addEventListener("click", function () {
      player.heal(20);
      updateHealthBar(player);
      player.savePlayerToStorage();
      window.location.href = "map.html";
    });
  }

  //Lightning

  if (eventType === "lightning") {
    document.getElementById("lightning").classList.remove("hidden");
    document
      .getElementById("takeLightning")
      .addEventListener("click", function () {
        document.getElementById("lightning").classList.add("hidden");
        document.getElementById("takeLightning2").classList.remove("hidden");

        player.clearDeck();

        player.addWeapon(new Lightning());
        player.addWeapon(new Lightning());
        player.addWeapon(new Lightning());

        player.savePlayerToStorage();

        console.log("Updated player deck after event", player.deck);
      });
  }

  //Thors Hammer Code

  if (eventType === "thorsHammer") {
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
  }

  //Found Gold Code

  if (eventType === "foundGold") {
    const foundGoldButton = document.querySelector(".foundGold");
    if (foundGoldButton) {
      foundGoldButton.addEventListener("click", function () {
        updatePlayerGold(50);

        window.location.href = "map.html";
      });
    }
  }

  //Gamble Code

  if (eventType === "gambling") {
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
  }

  //drop weapon

  if (eventType === "dropWeapon") {
    // Function to randomly select an index from the deck
    function randomWeaponIndex() {
      return Math.floor(Math.random() * player.deck.length);
    }

    // Get two random weapon indices
    let randomWeapon1 = randomWeaponIndex();
    let randomWeapon2 = randomWeaponIndex();

    // Ensure the two weapons selected are not the same
    while (randomWeapon1 === randomWeapon2) {
      randomWeapon2 = randomWeaponIndex(); // Keep selecting until they are different
    }

    // Select the weapons using the indices
    let weaponChoices = [
      player.deck[randomWeapon1], // Weapon at randomWeapon1 index
      player.deck[randomWeapon2], // Weapon at randomWeapon2 index
    ];

    console.log("Selected Weapons:", weaponChoices); // Debugging output

    // Get the buttons for displaying weapons
    const button1 = document.getElementById("randomWeapon1");
    const button2 = document.getElementById("randomWeapon2");

    if (button1 && button2) {
      if (weaponChoices[0] && weaponChoices[1]) {
        // Remove any existing content from buttons
        button1.innerHTML = "";
        button2.innerHTML = "";

        // Generate detailed weapon info inside the buttons
        generateWeaponInfo(
          weaponChoices[0], // Weapon 1
          randomWeapon1, // Index of weapon 1 in deck
          button1, // Parent button
          null, // Display element (can be null for automatic creation)
          null, // Tooltip element (can be null)
          0 // Weapon price (if any)
        );

        generateWeaponInfo(
          weaponChoices[1], // Weapon 2
          randomWeapon2, // Index of weapon 2 in deck
          button2, // Parent button
          null, // Display element (can be null for automatic creation)
          null, // Tooltip element (can be null)
          0 // Weapon price (if any)
        );
      } else {
        console.error("Weapons are undefined or missing!");
      }
    } else {
      console.error("Weapon buttons not found!");
    }

    // Add event listeners to drop the weapon that was NOT chosen
    button1.addEventListener("click", () => {
      dropWeapon(randomWeapon1); // Drop the first weapon by index
      window.location.href = "map.html";
    });

    button2.addEventListener("click", () => {
      dropWeapon(randomWeapon2); // Drop the second weapon by index
      window.location.href = "map.html";
    });
  }

  //upgrade Weapon

  if (eventType === "upgradeWeapon") {
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
  }

  //gold ambush

  if (eventType === "ambushGold") {
    const ambushGoldLeaveBtn = document.getElementById("ambushGold-leave");

    if (ambushGoldLeaveBtn) {
      ambushGoldLeaveBtn.addEventListener("click", () => {
        // Corrected the Math.floor function
        const goldToLose = Math.floor(globalSettings.playerGold * (2 / 3));

        // Log and update the player's gold
        globalSettings.playerGold -= goldToLose;

        console.log(
          `Lost ${goldToLose} gold! You now have ${globalSettings.playerGold} gold.`
        );

        // Update the gold display
        const goldDisplay = document.getElementById("playerGold");
        if (goldDisplay) {
          goldDisplay.textContent = `Gold: ${globalSettings.playerGold}`;
        }

        player.savePlayerToStorage();
        window.location.href = "map.html";
      });
    } else {
      console.error("Ambush gold button not found!");
    }
  }

  if (eventType === "hurtAnkle") {
    const hurtAnkleBtn = document.getElementById("hurtAnkle-btn");

    if (hurtAnkleBtn) {
      hurtAnkleBtn.addEventListener("click", () => {
        player.takeDamage(10);
        updateHealthBar(player);
        player.savePlayerToStorage();
        window.location.href = "map.html";
      });
    }
  }

  //duplicate Weapon

  if (eventType === "duplicateWeapon") {
    const duplicateWeaponBtn = document.getElementById("duplicateWeapon-btn");
    const duplicateWeaponBox = document.getElementById("duplicateWeapon");
    const duplicateWeaponBox2 = document.getElementById("duplicateWeapon2");
    const weaponDeckScreen = document.getElementById("weapon-deck-screen");

    if (duplicateWeaponBtn) {
      duplicateWeaponBtn.addEventListener("click", function () {
        weaponDeckScreen?.classList.remove("hidden");
        player.showDeck("duplicate"); // Display player's weapons for selection
      });
    }

    // Listen for clicks on weapons in the deck
    weaponDeckScreen?.addEventListener("click", (event) => {
      const weaponElement = event.target.closest(".weapon"); // Get the clicked weapon element

      if (weaponElement) {
        // Get the index of the clicked weapon in the weapon deck
        const weaponIndex = Array.from(
          weaponDeckScreen.querySelectorAll(".weapon")
        ).indexOf(weaponElement);
        console.log("Weapon clicked, index:", weaponIndex); // Debugging the index

        if (weaponIndex === -1) {
          console.error("Weapon index not found!");
          return;
        }

        // Get the weapon from player's deck using the index
        const selectedWeapon = player.deck[weaponIndex];
        console.log("Weapon found:", selectedWeapon); // Debugging the weapon object

        // Debugging the level of the selected weapon
        console.log(`Original weapon level: ${selectedWeapon.level}`);

        // Proceed to duplicate the weapon
        if (selectedWeapon) {
          console.log(`Duplicating weapon: ${selectedWeapon.name}`);

          // Create a new instance of the selected weapon, ensuring proper handling of private fields
          const duplicatedWeapon = new selectedWeapon.constructor(); // This ensures the new weapon is created using the same constructor

          // Copy all properties over to the duplicated weapon (including private fields and level)
          Object.getOwnPropertyNames(selectedWeapon).forEach((key) => {
            // Ensure we're not duplicating the constructor property
            if (key !== "constructor") {
              duplicatedWeapon[key] = selectedWeapon[key];
            }
          });

          // If the level is a private field, use the getter to assign the value
          duplicatedWeapon.level = selectedWeapon.level; // Use the getter for level

          console.log(
            `Duplicated weapon level after handling: ${duplicatedWeapon.level}`
          );

          player.addWeapon(duplicatedWeapon); // Add the duplicated weapon to player's deck
          player.savePlayerToStorage(); // Save the updated deck to local storage

          // Hide the weapon deck screen and show the next event box
          weaponDeckScreen.classList.add("hidden");
          duplicateWeaponBox.classList.add("hidden");
          duplicateWeaponBox2.classList.remove("hidden");
        } else {
          console.error("Selected weapon not found in player's deck");
        }
      }
    });
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

function randomWeaponIndex() {
  return Math.floor(Math.random() * player.deck.length);
}
