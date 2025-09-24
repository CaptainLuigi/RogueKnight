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

      this.#relicFunction(player, this);
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
  new ActiveRelics(
    "Grinding Monstera",
    "Assets/monsteraLeaf.png",
    grindingMonstera,
    "Get +1 max HP for every non-summon enemy killed.",
    "elite",
    125
  ),
  new ActiveRelics(
    "Executioner's Mark",
    "Assets/executionersMark.png",
    executionersMark,
    "Whenever an enemy is killed, draw one.",
    "chest",
    100
  ),
  new ActiveRelics(
    "Spirit Totem",
    "Assets/spiritTotem.png",
    spiritTotem,
    "Whenever an enemy dies during your turn, get 1 Energy.",
    "chest",
    125
  ),
  new ActiveRelics(
    "Sanguine Blessing",
    "Assets/SanguineBlessing.png",
    sanguineBlessing,
    "Heal 3 HP for every enemy killed.",
    "chest",
    100
  ),

  new Relics(
    "Souleater",
    "Assets/souleater.png",
    souleater,
    "All weapons get +5% lifesteal.",
    "succubus"
  ),
  new Relics(
    "Beefy Steak",
    "Assets/pixelSteak.png",
    beefySteak,
    "Get +20 max HP.",
    "chest",
    75
  ),
  new Relics(
    "Whetstone",
    "Assets/whetstone.png",
    whetstone,
    "All weapons get +15 critical chance.",
    "chest",
    100
  ),
  new Relics(
    "Scroll of Knowledge",
    "Assets/scrollRelic.png",
    scrollOfKnowledge,
    "Hand size increased by 1.",
    "chest",
    75
  ),
  new Relics(
    "Bramble Mantle",
    "Assets/brambleMantle.png",
    brambleMantle,
    "Whenever an enemy attacks you, deal 15 damage back.",
    "chest",
    75
  ),
  new Relics(
    "Relic of Vigor",
    "Assets/relicOfVigor.png",
    relicOfVigor,
    "All weapons get +15 damage.",
    "chest",
    100
  ),
  new Relics(
    "Defender's Seal",
    "Assets/defendersSeal.png",
    defendersSeal,
    "When blocking, increase the block by 5.",
    "chest",
    100
  ),
  new Relics(
    "Critical Surge",
    "Assets/criticalSurge.png",
    criticalSurge,
    "All weapons get +25 critical damage.",
    "chest",
    100
  ),
  new Relics(
    "Omnipotence",
    "Assets/blackHole.png",
    omnipotence,
    "Max Energy is increased by 3, but -70% max HP.",
    "elite",
    175
  ),
  new Relics(
    "Cursed Gauntlet",
    "Assets/cursedGauntlet.png",
    cursedGauntlet,
    "Max Energy reduced by 1, but all attacks deal +25 damage, +50 critical damage and shields get +10 block.",
    "elite",
    125
  ),
  new Relics(
    "Pacifist Amulett",
    "Assets/pacifistAmulet.png",
    pacifistAmulet,
    "Max Energy is increased by 1, but weapons deal -10 damage and -20 critical damage.",
    "elite",
    125
  ),
  new ActiveRelics(
    "Overcharged Core",
    "Assets/overchargedCore.png",
    overchargedCore,
    "Max Energy is increased by 1, but deals 3 unblockable damage to you at the end of your turn.",
    "elite",
    125
  ),

  new Relics(
    "Tincture of Suffering",
    "Assets/tinctureOfSuffering.png",
    tinktureOfSuffering,
    "When applying poison, increase the amount by 10.",
    "chest",
    100
  ),
  new ActiveRelics(
    "Golden Sigil",
    "Assets/goldenSigil.png",
    goldenSigil,
    "Get 25 Gold at the end of combat.",
    "chest",
    75
  ),
  new Relics(
    "Back to Basics",
    "Assets/backToBasics.png",
    backToBasics,
    "Max Energy is increased by 1, but you can't crit.",
    "elite",
    125
  ),
  new ActiveRelics(
    "Stonewall Totem",
    "Assets/stonewallTotem.png",
    stonewallTotem,
    "At the end of your turn, add 10 block.",
    "chest",
    100
  ),
  new Relics(
    "AliensRock",
    "Assets/aliensRock.png",
    aliensRock,
    "All weapons can target any enemy. Click weapon first, then the enemy you want to hit.",
    "elite",
    125
  ),
  new Relics(
    "Sharp Focus",
    "Assets/sharpFocus.png",
    () => {},
    "When hitting a crit, gain 1 Energy.",
    "elite",
    125
  ),
  new ActiveRelics(
    "Fist of Bulwark",
    "Assets/fistOfBulwark.png",
    fistOfBulwark,
    "When you attack, also gain 5 block.",
    "chest",
    100
  ),
  new Relics(
    "Titan's Reflection",
    "Assets/titansReflection.png",
    () => {},
    "Whenever an enemy attacks you, deal damage back equal to 3 times the remaining block after the attack.",
    "chest",
    100
  ),
  new ActiveRelics(
    "Adrenal Surge",
    "Assets/adrenalSurge.png",
    adrenalSurge,
    "Get +1 Energy at the start of your turn if you have 30% or less health.",
    "elite",
    125
  ),
  new Relics(
    "Death's Bargain",
    "Assets/deathsPact.png",
    () => {},
    "Saves you once from death and then heals you for 10%.",
    "elite",
    125
  ),
  new ActiveRelics(
    "Curse of Continuity",
    "Assets/CurseOfContinuity.png",
    curseOfContinuity,
    "Carry over up to 3 unused Energy to the next turn. Each carried over Energy does 1 damage to you at the end of your turn.",
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
  new ActiveRelics(
    "Gambler's Die",
    "Assets/dice.png",
    gamblersDie,
    "50% chance each turn to gain 2 Energy or lose 1.",
    "event"
  ),
  new Relics(
    "Infernal Ingot",
    "Assets/infernalIngot.png",
    infernalIngot,
    "All weapons get +10% lifesteal but lose half your max HP.",
    "event"
  ),
  new Relics(
    "Blood Pact",
    "Assets/bloodPact.png",
    bloodPact,
    "Weapons deal +25% damage and critical damage, but you can't heal after battle.",
    "elite",
    150
  ),
  new ActiveRelics(
    "Vengeful Echo",
    "Assets/vengefulEcho.png",
    vengefulEcho,
    "Deal 10 damage to all enemies at the end of your turn.",
    "chest",
    75
  ),
  new ActiveRelics(
    "Curse of the plague",
    "Assets/curseOfThePlague.png",
    curseOfThePlague,
    "Apply 5 poison to all enemies at the end of your turn.",
    "chest",
    100
  ),
  new Relics(
    "Alchemist’s Needle",
    "Assets/alchemistsNeedle.png",
    () => {},
    "Whenever an enemy takes damage from a weapon, apply 5 poison to that enemy.",
    "chest",
    100
  ),
  new ActiveRelics(
    "Berserkers Rush",
    "Assets/peakCondition.png",
    berserkersRush,
    "Get 5 Strength at the end of your turn if you are at or below 35HP.",
    "chest",
    100
  ),
  new ActiveRelics(
    "Enthusiastic Start",
    "Assets/enthusiasticStart.png",
    enthusiasticStart,
    "Start each battle with 10 Strength.",
    "chest",
    100
  ),
  new Relics(
    "Burden of the Strong",
    "Assets/burdenOfTheStrong.png",
    burdenOfTheStrong,
    "Curse: Decrease Hand size by 1.",
    "curse"
  ),
  new Relics(
    "Contract with Dave",
    "Assets/davesContract.png",
    () => {},
    "The promise that he will pay you back.",
    "dave"
  ),
  new ActiveRelics(
    "Woundmark",
    "Assets/woundmark.png",
    woundmark,
    "Elites take 10% damage of their max HP at the start of the fight.",
    "chest",
    100
  ),
  new Relics(
    "Zen Barrier",
    "Assets/zenBarrier.png",
    () => {},
    "Whenever an enemy attacks you and you have no cards in hand, take no damage.",
    "event"
  ),
  new Relics(
    "Steady Ground",
    "Assets/steadyGround1.png",
    () => {},
    "You can't take more than 15 damage from a single enemy hit.",
    "elite",
    150
  ),
  new Relics(
    "Cloak of Protection",
    "Assets/cloakOfProtection.png",
    cloakOfProtection,
    "Reduces all incomming damage by 1.",
    "chest",
    100
  ),
  new Relics(
    "Blood Ink",
    "Assets/bloodInk.png",
    () => {},
    "Whenever you take self damage, draw 1.",
    "chest",
    100
  ),
  new ActiveRelics(
    "Rage Reward",
    "Assets/rageReward.png",
    rageReward,
    "Whenever you attack, get 1 Strength.",
    "elite",
    150
  ),
  new Relics(
    "Enrage",
    "Assets/enrage.png",
    () => {},
    "Whenever you take self damage, get 3 Strength.",
    "chest",
    100
  ),
  new Relics(
    "Critterbite",
    "Assets/critterbite.png",
    () => {},
    "Whenever you hit a crit, apply 5 Poison to the first enemy.",
    "chest",
    100
  ),
  new ActiveRelics(
    "Untouched Heart",
    "Assets/untouchedHeart.png",
    untouchedHeart,
    "Get +5 max HP if you finish a fight full life.",
    "chest",
    100
  ),
  new ActiveRelics(
    "Eternal Bloom",
    "Assets/eternalBloom.png",
    eternalBloom,
    "Heal 10 HP at the end of combat.",
    "chest",
    75
  ),
  new ActiveRelics(
    "Reservoir Lotus",
    "Assets/reservoirLotus.png",
    reservoirLotus,
    "Heal 5 HP for each unspent Energy at the end of your turn.",
    "chest",
    100
  ),
  new Relics(
    "Alchemist Shield",
    "Assets/alchemistShield.png",
    () => {},
    "You can block Poison.",
    "chest",
    100
  ),
  new Relics(
    "Double Strike",
    "Assets/doubleStrike.png",
    doubleStrike,
    "All your attacks hit twice, but weapon damage is reduced by 40%.",
    "boss"
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
      player.increaseMaxHealth(1, true);
    }
  });
}

