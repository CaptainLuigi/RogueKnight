let player = new Player("Knight", 100, 100, [], 3, 3);

let sprite;

document.addEventListener("DOMContentLoaded", function () {
  initializeHealthBars(player);
  updateEnergyDisplay();

  console.log("DOM fully loaded, difficulty: " + globalSettings.difficulty);
  sprite = document.querySelector(".sprite-player");
  // Start the idle animation immediately when the page loads
  resetToIdleAnimation(); // This will start the idle animation
  // Call the function to display the weapons

  player.loadPlayerFromStorage();

  displayWeapons(player, player.hand);

  Enemy.initialize();

  fillEnemyArray(globalSettings.difficulty);

  setEnemyIndices();
  // Add the event listener to the "End Turn" button
  document.getElementById("end-turn-btn").addEventListener("click", endTurn);

  updatePlayerGold(0);
  updateHealthBar(player);
  updateEnergyDisplay(player);
});

const enemies = [];

function fillEnemyArray(currentDifficulty) {
  console.log(enemyConstellationTemplates);

  const filteredEnemyArray = enemyConstellationTemplates.filter(
    (constellation) => {
      return (
        constellation.difficultyFrom <= currentDifficulty &&
        constellation.difficultyTo >= currentDifficulty
      );
    }
  );
  const randomIndex = Math.floor(Math.random() * filteredEnemyArray.length);
  const selectedConstellation = filteredEnemyArray[randomIndex];
  for (const enemy of selectedConstellation.enemies) {
    enemies.push(new enemy());
  }
  console.log("filteredEnemyArray", filteredEnemyArray[randomIndex]);
}

let isPlayerTurn = true; // Flag to track if it's the player's turn

function enemyDeathEvent() {
  let event = new CustomEvent("EnemyDeath");
  window.dispatchEvent(event);

  setEnemyIndices();

  if (enemies.every((enemy) => enemy.isDead())) {
    triggerPostBattleScreen();
    disableGameInteractions();
  }
}

function disableGameInteractions() {
  const weaponButtons = document.querySelectorAll(".weapon-button");
  weaponButtons.forEach((button) => {
    button.disabled = true;
  });

  const endTurnButton = document.getElementById("end-turn-btn");
  if (endTurnButton) {
    endTurnButton.disabled = true;
  }
  displayTurnMessage("All enemies defeated! The Battle is over!");
}

function setEnemyIndices() {
  for (let index in enemies) {
    let enemy = enemies[index];
    enemy.display.setAttribute("index", index);
  }
}

// Handle weapon selection
function useWeapon(weaponIndex) {
  if (!isPlayerTurn) {
    // Prevent using weapons if it's not the player's turn
    displayTurnMessage("It's not your turn!");
    return;
  }

  if (enemies.every((enemy) => enemy.isDead())) {
    displayTurnMessage("They are already dead!");
    return;
  }

  const weapon = player.hand[weaponIndex];
  console.log("Using weapon:", weapon.name);

  // Check if the player has enough energy to use the weapon
  if (player.energy >= weapon.energy) {
    if (weapon.requiresTargeting) setActiveWeapon(weaponIndex, false);
    else executeAttack(weapon, weapon.minRange);
  } else {
    displayTurnMessage("Not enough energy!");
  }
}

function weaponHover(weaponNode) {
  console.log(weaponNode);
  let index = weaponNode.getAttribute("index");
  console.log(index);
  index = parseInt(index);
  console.log(index);
  let weapon = player.hand[index];
  console.log(weapon);
  const possibleTargets = weapon.possibleTargets();
  console.log(possibleTargets);
  for (let enemyIndex of possibleTargets)
    enemies[enemyIndex].display.classList.add(tempTargetsCls);
}

function clearSelection() {
  let activeTargets = document.querySelectorAll(
    "." + possibleTargetsCls + ", ." + tempTargetsCls
  );
  for (let active of activeTargets) {
    active.classList.remove(possibleTargetsCls);
    active.classList.remove(tempTargetsCls);
    //active.removeAttribute("style");
  }
}

const possibleTargetsCls = "possibleTargets";
const tempTargetsCls = "tempTargets";

let activeWeapon;
let activePossibleTargets;

function setActiveWeapon(weaponIndex) {
  if (weaponIndex < 0) {
    activeWeapon = null;
    activePossibleTargets = null;
    return;
  }
  activeWeapon = player.hand[weaponIndex];
  activePossibleTargets = activeWeapon.possibleTargets();
}

