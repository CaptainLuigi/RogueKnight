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
    false,
    theBetterKnight
  ),
  new Achievements(
    "Ratvolution",
    "Defeat the Rat King",
    "Assets/ratKing.png",
    false,
    ratvolution
  ),
  new Achievements(
    "No spider dance",
    "Defeat the Spider Boss",
    "Assets/spiderBoss.png",
    false,
    noSpiderDance
  ),
  new Achievements(
    "Unfortunate Circumstance",
    "Die during an event",
    "Assets/DeadPicture.png",
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
    "Assets/skullEmoji.png",
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