function curseOfContinuity(player, relicObject) {
  window.addEventListener("EndTurn", (event) => {
    console.log("EndTurn event registered");

    let unusedEnergy = 0;
    unusedEnergy = Math.min(player.energy, 3);
    if (unusedEnergy > 0) {
      event.detail.eventQueue = event.detail.eventQueue.then(() => {
        return player.takeDamage(unusedEnergy);
      });
    }

    relicObject.bonusEnergy = unusedEnergy;
  });
}

function reservoirLotus(player, relicObject) {
  window.addEventListener("EndTurn", (event) => {
    let unusedEnergy = 0;
    unusedEnergy = player.energy;
    if (unusedEnergy > 0) {
      event.detail.eventQueue = event.detail.eventQueue.then(async () => {
        player.heal(unusedEnergy * 5);
        await wait(400);
      });
    }

    relicObject.bonusEnergy = unusedEnergy;
  });
}

function berserkersRush(player, relicObject) {
  const applyBerserkersRush = async () => {
    if (player.health <= 35) {
      player.increaseStrength(5);
      player.updateStrengthDisplay();
    }
  };

  window.addEventListener("StartFight", async () => {
    await applyBerserkersRush();
  });

  window.addEventListener("StartSecondTurn", async () => {
    await applyBerserkersRush();
  });
}

