class HealthEntity {
  get healthBar() {
    throw new Error("healthBar not overwritten");
  }

  constructor() {
    console.log("HealthEntity initialized: " + this.__proto__.constructor.name);
  }

  /**
   *
   * @param {int} damage 	inflicted damage
   * @param {boolean} isCritical if damage is critical
   * @param {HealthEntity} entity targeted enemy
   * @returns
   */
  displayDamage(damage, isCritical, offset = 0) {
    console.log("Displaying damage:", damage, "Critical:", isCritical);

    const enemyHealthBar = this.healthBar;
    if (!enemyHealthBar) {
      console.error("Enemy health bar not found!");
      return;
    }

    const healthBarRect = enemyHealthBar.getBoundingClientRect();
    console.log("Health Bar Rect:", healthBarRect); // Debugging

    // Create a damage popup element
    const damageElement = document.createElement("div");
    damageElement.classList.add("damage-popup");
    damageElement.textContent = damage;

    // Set styles for the popup
    damageElement.style.color = isCritical ? "#b8860b" : "red";
    damageElement.style.fontSize = "32px";
    damageElement.style.fontWeight = "bold";
    damageElement.style.webkitTextStroke = "0.1px black";
    damageElement.style.position = "absolute";
    damageElement.style.left = `${
      healthBarRect.left + healthBarRect.width / 2
    }px`;
    damageElement.style.top = `${healthBarRect.top - 40 - offset}px`; // Slightly above the health bar
    damageElement.style.transform = "translateX(-50%)"; // Center horizontally
    damageElement.style.zIndex = "1000"; // Ensure it's visible above other elements

    damageElement.style.background = "none";
    damageElement.style.border = "none";

    document.body.appendChild(damageElement);

    // Remove the element after 1 second
    setTimeout(() => {
      damageElement.remove();
    }, 1500);
  }

  /**
   * Display lifesteal popup above the health bar
   * @param {number} amount The amount of lifesteal to display
   */
  displayLifesteal(amount) {
    const healthBar = this.healthBar;
    if (!healthBar) {
      console.error("Health bar not found!");
      return;
    }

    const healthBarRect = healthBar.getBoundingClientRect();

    // Create a lifesteal popup element
    const lifestealElement = document.createElement("div");
    lifestealElement.classList.add("lifesteal-popup");
    lifestealElement.textContent = `+${amount}`;

    // Set styles for the popup
    lifestealElement.style.color = "#4caf50"; // Green color for lifesteal
    lifestealElement.style.fontSize = "32px";
    lifestealElement.style.fontWeight = "bold";
    lifestealElement.style.webkitTextStroke = "0.1px black";
    lifestealElement.style.position = "absolute";
    lifestealElement.style.left = `${
      healthBarRect.left + healthBarRect.width / 2
    }px`;
    lifestealElement.style.top = `${healthBarRect.top - 40}px`; // Slightly above the health bar
    lifestealElement.style.transform = "translateX(-50%)"; // Center horizontally
    lifestealElement.style.zIndex = "1000"; // Ensure it's visible above other elements

    lifestealElement.style.background = "none";
    lifestealElement.style.border = "none";

    document.body.appendChild(lifestealElement);

    // Remove the element after 1 second
    setTimeout(() => {
      lifestealElement.remove();
    }, 1500);
  }

  displayHeal(amount) {
    const healthBar = document.getElementById("health-bar-container-player");
    if (!healthBar) {
      console.error("Player health bar not found");
      return;
    }

    const healthBarRect = healthBar.getBoundingClientRect();

    const healElement = document.createElement("div");
    healElement.classList.add("heal-popup");
    healElement.textContent = `+${amount}`;

    healElement.style.color = "#4caf50";
    healElement.style.fontSize = "32px";
    healElement.style.fontWeight = "bold";
    healElement.style.webkitTextStroke = "0.1px black";
    healElement.style.position = "absolute";
    healElement.style.left = `${
      healthBarRect.left + healthBarRect.width / 2
    }px`;
    healElement.style.top = `${healthBarRect.top - 90}px`;
    healElement.style.transform = "translateX(-50%)";
    healElement.style.zIndex = "1000";
    healElement.style.background = "none";
    healElement.style.border = "none";

    document.body.appendChild(healElement);

    setTimeout(() => {
      healElement.remove();
    }, 1500);
  }
}
