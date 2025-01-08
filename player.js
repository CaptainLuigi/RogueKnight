class Player extends HealthEntity {
  get healthBar() {
    return document.getElementById("health-bar-container-player");
  }

  #name;
  #health;
  #maxHealth;
  #deck = [];
  #energy;
  #maxEnergy;

  constructor(name, health, maxHealth, deck, energy, maxEnergy) {
    super();
    this.#name = name;
    this.#health = health;
    this.#maxHealth = maxHealth;
    this.#deck = deck;
    this.#energy = energy;
    this.#maxEnergy = maxEnergy;
  }

  get name() {
    return this.#name;
  }

  get health() {
    return this.#health;
  }

  get maxHealth() {
    return this.#maxHealth;
  }

  get deck() {
    return this.#deck;
  }

  get energy() {
    return this.#energy;
  }

  get maxEnergy() {
    return this.#maxEnergy;
  }

  takeDamage(amount) {
    this.#health -= amount; // Reduce health
    if (this.#health < 0) this.#health = 0; // Ensure health doesn't go negative
    this.displayDamage(amount, false, -60);
  }
  heal(amount) {
    this.#health += amount; // Increase health
    if (this.#health > this.#maxHealth) this.#health = this.#maxHealth; // Cap at max health
  }
  useEnergy(amount) {
    if (this.#energy >= amount) {
      this.#energy -= amount; // Deduct energy
      return true; // Successfully used energy
    } else {
      return false; // Not enough energy
    }
  }
  restoreEnergy(amount) {
    this.#energy += amount; // Restore energy
    if (this.#energy > this.#maxEnergy) this.#energy = this.#maxEnergy; // Cap at max energy
  }
}

// Define the attack animation configuration
const attackConfig = {
  image: "Assets/Knight_1/Attack2.png", // Change to your attack sprite sheet
  totalFrames: 4, // Number of frames in the attack animation
  frameWidth: 200, // Width of each frame for attack
  backgroundSize: "800px 200px", // Full sprite sheet size for attack animation
  frameDelay: 150, // Delay between frames (milliseconds)
};

// Define the idle animation configuration
const idleConfig = {
  image: "Assets/Knight_1/Idlenew.png",
  totalFrames: 4,
  frameWidth: 200, // Width of each frame for idle
  backgroundSize: "800px 200px", // Full sprite sheet size for idle
  frameDelay: 350, // Delay between idle frames
};

// Use this to store the interval IDs for the animations
let attackInterval;
let idleInterval;

// Function to animate the sprite for attack
let attackFrame = 0;

function animateAttack() {
  attackFrame = (attackFrame + 1) % attackConfig.totalFrames;
  const frameX = attackFrame * attackConfig.frameWidth;
  sprite.style.backgroundPosition = `-${frameX}px 0px`;

  // If the attack animation reaches the last frame, stop it and reset to idle
  if (attackFrame === 0) {
    clearInterval(attackInterval);
    resetToIdleAnimation(); // Switch to idle animation after attack completes
  }
}

// Function to trigger attack animation and reset to idle after attack
function triggerAttackAnimation() {
  // Stop the idle animation if it's running
  clearInterval(idleInterval);

  // Ensure sprite is properly set for the attack animation
  sprite.style.backgroundImage = `url(${attackConfig.image})`;
  sprite.style.backgroundSize = attackConfig.backgroundSize;

  attackFrame = 0; // Reset to the first frame
  clearInterval(attackInterval);
  attackInterval = setInterval(animateAttack, attackConfig.frameDelay); // Start the attack animation
}

// Reset to idle animation
function resetToIdleAnimation() {
  // Set the sprite for idle animation
  sprite.style.backgroundImage = `url(${idleConfig.image})`;
  sprite.style.backgroundSize = idleConfig.backgroundSize;

  let frame = 0;

  // Animate idle animation
  function animateSprite() {
    frame = (frame + 1) % idleConfig.totalFrames;
    const frameX = frame * idleConfig.frameWidth;
    sprite.style.backgroundPosition = `-${frameX}px 0px`;
  }

  clearInterval(idleInterval); // Clear any previous idle intervals
  idleInterval = setInterval(animateSprite, idleConfig.frameDelay); // Start idle animation
}

// Handle weapon selection
function useWeapon(weaponIndex) {
  const weapon = weapons[weaponIndex];

  if (player.useEnergy(weapon.energy)) {
    console.log("Using weapon:", weapon.name);

    triggerAttackAnimation(); // Trigger the attack animation

    const { damage, isCritical } = calculateDamage(weapon);

    enemies[0].displayDamage(damage, isCritical); // Call displayDamage here

    enemies[0].takeDamage(damage); // Apply damage to the enemy

    // Reset the player's animation after the attack
    setTimeout(() => {
      resetToIdleAnimation();
    }, attackConfig.totalFrames * attackConfig.frameDelay); // Reset after the animation duration
  } else {
    displayTurnMessage("Not enough energy!");
  }
  updateEnergyDisplay();
}

// Function to initialize the health bars on page load
function initializeHealthBars() {
  updateHealthBar(player); // Update the player's health bar
}

// Update the player's health bar after damage
function updateHealthBar() {
  const healthPercentage = (player.health / player.maxHealth) * 100;
  console.log(
    "Updating player health bar:",
    player.health,
    "/",
    player.maxHealth
  ); // debugging
  const healthBar = document.getElementById("health-bar"); // Ensure this ID is correct

  if (!healthBar) {
    console.error("Health bar not found!");
    return;
  }

  // Set the width of the health bar based on health percentage
  healthBar.style.width = `${healthPercentage}%`;
  healthBar.style.backgroundColor =
    healthPercentage > 50
      ? "#4caf50"
      : healthPercentage > 25
      ? "#ff9800"
      : "#f44336";

  // Set the health text inside the bar
  let healthText = healthBar.querySelector("span");
  if (!healthText) {
    healthText = document.createElement("span");
    healthBar.appendChild(healthText);
  }

  healthText.textContent = `${player.health} / ${player.maxHealth}`; // Show health value
}

// Update the player's energy circle display
function updateEnergyDisplay() {
  const energyCircle = document.getElementById("energy-circle");
  const energyText = document.getElementById("energy-text");

  if (!energyCircle || !energyText) {
    console.error("Energy circle or energy text not found!");
    return;
  }

  // Set the text inside the circle to display the current energy
  energyText.textContent = `${player.energy}`;

  // Set the background color to indicate the energy level
  if (player.energy > 2) {
    energyCircle.style.backgroundColor = "#4caf50"; // Green if energy is full or almost full
  } else if (player.energy > 1) {
    energyCircle.style.backgroundColor = "#ff9800"; // Orange if energy is medium
  } else {
    energyCircle.style.backgroundColor = "#f44336"; // Red if energy is low
  }
}

window.onload = function () {
  initializeHealthBars(player);
  updateEnergyDisplay();
};
