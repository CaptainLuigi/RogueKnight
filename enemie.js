class Enemy extends HealthEntity {
  static #templateNode;
  static #enemyDisplay;
  static initialize() {
    //Zuweisung enemyDisplay entspricht dem Element, das alle angezeigten Gegner beeinhaltet (Node)
    this.#enemyDisplay = document.getElementById("enemies");
    //Zuweisung der Vorlage der Gegner
    this.#templateNode = this.#enemyDisplay.firstElementChild;
    //Entfernt die Vorlage der Gegner (damit keine leere Vorlage mit dabei ist)
    this.#templateNode.remove();
  }
  #health;
  #name;
  #maxHealth;
  #attackPower;
  #icon;
  #ranged;
  #lifesteal;
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

  get ranged() {
    return this.#ranged;
  }

  constructor(name, maxHealth, attackPower, icon, ranged, lifesteal = 0) {
    super();
    this.#health = maxHealth;
    this.#name = name;
    this.#attackPower = attackPower;
    this.#maxHealth = maxHealth;
    this.#icon = icon;
    this.#display = Enemy.#templateNode.cloneNode(true);
    let image = this.#display.querySelector(".enemy-icon");
    image.src = icon;
    image.alt = name;
    this.#ranged = ranged;
    this.#lifesteal = lifesteal;
    this.updateDisplay();
    Enemy.#enemyDisplay.appendChild(this.#display);
  }

  isDead() {
    return this.health <= 0;
  }

  takeDamage(amount) {
    this.#health -= amount;
    if (this.#health < 0) this.#health = 0; // Ensure health doesn't go negative
    if (this.#health === 0) this.enemyDeath();
    else this.updateDisplay();
  }
  attack(player) {
    this.#display.classList.add("grow-shrink");
    player.takeDamage(this.#attackPower);

    if (this.#lifesteal > 0) {
      this.heal(this.#lifesteal);
    }

    setTimeout(() => {
      this.#display.classList.remove("grow-shrink");
    }, 500);
  }

  heal(amount) {
    this.#health += amount; // Increase health
    if (this.#health > this.#maxHealth) this.#health = this.#maxHealth; // Cap at max health
    this.updateDisplay();

    if (amount > 0) {
      this.displayLifesteal(amount);
    }
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
    let deathSprite = this.#display.querySelector(".enemy-icon");

    deathSprite.src = "Assets/smoke.png";
    deathSprite.alt = "Dead " + this.name;

    this.display.classList.add("death-smoke");
    this.display.classList.add("death-smoke-shrink");

    let index = enemies.findIndex((e) => e == this);
    if (index > -1) {
      enemies.splice(index, 1);
    }

    const goldDropped = Math.floor(Math.random() * 6) + 10;
    console.log(`${this.name} dropped ${goldDropped} gold!`);

    enemyDeathEvent();

    const goldDisplay = document.createElement("div");
    goldDisplay.textContent = `+${goldDropped} Gold`;
    goldDisplay.style.position = "absolute";
    goldDisplay.style.color = "gold";
    goldDisplay.style.fontSize = "20px";
    goldDisplay.style.fontWeight = "bold";
    goldDisplay.style.zIndex = "1000";
    goldDisplay.style.transition = "opacity 1s ease-out";

    const enemyRect = this.#display.getBoundingClientRect();
    goldDisplay.style.left = `${enemyRect.left + enemyRect.width / 2 - 20}px`;
    goldDisplay.style.top = `${enemyRect.top - 30}px`;

    document.body.appendChild(goldDisplay);

    updatePlayerGold(goldDropped);

    setTimeout(() => {
      goldDisplay.style.opacity = "0";
    }, 750);

    setTimeout(() => {
      goldDisplay.remove();
    }, 1200);

    setTimeout(() => {
      this.#display.remove();
    }, 2500);
  }
}

class Shroom extends Enemy {
  constructor() {
    super("Shroom", 200, 8, "Assets/Transperent/Icon1.png", true);
  }
}

class Snail extends Enemy {
  constructor() {
    super("Snail", 300, 5, "Assets/Transperent/Icon5.png", false);
  }
}

class SadShroom extends Enemy {
  constructor() {
    super("Sad Shroom", 200, 5, "Assets/Transperent/Icon6.png", false);
  }
}

class BiteShroom extends Enemy {
  constructor() {
    super("Bite Shroom", 350, 10, "Assets/Transperent/Icon7.png", false);
  }
}

class Scorpion extends Enemy {
  constructor() {
    super("Scorpion Shroom", 150, 10, "Assets/Transperent/Icon9.png", true);
  }
}

class BitingPlant extends Enemy {
  constructor() {
    super("Biting Plant", 400, 10, "Assets/Transperent/Icon11.png", false);
  }
}

class SlimeHive extends Enemy {
  constructor() {
    super("Slime Hive", 500, 3, "Assets/Transperent/Icon23.png", false);
  }
}

class Mantis extends Enemy {
  constructor() {
    super("Mantis", 150, 15, "Assets/Transperent/Icon39.png", false);
  }
}

class Hornet extends Enemy {
  constructor() {
    super("Hornet", 100, 10, "Assets/Transperent/Icon42.png", true);
  }
}

class EvilKnight extends Enemy {
  constructor() {
    super("Evil Knight", 750, 15, "Assets/evilknight.png", false);
    this.display.classList.add("evil-knight");
  }
}

class HermitShroom extends Enemy {
  constructor() {
    super("Hermit Shroom", 500, 3, "Assets/Icon10.png", false);
  }
}

class Succubus extends Enemy {
  constructor() {
    super("Succubus", 750, 15, "Assets/succubus.png", false, 15);
    this.display.classList.add("succubus");
  }
}
