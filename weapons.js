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
  #affectsLeft;
  #affectsRight;

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
    affectsLeft = 0,
    affectsRight = 0
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
    this.#affectsLeft = affectsLeft;
    this.#affectsRight = affectsRight;
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

  // Getter for #affectsLeft
  get affectsLeft() {
    return this.#affectsLeft;
  }

  // Getter for #affectsRight
  get affectsRight() {
    return this.#affectsRight;
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

const weapons = [new BasicSword(), new BasicAxe(), new BasicSpear()];

// Calculate damage with a chance for a critical hit
function calculateDamage(weapon) {
  const isCritical = Math.random() * 100 < weapon.criticalChance; // Random chance for critical hit
  const totalDamage = isCritical ? weapon.criticalDamage : weapon.damage;

  console.log(
    `${weapon.name}: ${
      isCritical ? "Critical Hit!" : "Normal Hit"
    }, Damage: ${totalDamage}`
  );
  return { damage: totalDamage, isCritical }; // Return both damage and isCritical as an object
}

function displayWeapons() {
  const weaponsContainer = document.getElementById("weapons-container");
  weaponsContainer.innerHTML = ""; // Clear previous content if any

  // Loop through weapons and create an image for each
  weapons.forEach((weapon, index) => {
    // Add index parameter here
    const weaponElement = document.createElement("div");
    weaponElement.classList.add("weapon");

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
