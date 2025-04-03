class Relics {
  #name;
  #icon;
  #relicFunction;
  #relicDescription;
  #relicGroup;

  get icon() {
    return this.#icon;
  }

  get name() {
    return this.#name;
  }

  get relicDescription() {
    return this.#relicDescription;
  }

  get relicGroup() {
    return this.#relicGroup;
  }

  constructor(name, icon, relicFunction, relicDescription, relicGroup) {
    this.#name = name;
    this.#icon = icon;
    this.#relicFunction = relicFunction;
    this.#relicDescription = relicDescription;
    this.#relicGroup = relicGroup;
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
  constructor(name, icon, relicFunction, relicDescription, relicGroup) {
    super(name, icon, relicFunction, relicDescription, relicGroup);
  }
  markEquipped() {}
}

const relicList = [
  new ActiveRelics(
    "Grinding Monstera",
    "Assets/monsteraLeaf.png",
    grindingMonstera,
    "Get +1 max HP for every enemy killed.",
    "elite"
  ),

  new ActiveRelics(
    "Sanguine Blessing",
    "Assets/sanguineBlessing.png",
    sanguineBlessing,
    "Heal 3 HP for every enemy killed.",
    "chest"
  ),

  new Relics(
    "Souleater",
    "Assets/souleater.png",
    souleater,
    "All weapons get +5% lifesteal",
    "succubus"
  ),

  new Relics(
    "Beefy Steak",
    "Assets/pixelSteak.png",
    beefySteak,
    "Get +30 max HP.",
    "chest"
  ),

  new Relics(
    "Whetstone",
    "Assets/whetstone.png",
    whetstone,
    "All weapons get +15 critical chance.",
    "chest"
  ),

  new Relics(
    "Scroll of Knowledge",
    "Assets/scrollRelic.png",
    scrollOfKnowledge,
    "Hand size increased by 1.",
    "chest"
  ),

  new Relics(
    "Bramble Mantle",
    "Assets/brambleMantle.png",
    brambleMantle,
    "Whenever an enemy attacks you,<br> deal 5 damage back.",
    "chest"
  ),

  new Relics(
    "Relic of Vigor",
    "Assets/relicOfVigor.png",
    relicOfVigor,
    "All weapons get +15 damage.",
    "chest"
  ),

  new Relics(
    "Defender's Seal",
    "Assets/defendersSeal.png",
    defendersSeal,
    "All shields get +5 block.",
    "chest"
  ),

  new Relics(
    "Critical Surge",
    "Assets/criticalSurge.png",
    criticalSurge,
    "All weapons get +25 critical damage.",
    "chest"
  ),

  new Relics(
    "Omnipotence",
    "Assets/blackHole.png",
    omnipotence,
    "Actions don't cost energy, but set max HP to 20.",
    "elite"
  ),

  new Relics(
    "Cursed Gauntlet",
    "Assets/cursedGauntlet.png",
    cursedGauntlet,
    "Max Energy reduced by 1, but all attacks deal <br> +50 damage, +75 critical damage <br> and shields get +10 block.",
    "elite"
  ),

  new Relics(
    "Overcharged Core",
    "Assets/overchargedCore.png",
    overchargedCore,
    "Max Energy is increased by 1, but <br> deals 5 damage to you at the end of your turn.",
    "elite"
  ),
].reduce((o, r) => {
  o[r.name] = r;
  return o;
}, {});
const relicNames = [...Object.keys(relicList)].sort();

function grindingMonstera(player) {
  window.addEventListener("EnemyDeath", () => {
    player.increaseMaxHealth(1, true);
  });
}

function sanguineBlessing(player) {
  window.addEventListener("EnemyDeath", () => {
    player.heal(3);
  });
}

function beefySteak(player) {
  console.log("Beefy Steak effect applied!");
  player.increaseMaxHealth(30, true);
}

function cursedGauntlet(player) {
  player.increaseWeaponDamage(50);
  player.increaseWeaponCritDamage(75);
  player.increaseWeaponBlock(10);
  player.increaseMaxEnergy(-1);
}

function overchargedCore(player) {
  player.increaseMaxEnergy(1);
}

function whetstone(player) {
  player.increaseWeaponCritChance(15);
}

function criticalSurge(player) {
  player.increaseWeaponCritDamage(25);
}

function defendersSeal(player) {
  player.increaseWeaponBlock(5);
}

function relicOfVigor(player) {
  player.increaseWeaponDamage(15);
}

function scrollOfKnowledge(player) {
  player.maxHandSize += 1;
  player.drawHand();
}

function brambleMantle(player) {
  // No need to modify the attack function anymore
  // Just check if the relic is equipped when the player is attacked.
  const isBrambleEquipped = loadData("relic_Bramble Mantle");
  console.log("Is Bramble Mantle equipped?", isBrambleEquipped); // Debugging log

  // Check if Bramble Mantle relic is equipped and player has an attacking enemy
  if (isBrambleEquipped && player.attackingEnemy) {
    const enemy = player.attackingEnemy;

    // Log the enemy being attacked and the damage
    console.log("Enemy is attacking the player: ", enemy);
    console.log("Dealing 5 damage back to the enemy: ", enemy); // Debugging log

    // Deal 5 damage back to the enemy
    enemy.takeDamage(5);
  } else {
    console.log("Bramble Mantle is not equipped or no enemy is attacking.");
  }
}

function omnipotence(player) {
  player.setWeaponEnergy(0);
  player.setMaxHealth(20);
}

function souleater(player) {
  console.log("Player'S weapons:", player.hand);
  player.increaseWeaponLifesteal(5);
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
