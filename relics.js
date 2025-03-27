class Relics {
  #name;
  #icon;
  #relicFunction;
  #relicDescription;

  get icon() {
    return this.#icon;
  }

  get name() {
    return this.#name;
  }

  get relicDescription() {
    return this.#relicDescription;
  }

  constructor(name, icon, relicFunction, relicDescription) {
    this.#name = name;
    this.#icon = icon;
    this.#relicFunction = relicFunction;
    this.#relicDescription = relicDescription;
  }

  equipRelic(player) {
    if (!loadData("relic_" + this.#name)) {
      this.#relicFunction(player);
      this.markEquipped();
    }
  }

  markEquipped() {
    storeData("relic_" + this.#name, true);
  }
}

class ActiveRelics extends Relics {
  constructor(name, icon, relicFunction, relicDescription) {
    super(name, icon, relicFunction, relicDescription);
  }
  markEquipped() {}
}

const relicList = [
  new ActiveRelics(
    "Grinding Monstera",
    "Assets/Monstera.png",
    grindingMonstera,
    "Get +2 max HP for every enemy killed."
  ),

  new Relics("Beefy Steak", "Assets/Steak.png", beefySteak, "Get +30 max HP."),
  new Relics(
    "Whetstone",
    "Assets/sword.png",
    whetstone,
    "All attack weapons get +15 critical chance."
  ),
].reduce((o, r) => {
  o[r.name] = r;
  return o;
}, {});
const relicNames = [...Object.keys(relicList)].sort();

function grindingMonstera(player) {
  window.addEventListener("EnemyDeath", () => {
    player.increaseMaxHealth(2, true);
  });
}

function beefySteak(player) {
  player.increaseMaxHealth(30, true);
}

function whetstone(player) {}
