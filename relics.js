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
    console.log(`Attempting to equip ${this.#name}`);
    console.log(`Relic function`, this.#relicFunction);

    if (!loadData("relic_" + this.#name)) {
      console.log(`Applying relic effect: ${this.#name}`);

      this.#relicFunction(player);
      this.markEquipped();
    } else {
      console.log(`Relic ${this.#name} is already equipped`);
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
    "Assets/monsteraLeaf.png",
    grindingMonstera,
    "Get +2 max HP for every enemy killed."
  ),

  new Relics(
    "Beefy Steak",
    "Assets/pixelSteak.png",
    beefySteak,
    "Get +30 max HP."
  ),
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
  console.log("Beefy Steak effect applied!");
  player.increaseMaxHealth(30, true);
}

function whetstone(player) {
  player.increaseWeaponCritChance(15);
}

function createRelicElement(relic) {
  const relicImage = document.createElement("img");
  relicImage.src = relic.icon;
  relicImage.alt = relic.name;
  relicImage.classList.add("relic-image");

  const relicTooltip = document.createElement("div");
  relicTooltip.classList.add("relicTooltip");
  relicTooltip.innerHTML = `<strong>${relic.name}</strong><br>${relic.relicDescription}`;

  const relicWrapper = document.createElement("div");
  relicWrapper.classList.add("relic-wrapper");
  relicWrapper.appendChild(relicImage);
  relicWrapper.appendChild(relicTooltip);

  relicImage.addEventListener("mouseenter", () => {
    relicTooltip.style.display = "block";
  });

  relicImage.addEventListener("mouseleave", () => {
    relicTooltip.style.display = "none";
  });

  return relicWrapper;
}

function displayEquippedRelics() {
  const relicContainer = document.getElementById("equipped-relic-container");

  relicContainer.innerHTML = "";

  player.equippedRelics.forEach((relicName) => {
    const relic = relicList[relicName];
    if (relic) {
      const relicElement = createRelicElement(relic);
      relicContainer.appendChild(relicElement);
    }
  });
}
