class Relics {
  #name;
  #icon;
  #relicFunction;

  get icon() {
    return this.#icon;
  }

  get name() {
    return this.#name;
  }

  constructor(name, icon, relicFunction) {
    this.#name = name;
    this.#icon = icon;
    this.#relicFunction = relicFunction;
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
  constructor(name, icon, relicFunction) {
    super(name, icon, relicFunction);
  }
  markEquipped() {}
}

const relics = [
  new ActiveRelics("Dummy Relic", "Assets/Monstera.png", dummyRelic),
  new Relics("Dummy Relic 1", "Assets/Monstera.png", dummyRelic1),
].reduce((o, r) => {
  o[r.name] = r;
  return o;
}, {});
const relicNames = [...Object.keys(relics)].sort();

function dummyRelic(player) {
  window.addEventListener("EnemyDeath", () => {
    player.increaseMaxHealth(2, true);
  });
  alert("dummy relic received");
}

function dummyRelic1(player) {
  player.increaseMaxHealth(30, true);
  alert("this is also a dummy relic");
}
