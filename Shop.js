let player = new Player("Knight", 100, 100, [], 3, 3);

let sprite;

function updatePlayerGold(goldAmount) {
  globalSettings.playerGold += goldAmount;
  console.log(`Player now has ${globalSettings.playerGold} gold.`);

  const goldDisplay = document.getElementById("playerGold");
  if (goldDisplay) {
    goldDisplay.textContent = `Gold: ${globalSettings.playerGold}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const goldDisplay = document.getElementById("playerGold");
  goldDisplay.textContent = "Gold: " + globalSettings.playerGold;
  player.loadPlayerFromStorage();
  sprite = document.querySelector("#Shopkeeper");
  setSpriteConfig(idleShopkeeper);
  animateSprite();

  document.getElementById("current-deck").addEventListener("click", () => {
    player.showDeck();
  });
  document.getElementById("close-deck-btn").addEventListener("click", () => {
    document.getElementById("weapon-deck-screen").classList.add("hidden");
  });
});

window.addEventListener("DOMContentLoaded", function () {
  const availableWeapons = getAvailableWeapons();
  const weaponButtons = document.querySelectorAll(".Shop-weapon");
  const speechBubble = document.getElementById("speech-bubble");
  const weaponInfo = document.getElementById("weapon-info");

  weaponButtons.forEach((button) => {
    const randomIndex = Math.floor(Math.random() * availableWeapons.length);
    const randomWeapon = availableWeapons[randomIndex];

    generateWeaponInfo(
      player,
      randomWeapon,
      randomIndex,
      button,
      null,
      weaponInfo,
      20
    );

    weaponInfo.classList.remove("tooltip");

    button.addEventListener("mouseover", function () {
      if (speechBubble) {
        speechBubble.innerHTML = "";
        speechBubble.innerHTML += `<strong>${randomWeapon.name}</strong><br>`;
        speechBubble.innerHTML += `<strong>Energy Cost:</strong> ${randomWeapon.energy}<br>`;
        // Add additional information to the tooltip if applicable
        if (randomWeapon.damage > 0) {
          speechBubble.innerHTML += `<strong>Damage:</strong> ${randomWeapon.damage}<br>`;
        }
        if (randomWeapon.criticalDamage > 0) {
          speechBubble.innerHTML += `<strong>Critical Damage:</strong> ${randomWeapon.criticalDamage}<br>`;
        }
        if (randomWeapon.criticalChance > 0) {
          speechBubble.innerHTML += `<strong>Critical Chance:</strong> ${randomWeapon.criticalChance}%<br>`;
        }
        if (randomWeapon.blockAmount > 0) {
          speechBubble.innerHTML += `<strong>Block:</strong> ${randomWeapon.blockAmount}<br>`;
        }
        if (randomWeapon.canHeal) {
          let healingString = "";

          if (Array.isArray(randomWeapon.healingAmount)) {
            healingString = randomWeapon.healingAmount.join("%, ") + "%";
          } else {
            healingString = randomWeapon.healingAmount;
          }

          speechBubble.innerHTML += `<strong>Healing:</strong> ${healingString}<br>`;
        }

        speechBubble.innerHTML += `${randomWeapon.description}<br>`;

        speechBubble.innerHTML += `<strong>Price:</strong> 20 Gold`;
        speechBubble.style.display = "block";
      }
    });

    button.addEventListener("mouseout", function () {
      if (speechBubble) {
        speechBubble.style.display = "none";
      }
    });

    button.firstElementChild.addEventListener("click", function () {
      if (globalSettings.playerGold >= 20) {
        updatePlayerGold(-20);
        purchaseWeapon(randomWeapon);
        button.firstElementChild.remove();
      } else {
        displayTurnMessage("You don't have enough gold.");
      }
    });

    button.setAttribute("data-weapon-id", randomWeapon.name);
  });
});

function purchaseWeapon(weapon) {
  if (globalSettings.playerGold >= 20) {
    player.addWeapon(weapon);
    updatePlayerGold(-20);
  }
}

// 1. When Shop-removal button is clicked, show the deck and enable removal functionality
document.getElementById("Shop-removal").addEventListener("click", () => {
  // Display the player's deck and enter the removal mode
  const weaponDeckScreen = document.getElementById("weapon-deck-screen");
  weaponDeckScreen.classList.remove("hidden");

  player.showDeck("remove"); // Use the same method as upgrading to show the deck

  // Add class for remove mode
  document.body.classList.add("remove-mode");
});

// 2. Listen for clicks on the #weapon-deck-screen to select and remove a weapon
document
  .getElementById("weapon-deck-screen")
  .addEventListener("click", (event) => {
    // Check if the click target is a weapon item
    const weaponElement = event.target.closest(".weapon");

    if (weaponElement) {
      // Get the index of the clicked weapon
      const weaponIndex = Array.from(
        document.querySelectorAll("#weapon-deck-screen .weapon")
      ).indexOf(weaponElement);

      if (weaponIndex === -1) {
        console.error("Weapon index not found!");
        return;
      }

      const weapon = player.deck[weaponIndex]; // Get the selected weapon
      if (weapon) {
        // Check if player has 50 or more gold
        if (globalSettings.playerGold >= 50) {
          console.log(`Removing weapon: ${weapon.name}`);

          // Call dropWeapon to remove the weapon
          dropWeapon(weaponIndex);

          // Subtract 50 gold from the player
          updatePlayerGold(-50);

          // Close the deck screen and disable the Shop-removal button
          document.getElementById("weapon-deck-screen").classList.add("hidden");
          document.getElementById("Shop-removal").disabled = true;

          displayTurnMessage(`You removed the weapon and lost 50 gold.`); // Show a message to the player
        } else {
          // If player doesn't have enough gold, close the deck and show a message
          document.getElementById("weapon-deck-screen").classList.add("hidden");
          displayTurnMessage("You don't have enough gold to remove a weapon."); // Show the message
        }
      } else {
        console.error("Weapon not found in player's deck");
      }
    }
  });

// 3. Drop/Remove the weapon from the player's deck
function dropWeapon(indexToDrop) {
  let currentDeck = player.deck;

  if (
    indexToDrop === undefined ||
    indexToDrop < 0 ||
    indexToDrop >= currentDeck.length
  ) {
    console.error("Invalid weapon index!");
    return;
  }

  // Remove the weapon from the deck
  player.dropWeapon(indexToDrop);
  player.showDeck("remove"); // Re-render the deck after removal

  console.log("Weapon removed.");
}

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

document.addEventListener("DOMContentLoaded", () => {
  const availableRelics = getAvailableRelics(); // Get the initial pool of relics
  const relicButtons = document.querySelectorAll(".Shop-relic"); // Assuming these are the buttons for relics
  const speechBubble = document.getElementById("speech-bubble");
  const relicInfo = document.getElementById("weapon-info");

  let displayedRelics = []; // Track relics that have already been displayed

  relicButtons.forEach((button) => {
    // Ensure there's at least one relic left to display
    if (availableRelics.length === 0) {
      console.log("No relics available to display.");
      return;
    }

    // Randomly select a relic from the available ones, ensuring it hasn't been displayed already
    let randomIndex = Math.floor(Math.random() * availableRelics.length);
    let randomRelic = availableRelics[randomIndex];

    // Check if the relic has already been displayed
    while (displayedRelics.includes(randomRelic.name)) {
      randomIndex = Math.floor(Math.random() * availableRelics.length);
      randomRelic = availableRelics[randomIndex];
    }

    // Add the selected relic to the displayedRelics array
    displayedRelics.push(randomRelic.name);

    // Remove the selected relic from the availableRelics pool
    availableRelics.splice(randomIndex, 1);

    // Generate relic info (tooltips, descriptions, etc.)
    generateRelicInfo(player, randomRelic, randomIndex, button, relicInfo);

    // Remove tooltip class
    relicInfo.classList.remove("tooltip");

    button.addEventListener("mouseover", function () {
      if (speechBubble) {
        speechBubble.innerHTML = `<strong>${randomRelic.name}</strong><br>${randomRelic.relicDescription}<br><strong>Price:</strong> ${randomRelic.relicPrice} Gold`;
        speechBubble.style.display = "block";
      }
    });

    button.addEventListener("mouseout", function () {
      if (speechBubble) {
        speechBubble.style.display = "none";
      }
    });

    button.firstElementChild.addEventListener("click", function () {
      if (globalSettings.playerGold >= randomRelic.relicPrice) {
        updatePlayerGold(-randomRelic.relicPrice);
        purchaseRelic(randomRelic);
        button.firstElementChild.remove();
      } else {
        displayTurnMessage("You don't have enough gold.");
      }
    });

    button.setAttribute("data-relic-id", randomRelic.name);
  });
});

// Function to filter available relics (chest or elite group, not already found)
function getAvailableRelics() {
  // Log relicList to check its state
  console.log("relicList:", relicList);

  // Ensure relicList is an object and not an array
  if (typeof relicList !== "object" || relicList === null) {
    console.error("relicList is not an object.");
    return []; // Return an empty array if relicList is invalid
  }

  // Convert relicList to an array of relic objects
  const relicArray = Object.values(relicList);

  // Ensure player.foundRelics is an array
  if (!Array.isArray(player.foundRelics)) {
    console.error("player.foundRelics is not an array.");
    player.foundRelics = []; // Reset it to an empty array if needed
  }

  return relicArray.filter(
    (relic) =>
      (relic.relicGroup === "chest" || relic.relicGroup === "elite") &&
      !player.foundRelics.includes(relic.name)
  );
}

function purchaseRelic(relic) {
  // Equip the relic
  player.foundRelic(relic.name, true);
  displayEquippedRelics();
  player.savePlayerToStorage();

  // Show a message to the player
  displayTurnMessage(`You purchased the relic: ${relic.name}`);
}

function generateRelicInfo(player, relic, index, button, relicInfo) {
  // Create the tooltip information for the relic (name and description)
  const tooltip = document.createElement("div");
  tooltip.classList.add("relicTooltip");
  tooltip.innerHTML = `<strong>${relic.name}</strong><br>${relic.relicDescription}`;

  // Create an image for the relic and set it as the button's content
  const relicImage = document.createElement("img");
  relicImage.src = relic.icon;
  relicImage.alt = relic.name;

  // Add the image and tooltip to the button
  button.appendChild(relicImage);
  button.appendChild(tooltip);
}

let frame = 0;

const idleShopkeeper = {
  image: "Assets/BLACKSMITHv2.png",
  totalFrames: 7,
  frameWidth: 96, // Width of each frame for idle
  frameHeight: 80,
  backgroundSize: "672px 80px", // Full sprite sheet size for idle
  frameDelay: 175,
};

let currentConfig = idleShopkeeper; // Start with the running animation

function setSpriteConfig(config) {
  sprite.style.backgroundImage = `url(${config.image})`;
  sprite.style.backgroundSize = config.backgroundSize;
}

function animateSprite() {
  // Calculate the x-offset for the current frame
  const xOffset = -(frame * currentConfig.frameWidth);
  sprite.style.backgroundPosition = `${xOffset}px 0`;

  // Loop through frames
  frame = (frame + 1) % currentConfig.totalFrames;

  // Use the delay from the current configuration
  setTimeout(animateSprite, currentConfig.frameDelay);
}

document
  .getElementById("close-post-battle")
  .addEventListener("click", function () {
    window.location.href = "map.html";
  });
