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
  #damageModifier = 0;
  #critChanceModifier = 0;
  #critDamageModifier = 0;
  #blockModifier = 0;
  #lifestealModifier = 0;
  #damageReductionModifier = 0;
  #poisonModifier = 0;
  #critsDisabled = false;
  #currentPoison = 0;
  #canTargetAnyEnemy = false;
  #hand = [];
  #drawPile = [];
  #equippedRelics = [];
  #foundRelics = [];
  maxHandSize = 5;

  constructor(name, health, maxHealth, deck, energy, maxEnergy) {
    super();
    this.#name = name;
    this.#health = health;
    this.#maxHealth = maxHealth;
    this.#deck = deck;
    this.#energy = energy;
    this.#maxEnergy = maxEnergy;
    this.#equippedRelics = this.equippedRelics ?? [];

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

  get damageModifier() {
    return this.#damageModifier;
  }

  get critChanceModifier() {
    return this.#critChanceModifier;
  }

  get critDamageModifier() {
    return this.#critDamageModifier;
  }

  get blockModifier() {
    return this.#blockModifier;
  }

  get lifestealModifier() {
    return this.#lifestealModifier;
  }

  get damageReductionModifier() {
    return this.#damageReductionModifier;
  }

  get poisonModifier() {
    return this.#poisonModifier;
  }

  get critsDisabled() {
    return this.#critsDisabled;
  }

  get currentPoison() {
    return this.#currentPoison;
  }

  get canTargetAnyEnemy() {
    return this.#canTargetAnyEnemy;
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

  get foundRelics() {
    return [...this.#foundRelics];
  }

  set critsDisabled(value) {
    this.#critsDisabled = value;
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

  drawExtraCards(amount) {
    for (let i = 0; i < amount; i++) {
      if (this.#drawPile.length === 0) {
        this.#resetDrawPile();
      }

      const availableWeapons = this.#drawPile.filter(
        (w) => !this.#hand.includes(w)
      );

      if (availableWeapons.length === 0) {
        break;
      }

      const randomIndex = Math.floor(Math.random() * availableWeapons.length);
      const weaponToDraw = availableWeapons[randomIndex];

      const drawPileIndex = this.#drawPile.indexOf(weaponToDraw);
      if (drawPileIndex !== -1) {
        this.#drawPile.splice(drawPileIndex, 1);
        this.#hand.push(weaponToDraw);
      }
    }
  }

  #resetDrawPile() {
    // Start fresh from the full deck
    this.#drawPile = this.#deck.filter((weapon) => {
      // Don't include what's in hand
      const isInHand = this.#hand.includes(weapon);

      // Don't include once-per-battle weapons that have already been used
      const usedOnce = weapon.oncePerBattle && weapon.wasUsed;

      return !isInHand && !usedOnce;
    });

    // Reset wasUsed only for reusable weapons
    this.#drawPile.forEach((weapon) => {
      if (!weapon.oncePerBattle) {
        weapon.wasUsed = false;
      }
    });

    // Shuffle draw pile
    for (let i = this.#drawPile.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.#drawPile[i], this.#drawPile[j]] = [
        this.#drawPile[j],
        this.#drawPile[i],
      ];
    }
  }

  increaseMaxHealth(amount, addToCurrentHealth) {
    this.#maxHealth += amount;
    if (addToCurrentHealth) this.heal(amount);
  }

  decreaseMaxHealth(amount) {
    this.#maxHealth -= amount;
    if (this.#maxHealth < this.#health) {
      this.#health = this.#maxHealth;
    }
  }

  increaseMaxEnergy(amount) {
    this.#maxEnergy += amount;
  }

  setMaxHealth(amount) {
    this.#maxHealth = amount;
    this.#health = this.#maxHealth;
  }

  increaseWeaponCritChance(amount) {
    this.#critChanceModifier += amount;
  }

  increaseWeaponCritDamage(amount) {
    this.#critDamageModifier += amount;
  }

  increaseWeaponDamage(amount) {
    this.#damageModifier += amount;
  }

  increaseWeaponLifesteal(amount) {
    this.#lifestealModifier += amount;
  }

  increaseWeaponBlock(amount) {
    this.#blockModifier += amount;
  }

  increaseDamageReduction(amount) {
    this.#damageReductionModifier -= amount;
    if (this.#damageReductionModifier < 0) this.#damageReductionModifier = 0;
  }

  increasePoisonApplied(amount) {
    this.#poisonModifier += amount;
  }

  setWeaponEnergy(amount) {
    this.#deck.forEach((weapon) => {
      weapon.energy = amount;
    });
  }

  setTargetAnyEnemy(enabled) {
    this.#canTargetAnyEnemy = enabled;
  }

  canTargetAnyEnemy(weapon = null) {
    if (!this.#canTargetAnyEnemy) return false;
    if (weapon && weapon.damage > 0) return true;
    return false;
  }

  addWeapon(weapon) {
    this.#deck.push(weapon);
    if (this.#equippedRelics.includes("Omnipotence")) {
      weapon.energy = 0;
    }
    if (this.#equippedRelics.includes("Bloodforge")) {
      weapon.upgrade();
      this.takeDamage(5);
      updateHealthBar(player);
    }
    this.savePlayerToStorage();
  }

  dropWeapon(index) {
    index = parseInt(index);
    if (isNaN(index) || index < 0 || index >= this.deck.length) {
      return;
    }

    this.#deck.splice(index, 1);
    this.savePlayerToStorage();
  }

  foundRelic(relicName, wasEquipped) {
    this.#foundRelics.push(relicName);
    if (wasEquipped === true) {
      this.#equippedRelics.push(relicName);
    }
  }

  removeRelic(name) {
    const index = this.#equippedRelics.indexOf(name);
    if (index !== -1) {
      this.#equippedRelics.splice(index, 1);
    }
  }

  async takeDamage(amount) {
    if (this.isDying) return;

    const reduceAmount = this.equippedRelics.includes("Cloak of Protection")
      ? amount - 1
      : amount;

    const finalDamage = Math.max(0, reduceAmount);

    this.#health -= finalDamage;

    if (this.#health <= 0) {
      if (this.#equippedRelics.includes("Death's Bargain")) {
        this.#health = Math.floor((this.#maxHealth / 100) * 10);
        deathsBargain(this);
      } else {
        this.#health = 0; // Ensure health doesn't go negative
        this.isDying = true;
        this.displayDamage(finalDamage, false, -60);
        SoundManager.play("Hurt");
        await wait(300);
        triggerDeathAnimation();
        SoundManager.fadeOutBattleMusic();

        await wait(2000);
        globalSettings.relicGroup = "chest";
        globalSettings.redirectToChest = false;
        localStorage.removeItem("selectedFightIndex");
        window.location.href = "deathscreen.html";
      }
    } else {
      this.displayDamage(finalDamage, false, -60);
      triggerDamageAnimation();
      SoundManager.play("Hurt");
      await wait(300);
    }
    this.savePlayerToStorage();
  }

  applyPoison(amount) {
    this.#currentPoison += amount;
    this.updatePoisonDisplay();
  }

  applyPoisonDamage() {
    if (this.#currentPoison > 0) {
      const poisonDamage = this.#currentPoison;
      this.takeDamage(poisonDamage);
      this.#currentPoison = Math.max(this.#currentPoison - 1, 0);
      this.updatePoisonDisplay();
    }
  }

  updatePoisonDisplay() {
    const poisonElement = document.getElementById("poison-status");
    if (poisonElement) {
      if (this.#currentPoison > 0) {
        poisonElement.innerHTML = `<img src="Assets/skullEmoji.png"/> ${
          this.#currentPoison
        }`;
        poisonElement.classList.remove("hidden");

        poisonElement.addEventListener("mouseenter", () => {
          if (!poisonElement.querySelector(".poison-tooltip")) {
            const poisonTooltip = document.createElement("div");
            poisonTooltip.classList.add("poison-tooltip");

            poisonTooltip.innerText = `Poison deals ${
              this.#currentPoison
            } unblockable damage at the end of your turn and is then reduced by one`;
            poisonElement.appendChild(poisonTooltip);
          }
        });
        poisonElement.addEventListener("mouseleave", function () {
          const poisonTooltip = poisonElement.querySelector(".poison-tooltip");
          if (poisonTooltip) {
            poisonTooltip.remove();
          }
        });
      } else {
        poisonElement.classList.add("hidden");
      }
    }
  }

  heal(amount) {
    if (isNaN(amount) || amount < 0) {
      console.error("Invalid heal amount:", amount);
      return; // Prevent healing if the amount is invalid
    }

    this.#health += Math.floor(amount); // Increase health
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

  addEnergy(amount) {
    this.#energy += amount;
  }

  showDeck() {
    const deckScreen = document.getElementById("weapon-deck-screen");
    deckScreen.classList.remove("hidden");

    displayWeapons(this, this.deck, false, "weapon-list");
  }

  clearDeck() {
    this.#deck = [];
    this.savePlayerToStorage();
  }

  loadPlayerFromStorage() {
    let state = loadData("playerState");
    if (state == null) {
      globalSettings.playerGold = 150;
      this.addWeapon(new BasicSword());
      this.addWeapon(new BasicSword());
      this.addWeapon(new BasicSword());
      this.addWeapon(new BasicSpear());
      this.addWeapon(new BasicBow());
      this.addWeapon(new BasicAxe());
      this.addWeapon(new BasicShield());
      this.addWeapon(new BasicShield());
      this.addWeapon(new BasicShield());
      this.addWeapon(new BasicShield());
      this.addWeapon(new BasicShield());
      this.addWeapon(new devWeapon());

      // this.addWeapon(new devShield());
    } else {
      this.#name = state.name;
      this.#health = state.health;
      this.#maxHealth = state.maxHealth;
      this.#damageModifier = state.damageModifier;
      this.#critChanceModifier = state.critChanceModifier;
      this.#critDamageModifier = state.critDamageModifier;
      this.#blockModifier = state.blockModifier;
      this.#lifestealModifier = state.lifestealModifier;
      this.#damageReductionModifier = state.damageReductionModifier;
      this.#poisonModifier = state.poisonModifier;
      this.#critsDisabled = state.critsDisabled;
      this.#canTargetAnyEnemy = state.canTargetAnyEnemy;
      let deck = [];
      for (let weapon of state.deck) {
        let instance = createWeaponInstanceFromInfo(weapon);
        deck.push(instance);
      }
      this.#deck = deck;
      this.#maxEnergy = state.maxEnergy;
      this.#foundRelics = state.foundRelics ?? [];
      this.#equippedRelics = state.equippedRelics;
      this.maxHandSize = state.maxHandSize;
    }
    this.restoreEnergy(this.#maxEnergy);
    this.drawHand();

    for (let relicName of this.#equippedRelics) {
      relicList[relicName].equipRelic(this);
    }
  }
  savePlayerToStorage() {
    let state = {
      name: this.#name,
      health: this.#health,
      maxHealth: this.#maxHealth,
      maxEnergy: this.#maxEnergy,
      maxHandSize: this.maxHandSize,
      foundRelics: this.#foundRelics,
      equippedRelics: this.#equippedRelics,
      damageModifier: this.#damageModifier,
      critChanceModifier: this.#critChanceModifier,
      critDamageModifier: this.#critDamageModifier,
      blockModifier: this.#blockModifier,
      lifestealModifier: this.#lifestealModifier,
      damageReductionModifier: this.#damageReductionModifier,
      poisonModifier: this.#poisonModifier,
      critsDisabled: this.#critsDisabled,
      canTargetAnyEnemy: this.#canTargetAnyEnemy,
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

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let isAttacking = false;

// const attackConfig = {
//   image: "Assets/Knight_1/Attack2.png",
//   totalFrames: 4,
//   frameWidth: 200,
//   backgroundSize: "800px 200px",
//   frameDelay: 150,
// };

// const blockConfig = {
//   image: "Assets/Knight_1/Defendnew4.png",
//   totalFrames: 5,
//   frameWidth: 200,
//   backgroundSize: "1000px 200px",
//   frameDelay: 200,
// };

// const idleConfig = {
//   image: "Assets/Knight_1/Idlenew.png",
//   totalFrames: 4,
//   frameWidth: 200,
//   backgroundSize: "800px 200px",
//   frameDelay: 350,
// };

// const hurtConfig = {
//   image: "Assets/Knight_1/Hurtnew.png",
//   totalFrames: 2,
//   frameWidth: 200,
//   backgroundSize: "400px 200px",
//   frameDelay: 150,
// };

// const deathConfig = {
//   image: "Assets/Knight_1/Deadnew.png",
//   totalFrames: 6,
//   frameWidth: 200,
//   backgroundSize: "1200px 200px",
//   frameDelay: 300,
// };

let damageFrame = 0;
let damageInterval;

function animateDamage(config) {
  damageFrame = (damageFrame + 1) % config.frames;
  const frameX = damageFrame * config.width;
  sprite.style.backgroundPosition = `-${frameX}px 0px`;

  if (damageFrame === 0) {
    clearInterval(damageInterval);
    resetToIdleAnimation();
  }
}

function triggerDamageAnimation() {
  clearInterval(idleInterval);
  clearInterval(attackInterval);

  const config = getResponsivePlayerConfig("hurt");
  sprite.style.backgroundImage = `url(${config.image})`;
  sprite.style.backgroundSize = `${config.frames * config.width}px ${
    config.height
  }px`;

  damageFrame = 0;
  const frameX = damageFrame * config.width;
  sprite.style.backgroundPosition = `-${frameX}px 0px`;

  clearInterval(damageInterval);
  damageInterval = setInterval(() => animateDamage(config), config.delay);
}

let deathFrame = 0;
let deathInterval;

function animateDeath(config) {
  deathFrame = deathFrame + 1;

  if (deathFrame >= config.frames) {
    clearInterval(deathInterval);
    const lastFrameX = (config.frames - 1) * config.width;
    sprite.style.backgroundPosition = `-${lastFrameX}px 0px`;
  } else {
    const frameX = deathFrame * config.width;
    sprite.style.backgroundPosition = `-${frameX}px 0px`;
  }
}

function triggerDeathAnimation() {
  clearInterval(idleInterval);
  clearInterval(attackInterval);
  clearInterval(damageInterval);

  const config = getResponsivePlayerConfig("death");
  sprite.style.backgroundImage = `url(${config.image})`;
  sprite.style.backgroundSize = `${config.frames * config.width}px ${
    config.height
  }px`;

  deathFrame = 0;
  const frameX = deathFrame * config.width;
  sprite.style.backgroundPosition = `-${frameX}px 0px`;

  clearInterval(deathInterval);
  deathInterval = setInterval(() => animateDeath(config), config.delay);
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

  const config = getResponsivePlayerConfig("attack");
  // Ensure sprite is properly set for the attack animation
  sprite.style.backgroundImage = `url(${config.image})`;
  sprite.style.backgroundSize = `${config.frames * config.width}px ${
    config.height
  }px`;

  attackFrame = 0; // Reset to the first frame
  attackInterval = setInterval(() => {
    attackFrame = (attackFrame + 1) % config.frames;
    const frameX = attackFrame * config.width;
    sprite.style.backgroundPosition = `-${frameX}px 0px`;

    if (attackFrame === 0) {
      clearInterval(attackInterval);
      resetToIdleAnimation();
      isAttacking = false;
    }
  }, config.delay);
}

let blockInterval;

function triggerBlockAnimation() {
  if (isAttacking) return;
  isAttacking = true;

  // Clear other animations
  clearInterval(attackInterval);
  clearInterval(idleInterval);
  clearInterval(blockInterval); // Stop any ongoing block animation

  const config = getResponsivePlayerConfig("block");
  sprite.style.backgroundImage = `url(${config.image})`;
  sprite.style.backgroundSize = config.backgroundSize;

  let frame = 0; // Local frame counter

  blockInterval = setInterval(() => {
    const frameX = frame * config.width;
    sprite.style.backgroundPosition = `-${frameX}px 0px`;

    frame++;

    if (frame === config.frames) {
      clearInterval(blockInterval);
      isAttacking = false;
      resetToIdleAnimation();
    }
  }, config.delay);
}

// function animateBlock(config) {
//   const frameX = attackFrame * config.width;
//   sprite.style.backgroundPosition = `-${frameX}px 0px`;

//   attackFrame++;
//   if (attackFrame >= config.frames) {
//     clearInterval(attackInterval);
//     isAttacking = false;
//     resetToIdleAnimation();
//   }
// }

function setIdleTimeout() {
  const config = getResponsivePlayerConfig("attack");

  setTimeout(() => {
    resetToIdleAnimation();
  }, config.frames * config.delay);
}

// Reset to idle animation
function resetToIdleAnimation() {
  const config = getResponsivePlayerConfig("idle");

  clearInterval(idleInterval);
  // Set the sprite for idle animation
  sprite.style.backgroundImage = `url(${config.image})`;
  sprite.style.backgroundSize = `${config.frames * config.width}px ${
    config.height
  }px`;

  let frame = 0;

  // Animate idle animation
  function animateSprite() {
    frame = (frame + 1) % config.frames;
    const frameX = frame * config.width;
    sprite.style.backgroundPosition = `-${frameX}px 0px`;
  }

  clearInterval(idleInterval); // Clear any previous idle intervals
  idleInterval = setInterval(animateSprite, config.delay); // Start idle animation
}

function getResponsivePlayerConfig(type) {
  const screenWidth = window.innerWidth;

  const sizes = {
    large: {
      idle: {
        image: "Assets/Knight_1/Idlenew.png",
        frames: 4,
        width: 200,
        height: 200,
        delay: 350,
      },
      attack: {
        image: "Assets/Knight_1/Attack2.png",
        frames: 4,
        width: 200,
        height: 200,
        delay: 150,
      },
      block: {
        image: "Assets/Knight_1/Defendnew4.png",
        frames: 5,
        width: 200,
        height: 200,
        delay: 200,
        backgroundSize: "1000px 200px",
      },
      hurt: {
        image: "Assets/Knight_1/Hurtnew.png",
        frames: 2,
        width: 200,
        height: 200,
        delay: 150,
      },
      death: {
        image: "Assets/Knight_1/Deadnew.png",
        frames: 6,
        width: 200,
        height: 200,
        delay: 300,
      },
    },
    medium: {
      idle: {
        image: "Assets/Knight_1/Idlenew.png",
        frames: 4,
        width: 150,
        height: 150,
        delay: 350,
      },
      attack: {
        image: "Assets/Knight_1/Attack2.png",
        frames: 4,
        width: 150,
        height: 150,
        delay: 150,
      },
      block: {
        image: "Assets/Knight_1/Defendnew4.png",
        frames: 5,
        width: 150,
        height: 150,
        delay: 200,
        backgroundSize: "1000px 200px",
      },
      hurt: {
        image: "Assets/Knight_1/Hurtnew.png",
        frames: 2,
        width: 150,
        height: 150,
        delay: 150,
      },
      death: {
        image: "Assets/Knight_1/Deadnew.png",
        frames: 6,
        width: 150,
        height: 150,
        delay: 300,
      },
    },
    small: {
      idle: {
        image: "Assets/Knight_1/Idlenew.png",
        frames: 4,
        width: 100,
        height: 100,
        delay: 350,
      },
      attack: {
        image: "Assets/Knight_1/Attack2.png",
        frames: 4,
        width: 100,
        height: 100,
        delay: 150,
      },
      block: {
        image: "Assets/Knight_1/Defendnew4.png",
        frames: 5,
        width: 100,
        height: 100,
        delay: 200,
        backgroundSize: "1000px 200px",
      },
      hurt: {
        image: "Assets/Knight_1/Hurtnew.png",
        frames: 2,
        width: 100,
        height: 100,
        delay: 150,
      },
      death: {
        image: "Assets/Knight_1/Deadnew.png",
        frames: 6,
        width: 100,
        height: 100,
        delay: 300,
      },
    },
  };

  if (screenWidth >= 1280) return sizes.large[type];
  else if (screenWidth >= 1024) return sizes.medium[type];
  else return sizes.small[type];
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
