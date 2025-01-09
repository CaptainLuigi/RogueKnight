let player = new Player("Knight", 100, 100, [], 3, 3);

let sprite;

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  sprite = document.querySelector(".sprite-player");
  // Start the idle animation immediately when the page loads
  resetToIdleAnimation(); // This will start the idle animation
  // Call the function to display the weapons
  displayWeapons();

  Enemy.initialize();

  enemies.push(
    new Enemy("Shroom", 250, 15, "Assets/Transperent/Icon1.png"),
    new Shroom(),
    new Enemy("Troll", 750, 50, "Assets/Transperent/Icon3.png"),
    new Enemy("Troll", 750, 50, "Assets/Transperent/Icon4.png"),
    new Enemy("Troll", 750, 5, "Assets/Transperent/Icon5.png")
  );
  setEnemyIndices();
  // Add the event listener to the "End Turn" button
  document.getElementById("end-turn-btn").addEventListener("click", endTurn);
});

const enemies = [];

let isPlayerTurn = true; // Flag to track if it's the player's turn

function enemyDeathEvent() {
  setEnemyIndices();
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
  const weapon = weapons[weaponIndex];
  console.log("Using weapon:", weapon.name);

  // Check if the player has enough energy to use the weapon
  if (player.energy >= weapon.energy) {
    if (weapon.requiresTargeting) setActiveWeapon(weaponIndex, false);
    else executeAttack(weapon, weapon.minRange);
  } else {
    displayTurnMessage("Not enough energy! pls fix");
  }
}

function weaponHover(weaponNode) {
  console.log(weaponNode);
  let index = weaponNode.getAttribute("index");
  console.log(index);
  index = parseInt(index);
  console.log(index);
  let weapon = weapons[index];
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
    active.removeAttribute("style");
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
  activeWeapon = weapons[weaponIndex];
  activePossibleTargets = activeWeapon.possibleTargets();
}

/**
 *
 * @param {Weapons} weapon used weapon
 * @param {int} enemyIndex
 */
function executeAttack(weapon, enemyIndex) {
  triggerAttackAnimation(); // Trigger the attack animation

  // Call the damage calculation function
  let { startIndex, isCritical, damages } = weapon.calculateDamage(enemyIndex);

  for (let enemyDamage of damages) {
    enemies[startIndex].displayDamage(enemyDamage, isCritical); // Call displayDamage here
    enemies[startIndex].takeDamage(enemyDamage); // Apply damage to the enemy

    startIndex++;
  }

  // Optional: Reset the player's animation after the attack
  setTimeout(() => {
    // If using idle animation, you can do this after the attack animation is complete
    // Call the function to reset the player's animation back to idle
    resetToIdleAnimation();
  }, attackConfig.totalFrames * attackConfig.frameDelay); // Reset after the animation duration

  player.useEnergy(weapon.energy);

  updateEnergyDisplay();
  setActiveWeapon(-1);
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

  setTimeout(() => {
    enemies[0].attack(player); // Call the attack function in the enemy.js file

    updateHealthBar(player); // Make sure you update the health bar after damage

    setTimeout(() => {
      displayTurnMessage("Your Turn Again!");

      refillEnergy();

      updateEnergyDisplay();
    }, 500);

    setTimeout(() => {
      isPlayerTurn = true;
      enableWeapons(); // Enable the weapons after the delay
    }, 1500); // Enable after 2 seconds (can adjust based on animation time)
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
