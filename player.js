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
  #damagePercentModifier = 0;
  #critChanceModifier = 0;
  #critDamageModifier = 0;
  #critDamagePercentModifier = 0;
  #blockModifier = 0;
  #lifestealModifier = 0;
  #damageReductionModifier = 0;
  #poisonModifier = 0;
  #strength = 0;
  #weak = 0;
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
    return this.#maxEnergy + this.bonusEnergy;
  }

  get bonusEnergy() {
    let bonusEnergy = 0;
    if (this.equippedRelics.includes("Curse of Continuity")) {
      bonusEnergy += relicList["Curse of Continuity"].bonusEnergy ?? 0;
    }
    return bonusEnergy;
  }

  get damageModifier() {
    return this.#damageModifier;
  }

  get damagePercentModifier() {
    return this.#damagePercentModifier;
  }

  get critChanceModifier() {
    return this.#critChanceModifier;
  }

  get critDamageModifier() {
    return this.#critDamageModifier;
  }

  get critDamagePercentModifier() {
    return this.#critDamagePercentModifier;
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

  get strength() {
    return this.#strength;
  }

  get weak() {
    return this.#weak;
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

  set strength(value) {
    this.#strength = value;
  }

  set weak(value) {
    this.#weak = value;
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

  drawExtraCards(amount, ignoreHandFilter = false) {
    const hardcodeHandSize = 11;

    let spaceLeft = hardcodeHandSize - this.#hand.length;
    let cardsToDraw = Math.min(amount, spaceLeft);

    if (cardsToDraw < amount) {
      displayTurnMessage("Max hand size reached");
    }

    for (let i = 0; i < cardsToDraw; i++) {
      if (this.#drawPile.length === 0) {
        this.#resetDrawPile();
      }

      let availableWeapons;
      if (ignoreHandFilter) {
        availableWeapons = [...this.#drawPile];
      } else {
        availableWeapons = this.#drawPile.filter(
          (w) => !this.#hand.includes(w)
        );
      }

      if (availableWeapons.length === 0) {
        break;
      }

      const randomIndex = Math.floor(Math.random() * availableWeapons.length);
      const weaponToDraw = this.#drawPile[randomIndex];

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
    console.log("Applying crit chance modifier:", amount);

    this.#critChanceModifier += amount;
  }

  increaseWeaponCritDamage(amount) {
    this.#critDamageModifier += amount;
  }

  increaseWeaponCritDamagePercent(percent) {
    this.#critDamagePercentModifier += percent;
  }

  increaseWeaponDamage(amount) {
    this.#damageModifier += amount;
  }

  increaseWeaponDamagePercent(percent) {
    this.#damagePercentModifier += percent;
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

  increaseStrength(amount) {
    this.#strength += amount;
  }

  increaseWeak(amount) {
    this.#weak += amount;
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

    if (
      player.equippedRelics.includes("Champion's Might") &&
      weapon.damage > 0
    ) {
      weapon.energy = Math.max(1, weapon.energy - 1);
    }

    if (this.#equippedRelics.includes("Bloodforge")) {
      if (weapon.level < 3) {
        weapon.upgrade();
        this.takeDamage(5);
        updateHealthBar(player);
      }
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
      relicList[relicName].equipRelic(this);
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
    if (isDying) return;

    const reduceAmount = this.equippedRelics.includes("Cloak of Protection")
      ? amount - 1
      : amount;

    const finalDamage = Math.max(0, reduceAmount);

    this.#health -= finalDamage;

    if (this.#health <= 0) {
      isDying = true;
      if (this.#equippedRelics.includes("Death's Bargain")) {
        this.#health = Math.floor((this.#maxHealth / 100) * 10);
        deathsBargain(this);
        isDying = false;
      } else {
        this.#health = 0; // Ensure health doesn't go negative

        this.displayDamage(finalDamage, false, -60);
        SoundManager.play("Hurt");
        await wait(300);
        triggerDeathAnimation();
        SoundManager.fadeOutBattleMusic();

        await wait(2000);
        globalSettings.relicGroup = "chest";
        globalSettings.redirectToChest = false;
        localStorage.removeItem("selectedFightIndex");
        // deleteProgressAndExit(false);
        window.location.href = "deathscreen.html";
        return;
      }
    } else {
      if (!isDying) {
        this.displayDamage(finalDamage, false, -60);
        triggerDamageAnimation();
        SoundManager.play("Hurt");
        await wait(300);
      }
    }
    this.savePlayerToStorage();
  }

  applyPoison(amount) {
    this.#currentPoison += amount;
    this.updatePoisonDisplay();
  }

  applyPoisonDamage() {
    if (this.#currentPoison > 0) {
      let poisonDamage = this.#currentPoison;

      if (player.equippedRelics.includes("Alchemist Shield")) {
        const blockText = document.getElementById("block-text");
        const blockContainer = document.getElementById("block-circle");

        let currentBlock = parseInt(blockText.innerText) || 0;

        if (currentBlock > 0) {
          let blockUsed = Math.min(currentBlock, poisonDamage);

          poisonDamage -= blockUsed;
          currentBlock -= blockUsed;

          blockText.innerText = currentBlock;

          if (currentBlock <= 0) {
            blockContainer.classList.add("hidden");
          }
        }
      }

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

  updateStrengthDisplay() {
    const strengthElement = document.getElementById("strength-status");
    const weakElement = document.getElementById("weak-status");
    if (strengthElement) {
      if (this.#strength > 0) {
        strengthElement.innerHTML = `<img src="Assets/bicepsEmoji.png"/> ${
          this.#strength
        }`;
        strengthElement.classList.remove("hidden");

        strengthElement.addEventListener("mouseenter", () => {
          if (!strengthElement.querySelector(".strength-tooltip")) {
            const strengthTooltip = document.createElement("div");
            strengthTooltip.classList.add("strength-tooltip");

            strengthTooltip.innerText = `You were strengthened, which increases your damage and critical damage by ${
              this.#strength
            }`;
            strengthElement.appendChild(strengthTooltip);
          }
        });
        strengthElement.addEventListener("mouseleave", function () {
          const strengthTooltip =
            strengthElement.querySelector(".strength-tooltip");
          if (strengthTooltip) {
            strengthTooltip.remove();
          }
        });
      } else {
        strengthElement.classList.add("hidden");
      }
    }

    if (weakElement) {
      if (this.#weak > 0) {
        weakElement.innerHTML = `<img src="Assets/dizzyEmoji.png"/> ${
          this.#weak
        }`;
        weakElement.classList.remove("hidden");

        weakElement.addEventListener("mouseenter", () => {
          if (!weakElement.querySelector(".weak-tooltip")) {
            const weakTooltip = document.createElement("div");
            weakTooltip.classList.add("weak-tooltip");

            weakTooltip.innerText = `You were weakened, which decreases your damage and critical damage by ${
              this.#weak
            }. Weak is reduced by one at the end of your turn.`;
            weakElement.appendChild(weakTooltip);
          }
        });
        weakElement.addEventListener("mouseleave", function () {
          const weakTooltip = weakElement.querySelector(".weak-tooltip");
          if (weakTooltip) {
            weakTooltip.remove();
          }
        });
      } else {
        weakElement.classList.add("hidden");
      }
    }
  }

  heal(amount) {
    if (isDying) return;

    if (isNaN(amount) || amount < 0) {
      console.error("Invalid heal amount:", amount);
      return; // Prevent healing if the amount is invalid
    }

    const oldHealth = this.#health;

    this.#health += Math.floor(amount); // Increase health
    if (this.#health > this.#maxHealth) {
      this.#health = this.#maxHealth; // Cap at max health
    }
    if (isNaN(this.#health) || this.#health < 0) {
      console.error("Invalid health value:", this.#health);
      this.#health = 0;
    }

    const actualHealed = this.#health - oldHealth;
    if (actualHealed > 0) {
      this.displayHeal(actualHealed);
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
    if (this.#energy > this.maxEnergy) this.#energy = this.maxEnergy; // Cap at max energy
  }

  addEnergy(amount) {
    this.#energy += amount;
  }

  loseEnergy(amount) {
    this.#energy -= amount;
  }

  showDeck(filterFunction = () => true) {
    const deckScreen = document.getElementById("weapon-deck-screen");
    deckScreen.classList.remove("hidden");

    displayWeapons(
      this,
      this.deck.filter(filterFunction),
      false,
      "weapon-list",
      deckScreen.hasAttribute("isupgrademode")
    );
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
      this.addWeapon(new BasicSpear());
      this.addWeapon(new BasicBow());
      this.addWeapon(new BasicAxe());
      this.addWeapon(new BasicShield());
      this.addWeapon(new BasicShield());
      this.addWeapon(new BasicShield());
      this.addWeapon(new BasicShield());
      // this.addWeapon(new PoisonPotion());
      // this.addWeapon(new VampiricDagger());
      // this.addWeapon(new SmallHealthPotion());
      // this.addWeapon(new RagingDagger());
      // this.addWeapon(new SpikedShield());
      // this.addWeapon(new BerserkersBrew());
      // this.addWeapon(new SwiftSword());
      // this.addWeapon(new Macuahuitl());

      // this.addWeapon(new DevWeapon());
      // this.addWeapon(new DevWeapon());
      // this.addWeapon(new DevWeapon());
      // this.addWeapon(new DevWeapon());
      // this.addWeapon(new DevWeapon());

      // this.addWeapon(new DevBow());

      // this.addWeapon(new DevShield());
    } else {
      this.#name = state.name;
      this.#health = state.health;
      this.#maxHealth = state.maxHealth;
      this.#damageModifier = state.damageModifier;
      this.#damagePercentModifier = state.damagePercentModifier;
      this.#critChanceModifier = state.critChanceModifier;
      this.#critDamageModifier = state.critDamageModifier;
      this.#critDamagePercentModifier = state.critDamagePercentModifier;
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
      damagePercentModifier: this.#damagePercentModifier,
      critChanceModifier: this.#critChanceModifier,
      critDamageModifier: this.#critDamageModifier,
      critDamagePercentModifier: this.#critDamagePercentModifier,
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
let isDying = false;
let isAttacking = false;

// Define the attack animation configuration
const attackConfig = {
  image: "Assets/Knight_1/Attack2.png", // Change to your attack sprite sheet
  totalFrames: 4, // Number of frames in the attack animation
  frameWidth: 200, // Width of each frame for attack
  backgroundSize: "800px 200px", // Full sprite sheet size for attack animation
  frameDelay: 150, // Delay between frames (milliseconds)
};

const blockConfig = {
  image: "Assets/Knight_1/Defendnew4.png",
  totalFrames: 5,
  frameWidth: 200,
  backgroundSize: "1010px 200px",
  frameDelay: 200,
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
  if (typeof playerSprite === "undefined" || isDying) return;

  damageFrame++;

  if (damageFrame >= hurtConfig.totalFrames) {
    clearInterval(damageInterval);
    resetToIdleAnimation();
    return;
  }

  const frameX = damageFrame * hurtConfig.frameWidth;
  playerSprite.style.backgroundPositionX = `-${frameX}px`;
}

function triggerDamageAnimation() {
  if (typeof playerSprite === "undefined" || isDying) return;

  clearInterval(idleInterval);
  clearInterval(attackInterval);
  clearInterval(damageInterval);

  playerSprite.style.backgroundImage = `url(${hurtConfig.image})`;
  playerSprite.style.backgroundSize = hurtConfig.backgroundSize;

  damageFrame = 0;
  playerSprite.style.backgroundPositionX = `0px`;

  damageInterval = setInterval(animateDamage, hurtConfig.frameDelay);
}

let deathFrame = 0;
let deathInterval;

function animateDeath() {
  if (typeof playerSprite === "undefined") return;
  deathFrame = (deathFrame + 1) % deathConfig.totalFrames;
  const frameX = deathFrame * deathConfig.frameWidth;
  playerSprite.style.backgroundPositionX = `-${frameX}px`;

  if (deathFrame === 0) {
    clearInterval(deathInterval);

    playerSprite.style.backgroundPositionX = `-${
      (deathConfig.totalFrames - 1) * deathConfig.frameWidth
    }px`;
  }
}

function triggerDeathAnimation() {
  clearInterval(idleInterval);
  clearInterval(attackInterval);
  clearInterval(damageInterval);

  playerSprite.style.backgroundImage = `url(${deathConfig.image})`;
  playerSprite.style.backgroundSize = deathConfig.backgroundSize;

  deathFrame = 0;
  const frameX = deathFrame * deathConfig.frameWidth;
  playerSprite.style.backgroundPositionX = `-${frameX}px`;

  clearInterval(deathInterval);
  deathInterval = setInterval(animateDeath, deathConfig.frameDelay);
}

// Use this to store the interval IDs for the animations
let attackInterval;
let idleInterval;

// Function to animate the sprite for attack
let attackFrame = 0;
player.isAnimating = false;
player.isActing = false;

function animateAttack() {
  if (typeof playerSprite === "undefined") return;
  attackFrame = (attackFrame + 1) % attackConfig.totalFrames;
  const frameX = attackFrame * attackConfig.frameWidth;
  playerSprite.style.backgroundPositionX = `-${frameX}px`;

  // If the attack animation reaches the last frame, stop it and reset to idle
  if (attackFrame === 0) {
    clearInterval(attackInterval);
    resetToIdleAnimation(); // Switch to idle animation after attack completes

    player.isAnimating = false;
  }
}

// Function to trigger attack animation and reset to idle after attack
function triggerAttackAnimation() {
  if (isDying) return;
  player.isAnimating = true;
  // Stop the idle animation if it's running
  clearInterval(attackInterval);
  clearInterval(idleInterval);

  // Ensure sprite is properly set for the attack animation
  playerSprite.style.backgroundImage = `url(${attackConfig.image})`;
  playerSprite.style.backgroundSize = attackConfig.backgroundSize;

  attackFrame = 0; // Reset to the first frame
  attackInterval = setInterval(animateAttack, attackConfig.frameDelay); // Start the attack animation
}

function triggerBlockAnimation() {
  if (isDying || player.isAnimating) return;
  player.isAnimating = true;

  clearInterval(attackInterval);
  clearInterval(idleInterval);

  playerSprite.style.backgroundImage = `url(${blockConfig.image})`;
  playerSprite.style.backgroundSize = blockConfig.backgroundSize;

  attackFrame = 0;
  attackInterval = setInterval(animateBlock, blockConfig.frameDelay);

  setTimeout(() => {
    clearInterval(attackInterval);
    player.isAnimating = false;
  }, blockConfig.totalFrames * blockConfig.frameDelay);
}

function animateBlock() {
  if (isDying) return;
  if (isAnimating) return;
  if (typeof playerSprite === "undefined") return;
  attackFrame++;
  if (attackFrame >= blockConfig.totalFrames) {
    clearInterval(attackInterval);
    resetToIdleAnimation();
    player.isAnimating = false;
  }
}

function setIdleTimeout() {
  // Optional: Reset the player's animation after the attack
  setTimeout(() => {
    // If using idle animation, you can do this after the attack animation is complete
    // Call the function to reset the player's animation back to idle

    resetToIdleAnimation();
  }, attackConfig.totalFrames * attackConfig.frameDelay); // Reset after the animation duration
}

// Reset to idle animation
function resetToIdleAnimation() {
  if (typeof playerSprite === "undefined") return;
  if (isDying) return;
  // Set the sprite for idle animation
  playerSprite.style.backgroundImage = `url(${idleConfig.image})`;
  playerSprite.style.backgroundSize = idleConfig.backgroundSize;

  let frame = 0;

  // Animate idle animation
  function animateSprite() {
    frame = (frame + 1) % idleConfig.totalFrames;
    const frameX = frame * idleConfig.frameWidth;
    playerSprite.style.backgroundPositionX = `-${frameX}px`;
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
  const healthContainer = document.getElementById(
    "health-bar-container-player"
  );

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
  let healthText = healthContainer.querySelector(".health-text");
  if (!healthText) {
    healthText = document.createElement("span");
    healthText.classList.add("health-text");
    healthContainer.appendChild(healthText);
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
