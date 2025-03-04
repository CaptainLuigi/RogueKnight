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
});

window.addEventListener("DOMContentLoaded", function () {
  const availableWeapons = getAvailableWeapons();
  const weaponButtons = document.querySelectorAll(".Shop-weapon");
  const speechBubble = document.getElementById("speech-buabble");
  const weaponInfo = document.getElementById("weapon-info");

  weaponButtons.forEach((button) => {
    const randomIndex = Math.floor(Math.random() * availableWeapons.length);
    const randomWeapon = availableWeapons[randomIndex];

    generateWeaponInfo(randomWeapon, randomIndex, button, null, weaponInfo, 20);

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
