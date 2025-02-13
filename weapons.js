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
    healingAmount = 0
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

  possibleTargets() {
    if (!this.requiresTargeting) return [this.#minRange];

    const displayTargets = [];
    for (let index = this.#minRange; index <= this.#maxRange; index++)
      displayTargets.push(index);

    return displayTargets;
  }

  calculateDamage(enemyIndex) {
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
    this.applyUpgrades();
  }

  applyHealing(target) {
    if (this.#healingAmount > 0) {
      target.health(this.#healingAmount);
      console.log(
        `${this.name} healed the player for ${this.#healingAmount} health.`
      );
    }
  }

  applyUpgrades() {
    console.log(
      "applyUpgrades() should be overridden in each weapon subclass."
    );
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
      10
    );
  }
  applyUpgrades() {
    switch (this.level) {
      case 1:
        break;
      case 2:
        this.healingAmount += 5;
        break;
      case 3:
        this.healingAmount += 10;
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
  applyUpgrades() {
    switch (this.level) {
      case 1:
        break;
      case 2:
        this.damage += 5;
        this.criticalDamage += 10;
        this.criticalChance += 5;
        break;
      case 3:
        this.damage += 5;
        this.criticalDamage += 10;
        this.criticalChance += 5;
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
  applyUpgrades() {
    switch (this.level) {
      case 1:
        break;
      case 2:
        this.damage += 15;
        this.criticalDamage += 30;
        this.criticalChance += 5;
        break;
      case 3:
        this.damage += 15;
        this.criticalDamage += 30;
        this.criticalChance += 5;
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
  applyUpgrades() {
    switch (this.level) {
      case 1:
        break;
      case 2:
        this.damage += 5;
        this.criticalDamage += 10;
        this.criticalChance += 5;
        break;
      case 3:
        this.damage += 5;
        this.criticalDamage += 10;
        this.criticalChance += 10;
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
      40,
      20,
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
  applyUpgrades() {
    switch (this.level) {
      case 1:
        break;
      case 2:
        this.damage += 10;
        this.criticalDamage += 10;
        this.criticalChance += 5;
        break;
      case 3:
        this.damage += 10;
        this.criticalDamage += 10;
        this.criticalChance += 10;
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
  applyUpgrades() {
    switch (this.level) {
      case 1:
        break;
      case 2:
        this.damage += 5;
        this.criticalDamage += 5;
        this.criticalChance += 5;
        break;
      case 3:
        this.damage += 10;
        this.criticalDamage += 10;
        this.criticalChance += 5;
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
      "Assets/dagger.png"
    );
  }
  applyUpgrades() {
    switch (this.level) {
      case 1:
        break;
      case 2:
        this.damage += 5;
        this.criticalDamage += 10;
        this.criticalChance += 10;
        break;
      case 3:
        this.damage += 10;
        this.criticalDamage += 10;
        this.criticalChance += 15;
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
  applyUpgrades() {
    switch (this.level) {
      case 1:
        break;
      case 2:
        this.damage += 5;
        this.criticalDamage += 10;
        this.criticalChance += 10;
        break;
      case 3:
        this.damage += 10;
        this.criticalDamage += 10;
        this.criticalChance += 10;
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
      "Can target any enemie and also damages the enemie behind, click weapon first, then the enemy you want to hit.",
      "Assets/crossbow.png",
      true,
      0,
      4,
      0,
      [1]
    );
  }
  applyUpgrades() {
    switch (this.level) {
      case 1:
        break;
      case 2:
        this.damage += 5;
        this.criticalDamage += 5;
        this.criticalChance += 5;
        break;
      case 3:
        this.damage += 10;
        this.criticalDamage += 10;
        this.criticalChance += 15;
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

  if (!tooltipElement) {
    // Create a tooltip for the weapon
    tooltipElement = document.createElement("div");

    tooltipElement.innerHTML = tooltipString;

    // Append the tooltip to the weapon element
    display.appendChild(tooltipElement);
  }
  // Add event listener to use weapon on click
  else {
    display.addEventListener("mouseenter", function () {
      tooltipElement.classList.add("visible");
      tooltipElement.innerHTML = tooltipString;
    });
  }

  tooltipElement.classList.add("tooltip");

  return display;
}