/**
 *
 * @param {Weapons} weapon used weapon
 * @param {int} enemyIndex
 */
function executeAttack(weapon, enemyIndex) {
  if (enemies.every((enemy) => enemy.isDead())) {
    displayTurnMessage("They are already dead!");
    return;
  }

  // Call the damage calculation function
  let { startIndex, isCritical, damages } = weapon.calculateDamage(
    enemyIndex,
    player.damageModifier,
    player.critChanceModifier,
    player.critDamageModifier
  );
  damages = damages.reverse();
  startIndex += damages.length - 1;

  applyBlock(weapon, player.blockModifier);

  if (
    weapon.blockAmount > 0 ||
    (weapon.healingAmount > 0 && weapon.damage === 0)
  ) {
    triggerBlockAnimation();
  } else {
    triggerAttackAnimation();
  }

  let overallDamageTaken = 0;

  let damageIndex = 0;

  for (let enemyDamage of damages) {
    enemies[startIndex].displayDamage(enemyDamage, isCritical); // Call displayDamage here
    let damageTaken = enemies[startIndex].takeDamage(enemyDamage); // Apply damage to the enemy

    damages[damageIndex] = damageTaken;

    overallDamageTaken += damageTaken;
    startIndex--;

    damageIndex++;
  }
  damages = damages.reverse();

  setIdleTimeout();

  // Apply lifesteal if the Souleater relic is equipped
  let healing = 0;

  healing += (overallDamageTaken * player.lifestealModifier) / 100;

  // Calculate additional healing from the weapon
  healing += weapon.calculateHealing(damages);

  player.heal(healing);

  player.useEnergy(weapon.energy);
  updateHealthBar(player);

  updateEnergyDisplay();
  setActiveWeapon(-1);
  player.removeUsed();
  displayWeapons(player, player.hand);
}

function selectEnemy(enemyNode) {
  let index = enemyNode.getAttribute("index");
  index = parseInt(index);

  if (activeWeapon == null) {
    displayTurnMessage("No weapon selected!");
    return;
  }

  if (!activePossibleTargets.includes(index)) {
    displayTurnMessage("Can't attack selected enemy!");
    return;
  }

  executeAttack(activeWeapon, index);
}

// Function to disable weapons during the enemy's turn
function disableWeapons() {
  const weaponButtons = document.querySelectorAll(".weapon-button");
  weaponButtons.forEach((button) => {
    button.disabled = true; // Disable the weapon buttons
  });
}

// Function to enable weapons after the player’s turn is back
function enableWeapons() {
  const weaponButtons = document.querySelectorAll(".weapon-button");
  weaponButtons.forEach((button) => {
    button.disabled = false; // Enable the weapon buttons
  });
}

// Function to handle the "End Turn" button click
function endTurn() {
  console.log("End turn clicked!");

  disableWeapons();

  isPlayerTurn = false;

  if (player.equippedRelics.includes("Overcharged Core")) {
    player.takeDamage(5);
    updateHealthBar(player);
  }

  setTimeout(() => {
    enemies.forEach((enemy, index) => {
      if (index === 0 || enemy.ranged) {
        setTimeout(() => {
          enemy.attack(player); // Call the attack function in the enemy.js file
          updateHealthBar(player);
        }, index * 700);
      }
    });

    setTimeout(() => {
      player.blockAmount = 0;
      player.currentBlock = 0;

      const blockText = document.getElementById("block-text");
      blockText.innerText = "0";

      const blockContainer = document.getElementById("block-container");
      blockContainer.classList.add("hidden");

      displayTurnMessage("Your Turn Again!");

      refillEnergy();

      updateEnergyDisplay();
    }, enemies.length * 700 + 500);

    setTimeout(() => {
      isPlayerTurn = true;

      player.drawHand();
      displayWeapons(player, player.hand);

      enableWeapons(); // Enable the weapons after the delay
    }, enemies.length * 700 + 500); // Enable after 2 seconds (can adjust based on animation time)
  }, 500); // Add a 1.5-second delay before the enemy attacks (adjust the delay as needed)
}

// Function to refill the player's energy (e.g., set to full energy)
function refillEnergy() {
  player.restoreEnergy(player.maxEnergy); // Set the energy back to the maximum value
}

// Update the player's energy display
function updateEnergyDisplay() {
  const energyText = document.getElementById("energy-text");
  const energyCircle = document.getElementById("energy-circle");

  // Update the energy text
  energyText.textContent = `${player.energy}`;

  // Update the background color based on energy level
  if (player.energy > 2) {
    energyCircle.style.backgroundColor = "#4caf50"; // Green if energy is full
  } else if (player.energy > 1) {
    energyCircle.style.backgroundColor = "#ff9800"; // Orange if energy is medium
  } else {
    energyCircle.style.backgroundColor = "#f44336"; // Red if energy is low
  }
}

