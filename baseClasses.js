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
    damageElement.style.fontSize = "24px";
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
}
