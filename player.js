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
  #hand = [];
  #drawPile = [];
  #equippedRelics = [];
  maxHandSize = 5;

  constructor(
    name,
    health,
    maxHealth,
    deck,
    energy,
    maxEnergy,
    equippedRelics
  ) {
    super();
    this.#name = name;
    this.#health = health;
    this.#maxHealth = maxHealth;
    this.#deck = deck;
    this.#energy = energy;
    this.#maxEnergy = maxEnergy;
    this.relics = [];

    this.drawHand();
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

  get energy() {
    return this.#energy;
  }

  get maxEnergy() {
    return this.#maxEnergy;
  }

  get deck() {
    return [...this.#deck];
  }

  get hand() {
    return [...this.#hand];
  }

  get equippedRelics() {
    return [...this.#equippedRelics];
  }

  removeUsed() {
    this.#hand = this.#hand.filter((e) => !e.wasUsed);
  }

  drawHand() {
    this.removeUsed();
    let toBeDrawn = this.maxHandSize - this.#hand.length;
    if (this.#drawPile.length == 0) {
      this.#resetDrawPile();
    }
    if (this.#deck.length <= this.maxHandSize) {
      this.#hand.push(...this.#drawPile);
      this.#drawPile = [];
      return;
    }
    for (let i = 0; i < toBeDrawn; i++) {
      let weapon = this.#drawPile.shift();
      this.#hand.push(weapon);
      if (this.#drawPile.length == 0) {
        this.#resetDrawPile();
      }
    }
  }

  #resetDrawPile() {
    this.#drawPile = [...this.#deck];
    this.#drawPile = this.#drawPile.filter((e) => !this.#hand.includes(e));
    this.#drawPile.forEach((e) => (e.wasUsed = false));
    for (let i = this.#drawPile.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
      [this.#drawPile[i], this.#drawPile[j]] = [
        this.#drawPile[j],
        this.#drawPile[i],
      ]; // Swap elements
    }
  }

  increaseMaxHealth(amount, addToCurrentHealth) {
    this.#maxHealth += amount;
    if (addToCurrentHealth) this.heal(amount);
  }

  addWeapon(weapon) {
    this.#deck.push(weapon);
    this.savePlayerToStorage();
  }

  addRelic(relic) {
    this.relics.push(relic);
    relic.apply(this);
  }

  takeDamage(amount) {
    this.#health -= amount; // Reduce health
    if (this.#health <= 0) {
      this.#health = 0; // Ensure health doesn't go negative
      this.displayDamage(amount, false, -60);
      triggerDeathAnimation();
    } else {
      this.displayDamage(amount, false, -60);
      triggerDamageAnimation();
    }
    this.savePlayerToStorage();
  }

  heal(amount) {
    if (isNaN(amount) || amount < 0) {
      console.error("Invalid heal amount:", amount);
      return; // Prevent healing if the amount is invalid
    }

    this.#health += amount; // Increase health
    if (this.#health > this.#maxHealth) {
      this.#health = this.#maxHealth; // Cap at max health
    }
    if (isNaN(this.#health) || this.#health < 0) {
      console.error("Invalid health value:", this.#health);
      this.#health = 0;
    }
    this.savePlayerToStorage();
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

  showDeck() {
    const deckScreen = document.getElementById("weapon-deck-screen");
    deckScreen.classList.remove("hidden");

    displayWeapons(this.deck, false, "weapon-list");
  }

  clearDeck() {
    this.#deck = [];
    this.savePlayerToStorage();
  }

  loadPlayerFromStorage() {
    let state = loadData("playerState");
    if (state == null) {
      this.addWeapon(new BasicSword());
      this.addWeapon(new BasicAxe());
      this.addWeapon(new BasicSpear());
      this.addWeapon(new BasicSword());
      this.addWeapon(new BasicAxe());
      this.addWeapon(new BasicSpear());
      this.addWeapon(new BasicSword());
      this.addWeapon(new BasicShield());
    } else {
      this.#name = state.name;
      this.#health = state.health;
      this.#maxHealth = state.maxHealth;
      let deck = [];
      for (let weapon of state.deck) {
        let instance = createWeaponInstanceFromInfo(weapon);
        deck.push(instance);
      }
      this.#deck = deck;
      this.#maxEnergy = state.maxEnergy;
    }
    this.restoreEnergy(this.#maxEnergy);
    this.drawHand();

    //relics["Dummy Relic"].equipRelic(this);
  }
  savePlayerToStorage() {
    let state = {
      name: this.#name,
      health: this.#health,
      maxHealth: this.#maxHealth,
      maxEnergy: this.#maxEnergy,
    };
    let deck = [];
    for (let weapon of this.#deck) {
      let info = weapon.getWeaponInfo();
      deck.push(info);
    }
    state.deck = deck;
    storeData("playerState", state);
  }
}

let isAttacking = false;

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

const hurtConfig = {
  image: "Assets/Knight_1/Hurtnew.png",
  totalFrames: 2,
  frameWidth: 200,
  backgroundSize: "400px 200px",
  frameDelay: 150,
};

const deathConfig = {
  image: "Assets/Knight_1/Deadnew.png",
  totalFrames: 6,
  frameWidth: 200,
  backgroundSize: "1200px 200px",
  frameDelay: 300,
};

let damageFrame = 0;
let damageInterval;

function animateDamage() {
  damageFrame = (damageFrame + 1) % hurtConfig.totalFrames;
  const frameX = damageFrame * hurtConfig.frameWidth;
  sprite.style.backgroundPosition = `-${frameX}px 0px`;

  if (damageFrame === 0) {
    clearInterval(damageInterval);
    resetToIdleAnimation();
  }
}

function triggerDamageAnimation() {
  clearInterval(idleInterval);
  clearInterval(attackInterval);

  sprite.style.backgroundImage = `url(${hurtConfig.image})`;
  sprite.style.backgroundSize = hurtConfig.backgroundSize;

  damageFrame = 0;
  const frameX = damageFrame * hurtConfig.frameWidth;
  sprite.style.backgroundPosition = `-${frameX}px 0px`;

  clearInterval(damageInterval);
  damageInterval = setInterval(animateDamage, hurtConfig.frameDelay);
}

let deathFrame = 0;
let deathInterval;

function animateDeath() {
  deathFrame = (deathFrame + 1) % deathConfig.totalFrames;
  const frameX = deathFrame * deathConfig.frameWidth;
  sprite.style.backgroundPosition = `-${frameX}px 0px`;

  if (deathFrame === 0) {
    clearInterval(deathInterval);

    sprite.style.backgroundPosition = `-${
      (deathConfig.totalFrames - 1) * deathConfig.frameWidth
    }px 0px`;
  }
}

function triggerDeathAnimation() {
  clearInterval(idleInterval);
  clearInterval(attackInterval);
  clearInterval(damageInterval);

  sprite.style.backgroundImage = `url(${deathConfig.image})`;
  sprite.style.backgroundSize = deathConfig.backgroundSize;

  deathFrame = 0;
  const frameX = deathFrame * deathConfig.frameWidth;
  sprite.style.backgroundPosition = `-${frameX}px 0px`;

  clearInterval(deathInterval);
  deathInterval = setInterval(animateDeath, deathConfig.frameDelay);
}

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

    isAttacking = false;
  }
}

// Function to trigger attack animation and reset to idle after attack
function triggerAttackAnimation() {
  if (isAttacking) return;
  isAttacking = true;
  // Stop the idle animation if it's running
  clearInterval(attackInterval);
  clearInterval(idleInterval);

  // Ensure sprite is properly set for the attack animation
  sprite.style.backgroundImage = `url(${attackConfig.image})`;
  sprite.style.backgroundSize = attackConfig.backgroundSize;

  attackFrame = 0; // Reset to the first frame
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
