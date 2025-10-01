class Enemy extends HealthEntity {
  static #templateNode = null;
  static #enemyDisplay = null;
  static initialize() {
    //Zuweisung enemyDisplay entspricht dem Element, das alle angezeigten Gegner beeinhaltet (Node)
    this.#enemyDisplay = document.getElementById("enemies");
    //Zuweisung der Vorlage der Gegner
    this.#templateNode = this.#enemyDisplay.firstElementChild;
    //Entfernt die Vorlage der Gegner (damit keine leere Vorlage mit dabei ist)
    if (this.#templateNode) {
      this.#templateNode.remove();
    }
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
  #weakenPlayer = 0;
  #doubleStrike = 0;
  #tripleStrike = 0;
  #display;
  #nextAction = "";
  #possibleActions = [];
  #actionWeights;
  #fightType;

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

  get weakenPlayer() {
    return this.#weakenPlayer;
  }

  get doubleStrike() {
    return this.#doubleStrike;
  }

  get tripleStrike() {
    return this.#tripleStrike;
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

  get canWeakenPlayer() {
    return this.#weakenPlayer > 0;
  }

  get canDoubleStrike() {
    return this.#doubleStrike > 0;
  }

  get canTripleStrike() {
    return this.#tripleStrike > 0;
  }

  get fightType() {
    return this.#fightType;
  }

  static setTemplateNode(node) {
    Enemy.#templateNode = node;
  }

  setActionWeights(weights) {
    for (const [action, weight] of Object.entries(weights)) {
      if (this.#actionWeights.hasOwnProperty(action)) {
        this.#actionWeights[action] = weight;
      }
    }
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
    canSummon = false,
    weakenPlayer = 0,
    doubleStrike = 0,
    tripleStrike = 0,
    fightType
  ) {
    super();
    this.#health = maxHealth;
    this.#name = name;
    this.#attackPower = attackPower;
    this.#baseAttackPower = attackPower;
    this.#maxHealth = maxHealth;
    this.#icon = icon;
    this.#display = Enemy.#templateNode.cloneNode(true);
    const image = this.#display.querySelector(".enemy-icon");
    if (image) {
      image.src = icon;
      image.alt = name;
    }
    // let image = this.#display.querySelector(".enemy-icon");
    // image.src = icon;
    // image.alt = name;
    this.#ranged = ranged;
    this.#lifesteal = lifesteal;
    this.#blockAmount = blockAmount;
    this.#poison = poison;
    this.#healAll = healAll;
    this.#buffAll = buffAll;
    this.#shieldAll = shieldAll;
    this.#canSummon = canSummon;
    this.#weakenPlayer = weakenPlayer;
    this.#doubleStrike = doubleStrike;
    this.#tripleStrike = tripleStrike;
    this.#fightType = fightType;
    this.#actionWeights = {
      attack: 1,
      block: 1,
      poison: 1,
      healAll: 1,
      buffAll: 1,
      shieldAll: 1,
      canSummon: 1,
      weakenPlayer: 1,
      doubleStrike: 1,
      tripleStrike: 1,
    };

    // this.#display = Enemy.#templateNode.cloneNode(true);

    this.updateDisplay();
    if (Enemy.#enemyDisplay) {
      Enemy.#enemyDisplay.appendChild(this.#display);
    }
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
    if (this.canWeakenPlayer) {
      this.#possibleActions.push("weakenPlayer");
    }
    if (this.canDoubleStrike) {
      this.#possibleActions.push("doubleStrike");
    }
    if (this.canTripleStrike) {
      this.#possibleActions.push("tripleStrike");
    }
  }

  canSummon() {
    return this.#canSummon;
  }

  randomizeAction() {
    let availableActions = [...this.#possibleActions];
    const maxEnemies = 5;

    if (enemies.length >= maxEnemies) {
      availableActions = availableActions.filter(
        (action) => action !== "canSummon"
      );
    }

    const canHeal = enemies.some(
      (enemy) => enemy.health / enemy.maxHealth < 0.75
    );
    if (!canHeal) {
      availableActions = availableActions.filter(
        (action) => action !== "healAll"
      );
    }

    let weightedActions = availableActions.map((action) => ({
      action,
      weight: this.#actionWeights[action] || 0,
    }));

    const totalWeight = weightedActions.reduce((sum, a) => sum + a.weight, 0);
    if (totalWeight === 0) return;

    let rand = Math.random() * totalWeight;
    for (let { action, weight } of weightedActions) {
      if (rand < weight) {
        this.#nextAction = action;
        break;
      }
      rand -= weight;
    }

    this.updateDisplay();
  }

  displayIntent() {
    this.updateIntentElement();

    const intentElement = this.#display.querySelector(".enemy-intent");
    if (!intentElement) return;

    intentElement.addEventListener("mouseenter", () =>
      this.showIntentTooltip(intentElement)
    );
    intentElement.addEventListener("mouseleave", () =>
      this.hideIntentTooltip(intentElement)
    );
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
      case "weakenPlayer":
        await this.weakenPlayer(this.#weakenPlayer);
        break;
      case "doubleStrike":
        await this.multiAttack(player, this.#doubleStrike, 2);
        break;
      case "tripleStrike":
        await this.multiAttack(player, this.#tripleStrike, 3);
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

  attack(player, damageOverride = null) {
    player.attackingEnemy = this;
    console.log("Player is being attacked by:", player.attackingEnemy);

    let actualDamage =
      damageOverride !== null ? damageOverride : this.#attackPower;

    let blockedSomeDamage = false;

    // Handle blocking logic
    if (player.blockAmount > 0) {
      if (player.blockAmount >= actualDamage) {
        SoundManager.play("ShieldSound");
        player.blockAmount -= actualDamage;
        actualDamage = 0; // Fully blocked
        blockedSomeDamage = true;
      } else {
        actualDamage -= player.blockAmount;
        player.blockAmount = 0;
        blockedSomeDamage = true;
      }
    }

    if (
      actualDamage > 0 &&
      player.equippedRelics.includes("Zen Barrier") &&
      player.hand.length === 0
    ) {
      actualDamage = 0;
    }

    // Apply relics that reduce damage
    if (actualDamage > 0 && player.equippedRelics.includes("Death's Pact")) {
      actualDamage = Math.ceil(actualDamage / 2);
    }

    if (actualDamage > 15 && player.equippedRelics.includes("Steady Ground")) {
      actualDamage = 15;
    }

    // Apply damage
    let playerWillSurvive = player.health - actualDamage > 0;

    // Only trigger block animation if it's not lethal
    if (blockedSomeDamage && playerWillSurvive) {
      triggerBlockAnimation();
      setIdleTimeout();
    }

    if (actualDamage > 0) {
      player.takeDamage(actualDamage);
    }

    // UI updates
    const blockText = document.getElementById("block-text");
    const blockContainer = document.getElementById("block-circle");

    blockText.innerText = player.blockAmount;
    if (player.blockAmount === 0) {
      blockContainer.classList.add("hidden");
    }

    // Lifesteal
    if (this.#lifesteal > 0 && actualDamage > 0) {
      const lifestealHeal = Math.min(this.#lifesteal, actualDamage);
      this.heal(lifestealHeal);
    }

    // Bramble Mantle / Reflection
    if (player.attackingEnemy) {
      const enemy = player.attackingEnemy;
      const isBrambleEquipped = loadData("relic_Bramble Mantle");

      if (isBrambleEquipped) {
        enemy.takeDamage(15);
      }

      if (
        player.equippedRelics.includes("Titan's Reflection") &&
        player.blockAmount > 0
      ) {
        const reflectionDamage = player.blockAmount * 3;
        enemy.takeDamage(reflectionDamage);
      }
    }
  }

  async multiAttack(player, damagePerHit, times) {
    for (let i = 0; i < times; i++) {
      this.#display.classList.add("grow-shrink");
      this.attack(player, damagePerHit);
      await wait(400);
      updateHealthBar(player);
      this.#display.classList.remove("grow-shrink");

      if (i < times - 1) {
        await wait(400);
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

  async healAll(amount) {
    SoundManager.play("EnemyHeal");
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
    SoundManager.play("EnemyBuff");
    for (let enemy of enemies) {
      if (!enemy.isDead()) {
        if (enemy.#attackPower > 0) enemy.#attackPower += amount;
        if (enemy.#doubleStrike > 0) enemy.#doubleStrike += amount;
        if (enemy.#tripleStrike > 0) enemy.#tripleStrike += amount;
        enemy.updateDisplay();

        await wait(300);
      }
    }
  }

  async weakenPlayer(amount) {
    player.increaseWeak(amount);
    player.updateStrengthDisplay();

    await wait(300);
  }

  summon() {}

  updatePoisonDisplay() {
    let poisonElement = this.#display.querySelector(".poison-status-enemy");

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

  updateIntentElement() {
    const intentElement = this.#display.querySelector(".enemy-intent");
    if (!intentElement) {
      console.error("Enemy intent display element not found");
      return;
    }

    // intentElement.style.display = "block";
    // intentElement.style.visibility = "visible";

    const actionMap = {
      attack: `<img src="Assets/swordsEmoji.png"/> ${this.#attackPower}`,
      block: `<img src="Assets/shieldEmoji.png"/> ${this.#blockAmount}`,
      poison: `<img src="Assets/skullEmoji.png"/> ${this.#poison}`,
      healAll: `<img src="Assets/greenHeartEmoji.png"/> ${this.#healAll}`,
      buffAll: `<img src="Assets/bicepsEmoji.png"/> ${this.#buffAll}`,
      shieldAll: `<img src="Assets/shieldEmoji.png"/><img src="Assets/sparklesEmoji.png"/> ${
        this.#shieldAll
      }`,
      weakenPlayer: `<img src="Assets/dizzyEmoji.png"/> ${this.#weakenPlayer}`,
      canSummon: `<img src="Assets/gravestoneEmoji.png"/>`,
      doubleStrike: `2x <img src="Assets/swordsEmoji.png"/> ${
        this.#doubleStrike
      }`,
      tripleStrike: `3x <img src="Assets/swordsEmoji.png"/> ${
        this.#tripleStrike
      }`,
    };

    // intentElement.innerHTML = actionMap[this.#nextAction] || "";

    const html = actionMap[this.#nextAction];

    if (html) {
      intentElement.innerHTML = html;
      intentElement.style.visibility = "visible";
    } else {
      intentElement.style.visibility = "hidden";
    }

    console.log(
      `Enemy ${this.name} intent: ${this.#nextAction} - ${
        intentElement.textContent
      }`
    );
  }

  // Show tooltip when hovering over intent
  showIntentTooltip(intentElement) {
    const intentTooltip = document.createElement("div");
    intentTooltip.classList.add("enemy-intent-tooltip");

    let tooltipText = `Enemy intends to `;
    const tooltipMap = {
      attack: `attack for ${this.#attackPower} damage`,
      block: `block for ${this.#blockAmount}`,
      poison: `poison you for ${this.#poison}`,
      healAll: `heal all for ${this.#healAll} HP`,
      buffAll: `buff all by ${this.#buffAll}`,
      shieldAll: `block all for ${this.#shieldAll}`,
      weakenPlayer: `weaken you for ${this.#weakenPlayer}`,
      canSummon: `summon an enemy`,
      doubleStrike: `attack for ${this.#doubleStrike} damage two times`,
      tripleStrike: `attack for ${this.#tripleStrike} damage three times`,
    };

    tooltipText += tooltipMap[this.#nextAction] || "";
    intentTooltip.innerText = tooltipText;

    intentElement.appendChild(intentTooltip);

    const intentElementTop = intentElement.offsetTop;
    const intentElementHeight = intentElement.offsetHeight;

    intentTooltip.style.top = `${intentElementTop + intentElementHeight + 5}px`;
    intentTooltip.style.left = `${intentElement.offsetLeft + 20}px`;
  }

  // Hide tooltip when mouse leaves
  hideIntentTooltip(intentElement) {
    const intentTooltip = intentElement.querySelector(".enemy-intent-tooltip");
    if (intentTooltip) intentTooltip.remove();
  }

  updateDisplay() {
    const healthBarContainerEnemy = this.healthBar;
    const healthBarEnemy = this.#display.querySelector(".health-bar-enemy");

    if (!healthBarContainerEnemy) {
      console.error("Enemy health bar not found!");
      return;
    }

    const healthPercentage = (this.health / this.maxHealth) * 100;
    healthBarEnemy.style.width = `${healthPercentage}%`;
    healthBarEnemy.style.backgroundColor =
      healthPercentage > 50
        ? "#4caf50"
        : healthPercentage > 25
        ? "#ff9800"
        : "#f44336";

    let healthText = healthBarContainerEnemy.querySelector("span");
    if (!healthText) {
      healthText = document.createElement("span");
      healthBarContainerEnemy.appendChild(healthText);
    }
    healthText.textContent = `${this.health} / ${this.maxHealth}`;

    // Update block display
    let displayedBlock = this.#display.querySelector(".enemy-block");
    displayedBlock.textContent = this.#activeShield;
    if (this.#activeShield > 0) {
      displayedBlock.classList.remove("hidden");
      this.addBlockTooltip(displayedBlock);
    } else {
      displayedBlock.classList.add("hidden");
    }

    // Update buff display
    let displayedBuff = this.#display.querySelector(".enemy-buff");
    const buffAmount = this.#attackPower - this.#baseAttackPower;
    if (buffAmount > 0) {
      displayedBuff.innerHTML = `<img src="Assets/bicepsEmoji.png"/> ${buffAmount}`;
      displayedBuff.classList.remove("hidden");
      this.addBuffTooltip(displayedBuff);
    } else {
      displayedBuff.classList.add("hidden");
    }

    // Update intent using helper
    this.updateIntentElement();
  }

  addBlockTooltip(blockElement) {
    blockElement.addEventListener("mouseenter", () => {
      if (!blockElement.querySelector(".block-tooltip")) {
        const blockTooltip = document.createElement("div");
        blockTooltip.classList.add("block-tooltip");
        blockTooltip.innerText = `Enemy blocks, which reduces incoming damage by ${
          this.#activeShield
        }`;
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
    buffElement.addEventListener("mouseenter", () => {
      const buffAmount = this.#attackPower - this.#baseAttackPower;
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

  async enemyDeath() {
    SoundManager.play("enemyDeathSound");

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

    enemyDeathEvent(this);

    if (!this.isSummoned) {
      const goldDropped = Math.floor(Math.random() * 6) + 10;
      console.log(`${this.name} dropped ${goldDropped} gold!`);

      const goldDisplay = document.createElement("div");
      goldDisplay.textContent = `+${goldDropped} Gold`;
      goldDisplay.style.position = "absolute";
      goldDisplay.style.color = "gold";
      goldDisplay.style.fontSize = "1.5rem";
      goldDisplay.style.fontWeight = "bold";
      goldDisplay.style.zIndex = "1000";
      goldDisplay.style.transition = "opacity 1s ease-out";

      const enemyRect = this.#display.getBoundingClientRect();
      goldDisplay.style.left = `${enemyRect.left + enemyRect.width / 2 - 20}px`;
      goldDisplay.style.top = `${enemyRect.top - 30}px`;

      document.body.appendChild(goldDisplay);

      updatePlayerGold(goldDropped);

      await wait(750);
      goldDisplay.style.opacity = "0";

      await wait(450);
      goldDisplay.remove();
    }

    await wait(1500);
    this.#display.remove();
  }
}

const enemies = [];

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Shroom extends Enemy {
  constructor() {
    super(
      "Shroom",
      200,
      3,
      "Assets/Transperent/Icon1.png",
      true,
      0,
      15,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      0,
      "normal1"
    );
  }
}

class Snail extends Enemy {
  constructor() {
    super(
      "Snail",
      150,
      6,
      "Assets/Transperent/Icon5.png",
      true,
      0,
      15,
      0,
      0,
      0,
      0,
      false,
      0,
      3,
      0,
      "normal1"
    );

    this.setActionWeights({
      attack: 25,
      block: 50,
      doubleStrike: 25,
    });
  }
}

class SadShroom extends Enemy {
  constructor() {
    super(
      "Sad Shroom",
      200,
      5,
      "Assets/Transperent/Icon6.png",
      true,
      0,
      10,
      2,
      0,
      0,
      0,
      false,
      0,
      0,
      0,
      "normal1"
    );
  }
}

class BiteShroom extends Enemy {
  constructor() {
    super(
      "Bite Shroom",
      250,
      10,
      "Assets/Transperent/Icon7.png",
      true,
      0,
      0,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      4,
      "normal1"
    );

    this.setActionWeights({
      attack: 25,
      tripleStrike: 25,
      block: 50,
    });
  }
}

class Scorpion extends Enemy {
  constructor() {
    super(
      "Scorpion Shroom",
      150,
      3,
      "Assets/Transperent/Icon9.png",
      true,
      0,
      18,
      2,
      0,
      0,
      0,
      false,
      0,
      0,
      0,
      "normal1"
    );
  }
}

class BitingPlant extends Enemy {
  constructor() {
    super(
      "Biting Plant",
      250,
      8,
      "Assets/Transperent/Icon11.png",
      true,
      8,
      15,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      0,
      "normal1"
    );
  }
}

class SlimeHive extends Enemy {
  constructor() {
    super(
      "Slime Hive",
      400,
      3,
      "Assets/Transperent/Icon23.png",
      false,
      0,
      25,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      3,
      "elite1"
    );

    this.setActionWeights({
      attack: 40,
      block: 50,
      tripleStrike: 10,
    });
    this.display.classList.add("biggerEnemy");
  }
}

class Mantis extends Enemy {
  constructor() {
    super(
      "Mantis",
      150,
      7,
      "Assets/Transperent/Icon39.png",
      true,
      0,
      10,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      0,
      "normal1"
    );
  }
}

class Hornet extends Enemy {
  constructor() {
    super(
      "Hornet",
      150,
      13,
      "Assets/Transperent/Icon42.png",
      true,
      0,
      15,
      3,
      0,
      0,
      0,
      false,
      0,
      7,
      4,
      "elite1"
    );

    this.setActionWeights({
      attack: 20,
      doubleStrike: 10,
      tripleStrike: 10,
      poison: 10,
      block: 50,
    });
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
      true,
      0,
      15,
      12,
      "boss1"
    );

    this.setActionWeights({
      attack: 10,
      shield: 10,
      canSummon: 15,
      block: 45,
      doubleStrike: 10,
      tripleStrike: 10,
    });
    this.display.classList.add("biggestEnemy");
  }
  summon() {
    const maxEnemies = 5;
    if (enemies.length >= maxEnemies) {
      return;
    }

    const summonedMinion = new MinionKnightSummon();

    enemies.pop();

    let index = enemies.findIndex((e) => e == this);
    enemies.splice(index, 0, summonedMinion);

    this.display.parentNode.insertBefore(summonedMinion.display, this.display);
    summonedMinion.randomizeAction();
    summonedMinion.displayIntent();
  }
}

class HermitShroom extends Enemy {
  constructor() {
    super(
      "Hermit Shroom",
      500,
      3,
      "Assets/Transperent/Icon10.png",
      true,
      0,
      0,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      0,
      "normal1"
    );
  }
}

class Succubus extends Enemy {
  constructor() {
    super(
      "Succubus",
      750,
      15,
      "Assets/succubus.png",
      false,
      15,
      35,
      0,
      0,
      0,
      0,
      false,
      2,
      8,
      6,
      "event1"
    );
    this.setActionWeights({
      block: 40,
      attack: 15,
      weakenPlayer: 15,
      doubleStrike: 15,
      tripleStrike: 15,
    });
    this.display.classList.add("biggerEnemy");
  }
}

class Gnome extends Enemy {
  constructor() {
    super(
      "Gnome",
      250,
      5,
      "Assets/Transperent/Icon44.png",
      true,
      0,
      15,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      0,
      "normal1"
    );
  }
}

class MinionKnightSummon extends Enemy {
  constructor() {
    super(
      "Minion Knight",
      250,
      5,
      "Assets/minionKnight.png",
      true,
      0,
      20,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      0,
      "summon1"
    );
    this.isSummoned = true;
  }
}

class MinionKnight extends Enemy {
  constructor() {
    super(
      "Minion Knight",
      250,
      5,
      "Assets/minionKnight.png",
      true,
      0,
      20,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      0,
      "boss1"
    );
  }
}

class TreeSlime extends Enemy {
  constructor() {
    super(
      "Tree Slime",
      150,
      4,
      "Assets/Transperent/Icon24.png",
      true,
      0,
      9,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      0,
      "elite1"
    );
  }
}

class Amalgam extends Enemy {
  constructor() {
    super(
      "Amalgam",
      350,
      10,
      "Assets/Transperent/Icon25.png",
      false,
      0,
      25,
      0,
      0,
      0,
      0,
      false,
      0,
      2,
      1,
      "elite1"
    );
    this.setActionWeights({
      block: 50,
      attack: 30,
      doubleStrike: 10,
      trippleStrike: 10,
    });
    this.display.classList.add("biggerEnemy");
  }
}

class Cleric extends Enemy {
  constructor() {
    super(
      "Cleric",
      200,
      3,
      "Assets/enemyCleric.png",
      true,
      0,
      15,
      0,
      20,
      0,
      0,
      false,
      3,
      0,
      0,
      "elite1"
    );
    this.setActionWeights({
      block: 45,
      attack: 15,
      healAll: 20,
      weakenPlayer: 20,
    });
    this.display.classList.add("bigEnemy");
  }
}

class Druid extends Enemy {
  constructor() {
    const randomBuffAmount = getRandomIntInclusive(1, 3);
    super(
      "Druid",
      150,
      2,
      "Assets/enemyDruid.png",
      true,
      0,
      10,
      0,
      0,
      2,
      0,
      false,
      0,
      0,
      0,
      "elite1"
    );
    this.setActionWeights({
      block: 45,
      attack: 25,
      buffAll: 30,
    });
    this.display.classList.add("bigEnemy");
  }
}

class CrystalMage extends Enemy {
  constructor() {
    const randomShieldAllAmount = getRandomIntInclusive(7, 13);
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
      10,
      false,
      0,
      0,
      0,
      "elite1"
    );
    this.setActionWeights({
      block: 45,
      attack: 25,
      shieldAll: 30,
    });
    this.display.classList.add("bigEnemy");
  }
}

class MasterMage extends Enemy {
  constructor() {
    const randomHealAmount = getRandomIntInclusive(15, 25);
    const randomBuffAmount = getRandomIntInclusive(1, 5);
    const randomShieldAllAmount = getRandomIntInclusive(15, 25);
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
      20,
      false,
      2,
      0,
      0,
      "elite1"
    );
    this.setActionWeights({
      block: 50,
      attack: 10,
      healAll: 10,
      shieldAll: 10,
      buffAll: 10,
      weakenPlayer: 10,
    });
    this.display.classList.add("bigEnemy");
  }
}

class SkeletonSummon extends Enemy {
  constructor() {
    const randomHealth = getRandomIntInclusive(45, 65);
    const randomAttackPower = getRandomIntInclusive(3, 7);
    const randomShieldAmount = getRandomIntInclusive(5, 15);
    super(
      "Skeleton",
      50,
      5,
      "Assets/skeleton.png",
      true,
      0,
      10,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      0,
      "summon1"
    );
    this.isSummoned = true;
  }
}

class Skeleton extends Enemy {
  constructor() {
    super(
      "Skeleton",
      50,
      5,
      "Assets/skeleton.png",
      true,
      0,
      10,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      0,
      "elite1"
    );
  }
}

class TrainingDummy extends Enemy {
  constructor() {
    super(
      "Training Dummy",
      250,
      3,
      "Assets/Training_dummy.png",
      true,
      0,
      5,
      1,
      5,
      1,
      0,
      false,
      1,
      0,
      0,
      "tutorial1"
    );
    this.display.classList.add("bigEnemy");
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
      true,
      0,
      0,
      0,
      "elite1"
    );
    this.setActionWeights({
      block: 35,
      canSummon: 50,
      attack: 15,
    });
    this.display.classList.add("bigEnemy");
  }

  summon() {
    const maxEnemies = 5;
    if (enemies.length >= maxEnemies) {
      return;
    }

    const summonedSkeleton = new SkeletonSummon();

    enemies.pop();

    let index = enemies.findIndex((e) => e == this);
    enemies.splice(index, 0, summonedSkeleton);
    this.display.parentNode.insertBefore(
      summonedSkeleton.display,
      this.display
    );
    summonedSkeleton.randomizeAction();
    summonedSkeleton.displayIntent();
  }
}

class SpiderBoss extends Enemy {
  constructor() {
    super(
      "Spider Boss",
      2500,
      20,
      "Assets/spiderBoss.png",
      true,
      0,
      150,
      0,
      0,
      0,
      0,
      true,
      5,
      0,
      0,
      "boss2"
    );
    this.setActionWeights({
      block: 50,
      canSummon: 20,
      attack: 15,
      weakenPlayer: 15,
    });
    this.display.classList.add("biggestEnemy");
  }
  summon() {
    const maxEnemies = 5;
    if (enemies.length >= maxEnemies) {
      return;
    }

    const summonedSkeleton = new SpiderSummon();

    enemies.pop();

    let index = enemies.findIndex((e) => e == this);
    enemies.splice(index, 0, summonedSkeleton);

    this.display.parentNode.insertBefore(
      summonedSkeleton.display,
      this.display
    );
    summonedSkeleton.randomizeAction();
    summonedSkeleton.displayIntent();
  }
}

class RatKing extends Enemy {
  constructor() {
    super(
      "Rat King",
      2500,
      25,
      "Assets/ratKing.png",
      true,
      0,
      125,
      0,
      0,
      0,
      0,
      true,
      0,
      0,
      0,
      "boss2"
    );
    this.setActionWeights({
      block: 35,
      attack: 25,
      canSummon: 40,
    });
    this.display.classList.add("biggestEnemy");
  }
  summon() {
    const maxEnemies = 6;
    if (enemies.length >= maxEnemies) {
      return;
    }

    const summonedRat = new RatSummon();

    enemies.pop();

    let index = enemies.findIndex((e) => e == this);
    enemies.splice(index, 0, summonedRat);

    this.display.parentNode.insertBefore(summonedRat.display, this.display);
    summonedRat.randomizeAction();
    summonedRat.displayIntent();
  }

  async enemyDeath() {
    this.spawnRatsOnDeath();
    await super.enemyDeath();
  }

  spawnRatsOnDeath() {
    const maxEnemies = 5;
    const RatsToSpawn = 5;

    for (let i = 0; i < RatsToSpawn; i++) {
      if (enemies.length >= maxEnemies) break;

      const rat = new RatSummon();
      enemies.pop();

      let index = enemies.findIndex((e) => e === this);
      enemies.splice(index, 0, rat);

      this.display.parentNode.insertBefore(rat.display, this.display);

      rat.randomizeAction();
      rat.displayIntent();
    }
  }
}

class Centepede extends Enemy {
  constructor() {
    const randomAttackPower = getRandomIntInclusive(13, 18);
    const randomShieldAmount = getRandomIntInclusive(15, 20);
    super(
      "Centepede",
      350,
      15,
      "Assets/Transperent/Icon35.png",
      true,
      0,
      18,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      0,
      "normal2"
    );
  }
}

class Bat extends Enemy {
  constructor() {
    const randomAttackPower = getRandomIntInclusive(15, 25);
    const randomShieldAmount = getRandomIntInclusive(17, 25);
    super(
      "Bat",
      250,
      18,
      "Assets/Transperent/Icon38.png",
      true,
      18,
      20,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      0,
      "normal2"
    );
  }
}

class Rat extends Enemy {
  constructor() {
    const randomAttackPower = getRandomIntInclusive(10, 12);
    const randomShieldAmount = getRandomIntInclusive(25, 30);
    const randomPoisonAmount = getRandomIntInclusive(2, 4);
    super(
      "Rat",
      550,
      15,
      "Assets/Transperent2/Icon18.png",
      true,
      0,
      27,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      0,
      "boss2"
    );
    this.display.classList.add("dark-cave-effect");
  }
}

class RatSummon extends Enemy {
  constructor() {
    const randomAttackPower = getRandomIntInclusive(12, 14);
    const randomShieldAmount = getRandomIntInclusive(25, 30);
    const randomPoisonAmount = getRandomIntInclusive(2, 4);
    super(
      "Rat",
      550,
      15,
      "Assets/Transperent2/Icon18.png",
      true,
      0,
      27,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      0,
      "summon2"
    );
    this.isSummoned = true;
    this.display.classList.add("dark-cave-effect");
  }
}

class Spider extends Enemy {
  constructor() {
    super(
      "Spider",
      450,
      10,
      "Assets/Transperent2/Icon25.png",
      true,
      0,
      20,
      5,
      0,
      0,
      0,
      false,
      0,
      0,
      0,
      "boss2"
    );
    this.setActionWeights({
      block: 30,
      attack: 30,
      poison: 40,
    });
  }
}

class SpiderSummon extends Enemy {
  constructor() {
    const randomAttackPower = getRandomIntInclusive(8, 12);
    const randomShieldAmount = getRandomIntInclusive(15, 25);
    const randomPoisonAmount = getRandomIntInclusive(3, 7);
    super(
      "Spider",
      450,
      10,
      "Assets/Transperent2/Icon25.png",
      true,
      0,
      20,
      5,
      0,
      0,
      0,
      false,
      0,
      0,
      0,
      "summon2"
    );
    this.setActionWeights({
      block: 30,
      attack: 30,
      poison: 40,
    });
    this.isSummoned = true;
    this.display.classList.add("dark-cave-effect");
  }
}

class Imp extends Enemy {
  constructor() {
    const randomAttackPower = getRandomIntInclusive(3, 7);
    const randomBuffAmount = getRandomIntInclusive(2, 5);
    super(
      "Imp",
      250,
      5,
      "Assets/Transperent2/Icon22.png",
      true,
      0,
      0,
      0,
      0,
      4,
      0,
      false,
      0,
      0,
      0,
      "elite2"
    );
  }
}

class FatImp extends Enemy {
  constructor() {
    const randomShieldAmount = getRandomIntInclusive(20, 30);
    const randomHealAmount = getRandomIntInclusive(45, 60);
    super(
      "Fat Imp",
      350,
      1,
      "Assets/Transperent2/Icon19.png",
      true,
      0,
      25,
      0,
      60,
      0,
      0,
      false,
      0,
      0,
      0,
      "elite2"
    );
  }
}

class SmallGolem extends Enemy {
  constructor() {
    const randomAttackPower = getRandomIntInclusive(8, 13);
    const randomShieldAmount = getRandomIntInclusive(20, 35);
    super(
      "Small Golem",
      250,
      15,
      "Assets/stoneGolem.png",
      true,
      0,
      30,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      0,
      "elite2"
    );
    this.display.classList.add("dark-cave-effect");
  }
}

class MediumGolem extends Enemy {
  constructor() {
    const randomAttackPower = getRandomIntInclusive(13, 18);
    const randomShieldAmount = getRandomIntInclusive(45, 60);
    super(
      "Medium Golem",
      500,
      20,
      "Assets/stoneGolem.png",
      true,
      0,
      60,
      0,
      0,
      0,
      0,
      false,
      0,
      15,
      0,
      "elite2"
    );
    this.setActionWeights({
      block: 45,
      attack: 25,
      doubleStrike: 30,
    });
    this.display.classList.add("bigEnemy");
    this.display.classList.add("dark-cave-effect");
  }

  async enemyDeath() {
    this.spawnSmallGolemsOnDeath();
    await super.enemyDeath();
  }

  spawnSmallGolemsOnDeath() {
    const maxEnemies = 5;
    const golemsToSpawn = 2;

    for (let i = 0; i < golemsToSpawn; i++) {
      if (enemies.length >= maxEnemies) break;

      const smallGolem = new SmallGolem();
      enemies.pop();

      let index = enemies.findIndex((e) => e === this);
      enemies.splice(index, 0, smallGolem);

      this.display.parentNode.insertBefore(smallGolem.display, this.display);

      smallGolem.randomizeAction();
      smallGolem.displayIntent();
    }
  }
}

class BigGolem extends Enemy {
  constructor() {
    super(
      "Big Golem",
      1000,
      40,
      "Assets/stoneGolem.png",
      true,
      0,
      120,
      0,
      0,
      0,
      0,
      false,
      0,
      25,
      20,
      "elite2"
    );
    this.setActionWeights({
      block: 40,
      attack: 20,
      doubleStrike: 20,
      tripleStrike: 20,
    });
    this.display.classList.add("biggestEnemy");
  }

  async enemyDeath() {
    this.spawnMediumGolemsOnDeath();
    await super.enemyDeath();
  }

  spawnMediumGolemsOnDeath() {
    const maxEnemies = 5;
    const golemsToSpawn = 2;

    for (let i = 0; i < golemsToSpawn; i++) {
      if (enemies.length >= maxEnemies) break;

      const mediumGolem = new MediumGolem();
      enemies.pop();

      let index = enemies.findIndex((e) => e === this);
      enemies.splice(index, 0, mediumGolem);

      this.display.parentNode.insertBefore(mediumGolem.display, this.display);

      mediumGolem.randomizeAction();
      mediumGolem.displayIntent();
    }
  }
}

class Mimic extends Enemy {
  constructor() {
    const attackPower = 15 * globalSettings.currentAct;
    const health = 500 * globalSettings.currentAct;
    const weaken = 3 * globalSettings.currentAct;
    super(
      "Mimic",
      health,
      attackPower,
      "Assets/mimic.png",
      true,
      0,
      35,
      0,
      50,
      0,
      0,
      false,
      weaken,
      0,
      0,
      "event1"
    );
  }
}

class HappyImp extends Enemy {
  constructor() {
    const randomAttackPower = getRandomIntInclusive(12, 17);
    const randomHealAmount = getRandomIntInclusive(40, 60);
    super(
      "Happy Imp",
      350,
      15,
      "Assets/Transperent2/Icon26.png",
      true,
      0,
      0,
      0,
      60,
      0,
      0,
      false,
      0,
      0,
      0,
      "normal2"
    );
  }
}

const enemyClassMapping = {
  Shroom,
  Snail,
  SadShroom,
  BiteShroom,
  Scorpion,
  BitingPlant,
  SlimeHive,
  Mantis,
  Hornet,
  EvilKnight,
  HermitShroom,
  Succubus,
  Gnome,
  MinionKnight,
  TreeSlime,
  Amalgam,
  Cleric,
  Druid,
  CrystalMage,
  Skeleton,
  TrainingDummy,
  Necromancer,
  SpiderBoss,
  RatKing,
  Centepede,
  Bat,
  Rat,
  Spider,
  Imp,
  FatImp,
  SmallGolem,
  MediumGolem,
  BigGolem,
  Mimic,
  HappyImp,
};
