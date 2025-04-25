class Enemy extends HealthEntity {
  static #templateNode;
  static #enemyDisplay;
  static initialize() {
    //Zuweisung enemyDisplay entspricht dem Element, das alle angezeigten Gegner beeinhaltet (Node)
    this.#enemyDisplay = document.getElementById("enemies");
    //Zuweisung der Vorlage der Gegner
    this.#templateNode = this.#enemyDisplay.firstElementChild;
    //Entfernt die Vorlage der Gegner (damit keine leere Vorlage mit dabei ist)
    this.#templateNode.remove();
  }
  #health;
  #name;
  #maxHealth;
  #attackPower;
  #baseAttackPower;
  #icon;
  #ranged;
  #lifesteal;
  #blockAmount = 0;
  #activeShield = 0;
  #poison = 0;
  #poisonFromPlayer = 0;
  #healAll = 0;
  #buffAll = 0;
  #shieldAll = 0;
  #canSummon = false;
  #display;
  #nextAction = "";
  #possibleActions = [];

  get icon() {
    return this.#icon;
  }

  get name() {
    return this.#name;
  }

  get maxHealth() {
    return this.#maxHealth;
  }

  get attackPower() {
    return this.#attackPower;
  }

  get health() {
    return this.#health;
  }

  get healthBar() {
    return this.#display.querySelector(".health-bar-container-enemy");
  }

  get display() {
    return this.#display;
  }

  get ranged() {
    return this.#ranged;
  }

  get blockAmount() {
    return this.#blockAmount;
  }

  get currentBlock() {
    return this.#activeShield;
  }

  get activeShield() {
    return this.#activeShield;
  }

  get posion() {
    return this.#poison;
  }

  get poisonFromPlayer() {
    return this.#poisonFromPlayer;
  }

  get healAll() {
    return this.#healAll;
  }

  get buffAll() {
    return this.#buffAll;
  }

  get shieldAll() {
    return this.#shieldAll;
  }
  get canSummon() {
    return this.#canSummon;
  }

  get nextAction() {
    return this.#nextAction;
  }

  get canAttack() {
    return this.#attackPower > 0;
  }

  get canBlock() {
    return this.#blockAmount > 0;
  }

  get canPoison() {
    return this.#poison > 0;
  }

  get canHealAll() {
    return this.#healAll > 0;
  }

  get canBuffAll() {
    return this.#buffAll > 0;
  }

  get canShieldAll() {
    return this.#shieldAll > 0;
  }

  constructor(
    name,
    maxHealth,
    attackPower,
    icon,
    ranged,
    lifesteal = 0,
    blockAmount = 0,
    poison = 0,
    healAll = 0,
    buffAll = 0,
    shieldAll = 0,
    canSummon = false
  ) {
    super();
    this.#health = maxHealth;
    this.#name = name;
    this.#attackPower = attackPower;
    this.#baseAttackPower = attackPower;
    this.#maxHealth = maxHealth;
    this.#icon = icon;
    this.#display = Enemy.#templateNode.cloneNode(true);
    let image = this.#display.querySelector(".enemy-icon");
    image.src = icon;
    image.alt = name;
    this.#ranged = ranged;
    this.#lifesteal = lifesteal;
    this.#blockAmount = blockAmount;
    this.#poison = poison;
    this.#healAll = healAll;
    this.#buffAll = buffAll;
    this.#shieldAll = shieldAll;
    this.#canSummon = canSummon;
    this.updateDisplay();
    Enemy.#enemyDisplay.appendChild(this.#display);
    enemies.push(this);

    if (this.canAttack) {
      this.#possibleActions.push("attack");
    }
    if (this.canBlock) {
      this.#possibleActions.push("block");
    }
    if (this.canPoison) {
      this.#possibleActions.push("poison");
    }
    if (this.canHealAll) {
      this.#possibleActions.push("healAll");
    }
    if (this.canBuffAll) {
      this.#possibleActions.push("buffAll");
    }
    if (this.canShieldAll) {
      this.#possibleActions.push("shieldAll");
    }
    if (this.canSummon()) {
      this.#possibleActions.push("canSummon");
    }
  }

  canSummon() {
    return this.#canSummon;
  }

  randomizeAction() {
    let actionIndex = Math.floor(Math.random() * this.#possibleActions.length);
    this.#nextAction = this.#possibleActions[actionIndex];
    this.updateDisplay();
  }

  displayIntent() {
    const enemyElement = this.#display;
    const intentElement = enemyElement.querySelector(".enemy-intent");

    if (!intentElement) {
      console.error("Enemy intent display element not found");
      return;
    }

    intentElement.style.display = "block";
    intentElement.style.visibility = "visible";

    console.log("Intent element:", intentElement);

    if (this.#nextAction === "attack") {
      intentElement.innerHTML = `<img src="Assets/swordsEmoji.png"/> ${
        this.#attackPower
      }`;
    } else if (this.#nextAction === "block") {
      intentElement.innerHTML = `<img src="Assets/shieldEmoji.png"/> ${
        this.#blockAmount
      }`;
    } else if (this.#nextAction === "poison") {
      intentElement.innerHTML = `<img src="Assets/skullEmoji.png"/> ${
        this.#poison
      }`;
    } else if (this.#nextAction === "healAll") {
      intentElement.innerHTML = `<img src="Assets/greenHeartEmoji.png"/> ${
        this.#healAll
      }`;
    } else if (this.#nextAction === "buffAll") {
      intentElement.innerHTML = `<img src="Assets/bicepsEmoji.png"/> ${
        this.#buffAll
      }`;
    } else if (this.#nextAction === "shieldAll") {
      intentElement.innerHTML = `<img src="Assets/shieldEmoji.png"/><img src="Assets/sparklesEmoji.png"/> ${
        this.#shieldAll
      }`;
    } else if (this.#nextAction === "canSummon") {
      intentElement.innerHTML = `<img src="Assets/gravestoneEmoji.png"/>`;
    }

    console.log(
      `Enemy ${this.name} intent: ${this.nextAction} - ${intentElement.textContent}`
    );

    intentElement.addEventListener("mouseenter", () => {
      const intentTooltip = document.createElement("div");
      intentTooltip.classList.add("enemy-intent-tooltip");

      let tooltipText = `Enemy intends to `;
      if (this.#nextAction === "attack") {
        tooltipText += `attack for ${this.#attackPower} damage`;
      } else if (this.#nextAction === "block") {
        tooltipText += `block for ${this.#blockAmount}`;
      } else if (this.#nextAction === "poison") {
        tooltipText += `poison you for ${this.#poison}`;
      } else if (this.#nextAction === "healAll") {
        tooltipText += `heal all for ${this.#healAll} HP`;
      } else if (this.#nextAction === "buffAll") {
        tooltipText += `buff all by ${this.#buffAll}`;
      } else if (this.#nextAction === "shieldAll") {
        tooltipText += `block all for ${this.#shieldAll}`;
      } else if (this.#nextAction === "canSummon") {
        tooltipText += `summon an enemy`;
      }

      intentTooltip.innerText = tooltipText;
      intentElement.appendChild(intentTooltip);

      const intentElementTop = intentElement.offsetTop;
      const intentElementHeight = intentElement.offsetHeight;

      // Set the tooltip's position just below the intent element
      intentTooltip.style.top = `${
        intentElementTop + intentElementHeight + 5
      }px`;
      intentTooltip.style.left = `${intentElement.offsetLeft + 20}px`;
    });

    intentElement.addEventListener("mouseleave", function () {
      const intentTooltip = intentElement.querySelector(
        ".enemy-intent-tooltip"
      );
      if (intentTooltip) {
        intentTooltip.remove();
      }
    });
  }

  async performAction(player) {
    if (!this.#nextAction) return;

    this.#display.classList.add("grow-shrink");
    console.log(`${this.name} is performing action: ${this.#nextAction}`);

    this.displayIntent();

    switch (this.#nextAction) {
      case "attack":
        this.attack(player);
        break;
      case "block":
        this.block(this.#blockAmount);
        break;
      case "poison":
        this.applyPoison(player, this.#poison);
        break;
      case "healAll":
        await this.healAll(this.#healAll);
        break;
      case "buffAll":
        await this.buffAll(this.#buffAll);
        break;
      case "shieldAll":
        await this.shieldAll(this.#shieldAll);
        break;
      case "canSummon":
        this.summon();
        break;
      default:
        console.log("No action performed");
        break;
    }

    this.#nextAction = "";

    await wait(500);
    this.#display.classList.remove("grow-shrink");
  }

  isDead() {
    return this.health <= 0;
  }

  takeDamage(amount, ignoreBlock = false) {
    if (ignoreBlock) {
      let actualDamage = Math.min(this.#health, amount);
      this.#health -= actualDamage;
      if (this.#health < 0) this.#health = 0;
      if (this.#health === 0) {
        this.enemyDeath();
      } else {
        this.updateDisplay();
      }
      return actualDamage;
    } else {
      let blocked = Math.min(this.#activeShield, amount);
      this.#activeShield -= blocked;
      if (this.#activeShield < 0) this.#activeShield = 0;

      let actualDamage = amount - blocked;
      actualDamage = Math.min(this.#health, actualDamage);

      this.#health -= actualDamage;
      if (this.#health < 0) this.#health = 0; // Ensure health doesn't go negative
      if (this.#health === 0) this.enemyDeath();
      else {
        this.updateDisplay();
      }
      return actualDamage;
    }
  }

  addPoisonFromPlayer(amount) {
    this.#poisonFromPlayer += amount;
  }

  applyPoisonDamageFromPlayer() {
    if (this.#poisonFromPlayer > 0) {
      console.log(
        `${this.#name} takes ${this.#poisonFromPlayer} poison damage`
      );

      this.takeDamage(this.#poisonFromPlayer, true);

      this.#poisonFromPlayer--;
      this.updatePoisonDisplay();
      this.updateDisplay();

      return true;
    }
    return false;
  }

  attack(player) {
    player.attackingEnemy = this;
    console.log("Player is being attacked by:", player.attackingEnemy);

    let actualDamage = this.#attackPower; // Start with base attack power

    if (player.blockAmount > 0) {
      if (player.blockAmount >= this.#attackPower) {
        player.blockAmount -= this.#attackPower;
        triggerBlockAnimation();
        setIdleTimeout();
        actualDamage = 0; // Fully blocked
      } else {
        actualDamage = this.#attackPower - player.blockAmount;
        player.blockAmount = 0;
        triggerBlockAnimation();
        setIdleTimeout();
      }
    }

    if (actualDamage > 0 && player.equippedRelics.includes("Death's Pact")) {
      actualDamage = Math.ceil(actualDamage / 2);
    }

    if (actualDamage > 0) {
      player.takeDamage(actualDamage);
    }

    const blockText = document.getElementById("block-text");
    const blockContainer = document.getElementById("block-container");

    blockText.innerText = player.blockAmount;
    if (player.blockAmount === 0) {
      blockContainer.classList.add("hidden");
    }

    // ✅ Apply Lifesteal Only on Unblocked Damage
    if (this.#lifesteal > 0 && actualDamage > 0) {
      let lifestealHeal = Math.min(this.#lifesteal, actualDamage);
      this.heal(lifestealHeal);
    }

    if (player.attackingEnemy) {
      const enemy = player.attackingEnemy;
      const isBrambleEquipped = loadData("relic_Bramble Mantle");
      if (isBrambleEquipped) {
        enemy.takeDamage(5);
      }

      if (
        player.equippedRelics.includes("Titan's Reflection") &&
        player.blockAmount > 0
      ) {
        const reflectionDamage = player.blockAmount;
        enemy.takeDamage(reflectionDamage);
      }
    }
  }

  heal(amount) {
    this.#health += amount; // Increase health
    if (this.#health > this.#maxHealth) this.#health = this.#maxHealth; // Cap at max health
    this.updateDisplay();

    if (amount > 0) {
      this.displayLifesteal(amount);
    }
  }

  block(amount) {
    this.#activeShield += amount;
    this.updateDisplay();
  }

  removeBlock(amount) {
    this.#activeShield -= amount;
    this.#activeShield = Math.max(this.#activeShield, 0);
    this.updateDisplay();
  }

  applyPoison(player, amount) {
    player.applyPoison(amount);
  }

  updatePoisonDisplay() {
    const poisonElement = this.#display.querySelector("#poison-status-enemy");

    if (this.#poisonFromPlayer > 0) {
      poisonElement.classList.remove("hidden");
      poisonElement.innerHTML = `<img src="Assets/skullEmoji.png"/> ${
        this.#poisonFromPlayer
      }`;

      this.addPoisonTooltip(poisonElement);
    } else {
      poisonElement.classList.add("hidden");
    }
  }

  async healAll(amount) {
    for (let enemy of enemies) {
      if (!enemy.isDead()) {
        enemy.heal(amount);

        await wait(300);
      }
    }
  }

  async shieldAll(amount) {
    for (let enemy of enemies) {
      if (!enemy.isDead()) {
        enemy.block(amount);

        await wait(300);
      }
    }
  }

  async buffAll(amount) {
    for (let enemy of enemies) {
      if (!enemy.isDead()) {
        enemy.#attackPower += amount;
        enemy.updateDisplay();

        await wait(300);
      }
    }
  }

  summon() {}

  updateDisplay() {
    const intentElement = this.#display.querySelector(".enemy-intent");
    const healthPercentage = (this.health / this.maxHealth) * 100;

    console.log("Updating enemy health bar:", this.health, "/", this.maxHealth); // debugging

    const healthBarContainerEnemy = this.healthBar;
    const healthBarEnemy = this.#display.querySelector(".health-bar-enemy");

    if (!healthBarContainerEnemy) {
      console.error("Enemy health bar not found!");
      return;
    }

    let displayedBlock = this.#display.querySelector(".enemy-block");
    displayedBlock.textContent = this.#activeShield;
    if (this.#activeShield > 0) {
      displayedBlock.classList.remove("hidden");
      this.addBlockTooltip(displayedBlock);
    } else {
      displayedBlock.classList.add("hidden");
    }

    let displayedBuff = this.#display.querySelector(".enemy-buff");
    const buffAmount = this.#attackPower - this.#baseAttackPower;
    if (buffAmount > 0) {
      displayedBuff.innerHTML = `<img src="Assets/bicepsEmoji.png"/> ${buffAmount}`;
      displayedBuff.classList.remove("hidden");
      this.addBuffTooltip(displayedBuff);
    } else {
      displayedBuff.classList.add("hidden");
    }

    // Set the width of the health bar based on health percentage
    healthBarEnemy.style.width = `${healthPercentage}%`;
    healthBarEnemy.style.backgroundColor =
      healthPercentage > 50
        ? "#4caf50"
        : healthPercentage > 25
        ? "#ff9800"
        : "#f44336";

    // Set the health text inside the bar
    let healthText = healthBarContainerEnemy.querySelector("span");
    if (!healthText) {
      healthText = document.createElement("span");
      healthBarContainerEnemy.appendChild(healthText);
    }

    healthText.textContent = `${this.health} / ${this.maxHealth}`; // Show health value

    if (intentElement) {
      intentElement.style.display = "block"; // Ensure it's visible
      intentElement.style.visibility = "visible"; // Ensure it's visible

      if (this.#nextAction === "attack") {
        intentElement.innerHTML = `<img src="Assets/swordsEmoji.png"/> ${
          this.#attackPower
        }`;
      } else if (this.#nextAction === "block") {
        intentElement.innerHTML = `<img src="Assets/shieldEmoji.png"/> ${
          this.#blockAmount
        }`;
      } else if (this.#nextAction === "poison") {
        intentElement.innerHTML = `<img src="Assets/skullEmoji.png"/> ${
          this.#poison
        }`;
      } else if (this.#nextAction === "healAll") {
        intentElement.innerHTML = `<img src="Assets/greenHeartEmoji.png"/> ${
          this.#healAll
        }`;
      } else if (this.#nextAction === "buffAll") {
        intentElement.innerHTML = `<img src="Assets/bicepsEmoji.png"/> ${
          this.#buffAll
        }`;
      } else if (this.#nextAction === "shieldAll") {
        intentElement.innerHTML = `<img src="Assets/shieldEmoji.png"/><img src="Assets/sparklesEmoji.png"/> ${
          this.#shieldAll
        }`;
      } else if (this.#nextAction === "canSummon") {
        intentElement.innerHTML = `<img src="Assets/gravestoneEmoji.png"/>`;
      }

      console.log(
        `Enemy ${this.name} intent: ${this.#nextAction} - ${
          intentElement.textContent
        }`
      );
    } else {
      console.error("Intent element not found!");
    }
  }

  addBlockTooltip(blockElement) {
    blockElement.addEventListener("mouseenter", () => {
      if (!blockElement.querySelector(".block-tooltip")) {
        const blockTooltip = document.createElement("div");
        blockTooltip.classList.add("block-tooltip");
        blockTooltip.innerText = `Enemy blocks, which reduces incoming damage by ${
          this.#activeShield
        } for this turn`;
        blockElement.appendChild(blockTooltip);
      }
    });
    blockElement.addEventListener("mouseleave", () => {
      const blockTooltip = blockElement.querySelector(".block-tooltip");
      if (blockTooltip) {
        blockTooltip.remove();
      }
    });
  }

  addBuffTooltip(buffElement) {
    const buffAmount = this.#attackPower - this.#baseAttackPower;

    buffElement.addEventListener("mouseenter", () => {
      if (!buffElement.querySelector(".buff-tooltip")) {
        const buffTooltip = document.createElement("div");
        buffTooltip.classList.add("buff-tooltip");
        buffTooltip.innerText = `Enemy was buffed, which increased the attack power by ${buffAmount}`;
        buffElement.appendChild(buffTooltip);
      }
    });
    buffElement.addEventListener("mouseleave", () => {
      const buffTooltip = buffElement.querySelector(".buff-tooltip");
      if (buffTooltip) {
        buffTooltip.remove();
      }
    });
  }

  addPoisonTooltip(poisonElement) {
    poisonElement.addEventListener("mouseenter", () => {
      if (!poisonElement.querySelector(".enemy-poison-tooltip")) {
        const poisonTooltip = document.createElement("div");
        poisonTooltip.classList.add("enemy-poison-tooltip");
        poisonTooltip.innerText = `Enemy takes ${
          this.#poisonFromPlayer
        } unblockable damage after its turn, then poison is reduced by one.`;
        poisonElement.appendChild(poisonTooltip);
      }
    });
    poisonElement.addEventListener("mouseleave", () => {
      const poisonTooltip = poisonElement.querySelector(
        ".enemy-poison-tooltip"
      );
      if (poisonTooltip) {
        poisonTooltip.remove();
      }
    });
  }

  enemyDeath() {
    this.#poisonFromPlayer = 0;
    this.#activeShield = 0;
    this.#attackPower = this.#baseAttackPower;

    this.updatePoisonDisplay();
    this.updateDisplay();

    let deathSprite = this.#display.querySelector(".enemy-icon");

    deathSprite.src = "Assets/smoke.png";
    deathSprite.alt = "Dead " + this.name;

    const intent = this.#display.querySelector(".enemy-intent");
    if (intent) intent.remove();

    this.display.classList.add("death-smoke");
    this.display.classList.add("death-smoke-shrink");

    let index = enemies.findIndex((e) => e == this);
    if (index > -1) {
      enemies.splice(index, 1);
    }

    const goldDropped = Math.floor(Math.random() * 6) + 10;
    console.log(`${this.name} dropped ${goldDropped} gold!`);

    enemyDeathEvent();

    const goldDisplay = document.createElement("div");
    goldDisplay.textContent = `+${goldDropped} Gold`;
    goldDisplay.style.position = "absolute";
    goldDisplay.style.color = "gold";
    goldDisplay.style.fontSize = "20px";
    goldDisplay.style.fontWeight = "bold";
    goldDisplay.style.zIndex = "1000";
    goldDisplay.style.transition = "opacity 1s ease-out";

    const enemyRect = this.#display.getBoundingClientRect();
    goldDisplay.style.left = `${enemyRect.left + enemyRect.width / 2 - 20}px`;
    goldDisplay.style.top = `${enemyRect.top - 30}px`;

    document.body.appendChild(goldDisplay);

    updatePlayerGold(goldDropped);

    setTimeout(() => {
      goldDisplay.style.opacity = "0";
    }, 750);

    setTimeout(() => {
      goldDisplay.remove();
    }, 1200);

    setTimeout(() => {
      this.#display.remove();
    }, 2500);
  }
}

const enemies = [];

class Shroom extends Enemy {
  constructor() {
    super("Shroom", 200, 3, "Assets/Transperent/Icon1.png", true, 0, 15);
  }
}

class Snail extends Enemy {
  constructor() {
    super("Snail", 150, 6, "Assets/Transperent/Icon5.png", true, 0, 15);
  }
}

class SadShroom extends Enemy {
  constructor() {
    super("Sad Shroom", 200, 5, "Assets/Transperent/Icon6.png", true, 0, 10, 3);
  }
}

class BiteShroom extends Enemy {
  constructor() {
    super("Bite Shroom", 250, 10, "Assets/Transperent/Icon7.png", true);
  }
}

class Scorpion extends Enemy {
  constructor() {
    super(
      "Scorpion Shroom",
      150,
      0,
      "Assets/Transperent/Icon9.png",
      true,
      0,
      15,
      2
    );
  }
}

class BitingPlant extends Enemy {
  constructor() {
    super(
      "Biting Plant",
      400,
      8,
      "Assets/Transperent/Icon11.png",
      true,
      5,
      15,
      2
    );
  }
}

class SlimeHive extends Enemy {
  constructor() {
    super("Slime Hive", 500, 3, "Assets/Transperent/Icon23.png", false, 0, 25);
    this.display.classList.add("biggerEnemy");
  }
}

class Mantis extends Enemy {
  constructor() {
    super("Mantis", 150, 8, "Assets/Transperent/Icon39.png", true, 0, 10);
  }
}

class Hornet extends Enemy {
  constructor() {
    super("Hornet", 100, 15, "Assets/Transperent/Icon42.png", true, 0, 10, 2);
  }
}

class EvilKnight extends Enemy {
  constructor() {
    super(
      "Evil Knight",
      1000,
      35,
      "Assets/evilKnight2.png",
      true,
      0,
      75,
      0,
      0,
      0,
      0,
      true
    );
    this.display.classList.add("biggestEnemy");
  }
  summon() {
    //constructor adds enemy at end of enemies
    const summonedMinion = new MinonKnight();
    //because new enemy should not be at the end, it must be removed from there again
    enemies.pop();

    let index = enemies.findIndex((e) => e == this);
    enemies.splice(index, 0, summonedMinion); // Add it to the enemies array so it's part of the game logic

    this.display.parentNode.insertBefore(summonedMinion.display, this.display);
    summonedMinion.randomizeAction();
    summonedMinion.displayIntent();
  }
}

class HermitShroom extends Enemy {
  constructor() {
    super("Hermit Shroom", 500, 3, "Assets/Transperent/Icon10.png", true);
  }
}

class Succubus extends Enemy {
  constructor() {
    super("Succubus", 750, 15, "Assets/succubus.png", false, 15, 35);
    this.display.classList.add("biggerEnemy");
  }
}

class Gnome extends Enemy {
  constructor() {
    super("Gnome", 250, 5, "Assets/Transperent/Icon44.png", true, 0, 15);
  }
}

class MinonKnight extends Enemy {
  constructor() {
    super("Minon Knight", 250, 5, "Assets/minionKnight.png", true, 0, 20);
  }
}

class TreeSlime extends Enemy {
  constructor() {
    super("Tree Slime", 150, 5, "Assets/Transperent/Icon24.png", true, 0, 10);
  }
}

class Amalgam extends Enemy {
  constructor() {
    super("Amalgam", 350, 15, "Assets/Transperent/Icon25.png", false, 0, 30);
    this.display.classList.add("biggerEnemy");
  }
}

class Cleric extends Enemy {
  constructor() {
    super("Cleric", 200, 3, "Assets/enemyCleric.png", true, 0, 15, 0, 15);
    this.display.classList.add("bigEnemy");
  }
}

class Druid extends Enemy {
  constructor() {
    super("Druid", 150, 2, "Assets/enemyDruid.png", true, 0, 10, 0, 0, 2);
    this.display.classList.add("bigEnemy");
  }
}

class CrystalMage extends Enemy {
  constructor() {
    super(
      "Crystal Mage",
      200,
      3,
      "Assets/crystalMage2.png",
      true,
      0,
      20,
      0,
      0,
      0,
      10
    );
    this.display.classList.add("bigEnemy");
  }
}

class MasterMage extends Enemy {
  constructor() {
    super(
      "Master Mage",
      300,
      5,
      "Assets/masterMage.png",
      true,
      0,
      20,
      0,
      20,
      3,
      20
    );
    this.display.classList.add("bigEnemy");
  }
}

class Skeleton extends Enemy {
  constructor() {
    super("Skeleton", 50, 3, "Assets/skeleton.png", true, 0, 10);
    // this.randomizeAction();
  }
}

class Necromancer extends Enemy {
  constructor() {
    super(
      "Necromancer",
      250,
      5,
      "Assets/necromancer.png",
      true,
      0,
      15,
      0,
      0,
      0,
      0,
      true
    );
    this.display.classList.add("bigEnemy");
  }

  summon() {
    //constructor adds enemy at end of enemies
    const summonedSkeleton = new Skeleton();
    //because new enemy should not be at the end, it must be removed from there again
    enemies.pop();

    let index = enemies.findIndex((e) => e == this);
    enemies.splice(index, 0, summonedSkeleton); // Add it to the enemies array so it's part of the game logic

    this.display.parentNode.insertBefore(
      summonedSkeleton.display,
      this.display
    );
    summonedSkeleton.randomizeAction();
    summonedSkeleton.displayIntent();
  }
}
