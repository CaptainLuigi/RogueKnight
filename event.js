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
    });

    button2.addEventListener("click", () => {
      dropWeapon(randomWeapon2); // Drop the second weapon by index
    });

    // Function to drop the selected weapon by index
    function dropWeapon(indexToDrop) {
      console.log(`Dropping weapon at index: ${indexToDrop}`);

      // Log the weapon that is being removed
      console.log("Weapon to drop:", player.deck[indexToDrop]);

      if (
        indexToDrop === undefined ||
        indexToDrop < 0 ||
        indexToDrop >= player.deck.length
      ) {
        console.error("Invalid weapon index!");
        return;
      }

      // Log deck before removing weapon
      console.log("Player deck before removing weapon:", player.deck);

      // Attempt to remove the weapon from the player's deck using its index
      const removedWeapon = player.deck.splice(indexToDrop, 1); // Remove the weapon at the selected index

      // Log the result of the splice operation
      console.log("Removed Weapon:", removedWeapon);

      // Log deck after removing weapon
      console.log("Player deck after removing weapon:", player.deck);

      // Update the player's deck by setting the modified deck back to the player object
      player.deck = player.deck; // Ensuring the updated deck is assigned

      // Save the updated deck to local storage
      player.savePlayerToStorage();

      // Log to confirm that the deck has been saved
      console.log("Player deck saved to storage.");

      // Redirect to map (or any other page)
      window.location.href = "map.html";
    }
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
