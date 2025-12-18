class Achievements {
  #name;
  #description;
  #icon;
  #unlocked;
  #achievementFunction;

  get name() {
    return this.#name;
  }

  get description() {
    return this.#description;
  }

  get icon() {
    return this.#icon;
  }

  get unlocked() {
    return this.#unlocked;
  }

  constructor(name, description, icon, unlocked, achievementFunction) {
    this.#name = name;
    this.#description = description;
    this.#icon = icon;
    this.#unlocked = unlocked;
    this.#achievementFunction = achievementFunction;
  }

  unlock() {
    this.#unlocked = true;

    const saved =
      JSON.parse(localStorage.getItem("achievementsUnlocked")) || {};
    saved[this.#name] = true;
    localStorage.setItem("achievementsUnlocked", JSON.stringify(saved));
  }
}

const achievementList = [
  new Achievements(
    "Always prepared",
    "Beat the tutorial",
    "Assets/Training_dummy.png",
    false,
    alwaysPrepared
  ),
  new Achievements(
    "First Blood",
    "Defeat your first enemy",
    "Assets/Transperent/Icon1.png",
    false,
    firstBlood
  ),

  new Achievements(
    "True Ending",
    "Win a run with the True Knight",
    "Assets/Knight_1/IdleImage.png",
    false,
    trueEnding
  ),
  new Achievements(
    "Defense Master",
    "Win a run with the Tank Knight",
    "Assets/masterShield.png",
    false,
    defenseMaster
  ),
  new Achievements(
    "Poison Scientist",
    "Win a run with the Poison Knight",
    "Assets/poisonPotion.png",
    false,
    poisonScientist
  ),
  new Achievements(
    "Spread the Word",
    "Win a run with the Holy Knight",
    "Assets/pacifistAmulet.png",
    false,
    spreadTheWord
  ),
  new Achievements(
    "Don't calm down",
    "Win a run with the Berserker",
    "Assets/enrage.png",
    false,
    dontCalmDown
  ),
  new Achievements(
    "The Doctor",
    "Win a run with the Medic",
    "Assets/bigHealthPotion.png",
    false,
    theDoctor
  ),
  new Achievements(
    "Shiny!",
    "Win a run with the Golden Knight",
    "Assets/goldSword.png",
    false,
    shiny
  ),
  new Achievements(
    "The easy one",
    "Win a run with the Custom Knight",
    "Assets/blackHole.png",
    false,
    theEasyOne
  ),
  new Achievements(
    "Master Adventurer",
    "Unlock all characters",
    "",
    false,
    masterAdventurer
  ),

  new Achievements(
    "The better knight",
    "Defeat the Evil Knight",
    "Assets/evilKnight2.png",
    false
    // theBetterKnight
  ),
  new Achievements(
    "Ratvolution",
    "Defeat the Rat King",
    "Assets/ratKing.png",
    false
    // ratvolution
  ),
  new Achievements(
    "No spider dance",
    "Defeat the Spider Boss",
    "Assets/spiderBoss.png",
    false
    // noSpiderDance
  ),
  new Achievements(
    "Unfortunate Circumstance",
    "Die during an event",
    "Assets/Knight_1/DeadPicture.png",
    false,
    unfortunateCircumstance
  ),
  new Achievements(
    "Not even close",
    "Win a fight with 1HP left",
    "Assets/notEvenClose.png",
    false,
    notEvenClose
  ),
  new Achievements(
    "Unlimited Power!",
    "Have 9 or more Energy",
    "Assets/channelEnergy.png",
    false,
    unlimitedPower
  ),
  new Achievements(
    "Money Hoarder",
    "Have 500 or more Gold",
    "Assets/goldCoins2.gif",
    false,
    moneyHoarder
  ),
  new Achievements(
    "The Plague is back",
    "Apply 100 Poison to a single enemy",
    "Assets/skullEmojiBig.png",
    false,
    thePlagueIsBack
  ),
  new Achievements(
    "Do you even lift?",
    "Get to 50 Strength",
    "Assets/bicepsEmoji.png",
    false,
    doYouEvenLift
  ),
];

const savedAchievements =
  JSON.parse(localStorage.getItem("achievementsUnlocked")) || {};

achievementList.forEach((a) => {
  if (savedAchievements[a.name]) {
    a.unlock();
  }
});

window.addEventListener("EndFight", async () => {
  await notEvenClose();
});

window.addEventListener("WinTutorial", async () => {
  await alwaysPrepared();
});

window.addEventListener("PoisonToEnemy", async (e) => {
  const amount = e.detail.amount;

  if (amount >= 100) {
    await thePlagueIsBack();
  }
});

window.addEventListener("StrengthToPlayer", async (e) => {
  const amount = e.detail.amount;

  if (amount >= 50) {
    await doYouEvenLift();
  }
});

window.addEventListener("currentEnergy", async (e) => {
  const amount = e.detail.amount;

  if (amount >= 9) {
    await unlimitedPower();
  }
});

window.addEventListener("PlayerGold", async (e) => {
  const amount = e.detail.amount;

  if (amount >= 500) {
    await moneyHoarder();
  }
});

window.addEventListener("EnemyDeath", async () => {
  await firstBlood();
});

window.addEventListener("PlayerDeath", async (e) => {
  const currentPage = window.location.pathname.split("/").pop();

  if (currentPage === "event.html") {
    await unfortunateCircumstance();
  }
});

window.addEventListener("Winscreen", async () => {
  await trueEnding();
  await defenseMaster();
  await poisonScientist();
  await spreadTheWord();
  await dontCalmDont();
  await theDoctor();
  await shiny();
  await theEasyOne();
  await masterAdventurer();
});

function unlockAchievement(name) {
  const achievement = achievementList.find((a) => a.name === name);
  const playerState = loadData("playerState");
  if (
    achievement &&
    !achievement.unlocked &&
    playerState.currentDeckIndex !== 7
  ) {
    achievement.unlock();
    SoundManager.play("Purchase");
    displayTurnMessage(`Achievement unlocked: ${achievement.name}`);
  }
}

function notEvenClose() {
  if (player.health === 1) {
    unlockAchievement("Not even close");
  }
}

function alwaysPrepared() {
  unlockAchievement("Always prepared");
}

function thePlagueIsBack() {
  unlockAchievement("The Plague is back");
}

function doYouEvenLift() {
  unlockAchievement("Do you even lift?");
}

function unlimitedPower() {
  unlockAchievement("Unlimited Power!");
}

function moneyHoarder() {
  unlockAchievement("Money Hoarder");
}

function firstBlood() {
  if (globalSettings.difficulty === 1) {
    unlockAchievement("First Blood");
  }
}

function unfortunateCircumstance() {
  unlockAchievement("Unfortunate Circumstance");
}

function trueEnding() {
  const playerState = loadData("playerState");
  if (playerState.name == "True Knight") {
    unlockAchievement("True Ending");
  }
}

function defenseMaster() {
  const playerState = loadData("playerState");
  if (playerState.name == "Tank Knight") {
    unlockAchievement("Defense Master");
  }
}

function poisonScientist() {
  const playerState = loadData("playerState");
  if (playerState.name == "Poison Knight") {
    unlockAchievement("Poison Scientist");
  }
}

function spreadTheWord() {
  const playerState = loadData("playerState");
  if (playerState.name == "Holy Knight") {
    unlockAchievement("Spread the Word");
  }
}

function dontCalmDown() {
  const playerState = loadData("playerState");
  if (playerState.name == "Berserker") {
    unlockAchievement("Don't calm down");
  }
}

function theDoctor() {
  const playerState = loadData("playerState");
  if (playerState.name == "Medic") {
    unlockAchievement("The Doctor");
  }
}

function shiny() {
  const playerState = loadData("playerState");
  if (playerState.name == "Golden Knight") {
    unlockAchievement("Shiny!");
  }
}

function theEasyOne() {
  const playerState = loadData("playerState");
  if (playerState.name == "Custom Knight") {
    unlockAchievement("The easy one");
  }
}

function masterAdventurer() {
  const playerState = loadData("playerState");
  if (playerState.name == "Custom Knight") {
    unlockAchievement("Master Adventurer");
  }
}

function detectRatKingFightEnd1() {
  let ratKingKilled = false;
  window.addEventListener("RatKingDeath", () => {
    ratKingKilled = true;
  });
  window.addEventListener("EndFight", () => {
    if (ratKingKilled) {
      unlockAchievement("Ratvolution");
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  detectRatKingFightEnd1();

  const container = document.getElementById("achievementsContainer");

  achievementList.forEach((achievement) => {
    const card = document.createElement("div");
    card.classList.add("achievement-card");
    if (!achievement.unlocked) {
      card.classList.add("locked");
    }

    const icon = document.createElement("img");
    icon.src = achievement.icon;
    icon.classList.add("achievement-icon");

    const textDiv = document.createElement("div");
    textDiv.classList.add("achievement-text");

    const name = document.createElement("h2");
    name.textContent = achievement.name;

    const description = document.createElement("p");
    description.textContent = achievement.description;

    textDiv.appendChild(name);
    textDiv.appendChild(description);

    card.appendChild(icon);
    card.appendChild(textDiv);
    container.appendChild(card);
  });
});
