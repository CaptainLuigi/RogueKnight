class Weapons {
  #name;
  #range;
  #damage;
  #criticalDamage;
  #criticalChance;
  #energy;
  #sprite;
  #requiresTargeting;
  #minRange;
  #maxRange;
  #effectsLeft;
  #effectsRight;

  constructor(
    name,
    range,
    damage,
    criticalDamage,
    criticalChance,
    energy,
    sprite,
    requiresTargeting = false,
    minRange = 0,
    maxRange = 0,
    effectsLeft = 0,
    effectsRight = 0
  ) {
    this.#name = name;
    this.#range = range;
    this.#damage = damage;
    this.#criticalDamage = criticalDamage;
    this.#criticalChance = criticalChance;
    this.#energy = energy;
    this.#sprite = sprite;
    this.#requiresTargeting = requiresTargeting;
    this.#minRange = minRange;
    this.#maxRange = maxRange;
    if (!Array.isArray(effectsLeft)) {
      effectsLeft = parseInt(effectsLeft);
      if (isNaN(effectsLeft) || effectsLeft == 0) effectsLeft = [];
      else effectsLeft = [...new Array(effectsLeft)].map((e) => 1);
    }
    this.#effectsLeft = effectsLeft;
    if (!Array.isArray(effectsRight)) {
      effectsRight = parseInt(effectsRight);
      if (isNaN(effectsRight) || effectsRight == 0) effectsRight = [];
      else effectsRight = [...new Array(effectsRight)].map((e) => 1);
    }
    this.#effectsRight = effectsRight;
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
}

class BasicSword extends Weapons {
  constructor() {
    super("Basic Sword", "melee", 25, 50, 25, 1, "Assets/sword.png");
  }
}

class BasicAxe extends Weapons {
  constructor() {
    super("Basic Axe", "melee", 55, 130, 15, 2, "Assets/axe.png", true, 0, 1);
  }
}

class BasicSpear extends Weapons {
  constructor() {
    super(
      "Basic Spear",
      "medium",
      20,
      75,
      15,
      1,
      "Assets/spear.png",
      false,
      0,
      0,
      0,
      [0.8, 0.5]
    );
  }
}

class Grenade extends Weapons {
  constructor() {
    super(
      "Grenade",
      "range",
      50,
      90,
      20,
      1,
      "Assets/spear.png",
      true,
      1,
      3,
      [0.5],
      [0.5]
    );
  }
}

const weapons = [
  new BasicSword(),
  new BasicAxe(),
  new BasicSpear(),
  new Grenade(),
];

function displayWeapons() {
  const weaponsContainer = document.getElementById("weapons-container");
  weaponsContainer.innerHTML = ""; // Clear previous content if any

  // Loop through weapons and create an image for each
  weapons.forEach((weapon, index) => {
    // Add index parameter here
    const weaponElement = document.createElement("div");
    weaponElement.classList.add("weapon");
    weaponElement.setAttribute("index", index);
    weaponElement.setAttribute("onmouseenter", "weaponHover(this);");
    weaponElement.setAttribute("onmouseleave", "clearSelection();");

    // Create an image element for the weapon
    const weaponImage = document.createElement("img");
    weaponImage.src = weapon.sprite;
    weaponImage.alt = weapon.name;
    weaponImage.classList.add("weapon-image");

    // Create a tooltip for the weapon
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");

    tooltip.innerHTML = `
            <strong>Energy Cost:</strong> ${weapon.energy} <br>
            <strong>Name:</strong> ${weapon.name} <br>
            <strong>Range:</strong> ${weapon.range} <br>
            <strong>Damage:</strong> ${weapon.damage} <br>
            <strong>Critical Damage:</strong> ${weapon.criticalDamage} <br>
            <strong>Critical Chance:</strong> ${weapon.criticalChance}% <br>           
        `;

    // Append the tooltip to the weapon element
    weaponElement.appendChild(tooltip);

    // Append image to weapon element
    weaponElement.appendChild(weaponImage);

    // Add event listener to use weapon on click
    weaponElement.addEventListener("click", function () {
      useWeapon(index); // Use the correct index
    });

    // Append weapon element to the weapons container
    weaponsContainer.appendChild(weaponElement);
  });
}
