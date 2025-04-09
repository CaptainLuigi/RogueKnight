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
  #icon;
  #ranged;
  #lifesteal;
  #blockAmount = 0;
  #activeShield = 0;
  #poison = 0;
  #poisonFromPlayer = 0;
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

  constructor(
    name,
    maxHealth,
    attackPower,
    icon,
    ranged,
    lifesteal = 0,
    blockAmount = 0,
    poison = 0
  ) {
    super();
    this.#health = maxHealth;
    this.#name = name;
    this.#attackPower = attackPower;
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
    this.updateDisplay();
    Enemy.#enemyDisplay.appendChild(this.#display);

    if (this.canAttack) {
      this.#possibleActions.push("attack");
    }
    if (this.canBlock) {
      this.#possibleActions.push("block");
    }
    if (this.canPoison) {
      this.#possibleActions.push("poison");
    }
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
      intentElement.textContent = `⚔️${this.#attackPower}`;
    } else if (this.#nextAction === "block") {
      intentElement.textContent = `🛡️${this.#blockAmount}`;
    } else if (this.#nextAction === "poison") {
      intentElement.textContent = `☠️${this.#poison}`;
    }

    console.log(
      `Enemy ${this.name} intent: ${this.nextAction} - ${intentElement.textContent}`
    );
  }

  performAction(player) {
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
      default:
        console.log("No action performed");
    }

    this.#nextAction = "";

    setTimeout(() => {
      this.#display.classList.remove("grow-shrink");
    }, 500);
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
    }
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
      poisonElement.innerHTML = `☠️ ${this.#poisonFromPlayer}`;
    } else {
      poisonElement.classList.add("hidden");
    }
  }

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
    } else {
      displayedBlock.classList.add("hidden");
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
        intentElement.textContent = `⚔️ ${this.#attackPower}`;
      } else if (this.#nextAction === "block") {
        intentElement.textContent = `🛡️ ${this.#blockAmount}`;
      } else if (this.#nextAction === "poison") {
        intentElement.textContent = `☠️ ${this.#poison}`;
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

  enemyDeath() {
    this.#poisonFromPlayer = 0;
    this.#activeShield = 0;

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
    super("Sad Shroom", 200, 5, "Assets/Transperent/Icon6.png", true, 0, 5);
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
    super("Biting Plant", 400, 10, "Assets/Transperent/Icon11.png", true);
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
    super("Evil Knight", 1000, 35, "Assets/evilknight.png", true, 0, 75);
    this.display.classList.add("biggestEnemy");
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
    super("Gnome", 250, 10, "Assets/Transperent/Icon44", true);
  }
}

class MinonKnight extends Enemy {
  constructor() {
    super("Minon Knight", 250, 5, "Assets/SoulKnight.png", true, 0, 20);
  }
}

class TreeSlime extends Enemy {
  constructor() {
    super("Tree Slime", 150, 5, "Assets/Transperent/Icon24.png", true, 0, 10);
  }
}

class Amalgam extends Enemy {
  constructor() {
    super("Amalgam", 500, 20, "Assets/Transperent/Icon25.png", false, 0, 30);
    this.display.classList.add("biggerEnemy");
  }
}
