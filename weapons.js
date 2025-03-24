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
  #wasUsed = false;

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
    canHeal = false
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

  get wasUsed() {
    return this.#wasUsed;
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
    this.#healingAmount = value;
  }

  set wasUsed(value) {
    this.#wasUsed = value === true;
  }

  possibleTargets() {
    if (!this.requiresTargeting) return [this.#minRange];

    const displayTargets = [];
    for (let index = this.#minRange; index <= this.#maxRange; index++)
      displayTargets.push(index);

    return displayTargets;
  }

  calculateDamage(enemyIndex) {
    this.#wasUsed = true;

    if (this.#damage == 0 && this.#criticalDamage == 0)
      return {
        startIndex: 0,
        isCritical: false,
        damages: [],
      };

    const isCritical = Math.random() * 100 < this.criticalChance; // Random chance for critical hit
    const damage = isCritical ? this.criticalDamage : this.damage;

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
      return (this.#healingAmount[0] * totalDamage) / 100;
    }
    let ttlHealing = 0;
    for (let i = 0; i < this.#healingAmount.length; i++) {
      let currentHealing = this.#healingAmount[i];
      let currentDamage = 0;
      if (i < damages.length) {
        currentDamage = damages[i];
      }
      ttlHealing += (currentDamage * currentHealing) / 100;
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

class HealthPotion extends Weapons {
  constructor() {
    super(
      "Health Potion",
      1,
      "item",
      0,
      0,
      0,
      1,
      "Click to heal the player.",
      "Assets/healthPotion.png",
      false,
      0,
      0,
      0,
      0,
      10,
      true
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.healingAmount += 5;
        break;
      case 3:
        weaponInfo.healingAmount += 10;
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
      "melee",
      25,
      50,
      25,
      1,
      "Can only target the first enemy, click to instanty use weapon.",
      "Assets/sword.png"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage += 5;
        weaponInfo.criticalDamage += 10;
        weaponInfo.criticalChance += 5;
        break;
      case 3:
        weaponInfo.damage += 5;
        weaponInfo.criticalDamage += 10;
        weaponInfo.criticalChance += 5;
        break;
    }
  }
}

class BasicAxe extends Weapons {
  constructor() {
    super(
      "Basic Axe",
      1,
      "melee",
      60,
      140,
      35,
      2,
      "Can target the closest two enemies, click weapon first, then the enemy you want to hit.",
      "Assets/waraxe.png",
      true,
      0,
      1
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage += 15;
        weaponInfo.criticalDamage += 30;
        weaponInfo.criticalChance += 5;
        break;
      case 3:
        weaponInfo.damage += 15;
        weaponInfo.criticalDamage += 30;
        weaponInfo.criticalChance += 5;
        break;
    }
  }
}

class BasicSpear extends Weapons {
  constructor() {
    super(
      "Basic Spear",
      1,
      "medium",
      20,
      50,
      15,
      1,
      "Can only target the first enemy and pierces two enemies, click to instantly use weapon.",
      "Assets/spear.png",
      false,
      0,
      0,
      0,
      [1, 1]
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage += 5;
        weaponInfo.criticalDamage += 10;
        weaponInfo.criticalChance += 5;

        break;
      case 3:
        weaponInfo.damage += 5;
        weaponInfo.criticalDamage += 10;
        weaponInfo.criticalChance += 10;

        weaponInfo.canHeal = true;
        weaponInfo.healingAmount = [20, 10, 5];
        break;
    }
  }
}

class VampiricDagger extends Weapons {
  constructor() {
    super(
      "Vampiric Dagger",
      1,
      "melee",
      20,
      50,
      25,
      1,
      "Can only target the first enemy and has 10% lifesteal, click to instantly use weapon.",
      "Assets/VampiricDagger.png",
      false,
      0,
      0,
      0,
      0,
      [10],
      true
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage += 10;
        weaponInfo.criticalDamage += 10;
        break;
      case 3:
        weaponInfo.damage += 10;
        weaponInfo.criticalDamage += 10;
        weaponInfo.criticalChance += 10;
        break;
    }
  }
}

class Bomb extends Weapons {
  constructor() {
    super(
      "Bomb",
      1,
      "far",
      500,
      500,
      0,
      2,
      "Can't target the first enemy and hits also the enemy to the left and to the right, click weapon first, then the enemy you want to hit.",
      "Assets/bomb.png",
      true,
      1,
      4,
      [1],
      [1]
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage += 10;
        weaponInfo.criticalDamage += 10;
        weaponInfo.criticalChance += 5;
        break;
      case 3:
        weaponInfo.damage += 10;
        weaponInfo.criticalDamage += 10;
        weaponInfo.criticalChance += 10;
        break;
    }
  }
}

class Herosword extends Weapons {
  constructor() {
    super(
      "Hero Sword",
      1,
      "melee",
      15,
      65,
      60,
      1,
      "Can only target the first enemy, click to instanty use weapon.",
      "Assets/herosword.png"
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage += 5;
        weaponInfo.criticalDamage += 5;
        weaponInfo.criticalChance += 5;
        break;
      case 3:
        weaponInfo.damage += 10;
        weaponInfo.criticalDamage += 10;
        weaponInfo.criticalChance += 5;
        break;
    }
  }
}

class Dagger extends Weapons {
  constructor() {
    super(
      "Dagger",
      1,
      "melee",
      5,
      70,
      45,
      1,
      "Can only target the first enemy, click to instanty use weapon.",
      "Assets/dagger.png",
      false,
      0,
      0,
      0,
      0,
      [10],
      true
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage += 5;
        weaponInfo.criticalDamage += 10;
        weaponInfo.criticalChance += 10;
        break;
      case 3:
        weaponInfo.damage += 10;
        weaponInfo.criticalDamage += 10;
        weaponInfo.criticalChance += 15;
        break;
    }
  }
}

class Spearblade extends Weapons {
  constructor() {
    super(
      "Spearblade",
      1,
      "melee",
      55,
      80,
      30,
      2,
      "Damages the first two enemies, click to instantly use weapon.",
      "Assets/spearblade.png",
      false,
      0,
      0,
      0,
      [1]
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage += 5;
        weaponInfo.criticalDamage += 10;
        weaponInfo.criticalChance += 10;
        break;
      case 3:
        weaponInfo.damage += 10;
        weaponInfo.criticalDamage += 10;
        weaponInfo.criticalChance += 10;
        break;
    }
  }
}

class Crossbow extends Weapons {
  constructor() {
    super(
      "Crossbow",
      1,
      "far",
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
      [1]
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage += 5;
        weaponInfo.criticalDamage += 5;
        weaponInfo.criticalChance += 5;
        break;
      case 3:
        weaponInfo.damage += 10;
        weaponInfo.criticalDamage += 10;
        weaponInfo.criticalChance += 15;
        break;
    }
  }
}

class ThorsHammer extends Weapons {
  constructor() {
    super(
      "Thor's Hammer",
      1,
      "far",
      50,
      80,
      30,
      3,
      "Damages all enemies, click to instanty use weapon.",
      "Assets/ThorsHammer.png",
      false,
      0,
      5,
      0,
      [1, 1, 1, 1, 1]
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage += 10;
        weaponInfo.criticalDamage += 10;
        weaponInfo.criticalChance += 5;
        break;
      case 3:
        weaponInfo.damage += 15;
        weaponInfo.criticalDamage += 15;
        weaponInfo.criticalChance += 10;
        break;
    }
  }
}

class Lightning extends Weapons {
  constructor() {
    super(
      "Lightning Strike",
      1,
      "far",
      20,
      150,
      3,
      1,
      "Also hits the enemy to the left and to the right, click weapon first, then the enemy you want to hit",
      "Assets/Lightning.png",
      true,
      0,
      5,
      [1],
      [1]
    );
  }
  applyUpgrades(weaponInfo) {
    switch (this.level) {
      case 1:
        break;
      case 2:
        weaponInfo.damage += 10;
        weaponInfo.criticalDamage += 50;
        weaponInfo.criticalChance += 1;
        break;
      case 3:
        weaponInfo.damage += 10;
        weaponInfo.criticalDamage += 50;
        weaponInfo.criticalChance += 1;
        break;
    }
  }
}

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
    new HealthPotion(),
    new VampiricDagger(),
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
  HealthPotion,
  ThorsHammer,
  VampiricDagger,
  Lightning,
};

function createWeaponInstanceFromInfo(info) {
  let cls = weaponClassMapping[info.className];
  let instance = new cls();
  instance.loadFromWeaponInfo(info);
  return instance;
}

function displayWeapons(
  weapons,
  usesTargeting = true,
  containerElementID = "weapons-container"
) {
  const weaponsContainer = document.getElementById(containerElementID);
  weaponsContainer.innerHTML = ""; // Clear previous content if any

  // Loop through weapons and create an image for each
  weapons.forEach((weapon, index) => {
    // Add index parameter here
    const weaponElement = generateWeaponInfo(
      weapon,
      index,
      weaponsContainer,
      null,
      null
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
  weapon,
  weaponIndex,
  displayParent,
  display,
  tooltipElement,
  weaponPrice
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
  weaponImage.classList.add("weapon-image");
  display.appendChild(weaponImage);

  var getTooltip = () => {
    let tooltipString = `          
        <strong> ${weapon.name} </strong> <br>
        <strong>Level:</strong> ${weapon.level} <br>
        <strong>Energy Cost:</strong> ${weapon.energy} <br>
        <strong>Range:</strong> ${weapon.range} <br>
        <strong>Damage:</strong> ${weapon.damage} <br>
        <strong>Critical Damage:</strong> ${weapon.criticalDamage} <br>
        <strong>Critical Chance:</strong> ${weapon.criticalChance}% <br>
        <strong>Healing:</strong> ${weapon.healingAmount} <br>
        ${weapon.description} <br>           
    `;
    weaponPrice = parseInt(weaponPrice);
    if (!isNaN(weaponPrice) && weaponPrice > 0) {
      tooltipString += `<strong>${weaponPrice} Gold</strong>`;
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
