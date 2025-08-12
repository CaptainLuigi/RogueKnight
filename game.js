let player = new Player("Knight", 100, 100, [], 3, 3);

let playerSprite;

document.addEventListener("DOMContentLoaded", function () {
  initializeHealthBars(player);
  updateEnergyDisplay();

  console.log("DOM fully loaded, difficulty: " + globalSettings.difficulty);
  playerSprite = document.querySelector(".sprite-player");
  // Start the idle animation immediately when the page loads
  resetToIdleAnimation(); // This will start the idle animation
  // Call the function to display the weapons

  player.loadPlayerFromStorage();

  refillEnergy();

  displayWeapons(player, player.hand);

  Enemy.initialize();

  fillEnemyArray(globalSettings.difficulty);

  setEnemyIndices();
  // Add the event listener to the "End Turn" button
  document.getElementById("end-turn-btn").addEventListener("click", endTurn);

  updatePlayerGold(0);
  updateHealthBar(player);
  updateEnergyDisplay(player);

  SoundManager.preloadAll();

  document.getElementById("start-fight-btn").addEventListener("click", () => {
    // Unlock all sounds by playing silently once
    for (const key in SoundManager.sounds) {
      const audio = SoundManager.sounds[key];
      audio.volume = 0;
      audio
        .play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.volume = 1; // Restore original volume
        })
        .catch((e) => {
          console.warn(`Failed to unlock ${key}`, e);
        });
    }

    document.getElementById("battle-overlay").style.display = "none";
    SoundManager.playBattleMusic();

    if (globalSettings.isTutorial) {
      document.getElementById("tutorial-intro-overlay").style.display = "block";

      document
        .getElementById("continue-fight")
        .addEventListener("click", () => {
          document.getElementById("tutorial-intro-overlay").style.display =
            "none";
        });
    }
  });

  if (player.equippedRelics.includes("Blood Pact")) {
    const healButton = document.getElementById("heal-btn");
    healButton.disabled = true;
  }

  if (player.equippedRelics.includes("Enthusiastic Start")) {
    player.increaseStrength(10);
    player.updateStrengthDisplay();
  }

  if (
    player.equippedRelics.includes("Woundmark") &&
    (globalSettings.difficulty === 8 ||
      globalSettings.difficulty === 9 ||
      globalSettings.difficulty === 18 ||
      globalSettings.difficulty === 19)
  ) {
    enemies.forEach((enemy) => {
      const damage = enemy.maxHealth * 0.1;
      enemy.takeDamage(damage, false);
    });
  }
});

function fillEnemyArray(currentDifficulty) {
  const filteredEnemyArray = enemyConstellationTemplates.filter(
    (constellation) => {
      return (
        constellation.difficultyFrom <= currentDifficulty &&
        constellation.difficultyTo >= currentDifficulty
      );
    }
  );

  let selectedIndex = localStorage.getItem("selectedFightIndex");

  if (selectedIndex === null) {
    // No fight selected yet — randomize and save
    selectedIndex = Math.floor(Math.random() * filteredEnemyArray.length);
    localStorage.setItem("selectedFightIndex", selectedIndex);
  } else {
    selectedIndex = parseInt(selectedIndex);
  }

  const selectedConstellation = filteredEnemyArray[selectedIndex];

  for (const EnemyClass of selectedConstellation.enemies) {
    const enemyInstance = new EnemyClass();
    enemyInstance.randomizeAction();
    enemyInstance.displayIntent();
  }

  console.log("Loaded fight constellation:", selectedConstellation);
}

let isPlayerTurn = true; // Flag to track if it's the player's turn

async function enemyDeathEvent(deadEnemy) {
  const event = new CustomEvent("EnemyDeath", {
    detail: { enemy: deadEnemy },
  });
  window.dispatchEvent(event);

  setEnemyIndices();

  if (enemies.every((enemy) => enemy.isDead())) {
    disableGameInteractions(); // Disable game interactions after the battle

    // await wait(1000);

    if (globalSettings.difficulty === 0 || globalSettings.difficulty === 20) {
      SoundManager.fadeOutBattleMusic();
      await wait(1500);
      localStorage.removeItem("selectedFightIndex");
      window.location.href = "winscreen.html";
    } else if (globalSettings.difficulty === 10) {
      SoundManager.fadeOutBattleMusic();
      await wait(1500);
      localStorage.removeItem("selectedFightIndex");

      const actTransition = document.getElementById("actTransition");
      actTransition.classList.remove("hidden");

      await wait(50);

      playerSprite = actTransition.querySelector(".sprite");

      if (playerSprite) {
        resetToIdleAnimation();
      }

      document.getElementById("act2").addEventListener("click", () => {
        globalSettings.currentAct = 2;
        updatePlayerGold(100);
        player.heal(player.maxHealth);
        player.savePlayerToStorage();
        window.location.href = "map.html";
      });
    } else {
      triggerPostBattleScreen();
    }
  }
}

