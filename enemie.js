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
  #details;
  #summonType = null;

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

  get attackPower() {
    return this.#attackPower;
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

  get details() {
    return this.#details;
  }

  get possibleActions() {
    return [...this.#possibleActions];
  }

  get actionWeights() {
    return { ...this.#actionWeights };
  }

  get isElite() {
    return false;
  }

  get isBoss() {
    return false;
  }

  get description() {
    let desc = `${this.#name}<br><br>`;
    desc += `Max Health: ${this.#maxHealth}<br>`;
    desc += `Attack Power: ${this.#baseAttackPower}<br>`;

    if (this.#doubleStrike > 0)
      desc += `Double Strike Power: ${this.#doubleStrike}<br>`;
    if (this.#tripleStrike > 0)
      desc += `Triple Strike Power: ${this.#tripleStrike}<br>`;
    if (this.#lifesteal > 0) desc += `Max Lifesteal: ${this.#lifesteal}<br>`;
    if (this.#blockAmount > 0)
      desc += `Shield Amount: ${this.#blockAmount}<br>`;
    if (this.#shieldAll > 0)
      desc += `Shields all allies: ${this.#shieldAll}<br>`;
    if (this.#healAll > 0) desc += `Heals all allies: ${this.#healAll}<br>`;
    if (this.#buffAll > 0) desc += `Buffs all allies: ${this.#buffAll}<br>`;
    if (this.#poison > 0) desc += `Poison Amount: ${this.#poison}<br>`;
    if (this.#weakenPlayer > 0)
      desc += `Weakens player: ${this.#weakenPlayer}<br>`;
    if (this.#canSummon) {
      desc += `Can summon: ${this.#summonType}<br>`;
    }
    desc += `<br><br>${this.#details}`;
    return desc.trim();
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
    fightType,
    details,
    summonType = null
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
    this.#details = details;
    this.#summonType = summonType;
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
    let availableActions = this.possibleActions;
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
      weight: this.actionWeights[action] || 0,
    }));

    const totalWeight = weightedActions.reduce((sum, a) => sum + a.weight, 0);
    if (totalWeight === 0) return;

    let rand = Math.random() * totalWeight;
    let selectedAction;
    for (let { action, weight } of weightedActions) {
      if (rand < weight) {
        selectedAction = action;
        this.#nextAction = action.split("_$sep$_")[0];
        break;
      }
      rand -= weight;
    }

    this.updateDisplay();
    return selectedAction;
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

    let actualDamage = damageOverride ?? this.attackPower;

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

    raiseEvent("PoisonToEnemy", {
      enemy: this,
      amount: this.#poisonFromPlayer,
    });
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
      attack: `<img src="Assets/swordsEmoji.png"/> ${this.attackPower}`,
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
      attack_in_5: `<img src="Assets/swordsEmoji.png"/> ${this.attackPower} (in 5)`,
      attack_in_4: `<img src="Assets/swordsEmoji.png"/> ${this.attackPower} (in 4)`,
      attack_in_3: `<img src="Assets/swordsEmoji.png"/> ${this.attackPower} (in 3)`,
      attack_in_2: `<img src="Assets/swordsEmoji.png"/> ${this.attackPower} (in 2)`,
      attack_in_1: `<img src="Assets/swordsEmoji.png"/> ${this.attackPower} (in 1)`,
      SD_in_10: `<img src="Assets/explosionEmoji.png"/> ${this.attackPower} (in 10)`,
      SD_in_9: `<img src="Assets/explosionEmoji.png"/> ${this.attackPower} (in 9)`,
      SD_in_8: `<img src="Assets/explosionEmoji.png"/> ${this.attackPower} (in 8)`,
      SD_in_7: `<img src="Assets/explosionEmoji.png"/> ${this.attackPower} (in 7)`,
      SD_in_6: `<img src="Assets/explosionEmoji.png"/> ${this.attackPower} (in 6)`,
      SD_in_5: `<img src="Assets/explosionEmoji.png"/> ${this.attackPower} (in 5)`,
      SD_in_4: `<img src="Assets/explosionEmoji.png"/> ${this.attackPower} (in 4)`,
      SD_in_3: `<img src="Assets/explosionEmoji.png"/> ${this.attackPower} (in 3)`,
      SD_in_2: `<img src="Assets/explosionEmoji.png"/> ${this.attackPower} (in 2)`,
      SD_in_1: `<img src="Assets/explosionEmoji.png"/> ${this.attackPower} (in 1)`,
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
    this.hideIntentTooltip(intentElement);

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
      attack_in_1: `attack for ${this.attackPower} in 1 Turn`,
      attack_in_2: `attack for ${this.attackPower} in 2 Turns`,
      attack_in_3: `attack for ${this.attackPower} in 3 Turns`,
      attack_in_4: `attack for ${this.attackPower} in 4 Turns`,
      attack_in_5: `attack for ${this.attackPower} in 5 Turns`,
      SD_in_1: `selfdestruct in 1 Turn, dealing ${this.attackPower} damage`,
      SD_in_2: `selfdestruct in 2 Turns, dealing ${this.attackPower} damage`,
      SD_in_3: `selfdestruct in 3 Turns, dealing ${this.attackPower} damage`,
      SD_in_4: `selfdestruct in 4 Turns, dealing ${this.attackPower} damage`,
      SD_in_5: `selfdestruct in 5 Turns, dealing ${this.attackPower} damage`,
      SD_in_6: `selfdestruct in 6 Turns, dealing ${this.attackPower} damage`,
      SD_in_7: `selfdestruct in 7 Turns, dealing ${this.attackPower} damage`,
      SD_in_8: `selfdestruct in 8 Turns, dealing ${this.attackPower} damage`,
      SD_in_9: `selfdestruct in 9 Turns, dealing ${this.attackPower} damage`,
      SD_in_10: `selfdestruct in 10 Turns, dealing ${this.attackPower} damage`,
    };

    tooltipText += tooltipMap[this.#nextAction] || "";
    intentTooltip.innerText = tooltipText;

    intentElement.appendChild(intentTooltip);

    // const intentElementTop = intentElement.offsetTop;
    // const intentElementHeight = intentElement.offsetHeight;

    // intentTooltip.style.top = `${intentElementTop + intentElementHeight + 5}px`;
    // intentTooltip.style.left = `${intentElement.offsetLeft + 20}px`;
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
      "Act 1 - normal",
      "One of the first enemies implemented. These enemies are always accompanied by a Sad Shroom."
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
      "Act 1 - normal",
      "This is the most basic enemy in terms of stats. Most things are balanced around the Snails stats."
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
      "Act 1 - normal",
      "This enemy always hides behind other enemies to avoid the player."
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
      "Act 1 - normal",
      "Currently unused enemy with an above average attack power. When implemented keep your defenses in mind."
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
      "Act 1 - normal",
      "One of the more annoying enemies in Act 1. Despite having low attack, you are pretty much guaranteed to take damage because of the poison they apply to you."
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
      "Act 1 - normal",
      "A tough enemy with above average health and attack power, also with the ability to lifesteal. Fortunately you will only encounter three of them at the same time."
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
      "Act 1 - elite",
      "The Slime Hive elite fight is one of the toughest fights in Act 1. This enemy holds the first line to shield the other Tree Slimes from incoming attacks."
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
      "Act 1 - normal",
      "The Mantis is one of the more basic enemies, having only attack and block as actions."
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
      "Act 1 - elite",
      "The Hornet elite fight is either really easy or very tough, depending on how fast you can kill these glas-cannons."
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

class BossBear extends Enemy {
  get isBoss() {
    return true;
  }
  specialAttackStarted = false;
  specialAttackCooldown = 0;
  specialAttackMaxCooldown = 5;
  canQueueSpecialAttack = true;
  forceQueueSpecialAttack = true;
  specialAttackPower = 50;
  specialAttackWeight = 0;

  get possibleActions() {
    if (!this.canQueueSpecialAttack && !this.forceQueueSpecialAttack) {
      return super.possibleActions;
    }

    let actualActions = super.possibleActions;
    if (this.specialAttackStarted) {
      actualActions = [this.specialAttackPlaceholder];
    } else {
      actualActions.push(this.specialAttackPlaceholder);
      // actualActions.push("attack_in_3_$sep$_poisionMist");
    }

    return actualActions;
  }

  get actionWeights() {
    if (!this.canQueueSpecialAttack && !this.forceQueueSpecialAttack) {
      return super.actionWeights;
    }

    if (this.forceQueueSpecialAttack) {
      return { [this.specialAttackPlaceholder]: 1 };
    }

    let actualWeights = super.actionWeights;
    if (this.specialAttackStarted) {
      actualWeights = { [this.specialAttackPlaceholder]: 1 };
    } else {
      actualWeights[this.specialAttackPlaceholder] = this.specialAttackWeight;
    }

    return actualWeights;
  }

  get attackPower() {
    if (!this.specialAttackStarted) {
      return super.attackPower;
    }
    return this.specialAttackPower;
  }

  get specialAttackPlaceholder() {
    let actualCooldown = this.specialAttackMaxCooldown;
    if (this.specialAttackStarted) {
      actualCooldown = this.specialAttackCooldown;
    }
    return "attack_in_" + actualCooldown;
  }
  constructor() {
    super(
      "Boss Bear",
      1250,
      15,
      "Assets/bearSleeping.png",
      true,
      0,
      80,
      0,
      0,
      0,
      0,
      false,
      0,
      10,
      8,
      "Act 1 - boss",
      "Don't wait until this bear wakes up. After that its next attack will be extremely dangerous."
    );

    this.setActionWeights({
      attack: 30,
      doubleStrike: 25,
      tripleStrike: 15,
      block: 30,
    });

    this.display.classList.add("biggestEnemy");
  }
  randomizeAction() {
    let action = super.randomizeAction();
    let [key, actionName] = action.split("_$sep$_");

    // if (actionName == "poisonMist") {

    // }

    this.forceQueueSpecialAttack = false;
    if (!this.specialAttackStarted && key == this.specialAttackPlaceholder) {
      this.specialAttackStarted = true;
      this.specialAttackCooldown = this.specialAttackMaxCooldown - 1;
    } else if (this.specialAttackStarted) {
      this.specialAttackCooldown -= 1;
    }
    return [key, actionName];
  }

  async performAction(player) {
    const image = this.display.querySelector(".enemy-icon");
    if (image && this.specialAttackStarted && this.specialAttackCooldown == 0) {
      image.src = "Assets/bear.png";
    }
    if (this.specialAttackStarted) {
      if (this.specialAttackCooldown > 0) {
        return;
      }
      try {
        SoundManager.play("BearGrowl");
        return this.attack(player);
      } finally {
        this.specialAttackStarted = false;
        this.specialAttackCooldown = 0;
      }
    }
    return super.performAction(player);
  }

  async enemyDeath() {
    unlockAchievement("Wake the bear");
    await super.enemyDeath();
  }
}

class FireSpirit extends Enemy {
  specialAttackStarted = false;
  specialAttackCooldown = 0;
  specialAttackMaxCooldown = 3;
  canQueueSpecialAttack = true;
  forceQueueSpecialAttack = true;
  specialAttackPower = 35;
  specialAttackWeight = 0;

  get possibleActions() {
    if (!this.canQueueSpecialAttack && !this.forceQueueSpecialAttack) {
      return super.possibleActions;
    }

    let actualActions = super.possibleActions;
    if (this.specialAttackStarted) {
      actualActions = [this.specialAttackPlaceholder];
    } else {
      actualActions.push(this.specialAttackPlaceholder);
      // actualActions.push("attack_in_3_$sep$_poisionMist");
    }

    return actualActions;
  }

  get actionWeights() {
    if (!this.canQueueSpecialAttack && !this.forceQueueSpecialAttack) {
      return super.actionWeights;
    }

    if (this.forceQueueSpecialAttack) {
      return { [this.specialAttackPlaceholder]: 1 };
    }

    let actualWeights = super.actionWeights;
    if (this.specialAttackStarted) {
      actualWeights = { [this.specialAttackPlaceholder]: 1 };
    } else {
      actualWeights[this.specialAttackPlaceholder] = this.specialAttackWeight;
    }

    return actualWeights;
  }

  get attackPower() {
    if (!this.specialAttackStarted) {
      return super.attackPower;
    }
    return this.specialAttackPower;
  }

  get specialAttackPlaceholder() {
    let actualCooldown = this.specialAttackMaxCooldown;
    if (this.specialAttackStarted) {
      actualCooldown = this.specialAttackCooldown;
    }
    return "SD_in_" + actualCooldown;
  }
  constructor() {
    super(
      "Fire Spirit",
      75,
      0,
      "Assets/Transperent2/Icon47.png",
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
      "Act 2 - normal",
      "This enemy is summoned by the Fire Lizard. They don't have a normal attack, but explode after a short time, dealing big damage to you."
    );
    this.isSummoned = true;
  }
  async randomizeAction() {
    let action = super.randomizeAction();
    if (!action) return [null, null];
    let [key, actionName] = action.split("_$sep$_");

    // if (actionName == "poisonMist") {

    // }

    this.forceQueueSpecialAttack = false;
    if (!this.specialAttackStarted && key == this.specialAttackPlaceholder) {
      this.specialAttackStarted = true;
      this.specialAttackCooldown = this.specialAttackMaxCooldown - 1;
    } else if (this.specialAttackStarted) {
      this.specialAttackCooldown -= 1;
    }
    return [key, actionName];
  }

  async performAction(player) {
    if (this.specialAttackStarted) {
      if (this.specialAttackCooldown > 0) {
        return;
      }
      try {
        return this.attack(player);
      } finally {
        this.specialAttackStarted = false;
        this.specialAttackCooldown = 0;
        SoundManager.play("BombSound");
        this.takeDamage(999);
      }
    }
    return super.performAction(player);
  }
}

class EvilKnight extends Enemy {
  get isBoss() {
    return true;
  }
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
      "Act 1 - boss",
      "A mighty Knight that guards the entrance of the mystical caves. You might have to be lucky to survive his devastating strikes.",
      "Minion Knight"
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

  async enemyDeath() {
    unlockAchievement("The better knight");
    await super.enemyDeath();
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
      "Act 1 - normal",
      "Currently unused enemy, that is suppose to be only a blocker to protect enemies behind it from the players attacks."
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
      "Act 1 - event",
      "You can only encounter this enemy via an event. This was the first enemy to use lifesteal, that shaped other enemies and even some weapons the player can use."
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
      "Act 1 - normal",
      "By themselves, these enemies are not that dangerous, but watch out, they might get buffed by a druid."
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
      "Act 1 - summon"
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
      "Act 1 - boss",
      "These enemies accompany the final boss of the forest. It looks like the Evil Knight has an infinite supply of them..."
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
      "Act 1 - elite",
      "These enemies try to overrun you by their sheer numbers. Maybe try to focus them first, before finishing the Slimie Hive in front of them."
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
      "Act 1 - elite",
      "Nobody knows what the Amalgam is suppose to be. But its high health stat makes it a good target for the Master Mage and the Druid to buff."
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
      "Act 1 - elite",
      "The Cleric is a team-player by healing allies and weakening the foe. Unfortunately he plays for the other team."
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
      "Act 1 - elite",
      "Druid's main focus lies in buffing his allies, which can get out of hand very quickly. Try to finish him off as soon as possible."
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
      "Act 1 - elite",
      "The Crystal Mages ability to give his allies extra block can drag out a fight. But alone is the Crystal Mage not the most dangerous enemy."
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
      "Act 1 - elite",
      "After perfecting all kinds of magic, this enemy is the most versatile, having the ability to give block to allies, healing or buffing them. If that wasn't enough, he is also able to weaken the player."
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
      "Act 1 - summon"
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
      "Act 1 - elite",
      "This undead enemy was summened by the Necromancer. Skeletons are usually more annoying than dangerous."
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
      "Tutorial - normal",
      "Just a Training Dummy with different kinds of actions to prepare you for the real fight."
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
      "Act 1 - elite",
      "Using the dark arts, this enemy summons Skeletons to help fighting. At his own, the Necromancer is pretty weak, so strike him down when there is no Skelton supporting him.",
      "Skeleton"
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

class FireLizard extends Enemy {
  constructor() {
    super(
      "Fire Lizard",
      300,
      15,
      "Assets/Transperent2/Icon28.png",
      true,
      0,
      50,
      0,
      0,
      0,
      0,
      true,
      0,
      0,
      8,
      "Act 2 - normal",
      "The Fire Lizard might look cute, but don't let that fool you. It summons Fire Spirits that will explode, damaging you in the process.",
      "Fire Spirit"
    );
    this.setActionWeights({
      block: 30,
      canSummon: 40,
      attack: 20,
      tripleStrike: 10,
    });
    this.display.classList.add("bigEnemy");
  }

  summon() {
    const maxEnemies = 5;
    if (enemies.length >= maxEnemies) {
      return;
    }

    const summonedFireSpirit = new FireSpirit();

    enemies.pop();

    let index = enemies.findIndex((e) => e == this);
    enemies.splice(index, 0, summonedFireSpirit);
    this.display.parentNode.insertBefore(
      summonedFireSpirit.display,
      this.display
    );
    summonedFireSpirit.randomizeAction();
    summonedFireSpirit.displayIntent();
  }
}

class SpiderBoss extends Enemy {
  get isBoss() {
    return true;
  }
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
      "Act 2 - boss",
      "Deep in the caves you encounter this enemy. She can summon Spiders and weakens you, so watch out and be strong.",
      "Spider"
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

  async enemyDeath() {
    unlockAchievement("No spider dance");
    await super.enemyDeath();
  }
}

class RatKing extends Enemy {
  get isBoss() {
    return true;
  }
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
      "Act 2 - boss",
      "The king of rats is an unnaturally big rat with an army of rats behind it. Even if you defeat the king, the fight might not be over.",
      "Rat"
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
    unlockAchievement("Ratvolution");
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
      "Act 2 - normal",
      "This is the basic enemy for the second Act. But despite beeing a basic enemy, its attacks are devastating."
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
      "Act 2 - normal",
      "Living in the caves, these creatures welcome fresh blood so they can heal of attacks."
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
      "Act 2 - boss",
      "You will encounter an endless amount of them in the final fight of the caves. Try to keep their numbers low."
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
      "Act 2 - summon"
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
      "Act 2 - boss",
      "This enemy was called by the Spider Boss and will try to poison you as much as possible. Sustain is your best friend against them."
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
      "Act 2 - summon"
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
      2,
      0,
      false,
      0,
      0,
      0,
      "Act 2 - elite",
      "Never beeing alone and beeing able to buff each other makes the fight agains the Imps a very hard battle."
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
      "Act 2 - elite",
      "This lazy enemy sits in the frontline to block attacks and heal its allies. After some buffs, even this enemy can be dangerous."
    );
  }
}

class SmallGolem extends Enemy {
  constructor() {
    const randomAttackPower = getRandomIntInclusive(8, 13);
    const randomShieldAmount = getRandomIntInclusive(20, 35);
    super(
      "Golem small",
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
      "Act 2 - elite",
      "Small Golems are the last phase of the Golem fight, but even then, they are pretty tough."
    );
    this.display.classList.add("dark-cave-effect");
  }
}

class MediumGolem extends Enemy {
  constructor() {
    const randomAttackPower = getRandomIntInclusive(13, 18);
    const randomShieldAmount = getRandomIntInclusive(45, 60);
    super(
      "Golem medium",
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
      "Act 2 - elite",
      "Big Golems split into two medium Golems when they die. If you see them, you are half way through the fight."
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
      "Golem big",
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
      "Act 2 - elite",
      "The mighty Golem is a meneace in the dark parts of the cave. You have to kill every part of it to really finish the fight."
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

class AncientClock extends Enemy {
  specialAttackStarted = false;
  specialAttackCooldown = 0;
  specialAttackMaxCooldown = 10;
  canQueueSpecialAttack = true;
  forceQueueSpecialAttack = true;
  specialAttackPower = 999;
  specialAttackWeight = 0;

  get possibleActions() {
    if (!this.canQueueSpecialAttack && !this.forceQueueSpecialAttack) {
      return super.possibleActions;
    }

    let actualActions = super.possibleActions;
    if (this.specialAttackStarted) {
      actualActions = [this.specialAttackPlaceholder];
    } else {
      actualActions.push(this.specialAttackPlaceholder);
      // actualActions.push("attack_in_3_$sep$_poisionMist");
    }

    return actualActions;
  }

  get actionWeights() {
    if (!this.canQueueSpecialAttack && !this.forceQueueSpecialAttack) {
      return super.actionWeights;
    }

    if (this.forceQueueSpecialAttack) {
      return { [this.specialAttackPlaceholder]: 1 };
    }

    let actualWeights = super.actionWeights;
    if (this.specialAttackStarted) {
      actualWeights = { [this.specialAttackPlaceholder]: 1 };
    } else {
      actualWeights[this.specialAttackPlaceholder] = this.specialAttackWeight;
    }

    return actualWeights;
  }

  get attackPower() {
    if (!this.specialAttackStarted) {
      return super.attackPower;
    }
    return this.specialAttackPower;
  }

  get specialAttackPlaceholder() {
    let actualCooldown = this.specialAttackMaxCooldown;
    if (this.specialAttackStarted) {
      actualCooldown = this.specialAttackCooldown;
    }
    return "SD_in_" + actualCooldown;
  }

  constructor() {
    super(
      "Ancient Clock",
      5000,
      0,
      "Assets/ancientClock.png",
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
      "Act 2 - event",
      "Hidden deep in the caves, this ancient machine waits for an unlucky soul to trigger its kill switch."
    );
    this.display.classList.add("biggestEnemy");
  }

  async randomizeAction() {
    let action = super.randomizeAction();
    if (!action) return [null, null];
    let [key, actionName] = action.split("_$sep$_");

    // if (actionName == "poisonMist") {

    // }

    this.forceQueueSpecialAttack = false;
    if (!this.specialAttackStarted && key == this.specialAttackPlaceholder) {
      this.specialAttackStarted = true;
      this.specialAttackCooldown = this.specialAttackMaxCooldown - 1;
    } else if (this.specialAttackStarted) {
      this.specialAttackCooldown -= 1;
    }
    return [key, actionName];
  }

  async performAction(player) {
    if (this.specialAttackStarted) {
      if (this.specialAttackCooldown > 0) {
        return;
      }
      try {
        return this.attack(player);
      } finally {
        this.specialAttackStarted = false;
        this.specialAttackCooldown = 0;
        SoundManager.play("BombSound");
        this.takeDamage(9999);
      }
    }
    return super.performAction(player);
  }
}

class SmallCopperCloud extends Enemy {
  constructor() {
    super(
      "Copper Cloud Small",
      150,
      5,
      "Assets/Transperent2/Icon15.png",
      true,
      0,
      5,
      5,
      0,
      0,
      0,
      false,
      0,
      0,
      0,
      "Act 2 - normal",
      "The smaller variant of the Copper Cloud, that appears after defeating a big Copper Cloud."
    );
    this.setActionWeights({
      block: 45,
      attack: 25,
      poison: 30,
    });
    this.display.classList.add("dark-cave-effect");
  }
  async enemyDeath() {
    player.applyPoison(2);
    player.updatePoisonDisplay();
    await super.enemyDeath();
  }
}

class BigCopperCloud extends Enemy {
  constructor() {
    super(
      "Copper Cloud Big",
      300,
      10,
      "Assets/Transperent2/Icon15.png",
      true,
      0,
      15,
      10,
      0,
      0,
      0,
      false,
      0,
      0,
      0,
      "Act 2 - normal",
      "A cloud of poison, that tries to wear you down. Killing it might add even more poison."
    );
    this.setActionWeights({
      block: 40,
      attack: 20,
      poison: 40,
    });
    this.display.classList.add("bigEnemy");
  }

  async enemyDeath() {
    this.spawnSmallCopperCloudOnDeath();
    player.applyPoison(5);
    player.updatePoisonDisplay();
    await super.enemyDeath();
  }

  spawnSmallCopperCloudOnDeath() {
    const maxEnemies = 5;
    const copperCloudsToSpawn = 2;

    for (let i = 0; i < copperCloudsToSpawn; i++) {
      if (enemies.length >= maxEnemies) break;

      const smallCopperCloud = new SmallCopperCloud();
      enemies.pop();

      let index = enemies.findIndex((e) => e === this);
      enemies.splice(index, 0, smallCopperCloud);

      this.display.parentNode.insertBefore(
        smallCopperCloud.display,
        this.display
      );

      smallCopperCloud.randomizeAction();
      smallCopperCloud.displayIntent();
    }
  }
}

class PotOfGold extends Enemy {
  #fightType = "Act 1 - normal";
  get fightType() {
    return this.#fightType;
  }

  set fightType(value) {
    this.#fightType = value;
  }

  constructor() {
    const attackPower = 5 * globalSettings.currentAct;
    const health = 100 * globalSettings.currentAct;
    const block = 5 * globalSettings.currentAct;
    super(
      "Pot of Gold",
      health,
      attackPower,
      "Assets/potOfGold.png",
      true,
      0,
      block,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      0,
      "Act 1 - normal",
      "This enemy has a small chance to appear in a fight, and when defeated, you will be rewarded with extra gold. This is one of the few enemies that can appear in Act 1 and Act 2."
    );
  }

  async enemyDeath() {
    updatePlayerGold(50);
    await super.enemyDeath();
  }
}

class Mimic extends Enemy {
  #fightType = "Act 1 - event";
  get fightType() {
    return this.#fightType;
  }

  set fightType(value) {
    this.#fightType = value;
  }

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
      "Act 1 - event",
      "The Mimic camouflages itself as a chest, and when you least expect it, you have to fight. This is one of the few enemies that can appear in Act 1 and Act 2."
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
      "Act 2 - normal",
      "The Happy Imp is just glad its not alone and it wants to keep it that way. It tries its hardest to keep its friends alive."
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
  MasterMage,
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
  BigCopperCloud,
  SmallCopperCloud,
  PotOfGold,
  BossBear,
  FireSpirit,
  FireLizard,
  AncientClock,
};
