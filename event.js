let player = new Player("Knight", 100, 100, [], 3, 3);

player.loadPlayerFromStorage();

function updatePlayerGold(goldAmount) {
  globalSettings.playerGold += goldAmount;
}

let playerSprite;
let isDuplicateMode = false;
let isLifestealMode = false;
let isLowerCostMode = false;
let isApplyPoisonMode = false;
let isUpgradeMode = false;
document.addEventListener("DOMContentLoaded", () => {
  displayEquippedRelics();

  document.getElementById("current-deck").addEventListener("click", () => {
    isDuplicateMode = false;
    isLifestealMode = false;
    isLowerCostMode = false;
    isApplyPoisonMode = false;
    isUpgradeMode = false;
    player.showDeck();
  });
  document.getElementById("close-deck-btn").addEventListener("click", () => {
    document.getElementById("weapon-deck-screen").classList.add("hidden");
    isDuplicateMode = false;
    isLifestealMode = false;
    isLowerCostMode = false;
    isApplyPoisonMode = false;
    isUpgradeMode = false;
  });
  let eventType = loadData("RandomEvent");

  document.getElementById(eventType).classList.remove("hidden");

  const goldDisplay = document.getElementById("playerGold");
  goldDisplay.textContent = "Gold: " + globalSettings.playerGold;
  playerSprite = document.querySelector(".sprite");

  resetToIdleAnimation();

  initializeHealthBars();
});

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

// Function to drop the selected weapon by index
function dropWeapon(indexToDrop) {
  console.log(`Dropping weapon at index: ${indexToDrop}`);

  let currentDeck = player.deck; // Get a copy of the deck (since the getter returns a copy)

  if (
    indexToDrop === undefined ||
    indexToDrop < 0 ||
    indexToDrop >= currentDeck.length
  ) {
    console.error("Invalid weapon index!");
    return;
  }

  player.dropWeapon(indexToDrop);

  console.log("Player deck saved to storage.");
}

//golden Statue
function smashStatueAction() {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));
  player.takeDamage(15);
  updateHealthBar(player);
  updatePlayerGold(75);
  player.savePlayerToStorage();

  if (player.health > 0) {
    setTimeout(() => {
      returnToMap();
    }, 2000);
  }
}

//returning to map after leaving

document.addEventListener("DOMContentLoaded", function () {
  const leaveButtons = document.querySelectorAll(".textbox-btn");

  leaveButtons.forEach((button) => {
    if (button.classList.contains("leave-btn")) {
      button.addEventListener("click", function () {
        returnToMap();
      });
    }
  });
});

function restAction() {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));
  player.heal(20);
  updateHealthBar(player);
  player.savePlayerToStorage();
  setTimeout(() => {
    returnToMap();
  }, 500);
}

