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

let shopWeapons = [];

document.addEventListener("DOMContentLoaded", () => {
  const goldDisplay = document.getElementById("playerGold");
  goldDisplay.textContent = "Gold: " + globalSettings.playerGold;
  player.loadPlayerFromStorage();
  sprite = document.querySelector("#Shopkeeper");

  const DESIGN_WIDTH = 1920;

  function updateShopkeeperScale() {
    const scale = window.innerWidth / DESIGN_WIDTH;
    sprite.style.transform = `scale(${scale})`;
  }

  window.addEventListener("resize", updateShopkeeperScale);
  updateShopkeeperScale();

  setSpriteConfig(idleShopkeeper);
  animateSprite();

  document.getElementById("current-deck").addEventListener("click", () => {
    player.showDeck();
  });
  document.getElementById("close-deck-btn").addEventListener("click", () => {
    document.getElementById("weapon-deck-screen").classList.add("hidden");
  });

  displayShopWeapons();

  const weaponList = getAvailableWeapons();

  displayWeaponSpeechbubble();

  displayShopRelics();

  const shopRemovalButton = document.getElementById("Shop-removal");
  if (localStorage.getItem("weaponRemoved") === "true") {
    shopRemovalButton.disabled = true;
  }
});

function displayWeaponSpeechbubble() {
  const weaponButtons = document.querySelectorAll(".Shop-weapon");
  const speechBubble = document.getElementById("speech-bubble");
  const weaponInfo = document.getElementById("weapon-info");
  let boughtWeaponFlags =
    JSON.parse(localStorage.getItem("boughtShopWeapons")) || [];

  weaponButtons.forEach((button, index) => {
    const weapon = shopWeapons[index];
    console.log(`Weapon at index ${index}:`, weapon);

    if (boughtWeaponFlags[index]) {
      button.innerHTML = "<div class='sold-label'>SOLD</div>";
      return;
    }
    if (!weapon) return;

    let weaponPrice = 20;
    if (weapon.level === 2) {
      weaponPrice = 40;
    } else if (weapon.level === 3) {
      weaponPrice = 60;
    }
    let weaponDisplay = generateWeaponInfo(
      player,
      weapon,
      index,
      button,
      null,
      weaponInfo,
      weaponPrice
    );

    weaponDisplay.firstElementChild?.addEventListener("mouseout", () => {
      if (weaponInfo) {
        weaponInfo.classList.remove("visible");
      }
    });

    button.firstElementChild?.addEventListener("click", () => {
      if (globalSettings.playerGold >= weaponPrice) {
        purchaseWeapon(weapon);
        button.firstElementChild.remove();
        boughtWeaponFlags[index] = true;
        localStorage.setItem(
          "boughtShopWeapons",
          JSON.stringify(boughtWeaponFlags)
        );
      } else {
        displayTurnMessage("You don't have enough gold.");
      }
    });

    button.setAttribute("data-weapon-id", weapon.name);
  });
}

function displayShopWeapons() {
  let shopWeaponData = loadData("shopWeapons");
  console.log(shopWeaponData);

  shopWeapons = [];

  if (shopWeaponData) {
    for (let savedShopWeapon of shopWeaponData) {
      let loadedWeapon = createWeaponInstanceFromInfo(savedShopWeapon);
      shopWeapons.push(loadedWeapon);
    }

    console.log("Loaded shopWeapons from localStorage:", shopWeapons);
  } else {
    shopWeaponData = [];
  }

  let WeaponBtnCount = document.querySelectorAll(".Shop-weapon").length;
  while (WeaponBtnCount > shopWeapons.length) {
    const randomWeapon = getRandomWeapons(shopWeapons, 0.25, 0.15);
    shopWeaponData.push(randomWeapon.getWeaponInfo());
    shopWeapons.push(randomWeapon);
  }

  storeData("shopWeapons", shopWeaponData);
}

function purchaseWeapon(weapon) {
  SoundManager.play("Purchase");
  let weaponPrice = 20;
  if (weapon.level === 2) {
    weaponPrice = 40;
  } else if (weapon.level === 3) {
    weaponPrice = 60;
  }

  if (globalSettings.playerGold >= weaponPrice) {
    player.addWeapon(weapon);
    SoundManager.play("Purchase");
    updatePlayerGold(-weaponPrice);
  }
}