function disableGameInteractions() {
  const weaponButtons = document.querySelectorAll(".weapon-button");
  weaponButtons.forEach((button) => {
    button.disabled = true;
  });

  const endTurnButton = document.getElementById("end-turn-btn");
  if (endTurnButton) {
    endTurnButton.disabled = true;
  }
  displayTurnMessage("All enemies defeated! The Battle is over!");
}

function setEnemyIndices() {
  for (let index in enemies) {
    let enemy = enemies[index];
    // enemy.display.setAttribute("index", index);
  }
}

// Handle weapon selection
function useWeapon(weaponIndex) {
  if (!isPlayerTurn) {
    // Prevent using weapons if it's not the player's turn
    displayTurnMessage("It's not your turn!");
    return;
  }

  if (enemies.every((enemy) => enemy.isDead())) {
    displayTurnMessage("They are already dead!");
    return;
  }

  const weapon = player.hand[weaponIndex];
  if (weapon.wasUsed) {
    displayTurnMessage("Not so fast!");
    return;
  }

  console.log("Using weapon:", weapon.name);

  if (player.energy >= weapon.energy) {
    const hasRelicTargeting = player.canTargetAnyEnemy(weapon);
    const needsTargeting = weapon.requiresTargeting || hasRelicTargeting;

    if (weapon.drawAmountOnUse > 0) {
      player.drawExtraCards(weapon.drawAmountOnUse);
    }

    if (needsTargeting) {
      setActiveWeapon(weaponIndex, true);
    } else {
      executeAttack(weapon, weapon.minRange).then(() => {});
      if (weapon.energyGainOnUse > 0) {
        player.addEnergy(weapon.energyGainOnUse);
      }
    }
  } else {
    displayTurnMessage("Not enough energy!");
  }
}

function weaponHover(weaponNode) {
  console.log(weaponNode);
  let index = weaponNode.getAttribute("index");
  console.log(index);
  index = parseInt(index);
  console.log(index);
  let weapon = player.hand[index];
  console.log(weapon);
  const possibleTargets = weapon.possibleTargets();
  console.log(possibleTargets);
  for (let enemyIndex of possibleTargets)
    enemies[enemyIndex].display.classList.add(tempTargetsCls);
}

function clearSelection() {
  let activeTargets = document.querySelectorAll(
    "." + possibleTargetsCls + ", ." + tempTargetsCls
  );
  for (let active of activeTargets) {
    active.classList.remove(possibleTargetsCls);
    active.classList.remove(tempTargetsCls);
    //active.removeAttribute("style");
  }
}

const possibleTargetsCls = "possibleTargets";
const tempTargetsCls = "tempTargets";

let activeWeapon;
let activePossibleTargets;

function setActiveWeapon(weaponIndex) {
  if (weaponIndex < 0) {
    activeWeapon = null;
    activePossibleTargets = null;
    return;
  }
  activeWeapon = player.hand[weaponIndex];
  activePossibleTargets = activeWeapon.possibleTargets();
}

/**
 *
 * @param {Weapons} weapon used weapon
 * @param {int} enemyIndex
 */
