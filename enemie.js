class Enemy extends HealthEntity {
  static #templateNote;
  static #enemyDisplay;
  static initialize() {
    this.#enemyDisplay = document.getElementById("enemies");
    this.#templateNote = this.#enemyDisplay.firstElementChild;
    this.#templateNote.remove();
  }
  #health;
  #name;
  #maxHealth;
  #attackPower;
  #icon;
  #display;

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

  constructor(name, maxHealth, attackPower, icon) {
    super();
    this.#health = maxHealth;
    this.#name = name;
    this.#attackPower = attackPower;
    this.#maxHealth = maxHealth;
    this.#icon = icon;
    this.#display = Enemy.#templateNote.cloneNode(true);
    let image = this.#display.querySelector(".enemy-icon");
    image.src = icon;
    image.alt = name;
    this.updateDisplay();
    Enemy.#enemyDisplay.appendChild(this.#display);
  }

  takeDamage(amount) {
    this.#health -= amount;
    if (this.#health < 0) this.#health = 0; // Ensure health doesn't go negative
    if (this.#health === 0) this.enemyDeath();
    else this.updateDisplay();
  }
  attack(player) {
    player.takeDamage(this.#attackPower);
  }
  heal(amount) {
    this.#health += amount; // Increase health
    if (this.#health > this.#maxHealth) this.#health = this.#maxHealth; // Cap at max health
    this.updateDisplay();
  }

  updateDisplay() {
    const healthPercentage = (this.health / this.maxHealth) * 100;
    console.log("Updating enemy health bar:", this.health, "/", this.maxHealth); // debugging
    const healthBarContainerEnemy = this.healthBar;
    const healthBarEnemy = this.#display.querySelector(".health-bar-enemy");

    if (!healthBarContainerEnemy) {
      console.error("Enemy health bar not found!");
      return;
    }

    // Set the width of the health bar based on health percentage
    healthBarEnemy.style.width = `${healthPercentage}%`;
    healthBarEnemy.style.backgroundColor =
      healthPercentage > 50
        ? "#4caf50"
        : healthPercentage > 25
        ? "#ff9800"
        : "#f44336";

    // Set the health text inside the bar
    let healthText = healthBarContainerEnemy.querySelector("span");
    if (!healthText) {
      healthText = document.createElement("span");
      healthBarContainerEnemy.appendChild(healthText);
    }

    healthText.textContent = `${this.health} / ${this.maxHealth}`; // Show health value
  }

  enemyDeath() {
    let index = enemies.findIndex((e) => e == this);
    enemies.splice(index, 1);
    this.#display.remove();

    enemyDeathEvent();
  }
}

class Shroom extends Enemy {
  constructor() {
    super("Shroom", 200, 8, "Assets/Transperent/Icon1.png");
  }
}

class Snail extends Enemy {
  constructor() {
    super("Snail", 300, 5, "Assets/Transperent/Icon5.png");
  }
}

class SadShroom extends Enemy {
  constructor() {
    super("Sad Shroom", 200, 5, "Assets/Transperent/Icon6.png");
  }
}

class BiteShroom extends Enemy {
  constructor() {
    super("Bite Shroom", 350, 10, "Assets/Transperent/Icon7.png");
  }
}

class Scorpion extends Enemy {
  constructor() {
    super("Scorpion Shroom", 150, 10, "Assets/Transperent/Icon9.png");
  }
}

class BitingPlant extends Enemy {
  constructor() {
    super("Biting Plant", 400, 10, "Assets/Transperent/Icon11.png");
  }
}

class SlimeHive extends Enemy {
  constructor() {
    super("Slime Hive", 500, 3, "Assets/Transperent/Icon23.png");
  }
}

class Mantis extends Enemy {
  constructor() {
    super("Mantis", 150, 15, "Assets/Transperent/Icon39.png");
  }
}

class Hornet extends Enemy {
  constructor() {
    super("Hornet", 100, 10, "Assets/Transperent/Icon42.png");
  }
}
