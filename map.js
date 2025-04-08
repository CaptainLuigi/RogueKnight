let player = new Player("Knight", 100, 100, [], 3, 3);

const events = [
  {
    name: "questionmark",
    propability: 10,
  },
  {
    name: "skull",
    propability: 5,
  },
  {
    name: "shop",
    propability: 1,
  },
  {
    name: "elite",
    propability: 3,
  },
  {
    name: "chest",
    propability: 5,
  },
];

const DEFAULT_EVENT_TYPE = "skull";

let globalEventArray = [];

const skullDifficulty = [1, 1, 1, 2, 2, 2, 3, 3, 3, 3];

let mapState;

player.loadPlayerFromStorage();

document.addEventListener("DOMContentLoaded", function () {
  displayEquippedRelics();
  mapState = loadData("MapState");
  if (mapState == null || mapState.wasFinalBoss == true) generateMap();
  else loadMap();
  markPossibleLocations();
  document.getElementById("current-deck").addEventListener("click", () => {
    player.showDeck();
  });
  document.getElementById("close-deck-btn").addEventListener("click", () => {
    document.getElementById("weapon-deck-screen").classList.add("hidden");
  });
});

function fillGlobalEventArray() {
  globalEventArray.length = 0;
  events.forEach((event) => {
    for (let i = 0; i < event.propability; i++) {
      globalEventArray.push(event.name);
    }
  });
}

function generateMap() {
  fillGlobalEventArray();
  mapState = null;
  let tempMapState = {
    locationStates: {},
    activeLocation: null,
    wasFinalBoss: false,
  };

  const navigationButtons = document.querySelectorAll(".navigation");
  for (let i = 0; i < navigationButtons.length; i++) {
    let button = navigationButtons[i];
    button.setAttribute("index", i);

    let buttonData = {
      type: "skull",
      difficulty: 1,
      nextLocations: [],
      isFinalBoss: false,
    };
    tempMapState.locationStates[i] = buttonData;

    let parentRow = button.parentNode;
    let nextRow = parentRow.nextElementSibling;
    if (nextRow == null) {
      buttonData.isFinalBoss = true;
      buttonData.difficulty = 10;
      continue;
    }

    buttonData.difficulty = getSkullDifficulty(i);
    if (i != 0) {
      buttonData.type = getLocationType(i);
    }

    if (nextRow.children.length == 1) {
      buttonData.nextLocations.push(0);
    } else if (parentRow.children.length == 3) {
      if (button == parentRow.firstElementChild) {
        buttonData.nextLocations.push(0);
      } else if (button == parentRow.lastElementChild) {
        buttonData.nextLocations.push(1);
      } else {
        buttonData.nextLocations.push(0, 1);
      }
    } else if (parentRow.children.length == 2) {
      if (button == parentRow.firstElementChild) {
        buttonData.nextLocations.push(0, 1);
      } else {
        buttonData.nextLocations.push(1, 2);
      }
    } else {
      for (let next = 0; next < nextRow.children.length; next++)
        buttonData.nextLocations.push(next);
    }

    setButtonData(button, buttonData);
  }
  mapState = tempMapState;
  storeData("MapState", mapState);
}
function loadMap() {
  const navigationButtons = document.querySelectorAll(".navigation");
  for (let i = 0; i < navigationButtons.length; i++) {
    let button = navigationButtons[i];
    button.setAttribute("index", i);

    let buttonData = mapState.locationStates[i];
    if (buttonData.isFinalBoss) continue;

    setButtonData(button, buttonData);
  }
}

function setButtonData(button, data) {
  let imageTag;
  if (data.type === "elite") {
    imageTag = '<img src="Assets/eliteSkullred.png" alt="Elite" />';
  } else if (data.type === "shop") {
    imageTag = '<img src="Assets/shopicon.png" alt="Shop" />';
  } else if (data.type === "questionmark") {
    imageTag = '<img src="Assets/questionmark.png" alt="Questionmark" />';
  } else if (data.type === "skull") {
    imageTag = '<img src="Assets/skull.png" alt="Skull" />';
  } else if (data.type === "chest") {
    imageTag = '<img src="Assets/chest.png" alt="Chest" />';
  }

  button.innerHTML = imageTag;
}

function getLocationType(index) {
  if (globalEventArray.length === 0) {
    return DEFAULT_EVENT_TYPE;
  }
  let tempIndex = Math.floor(Math.random() * globalEventArray.length);
  let result = globalEventArray.splice(tempIndex, 1)[0];

  return result;
}