function overchargedCore(player, relicObject) {
  if (!player.equippedRelics.includes("Overcharged Core")) {
    player.increaseMaxEnergy(1);
  }
  window.addEventListener("EndTurn", (event) => {
    event.detail.eventQueue = event.detail.eventQueue.then(async () => {
      player.takeDamage(3);
      await wait(400);
    });
  });
}

function bloodPact(player, relicObject) {
  if (!player.equippedRelics.includes("Blood Pact")) {
    player.increaseWeaponDamagePercent(25);
    player.increaseWeaponCritDamagePercent(25);
    player.savePlayerToStorage();
  }
}

function doubleStrike(player, relicObject) {
  if (!player) return;

  player.increaseWeaponDamagePercent(-40);
  player.increaseWeaponCritDamagePercent(-40);
  player.savePlayerToStorage();
}

function stonewallTotem(player, relicObject) {
  window.addEventListener("EndTurn", (event) => {
    event.detail.eventQueue = event.detail.eventQueue.then(async () => {
      const blockCircle = document.getElementById("block-circle");
      const blockText = document.getElementById("block-text");

      let currentBlock = parseInt(blockText.innerText) || 0;

      currentBlock += 10;

      player.blockAmount = currentBlock;
      blockText.innerText = currentBlock;

      blockCircle.classList.remove("hidden");

      await wait(300);
    });
  });
}

function vengefulEcho(player, relicObject) {
  window.addEventListener("EndTurn", (event) => {
    event.detail.eventQueue = event.detail.eventQueue.then(async () => {
      enemies.forEach((enemy) => {
        enemy.takeDamage(10, false);
      });
      await wait(300);
    });
  });
}

function curseOfThePlague(player, relicObject) {
  window.addEventListener("EndTurn", (event) => {
    event.detail.eventQueue = event.detail.eventQueue.then(async () => {
      enemies.forEach((enemy) => {
        enemy.addPoisonFromPlayer(5 + player.poisonModifier);
        enemy.updatePoisonDisplay();
      });
      await wait(300);
    });
  });
}

