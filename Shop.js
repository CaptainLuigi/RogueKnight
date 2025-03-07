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

// document.getElementById("Shop-removal").addEventListener("click", () => {
//   player.showDeck();
// });

// document.getElementById("close-deck-btn").addEventListener("click", () => {
//   document.getElementById("weapon-deck-screen").classList.add("hidden");
// });

// function dropWeapon(indexToDrop) {
//   console.log(`Dropping weapon at index: ${indexToDrop}`);

//   let currentDeck = player.deck;

//   if (
//     indexToDrop === undefined ||
//     indexToDrop < 0 ||
//     indexToDrop >= currentDeck.length
//   ) {
//     console.error("Invalid weapon index");
//     return;
//   }

//   console.log("Player deck before removing weapon:", currentDeck);

//   let updatedDeck = currentDeck.filter((_, index) => index !== indexToDrop);

//   console.log("Updated Player Deck:", updatedDeck);

//   player.savePlayerToStorage = function () {
//     let state = {
//       deck: updatedDeck.map((weapon) => weapon.getWeaponInfo()),
//     };
//     storeData("playerState", state);
//   };

//   player.deck = updatedDeck;
// }

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
