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

  function populateWeaponRemovalOptions() {
    // Display the player's current weapons in the "remove-weapon-options" section
    displayWeapons(player.deck, false, "remove-weapon-options");
  }

  function removeWeapon(weapon) {
    // Display a message if the weapon was successfully removed
    displayTurnMessage(`Removed ${weapon.name} from your deck!`);

    // Remove the weapon from the player's deck
    let index = player.deck.indexOf(weapon);
    if (index > -1) {
      player.deck.splice(index, 1); // Remove the weapon from the deck array
    }

    // Optionally, update the player's gold if needed. For example:
    updatePlayerGold(50); // Adding 50 gold for removing the weapon (adjust this amount based on your game logic)

    // Save the updated player state
    player.savePlayerToStorage();
  }

  function weaponSelectedRemoval(event) {
    let target = event.target;
    while (target && target.classList && !target.classList.contains("weapon"))
      target = target.parentNode;
    if (!target?.classList?.contains("weapon")) return;

    let index = target.getAttribute("index");
    index = parseInt(index);
    let weapon = player.deck[index];

    // Call the removeWeapon function when a weapon is selected
    removeWeapon(weapon);

    console.log(`Removed weapon: ${weapon.name}`);
  }

  window.onload = function () {
    // Toggle the visibility of the weapon removal options
    document
      .getElementById("choose-weapon-remove-btn")
      .addEventListener("click", function () {
        const removeOptions = document.getElementById("remove-weapon-options");
        if (
          removeOptions.style.display === "none" ||
          removeOptions.style.display === ""
        ) {
          removeOptions.style.display = "flex"; // Show removal options
        } else {
          removeOptions.style.display = "none"; // Hide removal options
        }
      });
  };
});

window.addEventListener("DOMContentLoaded", function () {
  const availableWeapons = getAvailableWeapons();
  const weaponButtons = document.querySelectorAll(".Shop-weapon");
  const speechBubble = document.getElementById("speech-bubble");
  const weaponInfo = document.getElementById("weapon-info");

  weaponButtons.forEach((button) => {
    const randomIndex = Math.floor(Math.random() * availableWeapons.length);
    const randomWeapon = availableWeapons[randomIndex];

    generateWeaponInfo(randomWeapon, randomIndex, button, null, weaponInfo, 20);

    weaponInfo.classList.remove("tooltip");

    button.firstElementChild.addEventListener("click", function () {
      purchaseWeapon(randomWeapon);
      button.firstElementChild.remove();
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