async function executeAttack(weapon, enemyIndex) {
  if (enemies.every((enemy) => enemy.isDead())) {
    displayTurnMessage("They are already dead!");
    return;
  }

  // Call the damage calculation function
  let { startIndex, isCritical, damages } = weapon.calculateDamage(
    enemyIndex,
    player.damageModifier,
    player.critChanceModifier,
    player.critDamageModifier,
    player.poisonModifier
  );
  damages = damages.reverse();
  startIndex += damages.length - 1;

  applyBlock(weapon, player.blockModifier);

  const soundCategory = weapon.soundCategory;
  if (soundCategory) {
    SoundManager.play(soundCategory);
  }

  if (weapon.selfDamage > 0) {
    player.takeDamage(weapon.selfDamage);
  }

  if (weapon.damage > 0 && weapon.blockAmount === 0) {
    triggerAttackAnimation();
    await wait(200);
  } else {
    triggerBlockAnimation();
    await wait(300);
  }

  let overallDamageTaken = 0;

  for (let i = 0; i < damages.length; i++) {
    const targetIndex = startIndex - i;
    const enemy = enemies[targetIndex];
    const enemyDamage = damages[i];

    enemy.displayDamage(enemyDamage, isCritical);

    const damageTaken = enemy.takeDamage(enemyDamage);
    damages[i] = damageTaken;
    overallDamageTaken += damageTaken;

    // === Alchemist’s Needle poison application ===
    if (
      damageTaken > 0 &&
      !enemy.isDead() &&
      player.equippedRelics.includes("Alchemist’s Needle")
    ) {
      enemy.addPoisonFromPlayer(5 + player.poisonModifier);
      enemy.updatePoisonDisplay();
    }
  }

  damages = damages.reverse();

  setIdleTimeout();

  // Lifesteal from total damage
  let healing = 0;
  healing += (overallDamageTaken * player.lifestealModifier) / 100;
  healing += weapon.calculateHealing(damages);

  player.heal(healing);
  player.useEnergy(weapon.energy);
  updateHealthBar(player);
  updateEnergyDisplay();
  setActiveWeapon(-1);
  player.removeUsed();
  displayWeapons(player, player.hand);
}

function selectEnemy(enemyNode) {
  let index = enemies.findIndex((enemy) => enemy.display === enemyNode);
  if (index === -1) {
    displayTurnMessage("Couldn't find selected enemy!");
    return;
  }

  if (activeWeapon == null) {
    displayTurnMessage("No weapon selected!");
    return;
  }

  if (!activePossibleTargets.includes(index)) {
    displayTurnMessage("Can't attack selected enemy!");
    return;
  }

  executeAttack(activeWeapon, index);
}

// Function to disable weapons during the enemy's turn
function disableWeapons() {
  const weaponButtons = document.querySelectorAll(".weapon-button");
  weaponButtons.forEach((button) => {
    button.disabled = true; // Disable the weapon buttons
  });
}

// Function to enable weapons after the player’s turn is back
function enableWeapons() {
  const weaponButtons = document.querySelectorAll(".weapon-button");
  weaponButtons.forEach((button) => {
    button.disabled = false; // Enable the weapon buttons
  });
}

function wait(length) {
  return new Promise((res) => {
    window.setTimeout(res, length);
  });
}

// Function to handle the "End Turn" button click
async function endTurn() {
  console.log("End turn clicked!");
  document.getElementById("end-turn-btn").disabled = true;

  if (
    player.equippedRelics.includes("Berserkers Rush") &&
    player.health <= 20
  ) {
    player.increaseStrength(5);
    player.updateStrengthDisplay();
  }

  if (player.currentPoison > 0) {
    player.applyPoisonDamage();
    updateHealthBar(player);
    await wait(400);
  }

  disableWeapons();

  isPlayerTurn = false;

  if (player.equippedRelics.includes("Overcharged Core")) {
    player.takeDamage(3);
    updateHealthBar(player);
    await wait(300);
  }

  if (player.equippedRelics.includes("Stonewall Totem")) {
    stonewallTotem();
    await wait(300);
  }

  if (player.equippedRelics.includes("Vengeful Echo")) {
    enemies.forEach((enemy) => {
      enemy.takeDamage(10, false);
    });
    await wait(300);
  }

  if (player.equippedRelics.includes("Curse of the plague")) {
    enemies.forEach((enemy) => {
      enemy.addPoisonFromPlayer(5 + player.poisonModifier);
      enemy.updatePoisonDisplay();
    });
    await wait(300);
  }

  enemies.forEach((enemy) => {
    enemy.removeBlock(enemy.activeShield);
  });

  let index = 0;
  let localEnemies = [...enemies];
  for (let enemy of localEnemies) {
    if (index === 0 || enemy.ranged) {
      console.log(`Enemy ${enemy.name} performing action`);

      // Perform the enemy action
      await enemy.performAction(player);
      updateHealthBar(player);
      await wait(300);
    }

    if (enemy.applyPoisonDamageFromPlayer()) await wait(500);

    // Randomize action for the next turn
    enemy.randomizeAction();
    // Display the intent for the next turn
    enemy.displayIntent();

    index++;
  }

  await wait(200);

  console.log("Player's turn begins...");

  // Draw the player's hand and display weapons for the player's turn
  isPlayerTurn = true;
  player.drawHand();
  displayWeapons(player, player.hand);
  enableWeapons(); // Enable weapons for the player
  document.getElementById("end-turn-btn").disabled = false;

  // Step 3: Reset player's stats (e.g., block)
  player.blockAmount = 0;
  player.currentBlock = 0;

  const blockText = document.getElementById("block-text");
  blockText.innerText = "0";

  const blockContainer = document.getElementById("block-container");
  blockContainer.classList.add("hidden");
  setEnemyIndices();

  // Show turn message for the player
  displayTurnMessage("Your Turn Again!");

  const endTurnEvent = new CustomEvent("EndTurn", {
    detail: {
      unusedEnergy: player.energy,
      player: player,
      eventQueue: Promise.resolve(),
    },
  });
  window.dispatchEvent(endTurnEvent);
  await wait(10);
  await endTurnEvent.detail.eventQueue;
  updateHealthBar(player);

  // Refill the player's energy and update energy display
  refillEnergy();
  updateEnergyDisplay();
}