function getSkullDifficulty(index) {
  const difficultyIndex = Math.min(index, skullDifficulty.length - 1);
  return skullDifficulty[difficultyIndex];
}

// function triggerFight(difficulty) {
//   console.log(`A fight is triggered with difficulty: $ {difficulty}`);
// }

function enterLocation(button) {
  let index = button.getAttribute("index");
  if (mapState.activeLocation == null && index != 0) {
    console.log("Bitte in Startgebiet beginnen");
    return;
  }

  let active;
  if (mapState.activeLocation != null) {
    active = mapState.locationStates[mapState.activeLocation];
    let activeButton = document.querySelector(
      `.navigation[index="${mapState.activeLocation}"]`
    );
    let activeRow = activeButton.parentElement;

    let buttonRow = button.parentElement;
    let indexInParent = [...buttonRow.children].findIndex((e) => e == button);

    if (
      activeRow.nextElementSibling != buttonRow ||
      !active.nextLocations.includes(indexInParent)
    ) {
      console.log("Bitte gültiges Gebiet auswählen");
      return;
    }
  }

  mapState.activeLocation = index;
  active = mapState.locationStates[mapState.activeLocation];
  mapState.wasFinalBoss = active.isFinalBoss;
  storeData("MapState", mapState);
  globalSettings.difficulty = active.difficulty;

  if (active.type == "questionmark") {
    triggerRandomEvent();
  } else if (active.type == "skull") window.location.href = "./tutorial.html";
  else if (active.type == "shop") window.location.href = "./Shop.html";
  else if (active.type == "chest") openChest();
  else if (active.type == "elite") {
    startEliteFight();
  } else window.location.reload();
}

function markPossibleLocations() {
  let nextLocations = [];
  let nextRow;
  if (mapState.activeLocation == null) {
    nextLocations.push(0);
    nextRow = document.querySelector(`.map-row-start`);
  } else {
    let active = mapState.locationStates[mapState.activeLocation];
    nextLocations = active.nextLocations;
    nextRow = document.querySelector(
      `div:has(> [index="${mapState.activeLocation}"])+div`
    );
  }
  for (let index of nextLocations)
    nextRow.children[index].classList.add("next");
}

function triggerRandomEvent() {
  const allEvents = [
    { type: "eliteFight", action: startEliteFight },
    { type: "normalFight", action: startNormalFight },
    { type: "chest", action: openChest },
    { type: "upgradeWeapon", action: showEvent },
    { type: "ambushGold", action: showEvent },
    { type: "hurtAnkle", action: showEvent },
    { type: "duplicateWeapon", action: showEvent },
    { type: "thorsHammer", action: showEvent },
    { type: "foundGold", action: showEvent },
    { type: "gambling", action: showEvent },
    { type: "rest", action: showEvent },
    { type: "lightning", action: showEvent },
    { type: "goldenStatue", action: showEvent },
    { type: "succubus", action: showEvent },
    { type: "stoned", action: showEvent },
  ];

  if (player.deck.length > 2) {
    allEvents.push({ type: "dropWeapon", action: showEvent });
  }

  let triggeredEvents =
    JSON.parse(localStorage.getItem("triggeredEvents")) || {};

  const availableEvents = allEvents.filter((event) => {
    return (
      !triggeredEvents[event.type] ||
      ["eliteFight", "normalFight", "chest"].includes(event.type)
    );
  });

  if (availableEvents.length > 0) {
    const randomEvent =
      availableEvents[Math.floor(Math.random() * availableEvents.length)];

    randomEvent.action(randomEvent.type);

    triggeredEvents[randomEvent.type] = true;

    localStorage.setItem("triggeredEvents", JSON.stringify(triggeredEvents));
  } else {
    console.log("No available events left to trigger!");
  }
}

function startEliteFight() {
  globalSettings.difficulty = 8;
  globalSettings.relicGroup = "elite";
  globalSettings.redirectToChest = true;
  window.location.href = "tutorial.html";
}

function startNormalFight() {
  window.location.href = "./tutorial.html";
}

function openChest() {
  globalSettings.relicGroup = "chest";
  window.location.href = "./chest.html";
}

function showEvent(type) {
  storeData("RandomEvent", type);
  window.location.href = "./event.html";
}

function resetAll() {
  localStorage.removeItem("playerState");
  localStorage.removeItem("MapState");
  localStorage.removeItem("triggeredEvents");

  relicNames.forEach((relicName) => {
    localStorage.removeItem("relic_" + relicName);
  });

  if (player && player.equippedRelics) {
    player.equippedRelics = [];
  }

  globalSettings.playerGold = 0;

  window.location.reload();
}