// Function to display the "Your Turn Again" message
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

function updatePlayerGold(goldAmount) {
  globalSettings.playerGold += goldAmount;
  console.log(`Player now has ${globalSettings.playerGold} gold.`);

  const goldDisplay = document.getElementById("playerGold");
  if (goldDisplay) {
    goldDisplay.textContent = `Gold: ${globalSettings.playerGold}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("current-deck").addEventListener("click", () => {
    player.showDeck();
  });

  document.getElementById("close-deck-btn").addEventListener("click", () => {
    document.getElementById("weapon-deck-screen").classList.add("hidden");
  });
});

function triggerPostBattleScreen() {
  if (player.equippedRelics.includes("Eternal Bloom")) {
    eternalBloom(player);
  }
  const postBattleScreen = document.getElementById("post-battle-screen");
  postBattleScreen.classList.remove("hidden");

  displayRandomWeapons();

  populateWeaponUpgradeOptions();

  document
    .getElementById("close-post-battle")
    .addEventListener("click", function () {
      if (globalSettings.redirectToChest) {
        globalSettings.redirectToChest = false;
        window.location.href = "chest.html";
      } else {
        window.location.href = "map.html";
      }
    });
}

function displayRandomWeapons() {
  const availableWeapons = getAvailableWeapons();

  const randomWeapons = [];

  const weaponButtons = document.querySelectorAll(".weapon-option");
  weaponButtons.forEach((button) => {
    let randomWeapon;
    let newRandomIndex;

    do {
      newRandomIndex = Math.floor(Math.random() * availableWeapons.length);
      randomWeapon = availableWeapons[newRandomIndex];
    } while (randomWeapons.includes(randomWeapon));

    randomWeapons.push(randomWeapon);

    generateWeaponInfo(
      player,
      randomWeapon,
      newRandomIndex,
      null,
      button,
      null,
      30
    );

    button.addEventListener("click", function () {
      purchaseWeapon(randomWeapon, button);
    });
  });
}

function purchaseWeapon(weapon, button) {
  if (globalSettings.playerGold >= 30) {
    player.addWeapon(weapon);
    updatePlayerGold(-30);
    populateWeaponUpgradeOptions();
    displayTurnMessage(`You purchased ${weapon.name}!`);
    button.remove();
  } else {
    displayTurnMessage("Not enough gold!");
  }
}

function populateWeaponUpgradeOptions() {
  displayWeapons(player, player.deck, false, "upgrade-weapon-options");
}

function upgradeWeapon(weapon) {
  if (weapon.level >= 3) {
    displayTurnMessage(`${weapon.name} is already max level.`);
    return;
  }

  if (globalSettings.playerGold >= 50) {
    updatePlayerGold(-50);

    weapon.upgrade();
    player.savePlayerToStorage();

    displayTurnMessage(`Upgraded ${weapon.name}!`);
  } else {
    displayTurnMessage("Not enough gold to upgrade!");
  }
}

function healPlayer(button) {
  const healingCost = 50;

  if (player.health >= player.maxHealth) {
    button.disabled = true;
    displayTurnMessage("Already full HP!");
  } else if (globalSettings.playerGold >= healingCost) {
    updatePlayerGold(-healingCost);
    player.heal(20);

    updateHealthBar();
    player.savePlayerToStorage();

    displayTurnMessage("You healed!");
    button.disabled = true;
  } else {
    displayTurnMessage("Not enough gold to heal!");
  }
}

function weaponSelectedUpgrade(event) {
  let target = event.target;
  while (target && target.classList && !target.classList.contains("weapon"))
    target = target.parentNode;
  if (!target?.classList?.contains("weapon")) return;

  let index = target.getAttribute("index");
  index = parseInt(index);
  let weapon = player.deck[index];

  upgradeWeapon(weapon);

  console.log(weapon);
}

window.onload = function () {
  document
    .getElementById("choose-weapon-upgrade-btn")
    .addEventListener("click", function () {
      const upgradeOptions = document.getElementById("upgrade-weapon-options");
      if (
        upgradeOptions.style.display === "none" ||
        upgradeOptions.style.display === ""
      ) {
        upgradeOptions.style.display = "flex";
      } else {
        upgradeOptions.style.display = "none";
      }
    });
};