// Function to refill the player's energy (e.g., set to full energy)
function refillEnergy() {
  player.restoreEnergy(player.maxEnergy); // Set the energy back to the maximum value

  adrenalSurge();
  if (player.equippedRelics.includes("Gambler's Die")) {
    if (Math.random() < 0.5) {
      player.addEnergy(2);
    } else {
      player.loseEnergy(1);
    }
  }
}

// Update the player's energy display
function updateEnergyDisplay() {
  const energyText = document.getElementById("energy-text");
  const energyCircle = document.getElementById("energy-circle");

  // Update the energy text
  energyText.textContent = `${player.energy}`;

  // Update the background color based on energy level
  if (player.energy > 2) {
    energyCircle.style.backgroundColor = "#4caf50"; // Green if energy is full
  } else if (player.energy > 1) {
    energyCircle.style.backgroundColor = "#ff9800"; // Orange if energy is medium
  } else {
    energyCircle.style.backgroundColor = "#f44336"; // Red if energy is low
  }

  energyCircle.addEventListener("mouseenter", () => {
    if (!energyCircle.querySelector(".energy-tooltip")) {
      const energyTooltip = document.createElement("div");
      energyTooltip.classList.add("energy-tooltip");

      energyTooltip.innerText = `You have ${player.energy} energy. Performing actions costs energy. Energy is refilled each turn.`;
      energyCircle.appendChild(energyTooltip);
    }
  });
  energyCircle.addEventListener("mouseleave", () => {
    const energyTooltip = energyCircle.querySelector(".energy-tooltip");
    if (energyTooltip) {
      energyTooltip.remove();
    }
  });
}

// Function to display the "Your Turn Again" message
function displayTurnMessage(message) {
  const turnMessage = document.getElementById("turn-message");

  if (!turnMessage) {
    console.error("Turn message element not found!");
    return;
  }

  console.log("Displaying turn message:", message);
  turnMessage.textContent = message;
  turnMessage.style.display = "block"; // Show the message

  // Hide the message after 2 seconds (you can adjust this delay)
  setTimeout(() => {
    turnMessage.style.display = "none"; // Hide the message
  }, 2000);
}