// 1. When Shop-removal button is clicked, show the deck and enable removal functionality
document.getElementById("Shop-removal").addEventListener("click", () => {
  // Display the player's deck and enter the removal mode
  const weaponDeckScreen = document.getElementById("weapon-deck-screen");
  weaponDeckScreen.classList.remove("hidden");

  player.showDeck(); // Use the same method as upgrading to show the deck

  // Add class for remove mode
  document.body.classList.add("remove-mode");

  setTimeout(() => {
    const weaponElements = weaponDeckScreen.querySelectorAll(".weapon");
    weaponElements.forEach((el) => {
      el.style.cursor = "pointer"; // Change cursor to pointer
    });
  }, 0);
});

// 2. Listen for clicks on the #weapon-deck-screen to select and remove a weapon
document
  .getElementById("weapon-deck-screen")
  .addEventListener("click", (event) => {
    if (!document.body.classList.contains("remove-mode")) {
      return;
    }
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
        if (globalSettings.playerGold >= 20) {
          console.log(`Removing weapon: ${weapon.name}`);

          // Call dropWeapon to remove the weapon
          dropWeapon(weaponIndex);

          // Subtract 50 gold from the player
          updatePlayerGold(-20);

          localStorage.setItem("weaponRemoved", "true");

          // Close the deck screen and disable the Shop-removal button
          document.getElementById("weapon-deck-screen").classList.add("hidden");
          document.getElementById("Shop-removal").disabled = true;
          document.body.classList.remove("remove-mode");

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
  player.showDeck(); // Re-render the deck after removal

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

function displayShopRelics() {
  const relicButtons = document.querySelectorAll(".Shop-relic");
  const speechBubble = document.getElementById("speech-bubble");
  const relicInfo = document.getElementById("weapon-info");

  let savedRelicNames = JSON.parse(localStorage.getItem("shopRelics"));
  let availableRelics = getAvailableRelics();
  let boughtRelicFlags =
    JSON.parse(localStorage.getItem("boughtShopRelics")) || [];

  if (!savedRelicNames || savedRelicNames.length !== relicButtons.length) {
    savedRelicNames = [];

    relicButtons.forEach(() => {
      let randomIndex = Math.floor(Math.random() * availableRelics.length);
      let randomRelic = availableRelics.splice(randomIndex, 1)[0];
      savedRelicNames.push(randomRelic.name);
    });

    localStorage.setItem("shopRelics", JSON.stringify(savedRelicNames));
    boughtRelicFlags = Array(savedRelicNames.length).fill(false);
    localStorage.setItem("boughtShopRelics", JSON.stringify(boughtRelicFlags));
  } else if (boughtRelicFlags.length !== savedRelicNames.length) {
    boughtRelicFlags = Array(savedRelicNames.length).fill(false);
    localStorage.setItem("boughtShopRelics", JSON.stringify(boughtRelicFlags));
  }

  const savedRelics = savedRelicNames.map((name) => relicList[name]);

  relicButtons.forEach((button, index) => {
    if (boughtRelicFlags[index]) {
      button.innerHTML = "<div class='sold-label'>SOLD</div>";
      return;
    }
    const relic = savedRelics[index];

    generateRelicInfo(player, relic, index, button, relicInfo);

    button.addEventListener("mouseover", () => {
      if (relicInfo) {
        relicInfo.innerHTML = `<strong>${relic.name}</strong><br>${relic.relicDescription}<br><strong>Price:</strong> ${relic.relicPrice} Gold`;
        relicInfo.classList.add("visible");
      }
    });

    button.addEventListener("mouseout", () => {
      if (relicInfo) {
        relicInfo.classList.remove("visible");
      }
    });

    button.firstElementChild?.addEventListener("click", () => {
      if (globalSettings.playerGold >= relic.relicPrice) {
        updatePlayerGold(-relic.relicPrice);
        purchaseRelic(relic);
        boughtRelicFlags[index] = true;
        localStorage.setItem(
          "boughtShopRelics",
          JSON.stringify(boughtRelicFlags)
        );
        button.firstElementChild.remove();
      } else {
        displayTurnMessage("You don't have enough gold.");
      }
    });

    button.setAttribute("data-relic-id", relic.name);
  });
}

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
  SoundManager.play("Purchase");
  // Equip the relic
  player.foundRelic(relic.name, true);
  relic.equipRelic(player);
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
  frameWidth: 480, // Width of each frame for idle
  frameHeight: 400,
  backgroundSize: "3360px 400px", // Full sprite sheet size for idle
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
    globalSettings.eventResolved = true;
    localStorage.removeItem("shopWeapons");
    localStorage.removeItem("shopRelics");
    localStorage.removeItem("boughtShopWeapons");
    localStorage.removeItem("boughtShopRelics");
    localStorage.setItem("weaponRemoved", "false");
    window.location.href = "map.html";
  });