function enthusiasticStart(player, relicObject) {
  window.addEventListener("StartFight", (event) => {
    event.detail.eventQueue = event.detail.eventQueue.then(() => {
      player.increaseStrength(10);
      player.updateStrengthDisplay();
    });
  });
}

function woundmark(player, relicObject) {
  window.addEventListener("StartFight", (event) => {
    event.detail.eventQueue = event.detail.eventQueue.then(() => {
      const allowedDifficulties = [8, 9, 18, 19, 100];

      if (allowedDifficulties.includes(globalSettings.difficulty)) {
        enemies.forEach((enemy) => {
          const damage = enemy.maxHealth * 0.1;
          enemy.takeDamage(damage, false);
        });
      }
    });
  });
}

function untouchedHeart(player, relicObject) {
  window.addEventListener("EndFight", (event) => {
    event.detail.eventQueue = event.detail.eventQueue.then(() => {
      if (player.health === player.maxHealth) {
        player.increaseMaxHealth(5, true);
        updateHealthBar(player);
      }
    });
  });
}

function eternalBloom(player, relicObject) {
  window.addEventListener("EndFight", (event) => {
    event.detail.eventQueue = event.detail.eventQueue.then(() => {
      player.heal(10);
      updateHealthBar(player);
    });
  });
}

function goldenSigil(player, relicObject) {
  window.addEventListener("EndFight", (event) => {
    event.detail.eventQueue = event.detail.eventQueue.then(() => {
      updatePlayerGold(25);
    });
  });
}

function adrenalSurge(player, relicObject) {
  window.addEventListener("StartFight", (event) => {
    event.detail.eventQueue = event.detail.eventQueue.then(() => {
      triggerAdrenalSurge(event.detail.player);
    });
  });

  window.addEventListener("StartSecondTurn", (event) => {
    event.detail.eventQueue = event.detail.eventQueue.then(() => {
      triggerAdrenalSurge(event.detail.player);
    });
  });
}

function triggerAdrenalSurge() {
  if (player.equippedRelics.includes("Adrenal Surge")) {
    const hpRatio = player.health / player.maxHealth;
    if (hpRatio <= 0.3) {
      player.addEnergy(1);
      updateEnergyDisplay(player);
    }
  }
}

function gamblersDie(player, relicObject) {
  window.addEventListener("StartFight", (event) => {
    event.detail.eventQueue = event.detail.eventQueue.then(() => {
      triggergamblersDie(event.detail.player);
    });
  });

  window.addEventListener("StartSecondTurn", (event) => {
    event.detail.eventQueue = event.detail.eventQueue.then(() => {
      triggergamblersDie(event.detail.player);
    });
  });
}

function triggergamblersDie() {
  if (Math.random() < 0.5) {
    player.addEnergy(2);
    updateEnergyDisplay(player);
  } else {
    player.loseEnergy(1);
    updateEnergyDisplay(player);
  }
}

function rageReward(player, relicObject) {
  window.addEventListener("Attack", (event) => {
    event.detail.eventQueue = event.detail.eventQueue.then(() => {
      player.increaseStrength(1);
      player.updateStrengthDisplay();
    });
  });
}

function fistOfBulwark(player, relicObject) {
  window.addEventListener("Attack", (event) => {
    event.detail.eventQueue = event.detail.eventQueue.then(() => {
      const blockCircle = document.getElementById("block-circle");
      const blockText = document.getElementById("block-text");

      let currentBlock = parseInt(blockText.innerText) || 0;
      currentBlock += 5;

      player.blockAmount = currentBlock;
      blockText.innerText = currentBlock;

      blockCircle.classList.remove("hidden");
    });
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

function pacifistAmulet(player) {
  player.increaseWeaponDamage(-10);
  player.increaseWeaponCritDamage(-20);
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

function burdenOfTheStrong(player) {
  player.maxHandSize -= 1;
  player.drawHand();
}

function cloakOfProtection(player) {
  player.increaseDamageReduction(1);
}

function tinktureOfSuffering(player) {
  player.increasePoisonApplied(10);
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
  player.increaseMaxEnergy(3);
  player.decreaseMaxHealth(Math.floor(player.maxHealth * 0.7));
}

function souleater(player) {
  console.log("Player'S weapons:", player.hand);
  player.increaseWeaponLifesteal(5);
}

function infernalIngot(player) {
  console.log("Infernal Ingot function triggered");

  player.increaseWeaponLifesteal(10);
  player.decreaseMaxHealth(Math.floor(player.maxHealth / 2));
  player.savePlayerToStorage();
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