function updatePlayerGold(goldAmount) {
  globalSettings.playerGold += goldAmount;
  console.log(`Player now has ${globalSettings.playerGold} gold.`);

  const goldDisplay = document.getElementById("playerGold");
  if (goldDisplay) {
    goldDisplay.textContent = `Gold: ${globalSettings.playerGold}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("current-deck").addEventListener("click", () => {
    player.showDeck();
  });

  document.getElementById("close-deck-btn").addEventListener("click", () => {
    document.getElementById("weapon-deck-screen").classList.add("hidden");
  });
});

async function triggerPostBattleScreen() {
  SoundManager.fadeOutBattleMusic();
  await wait(1000);
  SoundManager.play("LevelVictory");

  player.strength = 0;

  if (player.equippedRelics.includes("Eternal Bloom")) {
    eternalBloom(player);
  }

  if (player.equippedRelics.includes("Golden Sigil")) {
    goldenSigil(player);
  }
  const postBattleScreen = document.getElementById("post-battle-screen");
  postBattleScreen.classList.remove("hidden");

  displayRandomWeapons();

  populateWeaponUpgradeOptions();

  document
    .getElementById("close-post-battle")
    .addEventListener("click", function () {
      if (globalSettings.redirectToChest) {
        globalSettings.redirectToChest = false;
        localStorage.setItem("comingFromElite", "true");
        window.location.href = "chest.html";
      } else {
        localStorage.removeItem("selectedFightIndex");
        returnToMap();
      }
    });
}

function displayRandomWeapons() {
  const randomWeapons = [];
  const weaponButtons = document.querySelectorAll(".weapon-option");

  weaponButtons.forEach((button, buttonIndex) => {
    let newWeapon = getRandomWeapons(randomWeapons, 0.2, 0.1);
    randomWeapons.push(newWeapon);

    let weaponPrice = 30;
    if (newWeapon.level === 2) {
      weaponPrice = 50;
    } else if (newWeapon.level === 3) {
      weaponPrice = 70;
    }

    generateWeaponInfo(
      player,
      newWeapon,
      buttonIndex,
      null,
      button,
      null,
      weaponPrice
    );

    button.addEventListener("click", function () {
      purchaseWeapon(newWeapon, weaponPrice, button);
    });
  });
}

function purchaseWeapon(weapon, weaponPrice, button) {
  if (globalSettings.playerGold >= weaponPrice) {
    SoundManager.play("Purchase");
    player.addWeapon(weapon);
    updatePlayerGold(-weaponPrice);
    populateWeaponUpgradeOptions();
    displayTurnMessage(`You purchased ${weapon.name}!`);
    button.remove();
  } else {
    displayTurnMessage("Not enough gold!");
  }
}

function populateWeaponUpgradeOptions() {
  const upgradebleWeapons = player.deck.filter((weapon) => weapon.level < 3);

  window.currentUpgradebleWeapons = upgradebleWeapons;

  displayWeapons(
    player,
    upgradebleWeapons,
    false,
    "upgrade-weapon-options",
    true
  );

  const weaponElements = document.getElementById(
    "upgrade-weapon-options"
  ).children;

  Array.from(weaponElements).forEach((weaponElement, index) => {
    weaponElement.addEventListener("click", function () {
      upgradeWeapon(window.currentUpgradebleWeapons[index]);
    });
  });
}

function upgradeWeapon(weapon) {
  if (weapon.level >= 3) {
    displayTurnMessage(`${weapon.name} is already max level.`);
    return;
  }

  if (globalSettings.playerGold >= 30) {
    SoundManager.play("Upgrade");
    updatePlayerGold(-30);

    weapon.upgrade();
    player.savePlayerToStorage();

    displayTurnMessage(`Upgraded ${weapon.name}!`);

    populateWeaponUpgradeOptions();

    const upgradeOptions = document.getElementById("upgrade-weapon-options");
    upgradeOptions.style.display = "none";
  } else {
    displayTurnMessage("Not enough gold to upgrade!");
  }
}

function healPlayer(button) {
  const healingCost = 30;

  if (player.health >= player.maxHealth) {
    button.disabled = true;
    displayTurnMessage("Already full HP!");
  } else if (globalSettings.playerGold >= healingCost) {
    SoundManager.play("HealSound");
    updatePlayerGold(-healingCost);
    player.heal(player.maxHealth * 0.3);

    updateHealthBar();
    player.savePlayerToStorage();

    displayTurnMessage("You healed!");
    button.disabled = true;
  } else {
    displayTurnMessage("Not enough gold to heal!");
  }
}

function returnToMap() {
  // mark event as done
  globalSettings.eventResolved = true;
  window.location.href = "map.html";
}

window.onload = function () {
  document
    .getElementById("choose-weapon-upgrade-btn")
    .addEventListener("click", function () {
      const upgradeOptions = document.getElementById("upgrade-weapon-options");
      if (
        upgradeOptions.style.display === "none" ||
        upgradeOptions.style.display === ""
      ) {
        upgradeOptions.style.display = "flex";
      } else {
        upgradeOptions.style.display = "none";
      }
    });
};
