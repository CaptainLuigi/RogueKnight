class Relics {
  #name;
  #icon;
  #relicFunction;
  #relicDescription;
  #relicGroup;
  #relicPrice;
  #relicInfoText;

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

  get relicInfoText() {
    return this.#relicInfoText;
  }

  constructor(
    name,
    icon,
    relicFunction,
    relicDescription,
    relicGroup,
    relicPrice,
    relicInfoText
  ) {
    this.#name = name;
    this.#icon = icon;
    this.#relicFunction = relicFunction;
    this.#relicDescription = relicDescription;
    this.#relicGroup = relicGroup;
    this.#relicPrice = relicPrice;
    this.#relicInfoText = relicInfoText;
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
    relicPrice,
    relicInfoText
  ) {
    super(
      name,
      icon,
      relicFunction,
      relicDescription,
      relicGroup,
      relicPrice,
      relicInfoText
    );
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
    125,
    "This relic is inspired by the Grinding Monstera relic from Peglin. It's a nod to the youtuber TimeToGrind."
  ),
  new ActiveRelics(
    "Executioner's Mark",
    "Assets/executionersMark.png",
    executionersMark,
    "Whenever an enemy is killed, draw one.",
    "chest",
    100,
    "Executioner's Mark is a great relic when you play a lot of weapons during your turn and need more carddraw."
  ),
  new ActiveRelics(
    "Spirit Totem",
    "Assets/spiritTotem.png",
    spiritTotem,
    "Whenever an enemy dies during your turn, get 1 Energy.",
    "chest",
    125,
    "Keep your turn going with this relic by killing enemies and getting energy from it."
  ),
  new ActiveRelics(
    "Sanguine Blessing",
    "Assets/SanguineBlessing.png",
    sanguineBlessing,
    "Heal 3 HP for every enemy killed.",
    "chest",
    100,
    "One of the best sustain relics in the game, that keeps your HP steady."
  ),

  new Relics(
    "Souleater",
    "Assets/souleater.png",
    souleater,
    "All weapons get +5% lifesteal.",
    "succubus",
    0,
    "Probably the best healing relic in the game, that can be obtained by defeating the succubus."
  ),
  new Relics(
    "Beefy Steak",
    "Assets/pixelSteak.png",
    beefySteak,
    "Get +20 max HP.",
    "chest",
    75,
    "Very simple relic, that is just nice to get."
  ),
  new Relics(
    "Whetstone",
    "Assets/whetstone.png",
    whetstone,
    "All weapons get +15 critical chance.",
    "chest",
    100,
    "When going for crit synergy, this relic is a must have. Because most weapons have higher crit damage than normal damage, this relic is technically also a damage increase."
  ),
  new Relics(
    "Scroll of Knowledge",
    "Assets/scrollRelic.png",
    scrollOfKnowledge,
    "Hand size increased by 1.",
    "chest",
    75,
    "A very uncomplicated yet useful relic when you often run out of things in your hand."
  ),
  new Relics(
    "Bramble Mantle",
    "Assets/brambleMantle.png",
    brambleMantle,
    "Whenever an enemy attacks you, deal 15 damage back.",
    "chest",
    75,
    "Punish enemies for attacking you with this relic. It has one of the more unique effects, that fit perfectly into a defense based build."
  ),
  new Relics(
    "Relic of Vigor",
    "Assets/relicOfVigor.png",
    relicOfVigor,
    "All weapons get +15 damage.",
    "chest",
    100,
    "Just very basic and plain more damage. Simple but effective."
  ),
  new Relics(
    "Defender's Seal",
    "Assets/defendersSeal.png",
    defendersSeal,
    "When blocking, increase the block by 5.",
    "chest",
    100,
    "Incredibly powerful defensive relic that doubles the block you get from the starting level 1 shields."
  ),
  new Relics(
    "Critical Surge",
    "Assets/criticalSurge.png",
    criticalSurge,
    "All weapons get +25 critical damage.",
    "chest",
    100,
    "When going for heavy crit synergy, increased critical damage is very useful. Try to take weapons with high crit chance."
  ),
  new Relics(
    "Omnipotence",
    "Assets/blackHole.png",
    omnipotence,
    "Max Energy is increased by 3, but -70% max HP.",
    "elite",
    175,
    "At launch, this relic made actions cost 0 energy, but was nerfed because goining infinite with this was just too easy. Nontheless it's still a high risk, high reward relic."
  ),
  new Relics(
    "Cursed Gauntlet",
    "Assets/cursedGauntlet.png",
    cursedGauntlet,
    "Max Energy reduced by 1, but all attacks deal +25 damage, +50 critical damage and shields get +10 block.",
    "elite",
    125,
    "This relic fits the best in builds with low energy weapons, that profit the most from the stat increases."
  ),
  new Relics(
    "Pacifist Amulett",
    "Assets/pacifistAmulet.png",
    pacifistAmulet,
    "Max Energy is increased by 1, but weapons deal -10 damage and -20 critical damage.",
    "elite",
    125,
    "When taking this relic, try to focus on higher cost weapons, that don't suffer that much from the damage decrease."
  ),
  new ActiveRelics(
    "Overcharged Core",
    "Assets/overchargedCore.png",
    overchargedCore,
    "Max Energy is increased by 1, but deals 3 unblockable damage to you at the end of your turn.",
    "elite",
    125,
    "Very useful relic, but don't forget to heal from time to time."
  ),

  new Relics(
    "Tincture of Suffering",
    "Assets/tinctureOfSuffering.png",
    tinktureOfSuffering,
    "When applying poison, increase the amount by 10.",
    "chest",
    100,
    "Finding synergies for weapons and relics is the core part of the game, so if you want to lean into poison, this is the best relic for you."
  ),
  new ActiveRelics(
    "Golden Sigil",
    "Assets/goldenSigil.png",
    goldenSigil,
    "Get 25 Gold at the end of combat.",
    "chest",
    75,
    "This nondescript relic seems underwhelming at first, but if you get it early in the run, it makes you a lot of gold."
  ),
  new Relics(
    "Back to Basics",
    "Assets/backToBasics.png",
    backToBasics,
    "Max Energy is increased by 1, but you can't crit.",
    "elite",
    125,
    "When going for weapons with high normal damage, this relic is for you. But keep in mind that some relics can't trigger when you have this relic."
  ),
  new ActiveRelics(
    "Stonewall Totem",
    "Assets/stonewallTotem.png",
    stonewallTotem,
    "At the end of your turn, add 10 block.",
    "chest",
    100,
    "Getting unconditional block is always good, so you can focus your energy to attack the enemy."
  ),
  new Relics(
    "AliensRock",
    "Assets/aliensRock.png",
    aliensRock,
    "All weapons can target any enemy. Click weapon first, then the enemy you want to hit.",
    "elite",
    125,
    "AliensRock is a reference to one of my favourite youtubers. With this relic you can focus the enemy you want."
  ),
  new ActiveRelics(
    "Sharp Focus",
    "Assets/sharpFocus.png",
    sharpFocus,
    "When hitting a crit, gain 1 Energy.",
    "elite",
    125,
    "A very impactful relic with a lot of synergies with weapons and other relics. Focus on crit chance to trigger this relic as often as possible."
  ),
  new ActiveRelics(
    "Fist of Bulwark",
    "Assets/fistOfBulwark.png",
    fistOfBulwark,
    "When you attack, also gain 5 block.",
    "chest",
    100,
    "With this relic you can turn attacks also into defense. Most effective when using a lot of low energy weapons."
  ),
  new Relics(
    "Titan's Reflection",
    "Assets/titansReflection.png",
    () => {},
    "Whenever an enemy attacks you, deal damage back equal to 3 times the remaining block after the attack.",
    "chest",
    100,
    "Focusing on defense often leaves the offense behind. Titan's Reflection can turn that into a lot of damage."
  ),
  new ActiveRelics(
    "Adrenal Surge",
    "Assets/adrenalSurge.png",
    adrenalSurge,
    "Get +1 Energy at the start of your turn if you have 30% or less health.",
    "elite",
    125,
    "One of the more conditional energy increase relics."
  ),
  new Relics(
    "Death's Bargain",
    "Assets/deathsPact.png",
    () => {},
    "Saves you once from death and then heals you for 10%.",
    "elite",
    125,
    "With this very unique relic effect you can cheat death once."
  ),
  new ActiveRelics(
    "Curse of Continuity",
    "Assets/CurseOfContinuity.png",
    curseOfContinuity,
    "Carry over up to 3 unused Energy to the next turn. Each carried over Energy does 1 damage to you at the end of your turn.",
    "elite",
    150,
    "You can use this relic to stack up energy to use on a later round. Works best if you can get some additional energy."
  ),
  new Relics(
    "Bloodforge",
    "Assets/anvil.png",
    () => {},
    "Whenever you add something to your deck, upgrade it and lose 5 HP.",
    "event",
    0,
    "This relic is originally from peglin. It immediately upgrades new weapons at the cost of some HP."
  ),
  new Relics(
    "Death's Pact",
    "Assets/deathsBargain2.png",
    () => {},
    "Halfes incoming damage from enemies.",
    "unfindable",
    0,
    "This relic is only obtained by triggering the Death's Bargain. If you make it out the fight alive, future hits don't hit that hard."
  ),
  new ActiveRelics(
    "Gambler's Die",
    "Assets/dice.png",
    gamblersDie,
    "50% chance each turn to gain 2 Energy or lose 1.",
    "event",
    0,
    "In RogueLikes there is always luck involved. Even getting this relic requires luck."
  ),
  new Relics(
    "Infernal Ingot",
    "Assets/InfernalIngot.png",
    infernalIngot,
    "All weapons get +10% lifesteal but lose half your max HP.",
    "event",
    0,
    "Another relic taken from peglin. With this relic, you pretty much never need to heal."
  ),
  new Relics(
    "Blood Pact",
    "Assets/bloodPact.png",
    bloodPact,
    "Weapons deal +25% damage and critical damage, but you can't heal after battle.",
    "elite",
    150,
    "Very few relics have a percentage based damage increase. This makes this relic immensely powerful, you just need to find another way to heal."
  ),
  new ActiveRelics(
    "Vengeful Echo",
    "Assets/vengefulEcho.png",
    vengefulEcho,
    "Deal 10 damage to all enemies at the end of your turn.",
    "chest",
    75,
    "This straightforward relic can wreck up a lot of damage over the course of the game."
  ),
  new ActiveRelics(
    "Curse of the plague",
    "Assets/curseOfThePlague.png",
    curseOfThePlague,
    "Apply 5 poison to all enemies at the end of your turn.",
    "chest",
    100,
    "Especially in poison focused runs, this relic can be very helpful."
  ),
  new Relics(
    "Alchemist’s Needle",
    "Assets/alchemistsNeedle.png",
    () => {},
    "Whenever an enemy takes damage from a weapon, apply 5 poison to that enemy.",
    "chest",
    100,
    "Get damage through and also poison enemies. Extra helpful if you have poison synergy."
  ),
  new ActiveRelics(
    "Berserkers Rush",
    "Assets/peakCondition.png",
    berserkersRush,
    "Get 5 Strength at the end of your turn if you are at or below 35HP.",
    "chest",
    100,
    "The rage fills you when you are low and increases your damage."
  ),
  new ActiveRelics(
    "Enthusiastic Start",
    "Assets/enthusiasticStart.png",
    enthusiasticStart,
    "Start each battle with 10 Strength.",
    "chest",
    100,
    "Just a nice basic damage increase for normal and critcal damage."
  ),
  new Relics(
    "Burden of the Strong",
    "Assets/burdenOfTheStrong.png",
    burdenOfTheStrong,
    "Curse: Decrease Hand size by 1.",
    "curse",
    0,
    "This curse is used to balance a special event. Fewer weapons in hand means fewer options."
  ),
  new Relics(
    "Contract with Dave",
    "Assets/davesContract.png",
    () => {},
    "The promise that he will pay you back.",
    "dave",
    0,
    "You get this relic by lending Dave some gold. If you are lucky, you encounter him later on your journey."
  ),
  new ActiveRelics(
    "Woundmark",
    "Assets/woundmark.png",
    woundmark,
    "Elites take 10% damage of their max HP at the start of the fight.",
    "chest",
    100,
    "This makes elite fights a little bit easier. And who doesn't like easier fights?"
  ),
  new Relics(
    "Zen Barrier",
    "Assets/zenBarrier.png",
    () => {},
    "Whenever an enemy attacks you and you have no cards in hand, take no damage.",
    "event",
    0,
    "This relic could be broken or straight up useless, it depends on your build and how you can work around it."
  ),
  new Relics(
    "Steady Ground",
    "Assets/steadyGround1.png",
    () => {},
    "You can't take more than 15 damage from a single enemy hit.",
    "elite",
    150,
    "Steady Ground prevents enemies from hitting you with big attacks, so you don't have to worry as much about your defense."
  ),
  new Relics(
    "Cloak of Protection",
    "Assets/cloakOfProtection.png",
    cloakOfProtection,
    "Reduces all incomming damage by 1.",
    "chest",
    100,
    "Reducing every instance of damage you take is quite useful. It doesn' matter if the damage comes from an event, an enemy or even another relic."
  ),
  new ActiveRelics(
    "Blood Ink",
    "Assets/bloodInk.png",
    bloodInk,
    "Whenever you take self damage, draw 1.",
    "chest",
    100,
    "With this relic, taking self damage has an upside."
  ),
  new ActiveRelics(
    "Rage Reward",
    "Assets/rageReward.png",
    rageReward,
    "Whenever you attack, get 1 Strength.",
    "elite",
    150,
    "This relic almost always applies. Especially in long fights, your damage can increase a lot."
  ),
  new ActiveRelics(
    "Enrage",
    "Assets/enrage.png",
    enrage,
    "Whenever you take self damage, get 3 Strength.",
    "chest",
    100,
    "Self damage is mostly connected to increasing your damage. Why don't you double down with this relic?"
  ),
  new ActiveRelics(
    "Critterbite",
    "Assets/critterbite.png",
    critterbite,
    "Whenever you hit a crit, apply 5 Poison to the first enemy.",
    "chest",
    100,
    "Poison weapons already favour crits, so with Critterbite, you have another way to apply poison."
  ),
  new ActiveRelics(
    "Untouched Heart",
    "Assets/untouchedHeart.png",
    untouchedHeart,
    "Get +5 max HP if you finish a fight full life.",
    "chest",
    100,
    "Untouched Heart is undeniably a win more relic. It could be also good if you focus on healing and defense."
  ),
  new ActiveRelics(
    "Eternal Bloom",
    "Assets/eternalBloom.png",
    eternalBloom,
    "Heal 10 HP at the end of combat.",
    "chest",
    75,
    "Using this relic, you don't have to spent that much gold on healing and can focus on upgrading your deck."
  ),
  new ActiveRelics(
    "Reservoir Lotus",
    "Assets/reservoirLotus.png",
    reservoirLotus,
    "Heal 5 HP for each unspent Energy at the end of your turn.",
    "chest",
    100,
    "A very niche usecase. Maybe it's sometimes helpful to drag out a fight to heal a bit?"
  ),
  new Relics(
    "Alchemist Shield",
    "Assets/alchemistShield.png",
    () => {},
    "You can block Poison.",
    "chest",
    100,
    "This is the only way to block poison completely. That can be convenient in later fights."
  ),
  new Relics(
    "Pile of Gold",
    "Assets/goldCoins2.gif",
    () => {},
    "Get 50 Gold on pickup.",
    "fallback",
    0,
    "You get this relic if no other relic is available."
  ),
  new Relics(
    "Double Strike",
    "Assets/doubleStrike.png",
    doubleStrike,
    "Your weapons attack twice, but weapon damage is reduced by 40%.",
    "boss",
    0,
    "Powerful relic, that doubles all attack triggers and also has a small damage increase of it's own."
  ),
  new Relics(
    "Critikris",
    "Assets/critikris.png",
    critikris,
    "All weapons get +50 critical chance.",
    "boss",
    0,
    "Crit synergies were never easier with this relic. Getting a crit more often means more damage and possibly other positive effects."
  ),
  new Relics(
    "Champion's Might",
    "Assets/championsMight.png",
    championsMight,
    "Reduce Energy cost for weapons by one, can't reduce to 0. Weapon damage is reduced by 25%.",
    "boss",
    0,
    "Make your heavy hitting weapons cheaper. Focusing on high energy weapons is the best way to use this relic."
  ),
  new ActiveRelics(
    "Broken Heart",
    "Assets/brokenHeart.png",
    brokenHeart,
    "Curse: Take 5 damage at the end of your turn.",
    "curse",
    0,
    "The lovesickness is wearing you down."
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

function championsMight(player, relicObject) {
  player.deck.forEach((weapon) => {
    if (weapon.damage > 0) {
      weapon.energy = Math.max(1, weapon.energy - 1);
    }
  });
  player.increaseWeaponDamagePercent(-25);
  player.increaseWeaponCritDamagePercent(-25);
  player.savePlayerToStorage();
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

function brokenHeart(player, relicObject) {
  window.addEventListener("EndTurn", (event) => {
    event.detail.eventQueue = event.detail.eventQueue.then(async () => {
      player.takeDamage(5);
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

function bloodInk(player, relicObject) {
  window.addEventListener("SelfDamage", (event) => {
    player.drawExtraCards(1);
  });
}

function enrage(player, relicObject) {
  window.addEventListener("SelfDamage", (event) => {
    event.detail.eventQueue = event.detail.eventQueue.then(async () => {
      player.increaseStrength(3);
      player.updateStrengthDisplay();
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

function critikris(player) {
  player.increaseWeaponCritChance(50);
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

function sharpFocus(player, relicObject) {
  window.addEventListener("Attack", (event) => {
    if (event.detail.isCritical) {
      event.detail.eventQueue = event.detail.eventQueue.then(() => {
        player.addEnergy(1);
        updateEnergyDisplay(player);
      });
    }
  });
}

function critterbite(player, relicObject) {
  window.addEventListener("Attack", (event) => {
    if (event.detail.isCritical) {
      event.detail.eventQueue = event.detail.eventQueue.then(() => {
        const firstEnemy = enemies[0];
        firstEnemy.addPoisonFromPlayer(5 + player.poisonModifier);
        firstEnemy.updatePoisonDisplay();
      });
    }
  });
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

  preventMobileImgDownload(relicImage);

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

// function displayEquippedRelics() {
//   const relicContainer = document.getElementById("equipped-relic-container");

//   relicContainer.innerHTML = "";

//   player.equippedRelics.forEach((relicName) => {
//     const relic = relicList[relicName];
//     if (relic) {
//       const relicElement = createRelicElement(relic);
//       relicContainer.appendChild(relicElement);
//     }
//   });
// }

function displayEquippedRelics() {
  const relicContainer = document.getElementById("equipped-relic-container");
  relicContainer.innerHTML = "";

  // Two columns
  const column1 = document.createElement("div");
  const column2 = document.createElement("div");

  column1.style.display = "flex";
  column1.style.flexDirection = "column";
  column1.style.gap = "0.5vw";
  column2.style.display = "flex";
  column2.style.flexDirection = "column";
  column2.style.gap = "0.5vw";

  // Make relic container a flex container
  relicContainer.style.display = "flex";
  relicContainer.style.gap = "0.5vw";
  relicContainer.style.overflowY = "auto";
  relicContainer.style.maxHeight = "80vh"; // scrollable if too tall
  relicContainer.style.padding = "0.5vw";

  relicContainer.appendChild(column1);
  relicContainer.appendChild(column2);

  player.equippedRelics.forEach((relicName, index) => {
    const relic = relicList[relicName];
    if (!relic) return;

    const relicWrapper = document.createElement("div");
    relicWrapper.className = "relic-wrapper";
    relicWrapper.style.position = "relative";

    const img = document.createElement("img");
    img.src = relic.icon || "placeholder.png";
    img.alt = relicName;
    img.className = "relic-image";
    img.style.width = "2.5vw";
    img.style.height = "2.5vw";
    img.style.objectFit = "contain";
    img.style.border = "0.2vw solid black";
    img.style.borderRadius = "0.25vw";
    img.style.padding = "0.25vw";
    img.style.imageRendering = "pixelated";

    relicWrapper.appendChild(img);

    // Tooltip
    const tooltip = document.createElement("div");
    tooltip.className = "relicTooltip";
    tooltip.style.position = "absolute";
    tooltip.style.backgroundColor = "rgba(0,0,0,0.75)";
    tooltip.style.color = "white";
    tooltip.style.padding = "0.5vw";
    tooltip.style.borderRadius = "0.5vw";
    tooltip.style.fontSize = "1.25rem";
    tooltip.style.maxWidth = "20.5vw";
    tooltip.style.whiteSpace = "normal";
    tooltip.style.display = "none";
    tooltip.style.zIndex = "10000";

    tooltip.innerHTML = `<strong>${relic.name || relicName}</strong><br>${
      relic.relicDescription || "No description available."
    }`;

    document.body.appendChild(tooltip);

    img.addEventListener("mouseenter", (e) => {
      const rect = img.getBoundingClientRect();
      tooltip.style.left = `${rect.right + 5}px`;
      tooltip.style.top = `${rect.top}px`;
      tooltip.style.display = "block";
    });

    img.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });

    // Alternating layout: top-bottom left-right
    // Even index → column1, odd index → column2
    if (index % 2 === 0) {
      column1.appendChild(relicWrapper);
    } else {
      column2.appendChild(relicWrapper);
    }
  });
}
