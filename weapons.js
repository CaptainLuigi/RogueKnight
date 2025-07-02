class Weapons {
  #name;
  #level;
  #range;
  #damage;
  #criticalDamage;
  #criticalChance;
  #energy;
  #description;
  #sprite;
  #requiresTargeting;
  #minRange;
  #maxRange;
  #effectsLeft;
  #effectsRight;
  #healingAmount;
  #canHeal;
  #blockAmount;
  #poisonAmount;
  #oncePerBattle = false;
  #energyGainOnUse = 0;
  #drawAmountOnUse = 0;
  #wasUsed = false;
  #soundCategory;
  #strength = 0;
  #selfDamage = 0;

  constructor(
    name,
    level = 1,
    range,
    damage,
    criticalDamage,
    criticalChance,
    energy,
    description,
    sprite,
    requiresTargeting = false,
    minRange = 0,
    maxRange = 0,
    effectsLeft = 0,
    effectsRight = 0,
    healingAmount = 0,
    canHeal = false,
    blockAmount = 0,
    poisonAmount = 0,
    oncePerBattle = false,
    energyGainOnUse = 0,
    drawAmountOnUse = 0,
    soundCategory = null,
    strength = 0,
    selfDamage = 0
  ) {
    this.loadFromWeaponInfo({
      name,
      level,
      range,
      damage,
      criticalDamage,
      criticalChance,
      energy,
      description,
      sprite,
      requiresTargeting,
      minRange,
      maxRange,
      effectsLeft,
      effectsRight,
      healingAmount,
      canHeal,
      blockAmount,
      poisonAmount,
      oncePerBattle,
      energyGainOnUse,
      drawAmountOnUse,
      soundCategory,
      strength,
      selfDamage,
    });
  }

  get name() {
    return this.#name;
  }

  get range() {
    return this.#range;
  }

  get damage() {
    return this.#damage;
  }

  get criticalDamage() {
    return this.#criticalDamage;
  }

  get criticalChance() {
    return this.#criticalChance;
  }

  get energy() {
    return this.#energy;
  }

  get sprite() {
    return this.#sprite;
  }

  get requiresTargeting() {
    return this.#requiresTargeting;
  }

  // Getter for #minRange
  get minRange() {
    return this.#minRange;
  }

  // Getter for #maxRange
  get maxRange() {
    return this.#maxRange;
  }

  // Getter for #effectsLeft
  get effectsLeft() {
    return this.#effectsLeft;
  }

  // Getter for #effectsRight
  get effectsRight() {
    return this.#effectsRight;
  }

  get description() {
    return this.#description;
  }

  get healingAmount() {
    return this.#healingAmount;
  }

  get level() {
    return this.#level;
  }

  get canHeal() {
    return this.#canHeal;
  }

  get blockAmount() {
    return this.#blockAmount;
  }

  get poisonAmount() {
    return this.#poisonAmount;
  }

  get energyGainOnUse() {
    return this.#energyGainOnUse;
  }

  get drawAmountOnUse() {
    return this.#drawAmountOnUse;
  }

  get oncePerBattle() {
    return this.#oncePerBattle;
  }

  get wasUsed() {
    return this.#wasUsed;
  }

  get soundCategory() {
    console.log(`soundCategory for weapon: ${this.#soundCategory}`);

    return this.#soundCategory;
  }

  get strength() {
    return this.#strength;
  }

  get selfDamage() {
    return this.#selfDamage;
  }

  set canHeal(value) {
    console.log("Setting canHeal:", value);

    this.#canHeal = value;
  }

  set energy(value) {
    this.#energy = value;
  }

  set damage(value) {
    this.#damage = value;
  }

  set criticalDamage(value) {
    this.#criticalDamage = value;
  }

  set criticalChance(value) {
    this.#criticalChance = value;
  }

  set healingAmount(value) {
    console.log("setting healingAmount:", value);

    this.#healingAmount = value;
  }

  set blockAmount(value) {
    this.#blockAmount = value;
  }

  set poisonAmount(value) {
    this.#poisonAmount = value;
  }

  set wasUsed(value) {
    this.#wasUsed = value === true;
  }

  possibleTargets() {
    if (this.damage <= 0) return [];

    if (player.canTargetAnyEnemy(this)) {
      return enemies
        .map((enemy, index) => (enemy.isDead() ? null : index))
        .filter((index) => index !== null);
    }

    if (!this.requiresTargeting) return [this.#minRange];

    const displayTargets = [];
    for (let index = this.#minRange; index <= this.#maxRange; index++) {
      if (!enemies[index]?.isDead?.()) {
        displayTargets.push(index);
      }
    }

    return displayTargets;
  }

  calculateDamage(
    enemyIndex,
    damageModifier,
    critChanceModifier,
    critDamageModifier,
    poisonModifier
  ) {
    this.#wasUsed = true;

    if (this.#strength > 0) {
      player.increaseStrength(this.#strength);
      player.updateStrengthDisplay();
    }

    if (this.damage == 0 && this.criticalDamage == 0)
      return {
        startIndex: 0,
        isCritical: false,
        damages: [],
      };

    const isCritical =
      !player.critsDisabled &&
      Math.random() * 100 < this.criticalChance + critChanceModifier; // Random chance for critical hit

    const baseDamage = isCritical ? this.criticalDamage : this.damage;

    const flatModifier =
      (isCritical ? critDamageModifier : damageModifier) + player.strength;

    const percentModifier = isCritical
      ? player.critDamagePercentModifier || 0
      : player.damagePercentModifier || 0;

    const damage = Math.floor(
      (baseDamage + flatModifier) * (1 + percentModifier / 100)
    );

    if (isCritical && player.equippedRelics.includes("Sharp Focus")) {
      console.log("Sharp focus activated");

      sharpFocus(player);
    }

    let startIndex = enemyIndex - this.#effectsLeft.length;
    let leftOffset = 0;
    if (startIndex < 0) {
      leftOffset = Math.abs(startIndex);
      startIndex = 0;
    }

    let endIndex = enemyIndex + this.#effectsRight.length;
    let rightOffset = this.#effectsRight.length;
    if (endIndex >= enemies.length) {
      rightOffset = endIndex - enemies.length + 1;
      rightOffset = this.#effectsRight.length - rightOffset;
      endIndex = enemies.length - 1;
    }

    let factors = [
      ...this.#effectsLeft.slice(leftOffset),
      1,
      ...this.#effectsRight.slice(0, rightOffset),
    ];
    let damages = factors.map((factor) => factor * damage);

    damages = damages.map((damage, index) => {
      const targetEnemy = enemies[startIndex + index];
      const previewBlock = targetEnemy.currentBlock || 0;

      this.applyPoisonToEnemy(targetEnemy, poisonModifier);

      let blocked = Math.min(previewBlock, damage);

      targetEnemy.removeBlock(blocked);

      return Math.max(0, damage - blocked);
    });

    if (damage > 0 && player.equippedRelics.includes("Fist of Bulwark")) {
      fistOfBulwark();
    }

    return {
      startIndex,
      isCritical,
      damages,
    };
  }

  getWeaponInfo() {
    let getters = getAllGetters(this);
    let info = {
      className: this.__proto__.constructor.name,
    };
    for (let getter in getters) {
      info[getter] = getters[getter].call(this);
    }
    return info;
  }
  loadFromWeaponInfo(info) {
    this.#name = info.name;
    this.#level = info.level;
    this.#range = info.range;
    this.#damage = info.damage;
    this.#criticalDamage = info.criticalDamage;
    this.#criticalChance = info.criticalChance;
    this.#energy = info.energy;
    this.#sprite = info.sprite;
    this.#requiresTargeting = info.requiresTargeting;
    this.#minRange = info.minRange;
    this.#maxRange = info.maxRange;
    this.#description = info.description;
    this.#canHeal = info.canHeal;
    this.#blockAmount = info.blockAmount;
    this.#poisonAmount = info.poisonAmount;
    this.#oncePerBattle = info.oncePerBattle || false;
    this.#energyGainOnUse = info.energyGainOnUse;
    this.#drawAmountOnUse = info.drawAmountOnUse || 0;
    this.#soundCategory = info.soundCategory;
    this.#strength = info.strength;
    this.#selfDamage = info.selfDamage;

    let effectsLeft = info.effectsLeft;
    if (!Array.isArray(effectsLeft)) {
      info.effectsLeft = parseInt(info.effectsLeft);
      if (isNaN(effectsLeft) || effectsLeft == 0) effectsLeft = [];
      else effectsLeft = [...new Array(effectsLeft)].map((e) => 1);
    }
    this.#effectsLeft = effectsLeft;

    let effectsRight = info.effectsRight;
    if (!Array.isArray(effectsRight)) {
      effectsRight = parseInt(effectsRight);
      if (isNaN(effectsRight) || effectsRight == 0) effectsRight = [];
      else effectsRight = [...new Array(effectsRight)].map((e) => 1);
    }
    this.#effectsRight = effectsRight;

    this.#healingAmount = info.healingAmount || 0;

    this.#level = info.level || 1;
    this.#wasUsed = false;
  }

  calculateHealing(damages) {
    if (!this.#canHeal) {
      return 0;
    }
    if (!Array.isArray(this.#healingAmount)) {
      return this.#healingAmount;
    }
    if (this.#healingAmount.length == 1) {
      let totalDamage = damages.reduce((c, e) => c + e, 0);
      return Math.floor((this.#healingAmount[0] * totalDamage) / 100);
    }
    let ttlHealing = 0;
    for (let i = 0; i < this.#healingAmount.length; i++) {
      let currentHealing = this.#healingAmount[i];
      let currentDamage = 0;
      if (i < damages.length) {
        currentDamage = damages[i];
      }
      ttlHealing += Math.floor((currentDamage * currentHealing) / 100);
    }
    return ttlHealing;
  }

  applyHealing(target) {
    if (this.#healingAmount > 0) {
      target.health(this.#healingAmount);
      console.log(
        `${this.name} healed the player for ${this.#healingAmount} health.`
      );
    }
    this.#wasUsed = true;
  }

  applyPoisonToEnemy(targetEnemy, poisonModifier = 0) {
    const basePoison = this.#poisonAmount ?? 0;
    const totalPoison =
      basePoison > 0 ? basePoison + poisonModifier : basePoison;

    console.log("Applying poison to enemy: ", totalPoison);

    if (totalPoison > 0) {
      targetEnemy.addPoisonFromPlayer(totalPoison);
      targetEnemy.updatePoisonDisplay();
    }
  }

  applyUpgrades(weaponInfo) {
    console.log(
      "applyUpgrades() should be overridden in each weapon subclass."
    );
  }

  upgrade() {
    this.#level += 1;

    let weaponInfo = this.getWeaponInfo();
    this.applyUpgrades(weaponInfo);
    this.loadFromWeaponInfo(weaponInfo);
  }
}

class SmallHealthPotion extends Weapons {
  constructor() {
    super(
      "Small Health Potion",
      1,
      "Healing",
      0,
      0,
      0,
      1,
      "Click to heal the player. Can only be used once per battle.",
      "Assets/healthPotion.png",
      false,
      0,
      0,
      0,
      0,
      5,
      true,
      0,
      0,
      true,
      0,
      0,
      "HealSound"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.healingAmount = 10;
        break;
      case 3:
        weaponInfo.healingAmount = 10;
        weaponInfo.oncePerBattle = false;
        weaponInfo.description = "Click to heal the player.";
        break;
    }
  }

  applyEffects(target) {
    this.applyHealing(target);
  }
}

class BigHealthPotion extends Weapons {
  constructor() {
    super(
      "Big Health Potion",
      1,
      "Healing",
      0,
      0,
      0,
      2,
      "Click to heal the player. Can only be used once per battle.",
      "Assets/bigHealthPotion.png",
      false,
      0,
      0,
      0,
      0,
      10,
      true,
      0,
      0,
      true,
      0,
      0,
      "HealSound"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.healingAmount = 20;
        break;
      case 3:
        weaponInfo.healingAmount = 25;
        weaponInfo.oncePerBattle = false;
        weaponInfo.description = "Click to heal the player.";
        break;
    }
  }
  applyEffects(target) {
    this.applyHealing(target);
  }
}

class BasicSword extends Weapons {
  constructor() {
    super(
      "Basic Sword",
      1,
      "Melee",
      25,
      40,
      25,
      1,
      "Can only target the first enemy, click to instanty use weapon.",
      "Assets/sword.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      false,
      0,
      0,
      "SwordSlash"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 30;
        weaponInfo.criticalDamage = 50;
        weaponInfo.criticalChance = 30;
        break;
      case 3:
        weaponInfo.damage = 35;
        weaponInfo.criticalDamage = 60;
        weaponInfo.criticalChance = 40;
        break;
    }
  }
}

class BasicAxe extends Weapons {
  constructor() {
    super(
      "Basic Axe",
      1,
      "Melee",
      60,
      90,
      35,
      2,
      "Can target the closest two enemies, click weapon first, then the enemy you want to hit.",
      "Assets/waraxe.png",
      true,
      0,
      1,
      0,
      0,
      0,
      false,
      0,
      0,
      false,
      0,
      0,
      "SwordSlash"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 75;
        weaponInfo.criticalDamage = 115;
        weaponInfo.criticalChance = 40;
        break;
      case 3:
        weaponInfo.damage = 90;
        weaponInfo.criticalDamage = 140;
        weaponInfo.criticalChance = 45;
        break;
    }
  }
}

class BasicSpear extends Weapons {
  constructor() {
    super(
      "Basic Spear",
      1,
      "Medium",
      20,
      35,
      15,
      1,
      "Can only target the first enemy and pierces one enemy, click to instantly use weapon.",
      "Assets/spear.png",
      false,
      0,
      0,
      0,
      [1],
      0,
      false,
      0,
      0,
      false,
      0,
      0,
      "SwordSlash"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 25;
        weaponInfo.criticalDamage = 50;
        weaponInfo.criticalChance = 20;
        weaponInfo.effectsRight = [1, 1];
        weaponInfo.description =
          "Can only target the first enemy and pierces two enemies, click to instantly use weapon.";

        break;
      case 3:
        weaponInfo.damage = 30;
        weaponInfo.criticalDamage = 60;
        weaponInfo.criticalChance = 30;
        weaponInfo.effectsRight = [1, 1, 1];
        weaponInfo.description =
          "Can only target the first enemy and pierces three enemies, click to instantly use weapon.";

        // weaponInfo.canHeal = true;
        // weaponInfo.healingAmount = [20, 10, 5];
        break;
    }
  }
}

class BasicBow extends Weapons {
  constructor() {
    super(
      "Basic Bow",
      1,
      "Far",
      20,
      50,
      15,
      1,
      "Can target any enemy, click weapon first, then the enemy you want to hit.",
      "Assets/bow.png",
      true,
      0,
      5,
      0,
      0,
      0,
      false,
      0,
      0,
      false,
      0,
      0,
      "BowSound"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 25;
        weaponInfo.criticalDamage = 60;
        weaponInfo.criticalChance = 20;
        break;
      case 3:
        weaponInfo.damage = 30;
        weaponInfo.criticalDamage = 75;
        weaponInfo.criticalChance = 25;
        break;
    }
  }
}

class PoisonArrow extends Weapons {
  constructor() {
    super(
      "Poison Arrow",
      1,
      "Far",
      10,
      35,
      20,
      1,
      "Can target any enemy, click weapon first, then the enemy you want to hit.",
      "Assets/poisonArrow.png",
      true,
      0,
      6,
      0,
      0,
      0,
      false,
      0,
      10,
      false,
      0,
      0,
      "BowSound"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 15;
        weaponInfo.criticalDamage = 45;
        weaponInfo.criticalChance = 25;
        weaponInfo.poisonAmount += 5;
        break;
      case 3:
        weaponInfo.damage = 20;
        weaponInfo.criticalDamage = 55;
        weaponInfo.criticalChance = 30;
        weaponInfo.poisonAmount += 5;
        break;
    }
  }
}

class VampiricDagger extends Weapons {
  constructor() {
    super(
      "Vampiric Dagger",
      1,
      "Melee",
      10,
      50,
      25,
      1,
      "Can only target the first enemy and has 20% lifesteal, click to instantly use weapon.",
      "Assets/VampiricDagger.png",
      false,
      0,
      0,
      0,
      0,
      [20],
      true,
      0,
      0,
      false,
      0,
      0,
      "SwordSlash"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 20;
        weaponInfo.criticalDamage = 60;
        break;
      case 3:
        weaponInfo.damage = 30;
        weaponInfo.criticalDamage = 70;
        weaponInfo.criticalChance = 35;
        break;
    }
  }
}

class Bomb extends Weapons {
  constructor() {
    super(
      "Bomb",
      1,
      "Far",
      30,
      45,
      20,
      2,
      "Can't target the first enemy and hits also the enemy to the left and to the right, click weapon first, then the enemy you want to hit.",
      "Assets/bomb.png",
      true,
      1,
      4,
      [1],
      [1],
      0,
      false,
      0,
      0,
      false,
      0,
      0,
      "BombSound"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 40;
        weaponInfo.criticalDamage = 55;
        weaponInfo.criticalChance = 25;
        break;
      case 3:
        weaponInfo.damage = 50;
        weaponInfo.criticalDamage = 65;
        weaponInfo.criticalChance = 35;
        break;
    }
  }
}

class Herosword extends Weapons {
  constructor() {
    super(
      "Hero Sword",
      1,
      "Melee",
      15,
      65,
      60,
      1,
      "Can only target the first enemy, click to instanty use weapon.",
      "Assets/herosword.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      false,
      0,
      0,
      "SwordSlash"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 20;
        weaponInfo.criticalDamage = 70;
        weaponInfo.criticalChance = 65;
        break;
      case 3:
        weaponInfo.damage = 30;
        weaponInfo.criticalDamage = 80;
        weaponInfo.criticalChance = 70;
        break;
    }
  }
}

class Dagger extends Weapons {
  constructor() {
    super(
      "Dagger",
      1,
      "Melee",
      5,
      70,
      40,
      1,
      "Can only target the first enemy, click to instantly use weapon.",
      "Assets/dagger.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      false,
      0,
      0,
      "SwordSlash"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 10;
        weaponInfo.criticalDamage = 80;
        weaponInfo.criticalChance = 50;
        break;
      case 3:
        weaponInfo.damage = 20;
        weaponInfo.criticalDamage = 90;
        weaponInfo.criticalChance = 65;
        break;
    }
  }
}

class PoisonDagger extends Weapons {
  constructor() {
    super(
      "Poison Dagger",
      1,
      "Melee",
      5,
      55,
      35,
      1,
      "Can only target the first enemy and applies poison, click to instantly use weapon.",
      "Assets/poisonDagger.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      0,
      10,
      false,
      0,
      0,
      "SwordSlash"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.criticalDamage = 65;
        weaponInfo.criticalChance = 45;
        weaponInfo.poisonAmount += 5;
        break;
      case 3:
        weaponInfo.criticalDamage = 80;
        weaponInfo.criticalChance = 60;
        weaponInfo.poisonAmount += 5;
        break;
    }
  }
}

class Spearblade extends Weapons {
  constructor() {
    super(
      "Spearblade",
      1,
      "Melee",
      45,
      65,
      30,
      2,
      "Damages the first two enemies, click to instantly use weapon.",
      "Assets/spearblade.png",
      false,
      0,
      0,
      0,
      [1],
      0,
      false,
      0,
      0,
      false,
      0,
      0,
      "SwordSlash"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 55;
        weaponInfo.criticalDamage = 75;
        weaponInfo.criticalChance = 40;
        break;
      case 3:
        weaponInfo.damage = 65;
        weaponInfo.criticalDamage = 90;
        weaponInfo.criticalChance = 50;
        break;
    }
  }
}

class Crossbow extends Weapons {
  constructor() {
    super(
      "Crossbow",
      1,
      "Far",
      20,
      40,
      35,
      1,
      "Can target any enemy and also damages the enemy behind, click weapon first, then the enemy you want to hit.",
      "Assets/crossbow.png",
      true,
      0,
      4,
      0,
      [1],
      0,
      false,
      0,
      0,
      false,
      0,
      0,
      "BowSound"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 25;
        weaponInfo.criticalDamage = 45;
        weaponInfo.criticalChance = 40;
        break;
      case 3:
        weaponInfo.damage = 35;
        weaponInfo.criticalDamage = 55;
        weaponInfo.criticalChance = 55;
        break;
    }
  }
}

class ThorsHammer extends Weapons {
  constructor() {
    super(
      "Thor's Hammer",
      1,
      "Far",
      50,
      80,
      30,
      2,
      "Damages all enemies, click to instantly use weapon.",
      "Assets/ThorsHammer.png",
      false,
      0,
      5,
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      0,
      false,
      0,
      0,
      false,
      0,
      0,
      "Thunder"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 60;
        weaponInfo.criticalDamage = 90;
        weaponInfo.criticalChance = 35;
        break;
      case 3:
        weaponInfo.damage = 75;
        weaponInfo.criticalDamage = 100;
        weaponInfo.criticalChance = 45;
        break;
    }
  }
}

class Lightning extends Weapons {
  constructor() {
    super(
      "Lightning Strike",
      1,
      "Far",
      20,
      150,
      3,
      1,
      "Also hits the enemy to the left and to the right, click weapon first, then the enemy you want to hit.",
      "Assets/Lightning.png",
      true,
      0,
      5,
      [1],
      [1],
      0,
      false,
      0,
      0,
      false,
      0,
      0,
      "Lightning"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 30;
        weaponInfo.criticalDamage = 200;
        weaponInfo.criticalChance = 4;
        break;
      case 3:
        weaponInfo.damage = 40;
        weaponInfo.criticalDamage = 250;
        weaponInfo.criticalChance = 5;
        break;
    }
  }
}

class Stone extends Weapons {
  constructor() {
    super(
      "Stone",
      3,
      "Far",
      10,
      20,
      30,
      1,
      "Can hit any enemy, click weapon first, then the enemy you want to hit.",
      "Assets/Stone.png",
      true,
      0,
      5,
      0,
      0,
      0,
      false,
      0,
      0,
      false,
      0,
      0,
      "Stone"
    );
  }
}

class BasicShield extends Weapons {
  constructor() {
    super(
      "Basic Shield",
      1,
      "Block",
      0,
      0,
      0,
      1,
      "Block incoming damage. Block is removed at the beginning of your next turn.",
      "Assets/Shield.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      5,
      0,
      false,
      0,
      0,
      "ShieldSound"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.blockAmount = 10;
        break;
      case 3:
        weaponInfo.blockAmount = 15;
        break;
    }
  }
}

class MasterShield extends Weapons {
  constructor() {
    super(
      "Master Shield",
      1,
      "Block",
      0,
      0,
      0,
      2,
      "Block incoming damage. Block is removed at the beginning of your next turn.",
      "Assets/masterShield.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      15,
      0,
      false,
      0,
      0,
      "ShieldSound"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.blockAmount = 25;
        break;
      case 3:
        weaponInfo.blockAmount = 35;
        break;
    }
  }
}

class SpikedShield extends Weapons {
  constructor() {
    super(
      "Spiked Shield",
      1,
      "Melee",
      15,
      20,
      30,
      2,
      "Deals damage to the first enemy and blocks incoming damage. Block is removed at the beginning of your next turn.",
      "Assets/spikedShield.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      10,
      0,
      false,
      0,
      0,
      "ShieldSound"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 20;
        weaponInfo.criticalDamage = 30;
        weaponInfo.criticalChance = 35;
        weaponInfo.blockAmount = 15;
        break;
      case 3:
        weaponInfo.damage = 30;
        weaponInfo.criticalDamage = 40;
        weaponInfo.criticalChance = 40;
        weaponInfo.blockAmount = 25;
        break;
    }
  }
}

class TowerShield extends Weapons {
  constructor() {
    super(
      "Tower Shield",
      1,
      "Block",
      0,
      0,
      0,
      1,
      "Blocks incoming damage. Block is removed at the beginning of your next turn.",
      "Assets/towerShield.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      10,
      0,
      false,
      0,
      0,
      "ShieldSound"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.blockAmount = 15;
        break;
      case 3:
        weaponInfo.blockAmount = 20;
        break;
    }
  }
}

class SurvivalPotion extends Weapons {
  constructor() {
    super(
      "Survival Potion",
      1,
      "Healing & Block",
      0,
      0,
      0,
      2,
      "Heals you and blocks incoming damage. Block is removed at the beginning of your next turn. Can only be used once per battle",
      "Assets/purplePotion.png",
      false,
      0,
      0,
      0,
      0,
      10,
      true,
      15,
      0,
      true,
      0,
      0,
      "HealSound"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.healingAmount = 15;
        weaponInfo.blockAmount = 20;
        break;
      case 3:
        weaponInfo.healingAmount = 20;
        weaponInfo.blockAmount = 25;
        weaponInfo.oncePerBattle = false;
        weaponInfo.description =
          "Heals you and blocks incoming damage. Block is removed at the beginning of your next turn.";
        break;
    }
  }
}

class PoisonPotion extends Weapons {
  constructor() {
    super(
      "Poison Potion",
      1,
      "Far",
      5,
      10,
      35,
      2,
      "Damages and applies poison to all enemies, click to instantly use weapon.",
      "Assets/poisonPotion.png",
      false,
      0,
      0,
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      0,
      false,
      0,
      10,
      false,
      0,
      0,
      "PotionSound"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.poisonAmount += 5;
        break;
      case 3:
        weaponInfo.poisonAmount += 5;
        break;
    }
  }
}

class LightningShield extends Weapons {
  constructor() {
    super(
      "Lightning Shield",
      1,
      "Block",
      0,
      0,
      0,
      0,
      "Block incoming damage. Block is removed at the beginning of your next turn.",
      "Assets/lightningShield.png",
      false,
      0,
      0,
      0,
      0,
      0,
      0,
      5,
      0,
      false,
      0,
      0,
      "ShieldSound"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.blockAmount = 10;
        break;
      case 3:
        weaponInfo.blockAmount = 15;
        break;
    }
  }
}

class GoldSword extends Weapons {
  #damageModifier = 0.5;
  #critDamageModifier = 1;
  get damage() {
    return Math.floor(globalSettings.playerGold * this.#damageModifier);
  }
  get criticalDamage() {
    return Math.floor(globalSettings.playerGold * this.#critDamageModifier);
  }
  constructor() {
    super(
      "Golden Sword",
      1,
      "Melee",
      0,
      0,
      20,
      2,
      "Deals more damage depending on the amount of gold you have. Can target only the first enemy, click to instantly use weapon.",
      "Assets/goldSword.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      false,
      0,
      0,
      "SwordSlash"
    );
  }
  loadFromWeaponInfo(info) {
    this.applyUpgrades(info);
    super.loadFromWeaponInfo(...arguments);
  }
  applyUpgrades(weaponInfo) {
    switch (weaponInfo.level) {
      case 1:
        break;
      case 2:
        this.#damageModifier = 0.75;
        this.#critDamageModifier = 1.25;
        weaponInfo.criticalChance = 25;
        break;
      case 3:
        this.#damageModifier = 1;
        this.#critDamageModifier = 1.5;
        weaponInfo.criticalChance = 30;
        break;
    }
  }
}

class GoldShield extends Weapons {
  #blockModifier = 0.1;

  get blockAmount() {
    return Math.floor(globalSettings.playerGold * this.#blockModifier);
  }

  constructor() {
    super(
      "Golden Shield",
      1,
      "Block",
      0,
      0,
      0,
      2,
      "Blocks more depending on the amount of gold you have. Block is removed at the beginning of you next turn.",
      "Assets/goldShield.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      false,
      0,
      0,
      "ShieldSound"
    );
  }
  loadFromWeaponInfo(info) {
    this.applyUpgrades(info);
    super.loadFromWeaponInfo(...arguments);
  }
  applyUpgrades(weaponInfo) {
    switch (weaponInfo.level) {
      case 1:
        break;
      case 2:
        this.#blockModifier = 0.15;
        break;
      case 3:
        this.#blockModifier = 0.2;
        break;
    }
  }
}

class ChannelEnergy extends Weapons {
  constructor() {
    super(
      "Channel Energy",
      1,
      "Utility",
      0,
      0,
      0,
      1,
      "Click to get energy. Can only be used once per battle.",
      "Assets/channelEnergy.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      true,
      2,
      0,
      "ChargeSound"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.energyGainOnUse = 3;
        break;
      case 3:
        weaponInfo.energyGainOnUse = 3;
        weaponInfo.oncePerBattle = false;
        weaponInfo.description = "Click to get energy.";
        break;
    }
  }
}

class Restock extends Weapons {
  constructor() {
    super(
      "Restock",
      1,
      "Utility",
      0,
      0,
      0,
      1,
      "Click to draw new weapons.",
      "Assets/restock.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      false,
      0,
      2,
      "ShieldSound"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.drawAmountOnUse = 3;
        break;
      case 3:
        weaponInfo.drawAmountOnUse = 4;
        break;
    }
  }
}

class SwiftSword extends Weapons {
  constructor() {
    super(
      "Swift Sword",
      1,
      "Melee",
      25,
      50,
      30,
      1,
      "Can only target the first enemy, click to instantly use weapon and draw one.",
      "Assets/swiftSword.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      false,
      0,
      1,
      "SwordSlash"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 30;
        weaponInfo.criticalDamage = 60;
        weaponInfo.criticalChance = 35;
        break;
      case 3:
        weaponInfo.damage = 35;
        weaponInfo.criticalDamage = 70;
        weaponInfo.drawAmountOnUse = 2;
        weaponInfo.description =
          "Can only target the first enemy, click to instantly use weapon and draw two.";
    }
  }
}

class SwiftShield extends Weapons {
  constructor() {
    super(
      "Swift Shield",
      1,
      "Block",
      0,
      0,
      0,
      1,
      "Block incoming damage and draw one. Block is removed at the beginning of you next turn.",
      "Assets/swiftShield.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      5,
      0,
      false,
      0,
      1,
      "ShieldSound"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.blockAmount = 10;
        break;
      case 3:
        weaponInfo.blockAmount = 15;
        weaponInfo.drawAmountOnUse = 2;
        weaponInfo.description =
          "Block incoming damage and draw one. Block is removed at the beginning of you next turn.";
    }
  }
}

class BattleFocus extends Weapons {
  constructor() {
    super(
      "Battle Focus",
      1,
      "Utility",
      0,
      0,
      0,
      2,
      "Click to get energy and draw one. Can only be used once per battle.",
      "Assets/battleFocus.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      true,
      3,
      1,
      "ChargeSound"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.drawAmountOnUse = 2;
        weaponInfo.description =
          "Click to get energy and draw 2. Can only be used once per battle.";
        break;
      case 3:
        weaponInfo.energyGainOnUse = 4;
        weaponInfo.oncePerBattle = false;
        weaponInfo.description = "Click to get energy and draw 2.";
        break;
    }
  }
}

class ThrowingKnife extends Weapons {
  constructor() {
    super(
      "Throwing Knife",
      1,
      "Far",
      10,
      30,
      15,
      0,
      "Can hit any enemy, click weapon first, then the enemy you want to hit.",
      "Assets/throwingKnife.png",
      true,
      0,
      5,
      0,
      0,
      0,
      false,
      0,
      0,
      false,
      0,
      0,
      "SwordSlash"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 15;
        weaponInfo.criticalDamage = 40;
        break;
      case 3:
        weaponInfo.damage = 20;
        weaponInfo.criticalDamage = 45;
        weaponInfo.criticalChance = 20;
        break;
    }
  }
}

class BigBlade extends Weapons {
  constructor() {
    super(
      "Big Blade",
      1,
      "Melee",
      70,
      50,
      30,
      3,
      "Can only target the first enemy, click to instantly use weapon and gain 1 energy.",
      "Assets/blade.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      false,
      1,
      0,
      "SwordSlash"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 80;
        weaponInfo.criticalDamage = 55;
        weaponInfo.criticalChance = 25;
        break;
      case 3:
        weaponInfo.damage = 90;
        weaponInfo.criticalDamage = 60;
        weaponInfo.criticalChance = 20;
        break;
    }
  }
}

class Hammer extends Weapons {
  constructor() {
    super(
      "Hammer",
      1,
      "Melee",
      75,
      15,
      10,
      2,
      "Can only target the first enemy, click to instantly use weapon.",
      "Assets/hammer.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      false,
      0,
      0,
      "HammerSound"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 90;
        weaponInfo.criticalDamage = 10;
        weaponInfo.criticalChance = 15;
        break;
      case 3:
        weaponInfo.damage = 110;
        weaponInfo.criticalDamage = 5;
        weaponInfo.criticalChance = 20;
        break;
    }
  }
}

class Macuahuitl extends Weapons {
  constructor() {
    super(
      "Macuahuitl",
      1,
      "Melee",
      15,
      30,
      10,
      1,
      "Can only target the first enemy, click to instantly use weapon and gain 1 energy.",
      "Assets/mayan.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      false,
      1,
      0,
      "SwordSlash"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 20;
        weaponInfo.criticalDamage = 40;
        break;
      case 3:
        weaponInfo.damage = 25;
        weaponInfo.criticalDamage = 35;
        weaponInfo.criticalChance = 50;
    }
  }
}

class BrokenBlade extends Weapons {
  constructor() {
    super(
      "Broken Blade",
      1,
      "Melee",
      35,
      60,
      20,
      1,
      "Can only target the first enemy, click to instantly use weapon. Can only be used once per battle.",
      "Assets/brokenBlade.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      true,
      0,
      0,
      "SwordSlash"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 40;
        weaponInfo.criticalDamage = 70;
        weaponInfo.criticalChance = 25;
        break;
      case 3:
        weaponInfo.damage = 45;
        weaponInfo.criticalDamage = 80;
        weaponInfo.criticalChance = 30;
        weaponInfo.poisonAmount += 5;
        break;
    }
  }
}

class RageAxe extends Weapons {
  constructor() {
    super(
      "Rage Axe",
      1,
      "Melee",
      20,
      35,
      30,
      1,
      "Can only target the first enemy, click to gain strength and instantly use weapon.",
      "Assets/rageAxe.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      false,
      0,
      0,
      "SwordSlash",
      5
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 25;
        weaponInfo.criticalDamage = 45;
        weaponInfo.criticalChance = 35;
        weaponInfo.strength = 10;
        break;
      case 3:
        weaponInfo.damage = 30;
        weaponInfo.criticalDamage = 55;
        weaponInfo.criticalChance = 40;
        weaponInfo.strength = 15;
        break;
    }
  }
}

class BerserkersBrew extends Weapons {
  constructor() {
    super(
      "Berserkers Brew",
      1,
      "Utility",
      0,
      0,
      0,
      1,
      "Use to gain strength and take selfdamage. Can only be used once per battle.",
      "Assets/berserkersBrew.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      true,
      0,
      0,
      "ChargeSound",
      10,
      10
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.strength = 15;
        weaponInfo.selfDamage = 7;
        break;
      case 3:
        weaponInfo.strength = 20;
        weaponInfo.selfDamage = 5;
    }
  }
}

class RagingDagger extends Weapons {
  constructor() {
    super(
      "Raging Dagger",
      1,
      "Melee",
      3,
      15,
      60,
      0,
      "Can only target the first enemy, click to gain strength and instantly use weapon.",
      "Assets/Sword.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      0,
      0,
      false,
      0,
      0,
      "SwordSlash",
      5
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.criticalDamage = 25;
        weaponInfo.strength = 10;
        break;
      case 3:
        weaponInfo.criticalDamage = 40;
        weaponInfo.criticalChance = 70;
    }
  }
}

class BerserkersSpear extends Weapons {
  constructor() {
    super(
      "Berserkers Spear",
      1,
      "Medium",
      30,
      50,
      30,
      1,
      "Can only target the first enemy and pierces one enemy, click to get strength, instantly use weapon and take selfdamage.",
      "Assets/berserkersSpear.png",
      false,
      0,
      0,
      0,
      [1],
      0,
      false,
      0,
      0,
      false,
      0,
      0,
      "SwordSlash",
      5,
      10
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 35;
        weaponInfo.criticalDamage = 60;
        weaponInfo.criticalChance = 35;
        weaponInfo.effectsRight = [1, 1];
        weaponInfo.description =
          "Can only target the first enemy and pierces two enemies, click to instantly use weapon, take selfdamage and get strength.";
        break;
      case 3:
        weaponInfo.strength = 10;
        weaponInfo.selfDamage = 5;
        weaponInfo.effectsRight = [1, 1, 1];
        weaponInfo.description =
          "Can only target the first enemy and pierces three enemies, click to instantly use weapon, take selfdamage and get strength.";
        break;
    }
  }
}

class Leechfang extends Weapons {
  constructor() {
    super(
      "Leechfang",
      1,
      "Melee",
      50,
      60,
      10,
      1,
      "Can only target the first enemy, click to instantly use weapon and take selfdamage.",
      "Assets/leechfang.png",
      false,
      0,
      0,
      0,
      0,
      [20],
      true,
      0,
      0,
      false,
      0,
      0,
      "SwordSlash",
      0,
      15
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage = 60;
        weaponInfo.criticalDamage = 70;
        weaponInfo.criticalChance = 15;
        weaponInfo.healingAmount = [25];
        break;
      case 3:
        weaponInfo.damage = 70;
        weaponInfo.criticalDamage = 80;
        weaponInfo.criticalChance = 20;
        weaponInfo.healingAmount = [30];
        break;
    }
  }
}

class DevWeapon extends Weapons {
  constructor() {
    super(
      "Dev Weapon",
      1,
      "Melee",
      1000,
      1000,
      0,
      0,
      "Instakill",
      "Assets/morningstar.png",
      false,
      0,
      0,
      0,
      [1, 1, 1, 1, 1, 1],
      0,
      false,
      0
    );
  }
}

class DevShield extends Weapons {
  constructor() {
    super(
      "Dev Shield",
      1,
      0,
      0,
      0,
      0,
      0,
      "Block",
      "Assets/lightningShield.png",
      false,
      0,
      0,
      0,
      0,
      0,
      false,
      1000
    );
  }
}

class DevBow extends Weapons {
  constructor() {
    super(
      "Dev Bow",
      1,
      "Far",
      1000,
      0,
      0,
      0,
      "Instakill",
      "Assets/bow.png",
      true,
      0,
      6
    );
  }
}

class DevSword extends Weapons {
  constructor() {
    super(
      "Dev Sword",
      1,
      "Melee",
      1000,
      0,
      0,
      0,
      0,
      "Assets/Sword.png",
      false,
      0,
      0,
      0,
      0,
      0
    );
  }
}

// class WrappedWeapon extends Weapons {
//   #wrappedWeapon;

//   get damage() {
//     return this.#wrappedWeapon.damage;
//   }
//   constructor(wrappedWeapon) {
//     this.#wrappedWeapon = wrappedWeapon;
//   }

//   calculateDamage() {
//     return this.#wrappedWeapon.calculateDamage(...arguments);
//   }

//   applyPoisonToEnemy() {
//     return this.#wrappedWeapon.applyPoisonToEnemy(...arguments);
//   }
// }

// class SlimyWeapon extends WrappedWeapon {
//   constructor(wrappedWeapon) {
//     super(wrappedWeapon);
//   }

//   calculateDamage() {
//     if (Math.random() < 0.3) return 0;
//     return super.calculateDamage();
//   }
// }

// new SlimyWeapon(new BasicSword());

function getAvailableWeapons() {
  return [
    new BasicSword(),
    new BasicAxe(),
    new BasicSpear(),
    new Bomb(),
    new Herosword(),
    new Dagger(),
    new Spearblade(),
    new Crossbow(),
    new SmallHealthPotion(),
    new VampiricDagger(),
    new BasicShield(),
    new MasterShield(),
    new SpikedShield(),
    new SurvivalPotion(),
    new TowerShield(),
    new BasicBow(),
    new PoisonDagger(),
    new PoisonPotion(),
    new GoldSword(),
    new ChannelEnergy(),
    new Restock(),
    new SwiftSword(),
    new GoldShield(),
    new SwiftShield(),
    new BigHealthPotion(),
    new BattleFocus(),
    new ThrowingKnife(),
    new PoisonArrow(),
    new BigBlade(),
    new Hammer(),
    new Macuahuitl(),
    new BrokenBlade(),
    new RageAxe(),
    new BerserkersBrew(),
    new RagingDagger(),
    new BerserkersSpear(),
    new Leechfang(),
  ];
}

const weaponClassMapping = {
  BasicSword,
  BasicAxe,
  BasicSpear,
  Bomb,
  Herosword,
  Dagger,
  Spearblade,
  Crossbow,
  SmallHealthPotion,
  ThorsHammer,
  VampiricDagger,
  Lightning,
  Stone,
  BasicShield,
  MasterShield,
  SpikedShield,
  SurvivalPotion,
  TowerShield,
  BasicBow,
  PoisonDagger,
  PoisonPotion,
  LightningShield,
  GoldSword,
  ChannelEnergy,
  Restock,
  SwiftSword,
  GoldShield,
  SwiftShield,
  BigHealthPotion,
  BattleFocus,
  ThrowingKnife,
  PoisonArrow,
  BigBlade,
  Hammer,
  Macuahuitl,
  BrokenBlade,
  RageAxe,
  DevWeapon,
  BerserkersBrew,
  RagingDagger,
  BerserkersSpear,
  Leechfang,
  DevShield,
  DevBow,
  DevSword,
};

function createWeaponInstanceFromInfo(info) {
  let cls = weaponClassMapping[info.className];
  let instance = new cls();
  instance.loadFromWeaponInfo(info);
  return instance;
}

function displayWeapons(
  player,
  weapons,
  usesTargeting = true,
  containerElementID = "weapons-container",
  showUpgradePreview = false
) {
  const weaponsContainer = document.getElementById(containerElementID);
  weaponsContainer.innerHTML = ""; // Clear previous content if any

  // Loop through weapons and create an image for each
  weapons.forEach((weapon, index) => {
    // Add index parameter here
    const weaponElement = generateWeaponInfo(
      player,
      weapon,
      index,
      weaponsContainer,
      null,
      null,
      null,
      showUpgradePreview
    );

    if (weapon.wasUsed) {
      weaponElement.classList.add("used");
    }

    if (usesTargeting) {
      weaponElement.setAttribute("onmouseenter", "weaponHover(this);");
      weaponElement.setAttribute("onmouseleave", "clearSelection();");

      // Add event listener to use weapon on click
      weaponElement.addEventListener("click", function () {
        useWeapon(index); // Use the correct index
      });
    }
  });
}

function generateWeaponInfo(
  player,
  weapon,
  weaponIndex,
  displayParent,
  display,
  tooltipElement,
  weaponPrice,
  showUpgradePreview = false
) {
  if (displayParent && !display) {
    display = document.createElement("div");
    displayParent.appendChild(display);
    display.classList.add("weapon");
    display.setAttribute("index", weaponIndex);
  }

  displayParent = display.parentNode;
  display.innerHTML = "";

  // Create an image element for the weapon
  const weaponImage = document.createElement("img");
  weaponImage.src = weapon.sprite;
  weaponImage.alt = weapon.name;
  weaponImage.classList.add("weapon-image", `level-${weapon.level}`);
  display.appendChild(weaponImage);

  var getTooltip = () => {
    if (showUpgradePreview && weapon.level < 3) {
      // Clone and upgrade
      const upgradedWeapon = new weapon.__proto__.constructor();
      upgradedWeapon.loadFromWeaponInfo(weapon.getWeaponInfo());
      upgradedWeapon.upgrade();

      const statBlock = (w) => {
        let html = `<div class="tooltip-block">`;
        html += `<strong>${w.name}</strong> <br>`;
        html += `<strong>Level:</strong> ${w.level}<br>`;
        html += `<strong>Energy Cost:</strong> ${w.energy}<br>`;
        html += `<strong>Range:</strong> ${w.range}<br>`;
        if (w.damage > 0) html += `<strong>Damage:</strong> ${w.damage}<br>`;
        if (w.criticalDamage > 0)
          html += `<strong>Crit Dmg:</strong> ${w.criticalDamage}<br>`;
        if (w.criticalChance > 0)
          html += `<strong>Crit Chance:</strong> ${w.criticalChance}%<br>`;
        if (w.poisonAmount > 0)
          html += `<strong>Poison:</strong> ${w.poisonAmount}<br>`;
        if (w.canHeal) {
          const healing = Array.isArray(w.healingAmount)
            ? w.healingAmount.join("%, ") + "%"
            : w.healingAmount;
          html += `<strong>Healing:</strong> ${healing}<br>`;
        }
        if (w.blockAmount > 0)
          html += `<strong>Block:</strong> ${w.blockAmount}<br>`;
        if (w.energyGainOnUse > 0)
          html += `<strong>Energy Gain:</strong> ${w.energyGainOnUse}<br>`;
        if (w.drawAmountOnUse > 0)
          html += `<strong>Draw:</strong> ${w.drawAmountOnUse}<br>`;
        if (w.strength > 0)
          html += `<strong>Strength:</strong> ${w.strength}<br>`;
        if (w.selfDamage > 0)
          html += `<strong>Selfdamage:</strong> ${w.selfDamage}<br>`;
        html += `${w.description}<br>`;
        html += `</div>`;
        return html;
      };

      return `
      <div class="upgrade-preview-wrapper">
        ${statBlock(weapon)}
        <div class="arrow">→</div>
        ${statBlock(upgradedWeapon)}
      </div>
    `;
    }

    // Fallback: Standard tooltip
    let tooltipString = `          
      <strong>${weapon.name}</strong>  <br>
      <strong>Level:</strong> ${weapon.level} <br>
      <strong>Energy Cost:</strong> ${weapon.energy} <br>
      <strong>Range:</strong> ${weapon.range} <br>`;

    if (weapon.damage > 0) {
      let modifierDisplay = "";
      const totalDamageBuff = player.damageModifier + player.strength;

      if (totalDamageBuff > 0) {
        modifierDisplay = `(+${totalDamageBuff})`;
      }
      if (totalDamageBuff < 0) {
        modifierDisplay = `(${totalDamageBuff})`;
      }
      tooltipString += `<strong>Damage:</strong> ${weapon.damage} ${modifierDisplay} <br>`;
    }

    if (weapon.criticalDamage > 0) {
      let modifierDisplay = "";
      const totalCritDamageBuff = player.critDamageModifier + player.strength;

      if (totalCritDamageBuff > 0) {
        modifierDisplay = `(+${totalCritDamageBuff})`;
      }
      if (totalCritDamageBuff < 0) {
        modifierDisplay = `(${totalCritDamageBuff})`;
      }
      tooltipString += `<strong>Critical Damage:</strong> ${weapon.criticalDamage} ${modifierDisplay} <br>`;
    }

    if (player.critsDisabled) {
      tooltipString += `<strong>Critical Chance:</strong> ❌ Disabled<br>`;
    } else if (weapon.criticalChance > 0) {
      let modifierDisplay = "";
      if (player.critChanceModifier > 0) {
        modifierDisplay = `(+${player.critChanceModifier}%)`;
      }
      tooltipString += `<strong>Critical Chance:</strong> ${weapon.criticalChance}%  ${modifierDisplay}<br>`;
    }

    if (weapon.poisonAmount > 0) {
      let modifierDisplay = "";
      if (player.poisonModifier > 0) {
        modifierDisplay = `(+${player.poisonModifier})`;
      }
      tooltipString += `<strong>Poison:</strong> ${weapon.poisonAmount} ${modifierDisplay} <br>`;
    }

    if (weapon.canHeal) {
      let healingString = "";
      let modifierDisplay = "";
      if (Array.isArray(weapon.healingAmount)) {
        healingString = weapon.healingAmount.join("%, ") + "%";

        if (player.lifestealModifier > 0 && weapon.damage > 0) {
          modifierDisplay = `(+${player.lifestealModifier}%)`;
        }
      } else {
        healingString = weapon.healingAmount;
      }
      tooltipString += `<strong>Healing:</strong> ${healingString} ${modifierDisplay}<br>`;
    } else if (player.lifestealModifier > 0 && weapon.damage > 0) {
      tooltipString += `<strong>Healing:</strong> (+${player.lifestealModifier}%)<br>`;
    }

    if (weapon.blockAmount > 0) {
      let modifierDisplay = "";
      if (player.blockModifier > 0) {
        modifierDisplay = `(+${player.blockModifier})`;
      }
      if (player.blockModifier < 0) {
        modifierDisplay = `(${player.blockModifier})`;
      }
      tooltipString += `<strong>Block:</strong> ${weapon.blockAmount} ${modifierDisplay}<br>`;
    }

    if (weapon.energyGainOnUse > 0) {
      tooltipString += `<strong>Energy Gain:</strong> ${weapon.energyGainOnUse}<br>`;
    }

    if (weapon.drawAmountOnUse > 0) {
      tooltipString += `<strong>Draw:</strong> ${weapon.drawAmountOnUse}<br>`;
    }

    if (weapon.strength > 0) {
      tooltipString += `<strong>Strength:</strong> ${weapon.strength}<br>`;
    }

    if (weapon.selfDamage > 0) {
      tooltipString += `<strong>Selfdamage:</strong> ${weapon.selfDamage}<br>`;
    }

    tooltipString += `${weapon.description} <br>`;
    weaponPrice = parseInt(weaponPrice);
    if (!isNaN(weaponPrice) && weaponPrice > 0) {
      tooltipString += `<strong>Price:</strong> ${weaponPrice} Gold`;
    }

    return tooltipString;
  };

  if (!tooltipElement) {
    // Create a tooltip for the weapon
    tooltipElement = document.createElement("div");

    // Append the tooltip to the weapon element
    display.appendChild(tooltipElement);
  }

  display.addEventListener("mouseenter", function () {
    tooltipElement.classList.add("visible");
    tooltipElement.innerHTML = getTooltip();
  });

  tooltipElement.classList.add("tooltip");

  return display;
}

function applyBlock(weapon, blockModifier) {
  if (weapon.blockAmount > 0) {
    const blockContainer = document.getElementById("block-container");
    const blockText = document.getElementById("block-text");

    let currentBlock = parseInt(blockText.innerText) || 0;

    currentBlock += weapon.blockAmount + blockModifier;

    player.blockAmount = currentBlock;

    blockText.innerText = currentBlock;

    blockContainer.classList.remove("hidden");
  }
}

function getRandomWeapons(randomWeapons, lvl2Prop, lvl3Prop) {
  let baseWeapon;
  let newRandomIndex;

  const availableWeapons = getAvailableWeapons();

  do {
    newRandomIndex = Math.floor(Math.random() * availableWeapons.length);
    baseWeapon = availableWeapons[newRandomIndex];
  } while (randomWeapons.some((w) => w.name == baseWeapon.name));

  const weaponInfo = baseWeapon.getWeaponInfo();

  const levelRoll = Math.random();
  if (levelRoll < lvl3Prop) {
    weaponInfo.level = 3;
  } else if (levelRoll < lvl2Prop + lvl3Prop) {
    weaponInfo.level = 2;
  } else {
    weaponInfo.level = 1;
  }

  const WeaponClass = Object.getPrototypeOf(baseWeapon).constructor;
  const newWeapon = new WeaponClass();

  newWeapon.loadFromWeaponInfo(weaponInfo);
  newWeapon.applyUpgrades(weaponInfo);
  newWeapon.loadFromWeaponInfo(weaponInfo);

  return newWeapon;
}
