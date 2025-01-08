const weapons = [
  {
    name: "Basic Sword",
    range: "melee",
    damage: 25,
    criticalDamage: 50,
    criticalChance: 25,
    energy: 1,
    sprite: "Assets/sword.png",
  },

  {
    name: "Basic Spear",
    range: "medium",
    damage: 20,
    criticalDamage: 75,
    criticalChance: 15,
    energy: 1,
    sprite: "Assets/spear.png",
  },
];

// Handle weapon selection
function useWeapon(weaponIndex) {
  if (!isPlayerTurn) {
    // Prevent using weapons if it's not the player's turn
    displayTurnMessage("It's not your turn!");
    return;
  }
  const weapon = weapons[weaponIndex];
  console.log("Using weapon:", weapon.name);

  // Check if the player has enough energy to use the weapon
  if (player.useEnergy(weapon.energy)) {
    triggerAttackAnimation(); // Trigger the attack animation

    // Call the damage calculation function
    const { damage, isCritical } = calculateDamage(weapon); // Destructure to get both damage and isCritical

    enemies[0].displayDamage(damage, isCritical); // Call displayDamage here

    enemies[0].takeDamage(damage); // Apply damage to the enemy

    // Optional: Reset the player's animation after the attack
    setTimeout(() => {
      // If using idle animation, you can do this after the attack animation is complete
      // Call the function to reset the player's animation back to idle
      resetToIdleAnimation();
    }, attackConfig.totalFrames * attackConfig.frameDelay); // Reset after the animation duration
  } else {
    displayTurnMessage("Not enough energy!");
  }
  updateEnergyDisplay();
}

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

// Call the function to display the weapons
displayWeapons();