document.addEventListener("DOMContentLoaded", function () {
  let eventType = loadData("RandomEvent");

  //rest event

  if (eventType === "rest") {
    document.getElementById("rest").classList.remove("hidden");

    const leaveButton = document.getElementById("leaveRest");

    leaveButton.addEventListener("click", restAction);
  }

  //Lightning

  if (eventType === "lightning") {
    document.getElementById("lightning").classList.remove("hidden");
    document
      .getElementById("takeLightning")
      .addEventListener("click", function () {
        SoundManager.play("Thunder");
        document.getElementById("lightning").classList.add("hidden");
        document.getElementById("takeLightning2").classList.remove("hidden");

        player.clearDeck();

        player.addWeapon(new Lightning());
        player.addWeapon(new Lightning());
        player.addWeapon(new Lightning());
        player.addWeapon(new LightningShield());
        player.addWeapon(new LightningShield());
        player.addWeapon(new LightningShield());

        player.savePlayerToStorage();

        console.log("Updated player deck after event", player.deck);
      });
  }

  //succubus

  if (eventType === "succubus") {
    // Show succubus event dialogue
    document.getElementById("succubus").classList.remove("hidden");
    document.getElementById("succubus1").addEventListener("click", function () {
      SoundManager.play("Succubus");
      console.log("Clicked on succubus1, advancing dialogue...");
      document.getElementById("succubus").classList.add("hidden");
      document.getElementById("succubus2").classList.remove("hidden");

      document
        .getElementById("succubusFight")
        .addEventListener("click", function () {
          globalSettings.difficulty = 9;
          globalSettings.relicGroup = "succubus";
          globalSettings.redirectToChest = true;
          window.location.href = "Tutorial.html";
        });
    });
  }

  // golem encounter

  if (eventType === "golemEncounter") {
    document.getElementById("golemEncounter").classList.remove("hidden");
    document
      .getElementById("golemStones")
      .addEventListener("click", function () {
        player.addWeapon(new Stone());
        player.addWeapon(new Stone());
        player.addWeapon(new Stone());

        player.savePlayerToStorage();

        returnToMap();
      });

    document
      .getElementById("noGolemStones")
      .addEventListener("click", function () {
        globalSettings.difficulty = 19;
        globalSettings.relicGroup = "elite";
        globalSettings.redirectToChest = true;
        window.location.href = "Tutorial.html";
      });
  }

  // magic wand

  if (eventType === "magicWand") {
    document.getElementById("magicWand").classList.remove("hidden");
    document
      .getElementById("takeMagicWand")
      .addEventListener("click", function () {
        player.addWeapon(new MagicWand());
        player.savePlayerToStorage();
        returnToMap();
      });
  }

  // falling stones

  if (eventType === "fallingStones") {
    document.getElementById("fallingStones").classList.remove("hidden");
    document
      .getElementById("dodgeLeft")
      .addEventListener("click", async function () {
        player.decreaseMaxHealth(7);
        updateHealthBar(player);
        player.savePlayerToStorage();
        await wait(750);
        returnToMap();
      });

    document
      .getElementById("dodgeRight")
      .addEventListener("click", async function () {
        player.takeDamage(15);
        updateHealthBar(player);
        player.savePlayerToStorage();
        await wait(750);
        returnToMap();
      });
  }

  // zen relic

  if (eventType === "zenRelic") {
    document.getElementById("zenRelic").classList.remove("hidden");
    document.getElementById("donateAll").addEventListener("click", function () {
      updatePlayerGold(-globalSettings.playerGold);
      player.foundRelic("Zen Barrier", true);
      player.savePlayerToStorage();
      returnToMap();
    });
  }

  // ancient writing

  if (eventType === "ancientWriting") {
    document.getElementById("ancientWriting").classList.remove("hidden");
    document
      .getElementById("meleeImprove")
      .addEventListener("click", async function () {
        const meleeWeapons = player.deck.filter(
          (weapon) => weapon.range === "Melee" && weapon.level < 3
        );

        if (meleeWeapons.length === 0) {
          displayTurnMessage("All your melee weapons are already max level");
        } else {
          SoundManager.play("Upgrade");

          for (const weapon of meleeWeapons) {
            weapon.upgrade();
          }
        }
        player.savePlayerToStorage();
        await wait(750);
        returnToMap();
      });

    document.getElementById("thinning").addEventListener("click", () => {
      const weaponDeckScreen = document.getElementById("weapon-deck-screen");
      const closeDeckButton = document.getElementById("close-deck-btn");

      if (!weaponDeckScreen) {
        console.error("weapon-deck-screen element not found!");
        return;
      }

      // Show deck and enable remove mode
      weaponDeckScreen.classList.remove("hidden");
      player.showDeck(); // Show full deck
      document.body.classList.add("remove-mode");

      // Set cursor style on weapon elements
      setTimeout(() => {
        weaponDeckScreen.querySelectorAll(".weapon").forEach((el) => {
          el.style.cursor = "pointer";
        });
      }, 0);

      // Remove mode click handler (only add once)
      if (!weaponDeckScreen._removeModeListenerAdded) {
        weaponDeckScreen.addEventListener("click", (event) => {
          if (!document.body.classList.contains("remove-mode")) return;

          const weaponElement = event.target.closest(".weapon");
          if (!weaponElement) return;

          const weaponIndex = Array.from(
            weaponDeckScreen.querySelectorAll(".weapon")
          ).indexOf(weaponElement);
          if (weaponIndex === -1) {
            console.error("Weapon index not found!");
            return;
          }

          const weapon = player.deck[weaponIndex];
          if (weapon) {
            console.log(`Removing weapon: ${weapon.name}`);

            dropWeapon(weaponIndex); // Your existing weapon removal function

            // Clean up UI and exit remove mode
            weaponDeckScreen.classList.add("hidden");
            document.body.classList.remove("remove-mode");

            displayTurnMessage(`You removed ${weapon.name} from your deck.`);
            returnToMap();
          } else {
            console.error("Weapon not found in player's deck");
          }
        });

        weaponDeckScreen._removeModeListenerAdded = true;
      }

      // Close deck button listener (only add once)
      if (
        closeDeckButton &&
        !closeDeckButton._ancientWritingCloseListenerAdded
      ) {
        closeDeckButton.addEventListener("click", () => {
          weaponDeckScreen.classList.add("hidden");
          document.body.classList.remove("remove-mode");
        });

        closeDeckButton._ancientWritingCloseListenerAdded = true;
      }
    });
  }

  // offer weapon

  if (eventType === "offerWeapon") {
    const offerBtn = document.getElementById("offerSomething");
    const weaponDeckScreen = document.getElementById("weapon-deck-screen");

    let offerMode = false;

    if (offerBtn) {
      offerBtn.addEventListener("click", () => {
        offerMode = true;
        weaponDeckScreen.classList.remove("hidden");

        player.showDeck();
        document.body.classList.add("offer-mode");

        setTimeout(() => {
          weaponDeckScreen.querySelectorAll(".weapon").forEach((el) => {
            el.style.cursor = "pointer";
          });
        }, 0);
      });
    }

    weaponDeckScreen?.addEventListener("click", (event) => {
      if (!offerMode) return;

      const weaponElement = event.target.closest(".weapon");
      if (!weaponElement) return;

      const weaponIndex = Array.from(
        weaponDeckScreen.querySelectorAll(".weapon")
      ).indexOf(weaponElement);

      if (weaponIndex === -1) {
        console.error("Weapon index not found");
        return;
      }

      const weapon = player.deck[weaponIndex];
      if (!weapon) {
        console.error("Weapon not found in player's deck");
        return;
      }

      const level = weapon.level;

      dropWeapon(weaponIndex);

      weaponDeckScreen.classList.add("hidden");
      document.body.classList.remove("offer-mode");
      offerMode = false;

      document.getElementById("offerWeapon").classList.add("hidden");

      if (level === 1) {
        document.getElementById("offerLvl1").classList.remove("hidden");
      } else if (level === 2) {
        document.getElementById("offerLvl2").classList.remove("hidden");
        player.heal(40);
        updateHealthBar(player);
        player.savePlayerToStorage();
      } else if (level >= 3) {
        document.getElementById("offerLvl3").classList.remove("hidden");
        player.increaseMaxHealth(25, true);
        updateHealthBar(player);
        player.savePlayerToStorage();
      }
    });
  }

  // contract dave

  if (eventType === "dave") {
    document.getElementById("dave").classList.remove("hidden");
    document.getElementById("helpDave").addEventListener("click", function () {
      updatePlayerGold(-50);
      player.foundRelic("Contract with Dave", true);
      player.savePlayerToStorage();
      returnToMap();
    });
  }

  // reunion dave

  if (eventType === "reunionDave") {
    document.getElementById("reunionDave").classList.remove("hidden");
    document
      .getElementById("takeReward")
      .addEventListener("click", function () {
        updatePlayerGold(250);
        player.removeRelic("Contract with Dave");
        player.savePlayerToStorage();
        returnToMap();
      });
  }

  //Thors Hammer Code

  if (eventType === "thorsHammer") {
    const thorsHammerBtn = document.querySelector(".thorsHammer-btn");
    const thorsHammerBox = document.getElementById("thorsHammer");
    const thorsHammerTakenBox = document.getElementById("thorsHammerTaken");

    if (thorsHammerBtn) {
      thorsHammerBtn.addEventListener("click", function () {
        player.takeDamage(5);
        updateHealthBar(player);
        player.savePlayerToStorage();
        if (player.health > 0) {
          const successChance = Math.random();

          if (successChance < 0.3) {
            SoundManager.play("Thunder");
            thorsHammerBox.classList.add("hidden");
            thorsHammerTakenBox.classList.remove("hidden");
            player.addWeapon(new ThorsHammer());
            player.savePlayerToStorage();
          }
        }
      });
    }
  }

  //infernal Ingot

  if (eventType === "infernalIngot") {
    const infernalIngotBtn = document.getElementById("takeInfernalIngot");

    if (infernalIngotBtn) {
      infernalIngotBtn.addEventListener("click", function () {
        player.foundRelic("Infernal Ingot", true);
        player.savePlayerToStorage();
        returnToMap();
      });
    }
  }

  // heal or max hp

  if (eventType === "healOrHp") {
    const healOrHpBox = document.getElementById("healOrHp");
    const TouchedStalactiteBox = document.getElementById("TouchedStalactite");
    const TouchedStalagmiteBox = document.getElementById("TouchedStalagmite");

    healOrHpBox.classList.remove("hidden");

    const stalactiteBtn = document.getElementById("stalactite");
    const stalagmiteBtn = document.getElementById("stalagmite");

    stalactiteBtn.addEventListener("click", function () {
      healOrHpBox.classList.add("hidden");
      TouchedStalactiteBox.classList.remove("hidden");
      player.heal(20);
      updateHealthBar(player);
      player.savePlayerToStorage();
    });

    stalagmiteBtn.addEventListener("click", function () {
      healOrHpBox.classList.add("hidden");
      TouchedStalagmiteBox.classList.remove("hidden");
      player.increaseMaxHealth(10, true);
      updateHealthBar(player);
      player.savePlayerToStorage();
    });
  }

  //Die Gambling

  if (eventType === "dieGambling") {
    const dieGamblingBox = document.getElementById("dieGambling");
    const rollTheDieLostBox = document.getElementById("rollTheDieLost");
    const rolltheDieWonBox = document.getElementById("rollTheDieWon");

    dieGamblingBox.classList.remove("hidden");

    const rollButtons = document.querySelectorAll(".rollTheDie");
    const winButton = document.getElementById("gamblingDieWon");

    rollButtons.forEach((button) => {
      button.addEventListener("click", function () {
        if (globalSettings.playerGold < 10) {
          displayTurnMessage("Not enough gold!");
          return;
        }

        updatePlayerGold(-10);
        player.savePlayerToStorage();

        const dieRoll = Math.floor(Math.random() * 6) + 1;

        dieGamblingBox.classList.add("hidden");
        rollTheDieLostBox.classList.add("hidden");
        rolltheDieWonBox.classList.add("hidden");

        if (dieRoll === 6) {
          rolltheDieWonBox.classList.remove("hidden");
        } else {
          rollTheDieLostBox.classList.remove("hidden");
        }
      });
    });

    if (winButton) {
      winButton.addEventListener("click", function () {
        player.foundRelic("Gambler's Die", true);
        player.savePlayerToStorage();
        returnToMap();
      });
    }
  }

  //Found Gold Code

  if (eventType === "foundGold") {
    const foundGoldButton = document.querySelector(".foundGold");
    if (foundGoldButton) {
      foundGoldButton.addEventListener("click", function () {
        updatePlayerGold(50);

        returnToMap();
      });
    }
  }

  //Gamble Code

  if (eventType === "gambling") {
    const acceptGambleButton = document.querySelector(".acceptGamble");

    acceptGambleButton.addEventListener("click", function () {
      const gambleAmount = Math.floor(globalSettings.playerGold / 2);

      if (gambleAmount <= 1) {
        displayTurnMessage("You don't have enough gold to gamble");
        return;
      }

      SoundManager.play("CoinFlip");

      updatePlayerGold(-gambleAmount);

      const outcome = Math.random() < 0.5 ? "lost" : "won";

      document.getElementById("gambling").classList.add("hidden");

      if (outcome === "won") {
        updatePlayerGold(gambleAmount);
        updatePlayerGold(gambleAmount);

        document.getElementById("gamblingWon").classList.remove("hidden");
      } else {
        document.getElementById("gamblingLost").classList.remove("hidden");
      }
    });
  }

  //get stoned

  if (eventType === "stoned") {
    document.getElementById("stoned").classList.remove("hidden");

    const catchButton = document.getElementById("getStoned");
    catchButton.addEventListener("click", async function () {
      SoundManager.play("Gremlin");
      await wait(1500);
      player.addWeapon(new Stone());
      player.addWeapon(new Stone());

      player.savePlayerToStorage();

      returnToMap();
    });

    const fleeButton = document.getElementById("leaveStoned");
    fleeButton.addEventListener("click", function () {
      const buttons = document.querySelectorAll("button");
      buttons.forEach((button) => (button.disabled = true));
      player.takeDamage(15);

      updateHealthBar(player);

      if (player.health > 0) {
        player.savePlayerToStorage();
        setTimeout(() => {
          returnToMap();
        }, 2000);
      }
    });
  }

  //drop weapon

  if (eventType === "dropWeapon") {
    // Get two random weapon indices
    let randomWeapon1 = randomWeaponIndex();
    let randomWeapon2 = randomWeaponIndex();

    // Ensure the two weapons selected are not the same
    while (randomWeapon1 === randomWeapon2) {
      randomWeapon2 = randomWeaponIndex(); // Keep selecting until they are different
    }

    // Select the weapons using the indices
    let weaponChoices = [
      player.deck[randomWeapon1], // Weapon at randomWeapon1 index
      player.deck[randomWeapon2], // Weapon at randomWeapon2 index
    ];

    console.log("Selected Weapons:", weaponChoices); // Debugging output

    // Get the buttons for displaying weapons
    const button1 = document.getElementById("randomWeapon1");
    const button2 = document.getElementById("randomWeapon2");

    if (button1 && button2) {
      if (weaponChoices[0] && weaponChoices[1]) {
        // Remove any existing content from buttons
        button1.innerHTML = "";
        button2.innerHTML = "";

        // Generate detailed weapon info inside the buttons
        generateWeaponInfo(
          player,
          weaponChoices[0], // Weapon 1
          randomWeapon1, // Index of weapon 1 in deck
          button1, // Parent button
          null, // Display element (can be null for automatic creation)
          null, // Tooltip element (can be null)
          0 // Weapon price (if any)
        );

        generateWeaponInfo(
          player,
          weaponChoices[1], // Weapon 2
          randomWeapon2, // Index of weapon 2 in deck
          button2, // Parent button
          null, // Display element (can be null for automatic creation)
          null, // Tooltip element (can be null)
          0 // Weapon price (if any)
        );
      } else {
        console.error("Weapons are undefined or missing!");
      }
    } else {
      console.error("Weapon buttons not found!");
    }

    console.log("Equipped Relics before weapon drop:", player.equippedRelics);

    // Add event listeners to drop the weapon that was NOT chosen
    button1.addEventListener("click", () => {
      dropWeapon(randomWeapon1); // Drop the first weapon by index
      console.log("Equipped Relics after weapon drop:", player.equippedRelics);

      returnToMap();
    });

    button2.addEventListener("click", () => {
      dropWeapon(randomWeapon2); // Drop the second weapon by index
      console.log("Equipped Relics after weapon drop:", player.equippedRelics);
      returnToMap();
    });
  }

  //upgrade Weapon

  if (eventType === "upgradeWeapon") {
    const upgradeButton = document.getElementById("current-deck-upgrade");
    const weaponDeckScreen = document.getElementById("weapon-deck-screen");
    const closeDeckButton = document.getElementById("close-deck-btn");

    upgradeButton?.addEventListener("click", () => {
      isUpgradeMode = true;
      console.log("Upgrade button clicked");
      weaponDeckScreen.setAttribute("isupgrademode", "");
      weaponDeckScreen?.classList.remove("hidden");

      // Filter weapons to show only those that can be upgraded
      const upgradeableWeapons = player.deck.filter((w) => w.level < 3);

      // Call original showDeck (which renders filtered list)
      player.showDeck((weapon) => weapon.level < 3);

      // Attach the weapon object directly to each rendered .weapon element
      setTimeout(() => {
        const weaponElements = weaponDeckScreen.querySelectorAll(".weapon");
        weaponElements.forEach((el, index) => {
          el.style.cursor = "pointer";
          el.weaponData = upgradeableWeapons[index]; // Attach the correct weapon
        });
      }, 0);

      upgradeMode = true;
      document.body.classList.add("upgrade-mode");
    });

    weaponDeckScreen?.addEventListener("click", (event) => {
      if (!isUpgradeMode) return;

      const weaponElement = event.target.closest(".weapon");

      if (weaponElement?.weaponData) {
        const weapon = weaponElement.weaponData;

        console.log("Upgrading weapon:", weapon.name);

        if (typeof upgradeWeapon === "function") {
          SoundManager.play("Upgrade");
          upgradeWeapon(weapon); // ✅ Matches game.js
        } else {
          console.error("upgradeWeapon is not defined or is not a function.");
        }

        isUpgradeMode = false;
      }
    });

    closeDeckButton?.addEventListener("click", () => {
      console.log("Closing deck");
      weaponDeckScreen?.classList.add("hidden");
      isUpgradeMode = false;
      weaponDeckScreen.removeAttribute("isupgrademode");
    });

    async function upgradeWeapon(weapon) {
      console.log(`Upgrading weapon: ${weapon.name}`);

      if (weapon.level >= 3) {
        displayTurnMessage(`${weapon.name} is already max level.`);
        return;
      }

      SoundManager.play("Upgrade");
      await wait(700);

      weapon.upgrade();
      player.savePlayerToStorage();

      displayTurnMessage(`Upgraded ${weapon.name}`);
      returnToMap();
    }
  }

  //gold ambush

  if (eventType === "ambushGold") {
    const ambushGoldLeaveBtn = document.getElementById("ambushGold-leave");

    if (ambushGoldLeaveBtn) {
      ambushGoldLeaveBtn.addEventListener("click", () => {
        // Corrected the Math.floor function
        const goldToLose = Math.floor(globalSettings.playerGold * (1 / 5));

        // Log and update the player's gold
        globalSettings.playerGold -= goldToLose;

        console.log(
          `Lost ${goldToLose} gold! You now have ${globalSettings.playerGold} gold.`
        );

        // Update the gold display
        const goldDisplay = document.getElementById("playerGold");
        if (goldDisplay) {
          goldDisplay.textContent = `Gold: ${globalSettings.playerGold}`;
        }

        player.savePlayerToStorage();
        returnToMap();
      });
    } else {
      console.error("Ambush gold button not found!");
    }
  }

  if (eventType === "hurtAnkle") {
    const hurtAnkleBtn = document.getElementById("hurtAnkle-btn");

    if (hurtAnkleBtn) {
      hurtAnkleBtn.addEventListener("click", () => {
        const buttons = document.querySelectorAll("button");
        buttons.forEach((button) => (button.disabled = true));
        player.takeDamage(10);
        updateHealthBar(player);

        if (player.health > 0) {
          player.savePlayerToStorage();
          setTimeout(() => {
            returnToMap();
          }, 2000);
        }
      });
    }
  }

  //add poison to Weapon

  if (eventType === "poisonWeapon") {
    const tryPoisonBtn = document.getElementById("tryPoison");

    if (tryPoisonBtn) {
      tryPoisonBtn.addEventListener("click", () => {
        isApplyPoisonMode = true;

        const weaponDeckScreen = document.getElementById("weapon-deck-screen");
        const weaponList = document.getElementById("weapon-list");

        const validWeapons = player.deck.filter((weapon) => weapon.damage > 0);
        weaponDeckScreen.classList.remove("hidden");

        displayWeapons(player, validWeapons, false, "weapon-list");

        setTimeout(() => {
          const weaponElements = document.querySelectorAll(
            "#weapon-list .weapon"
          );
          weaponElements.forEach((el) => {
            el.style.cursor = "pointer";
          });
        }, 0);

        weaponList.addEventListener("click", async function selectWeapon(e) {
          if (!isApplyPoisonMode) return;

          const weaponEl = e.target.closest(".weapon");
          if (!weaponEl) return;

          const displayedWeaponEls = Array.from(
            weaponList.querySelectorAll(".weapon")
          );
          const displayIndex = displayedWeaponEls.indexOf(weaponEl);

          const selectedWeapon = validWeapons[displayIndex];

          const indexInDeck = player.deck.indexOf(selectedWeapon);

          weaponList.removeEventListener("click", selectedWeapon);
          weaponDeckScreen.classList.add("hidden");

          const success = Math.random() < 0.7;

          if (success) {
            SoundManager.play("Acid");
            player.deck[indexInDeck].poisonAmount =
              (player.deck[indexInDeck].poisonAmount || 0) + 15;
            document.getElementById("poisonSuccess").classList.remove("hidden");
            isApplyPoisonMode = false;
          } else {
            if (indexInDeck > -1) {
              SoundManager.play("Dissolve");
              dropWeapon(indexInDeck);
              isApplyPoisonMode = false;
            }
            document.getElementById("poisonFail").classList.remove("hidden");
          }
          player.savePlayerToStorage?.();
        });
      });
    }
  }

  //lower Energy Cost

  if (eventType === "lowerEnergyCost") {
    const lowerCostBtn = document.getElementById("acceptLowerCost");

    if (lowerCostBtn) {
      lowerCostBtn.addEventListener("click", () => {
        isLowerCostMode = true;

        const weaponDeckScreen = document.getElementById("weapon-deck-screen");
        const weaponList = document.getElementById("weapon-list");

        const validWeapons = player.deck.filter((weapon) => weapon.energy > 0);
        weaponDeckScreen.classList.remove("hidden");

        displayWeapons(player, validWeapons, false, "weapon-list");

        setTimeout(() => {
          const weaponElements = document.querySelectorAll(
            "#weapon-list .weapon"
          );
          weaponElements.forEach((el) => {
            el.style.cursor = "pointer";
          });
        }, 0);

        weaponList.addEventListener("click", function selectWeapon(e) {
          if (!isLowerCostMode) return;

          const weaponEl = e.target.closest(".weapon");
          if (!weaponEl) return;

          const displayedWeaponEls = Array.from(
            weaponList.querySelectorAll(".weapon")
          );
          const displayIndex = displayedWeaponEls.indexOf(weaponEl);

          const selectedWeapon = validWeapons[displayIndex];
          const indexInDeck = player.deck.findIndex(
            (w) => w.id == selectedWeapon.id
          );

          weaponList.removeEventListener("click", selectWeapon);
          // weaponDeckScreen.classList.add("hidden");

          selectedWeapon.energy = Math.max(0, selectedWeapon.energy - 1);
          player.decreaseMaxHealth(10);

          player.savePlayerToStorage?.();
          returnToMap();
        });
      });
    }
  }

  //bloodforge

  if (eventType === "bloodforge") {
    const takeBloodforgeBtn = document.getElementById("takeBloodforge");

    if (takeBloodforgeBtn) {
      takeBloodforgeBtn.addEventListener("click", () => {
        player.foundRelic("Bloodforge", true);
        player.savePlayerToStorage?.();
        returnToMap();
      });
    }
  }

  //weapon Lifesteal

  if (eventType === "weaponLifesteal") {
    const acceptLifestealBtn = document.getElementById("acceptLifesteal");

    if (acceptLifestealBtn) {
      acceptLifestealBtn.addEventListener("click", () => {
        isLifestealMode = true;

        const weaponDeckScreen = document.getElementById("weapon-deck-screen");
        const weaponList = document.getElementById("weapon-list");

        const validWeapons = player.deck.filter((weapon) => weapon.damage > 0);
        weaponDeckScreen.classList.remove("hidden");

        displayWeapons(player, validWeapons, false, "weapon-list");

        setTimeout(() => {
          const weaponElements = document.querySelectorAll(
            "#weapon-list .weapon"
          );
          weaponElements.forEach((el) => {
            el.style.cursor = "pointer";
          });
        }, 0);

        weaponList.addEventListener("click", function selectWeapon(e) {
          if (!isLifestealMode) return;

          const weaponEl = e.target.closest(".weapon");
          if (!weaponEl) return;

          const displayedWeaponEls = Array.from(
            weaponList.querySelectorAll(".weapon")
          );
          const displayIndex = displayedWeaponEls.indexOf(weaponEl);

          const selectedWeapon = validWeapons[displayIndex];
          const indexInDeck = player.deck.findIndex(
            (w) => w.id == selectedWeapon.id
          );

          // Remove the event listener to avoid multiple triggers
          weaponList.removeEventListener("click", selectWeapon);
          weaponDeckScreen.classList.add("hidden");

          player.takeDamage(15);

          updateHealthBar(player);

          // Apply lifesteal (set canHeal to true and modify healingAmount)
          selectedWeapon.canHeal = true;
          if (Array.isArray(selectedWeapon.healingAmount)) {
            selectedWeapon.healingAmount[0] += 20; // Increase existing healing by 20%
          } else if (typeof selectedWeapon.healingAmount === "number") {
            selectedWeapon.healingAmount = [selectedWeapon.healingAmount + 20];
          } else {
            selectedWeapon.healingAmount = [20]; // Set to 20% if no healingAmount
          }

          acceptLifestealBtn.disabled = true;

          // Update the weapon in the player’s deck
          player.deck[indexInDeck] = selectedWeapon;

          // Save player data
          player.savePlayerToStorage?.();

          // Redirect or perform any other action
          setTimeout(() => {
            returnToMap();
          }, 2000);
        });
      });
    }
  }

  //full Heal

  if (eventType === "fullHeal") {
    const fairyHealBtn = document.getElementById("fairyHeal");

    if (fairyHealBtn) {
      fairyHealBtn.addEventListener("click", async () => {
        player.decreaseMaxHealth(10);
        player.heal(player.maxHealth);
        updateHealthBar(player);
        player.savePlayerToStorage();

        await wait(500);

        returnToMap();
      });
    }
  }

  // shop scouting

  if (eventType === "shopScouting") {
    const upgradeBtn = document.getElementById("sampleUpgrade");
    const removeBtn = document.getElementById("sampleRemove");
    const weaponDeckScreen = document.getElementById("weapon-deck-screen");
    const closeDeckButton = document.getElementById("close-deck-btn");

    let upgradeableWeapons = [];

    if (upgradeBtn) {
      upgradeBtn.addEventListener("click", () => {
        isUpgradeMode = true;
        weaponDeckScreen.setAttribute("isupgrademode", "");
        weaponDeckScreen.classList.remove("hidden");

        // Store filtered weapons and show them
        upgradeableWeapons = player.deck.filter((weapon) => weapon.level < 3);
        player.showDeck((weapon) => weapon.level < 3);
        document.body.classList.add("upgrade-mode");

        setTimeout(() => {
          weaponDeckScreen.querySelectorAll(".weapon").forEach((el) => {
            el.style.cursor = "pointer";
          });
        }, 0);
      });
    }

    weaponDeckScreen?.addEventListener("click", async (event) => {
      if (!isUpgradeMode) return;

      const weaponElement = event.target.closest(".weapon");

      if (weaponElement) {
        console.log("Weapon clicked");

        const weaponIndex = Array.from(
          weaponDeckScreen.querySelectorAll(".weapon")
        ).indexOf(weaponElement);
        console.log("Weapon clicked, index:", weaponIndex);

        if (weaponIndex === -1) {
          console.error("Weapon index not found!");
          return;
        }

        const weapon = upgradeableWeapons[weaponIndex]; // ✅ Use filtered list
        console.log("Weapon found:", weapon);

        if (weapon) {
          console.log("Upgrading weapon:", weapon.name);
          if (typeof upgradeWeapon === "function") {
            SoundManager.play("Upgrade");
            await upgradeWeapon(weapon);
          } else {
            console.error("upgradeWeapon is not defined or is not a function.");
          }
          isUpgradeMode = false;
        } else {
          console.error("Weapon not found in upgradeableWeapons");
        }
      }
    });

    if (closeDeckButton) {
      closeDeckButton.addEventListener("click", () => {
        console.log("Closing deck");
        weaponDeckScreen.classList.add("hidden");
        isUpgradeMode = false;
        weaponDeckScreen.removeAttribute("isupgrademode");
      });
    }

    async function upgradeWeapon(weapon) {
      console.log(`Upgrading weapon: ${weapon.name}`);

      if (weapon.level >= 3) {
        displayTurnMessage(`${weapon.name} is already max level.`);
        return;
      }

      SoundManager.play("Upgrade");
      await wait(700);
      weapon.upgrade();
      player.savePlayerToStorage();

      displayTurnMessage(`Upgraded ${weapon.name}`);
      returnToMap();
    }

    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        weaponDeckScreen.classList.remove("hidden");

        player.showDeck(); // Show full deck
        document.body.classList.add("remove-mode");

        setTimeout(() => {
          weaponDeckScreen.querySelectorAll(".weapon").forEach((el) => {
            el.style.cursor = "pointer";
          });
        }, 0);
      });

      weaponDeckScreen?.addEventListener("click", (event) => {
        if (!document.body.classList.contains("remove-mode")) return;

        const weaponElement = event.target.closest(".weapon");

        if (weaponElement) {
          const weaponIndex = Array.from(
            weaponDeckScreen.querySelectorAll(".weapon")
          ).indexOf(weaponElement);

          if (weaponIndex === -1) {
            console.error("Weapon index not found!");
            return;
          }

          const weapon = player.deck[weaponIndex];
          if (weapon) {
            console.log(`Removing weapon: ${weapon.name}`);

            dropWeapon(weaponIndex);

            weaponDeckScreen.classList.add("hidden");
            document.body.classList.remove("remove-mode");

            displayTurnMessage(`You removed ${weapon.name} from your deck.`);
            returnToMap();
          } else {
            console.error("Weapon not found in player's deck");
          }
        }
      });
    }
  }

  // upgrade all and curse

  if (eventType === "upgradeAll") {
    const upgradeAndCurseBtn = document.getElementById("upgradeAndCurse");

    upgradeAndCurseBtn?.addEventListener("click", async () => {
      const upgradeableWeapons = player.deck.filter(
        (weapon) => weapon.level < 3
      );

      if (upgradeableWeapons.length === 0) {
        displayTurnMessage("All your weapons are already max level");
      } else {
        SoundManager.play("Upgrade");

        for (const weapon of upgradeableWeapons) {
          weapon.upgrade();
        }
      }

      player.foundRelic("Burden of the Strong", true);
      const burdenRelic = relicList["Burden of the Strong"];
      burdenRelic.equipRelic(player);
      player.savePlayerToStorage();
      await wait(1000);
      returnToMap();
    });
  }

  //duplicate Weapon

  if (eventType === "duplicateWeapon") {
    const duplicateWeaponBtn = document.getElementById("duplicateWeapon-btn");
    const duplicateWeaponBox = document.getElementById("duplicateWeapon");
    const duplicateWeaponBox2 = document.getElementById("duplicateWeapon2");
    const weaponDeckScreen = document.getElementById("weapon-deck-screen");

    if (duplicateWeaponBtn) {
      duplicateWeaponBtn.addEventListener("click", function () {
        isDuplicateMode = true;
        weaponDeckScreen?.classList.remove("hidden");
        player.showDeck(); // Display player's weapons for selection

        setTimeout(() => {
          const weaponElements = weaponDeckScreen.querySelectorAll(".weapon");
          weaponElements.forEach((el) => {
            el.style.cursor = "pointer";
          });
        }, 0);
      });
    }

    // Listen for clicks on weapons in the deck
    weaponDeckScreen?.addEventListener("click", (event) => {
      if (!isDuplicateMode) return;

      const weaponElement = event.target.closest(".weapon"); // Get the clicked weapon element

      if (weaponElement) {
        // Get the index of the clicked weapon in the weapon deck
        const weaponIndex = Array.from(
          weaponDeckScreen.querySelectorAll(".weapon")
        ).indexOf(weaponElement);
        console.log("Weapon clicked, index:", weaponIndex); // Debugging the index

        if (weaponIndex === -1) {
          console.error("Weapon index not found!");
          return;
        }

        // Get the weapon from player's deck using the index
        const selectedWeapon = player.deck[weaponIndex];
        console.log("Weapon found:", selectedWeapon); // Debugging the weapon object

        // Debugging the level of the selected weapon
        console.log(`Original weapon level: ${selectedWeapon.level}`);

        // Proceed to duplicate the weapon
        if (selectedWeapon) {
          console.log(`Duplicating weapon: ${selectedWeapon.name}`);

          //Extrahiert Daten als JSON Objekt der ausgewählten Waffe
          let weaponData = selectedWeapon.getWeaponInfo();

          //Erzeugt aus JSON Objekt neue Waffeninstanz
          const duplicatedWeapon = createWeaponInstanceFromInfo(weaponData);

          console.log(
            `Duplicated weapon level after handling: ${duplicatedWeapon.level}`
          );

          player.addWeapon(duplicatedWeapon); // Add the duplicated weapon to player's deck
          player.savePlayerToStorage(); // Save the updated deck to local storage

          // Hide the weapon deck screen and show the next event box
          weaponDeckScreen.classList.add("hidden");
          duplicateWeaponBox.classList.add("hidden");
          duplicateWeaponBox2.classList.remove("hidden");

          isDuplicateMode = false;
        } else {
          console.error("Selected weapon not found in player's deck");
        }
      }
    });
  }
});

function returnToMap() {
  // mark event as done
  globalSettings.eventResolved = true;
  window.location.href = "map.html";
}

function updatePlayerGold(goldAmount) {
  globalSettings.playerGold += goldAmount;
  console.log(`Player now has ${globalSettings.playerGold} gold`);

  const goldDisplay = document.getElementById("playerGold");
  if (goldDisplay) {
    goldDisplay.textContent = `Gold: ${globalSettings.playerGold}`;
  }
}

function randomWeaponIndex() {
  let index = Math.floor(Math.random() * player.deck.length);
  if (index >= player.deck.length) index = player.deck.length - 1;
  return index;
}
