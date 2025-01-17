class Relics {
  #name;
  #description;
  #effectType;
  #effectValue;

  constructor(name, description, effectType, effectValue) {
    this.#name = name;
    this.#description = description;
    this.#effectType = effectType;
    this.#effectValue = effectValue;
  }

  get name() {
    return this.#name;
  }

  get description() {
    return this.#description;
  }

  get effectType() {
    return this.#effectType;
  }

  get effectValue() {
    return this.#effectValue;
  }

  applyEffect(target) {
    if (this.#effectType === "weapon" && target instanceof Weapons) {
      switch (this.#name) {
        case "Crit Boost":
          target.#criticalChance += this.#effectValue;
          break;
        case "Damage Boost":
          target.#damage += this.#effectValue;
          break;
        case "Crit Damage Boost":
          target.#criticalDamage += this.#effectValue;
          break;
      }
    }

    if (this.#effectType === "player" && target instanceof Player) {
      switch (this.#name) {
        case "Grinding Monstera":
          target.maxHealth += this.#effectValue;
          break;
        case "Energy Boost":
          target.maxEnergy += this.#effectValue;
          break;
      }
    }
  }
}

const relics = [
  new Relic("Crit Boost", "Increase critical chance by 15%", "weapon", 15),
  new Relic("Damage Boost", "Increase normal damage by 20", "weapon", 20),
  new Relic(
    "Crit Damage Boost",
    "Increase critical damage by 30",
    "weapon",
    30
  ),
  new Relic(
    "Grinding Monstera",
    "Increase max health by 2 after defeating an enemy",
    "player",
    50
  ),
  new Relic("Energy Boost", "Increase max energy by 1", "player", 1),
];
