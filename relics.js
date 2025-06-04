class Relics {
  #name;
  #icon;
  #relicFunction;
  #relicDescription;
  #relicGroup;
  #relicPrice;

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

  get relicPrice() {
    return this.#relicPrice;
  }

  constructor(
    name,
    icon,
    relicFunction,
    relicDescription,
    relicGroup,
    relicPrice
  ) {
    this.#name = name;
    this.#icon = icon;
    this.#relicFunction = relicFunction;
    this.#relicDescription = relicDescription;
    this.#relicGroup = relicGroup;
    this.#relicPrice = relicPrice;
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
  constructor(
    name,
    icon,
    relicFunction,
    relicDescription,
    relicGroup,
    relicPrice
  ) {
    super(name, icon, relicFunction, relicDescription, relicGroup, relicPrice);
  }
  markEquipped() {}
}

const relicList = [
  // new ActiveRelics(
  //   "Grinding Monstera",
  //   "Assets/monsteraLeaf.png",
  //   grindingMonstera,
  //   "Get +2 max HP for every non-summon enemy killed.",
  //   "elite",
  //   100
  // ),

  // new ActiveRelics(
  //   "Executioner's Mark",
  //   "Assets/executionersMark.png",
  //   executionersMark,
  //   "Whenever an enemy is killed, draw one.",
  //   "chest",
  //   100
  // ),

  // new ActiveRelics(
  //   "Spirit Totem",
  //   "Assets/spiritTotem.png",
  //   spiritTotem,
  //   "Whenever an enemy dies, get one energy.",
  //   "chest",
  //   125
  // ),

  // new ActiveRelics(
  //   "Sanguine Blessing",
  //   "Assets/sanguineBlessing.png",
  //   sanguineBlessing,
  //   "Heal 3 HP for every enemy killed.",
  //   "chest",
  //   100
  // ),

  // new Relics(
  //   "Eternal Bloom",
  //   "Assets/eternalBloom.png",
  //   () => {},
  //   "Heal 10 HP at the end of combat.",
  //   "chest",
  //   75
  // ),

  // new Relics(
  //   "Souleater",
  //   "Assets/souleater.png",
  //   souleater,
  //   "All weapons get +5% lifesteal",
  //   "succubus"
  // ),

  // new Relics(
  //   "Beefy Steak",
  //   "Assets/pixelSteak.png",
  //   beefySteak,
  //   "Get +20 max HP.",
  //   "chest",
  //   75
  // ),

  // new Relics(
  //   "Whetstone",
  //   "Assets/whetstone.png",
  //   whetstone,
  //   "All weapons get +15 critical chance.",
  //   "chest",
  //   100
  // ),

  // new Relics(
  //   "Scroll of Knowledge",
  //   "Assets/scrollRelic.png",
  //   scrollOfKnowledge,
  //   "Hand size increased by 1.",
  //   "chest",
  //   75
  // ),

  // new Relics(
  //   "Bramble Mantle",
  //   "Assets/brambleMantle.png",
  //   brambleMantle,
  //   "Whenever an enemy attacks you, deal 15 damage back.",
  //   "chest",
  //   75
  // ),

  // new Relics(
  //   "Relic of Vigor",
  //   "Assets/relicOfVigor.png",
  //   relicOfVigor,
  //   "All weapons get +15 damage.",
  //   "chest",
  //   100
  // ),

  // new Relics(
  //   "Defender's Seal",
  //   "Assets/defendersSeal.png",
  //   defendersSeal,
  //   "When blocking, increase the block by 5.",
  //   "chest",
  //   100
  // ),

  // new Relics(
  //   "Critical Surge",
  //   "Assets/criticalSurge.png",
  //   criticalSurge,
  //   "All weapons get +25 critical damage.",
  //   "chest",
  //   100
  // ),

  // new Relics(
  //   "Omnipotence",
  //   "Assets/blackHole.png",
  //   omnipotence,
  //   "Actions don't cost energy, but -80 max HP.",
  //   "elite",
  //   175
  // ),

  // new Relics(
  //   "Cursed Gauntlet",
  //   "Assets/cursedGauntlet.png",
  //   cursedGauntlet,
  //   "Max Energy reduced by 1, but all attacks deal +25 damage, +50 critical damage and shields get +10 block.",
  //   "elite",
  //   125
  // ),

  // new Relics(
  //   "Overcharged Core",
  //   "Assets/overchargedCore.png",
  //   overchargedCore,
  //   "Max Energy is increased by 1, but deals 5 unblockable damage to you at the end of your turn.",
  //   "elite",
  //   125
  // ),

  // new Relics(
  //   "Cloak of Protection",
  //   "Assets/cloakOfProtection.png",
  //   cloakOfProtection,
  //   "Reduces incoming damage during battle by 1.",
  //   "chest",
  //   100
  // ),

  // new Relics(
  //   "Tincture of Suffering",
  //   "Assets/tinctureOfSuffering.png",
  //   tinktureOfSuffering,
  //   "When applying poison, increase the amount by 10.",
  //   "chest",
  //   100
  // ),

  // new Relics(
  //   "Golden Sigil",
  //   "Assets/goldenSigil.png",
  //   () => {},
  //   "Get 25 Gold at the end of combat.",
  //   "chest",
  //   75
  // ),

  // new Relics(
  //   "Back to Basics",
  //   "Assets/backToBasics.png",
  //   backToBasics,
  //   "Max Energy is increased by 1, but you can't crit.",
  //   "elite",
  //   125
  // ),

  // new Relics(
  //   "Stonewall Totem",
  //   "Assets/stonewallTotem.png",
  //   () => {},
  //   "At the end of your turns, add 10 block.",
  //   "chest",
  //   100
  // ),

  // new Relics(
  //   "AliensRock",
  //   "Assets/aliensRock.png",
  //   aliensRock,
  //   "All weapons can target any enemy. Click weapon first, then the enemy you want to hit.",
  //   "elite",
  //   125
  // ),

  // new Relics(
  //   "Sharp Focus",
  //   "Assets/sharpFocus.png",
  //   () => {},
  //   "When hitting a crit, gain 1 Energy.",
  //   "elite",
  //   125
  // ),

  // new Relics(
  //   "Fist of Bulwark",
  //   "Assets/fistOfBulwark.png",
  //   () => {},
  //   "When you attack, also gain 5 block.",
  //   "chest",
  //   100
  // ),

  // new Relics(
  //   "Titan's Reflection",
  //   "Assets/titansReflection.png",
  //   () => {},
  //   "Whenever an enemy attacks you, deal damage back equal to 3 times the remaining block after the attack.",
  //   "chest",
  //   100
  // ),

  // new Relics(
  //   "Adrenal Surge",
  //   "Assets/adrenalSurge.png",
  //   () => {},
  //   "Get +1 Energy at the start of your turn if you have 30% or less health.",
  //   "elite",
  //   125
  // ),

  // new Relics(
  //   "Death's Bargain",
  //   "Assets/deathsPact.png",
  //   () => {},
  //   "Saves you once from death and then heals you for 10%.",
  //   "elite",
  //   125
  // ),

  new Relics(
    "Curse of Continuity",
    "Assets/Sword.png",
    () => {},
    "Carry over up to 3 unused energy to the next turn. Each carried over energy does 3 damage to you.",
    "elite",
    150
  ),

  new Relics(
    "Bloodforge",
    "Assets/anvil.png",
    () => {},
    "Whenever you add something to your deck, upgrade it and lose 5 HP.",
    "event",
    0
  ),

  new Relics(
    "Death's Pact",
    "Assets/deathsBargain2.png",
    () => {},
    "Halfes incoming damage from enemies.",
    "unfindable",
    0
  ),

  new Relics(
    "Gambler's Die",
    "Assets/dice.png",
    () => {},
    "50% chance eache turn to gain 2 energy or lose 1.",
    "event"
  ),
].reduce((o, r) => {
  o[r.name] = r;
  return o;
}, {});
const relicNames = [...Object.keys(relicList)].sort();

function grindingMonstera(player) {
  window.addEventListener("EnemyDeath", (event) => {
    const enemy = event.detail.enemy;

    if (enemy && !enemy.isSummoned) {
      player.increaseMaxHealth(2, true);
    }
  });
}

function executionersMark(player) {
  window.addEventListener("EnemyDeath", () => {
    player.drawExtraCards(1);
  });
}

function spiritTotem(player) {
  window.addEventListener("EnemyDeath", () => {
    player.addEnergy(1);
  });
}

function sanguineBlessing(player) {
  window.addEventListener("EnemyDeath", () => {
    player.heal(3);
  });
}

function beefySteak(player) {
  console.log("Beefy Steak effect applied!");
  player.increaseMaxHealth(20, true);
}

function cursedGauntlet(player) {
  player.increaseWeaponDamage(25);
  player.increaseWeaponCritDamage(50);
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

function cloakOfProtection(player) {
  player.increaseDamageReduction(1);
}

function tinktureOfSuffering(player) {
  player.increasePoisonApplied(10);
}

function eternalBloom(player) {
  player.heal(10);
  updateHealthBar(player);
}

function aliensRock(player) {
  player.setTargetAnyEnemy(true);
}

function sharpFocus(player) {
  player.addEnergy(1);
  updateEnergyDisplay(player);
}

function deathsBargain(player) {
  player.removeRelic("Death's Bargain");
  player.foundRelic("Death's Pact", true);
  displayEquippedRelics();
}

function adrenalSurge() {
  if (player.equippedRelics.includes("Adrenal Surge")) {
    const hpRatio = player.health / player.maxHealth;
    if (hpRatio <= 0.3) {
      player.addEnergy(1);
      updateEnergyDisplay();
    }
  }
}

function stonewallTotem() {
  const blockContainer = document.getElementById("block-container");
  const blockText = document.getElementById("block-text");

  let currentBlock = parseInt(blockText.innerText) || 0;

  currentBlock += 10;

  player.blockAmount = currentBlock;
  blockText.innerText = currentBlock;

  blockContainer.classList.remove("hidden");
}

function fistOfBulwark() {
  const blockContainer = document.getElementById("block-container");
  const blockText = document.getElementById("block-text");

  let currentBlock = parseInt(blockText.innerText) || 0;
  currentBlock += 5;

  player.blockAmount = currentBlock;
  blockText.innerText = currentBlock;

  blockContainer.classList.remove("hidden");
}

function goldenSigil() {
  updatePlayerGold(25);
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
  player.decreaseMaxHealth(80);
}

function souleater(player) {
  console.log("Player'S weapons:", player.hand);
  player.increaseWeaponLifesteal(5);
}

function backToBasics(player) {
  player.increaseMaxEnergy(1);
  player.critsDisabled = true;
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
