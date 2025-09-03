let player = new Player("Knight", 100, 100, [], 3, 3);

const events = [
  {
    name: "questionmark",
    propability: 15,
    fillRemaining: true,
  },
  {
    name: "shop",
    propability: 5,
    fillRemaining: false,
  },
  {
    name: "elite",
    propability: 5,
    fillRemaining: false,
  },
  {
    name: "chest",
    propability: 5,
    fillRemaining: false,
  },
];

const DEFAULT_EVENT_TYPE = "skull";

let globalEventArray = [];

let skullDifficulty;

player.loadPlayerFromStorage();

function setSkullDifficulty() {
  if (globalSettings.currentAct === 1) {
    skullDifficulty = [
      1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4,
      4,
    ];
  } else if (globalSettings.currentAct === 2) {
    skullDifficulty = [
      11, 11, 11, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13, 13, 14, 14,
      14, 14, 14,
    ];
  }
}

setSkullDifficulty();

let mapState;

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const viewOnly = params.get("viewonly") === "true";

  displayEquippedRelics();
  mapState = loadData("MapState");
  const lastAct = loadData("MapAct");

  if (
    mapState == null ||
    mapState.wasFinalBoss == true ||
    lastAct !== globalSettings.currentAct
  ) {
    generateMap();
    storeData("MapAct", globalSettings.currentAct);
  } else {
    loadMap();
  }

  if (viewOnly) {
    markCurrentLocation();
    disableInteractions();
  } else {
    markPossibleLocations();
  }

  document.getElementById("current-deck").addEventListener("click", () => {
    player.showDeck();
  });
  document.getElementById("close-deck-btn").addEventListener("click", () => {
    document.getElementById("weapon-deck-screen").classList.add("hidden");
  });
});

function fillGlobalEventArray(totalLength, skullPercentage) {
  globalEventArray.length = 0;
  let skullTotoal = Math.ceil((skullPercentage * totalLength) / 100);
  let eventCount = totalLength - skullTotoal;
  let totalPropability = 0;
  let remainingEventCount = eventCount;
  events.forEach((event) => {
    totalPropability += event.propability;
  });

  let fillEvent;
  events.forEach((event) => {
    if (event.fillRemaining) {
      fillEvent = event;
      return;
    }
    let actualCount = Math.floor(
      (eventCount * event.propability) / totalPropability
    );
    if (actualCount === 0) {
      actualCount = 1;
    }
    remainingEventCount -= actualCount;
    for (let i = 0; i < actualCount; i++) {
      globalEventArray.push(event.name);
    }
  });
  for (let i = 0; i < remainingEventCount; i++) {
    globalEventArray.push(fillEvent.name);
  }
  while (globalEventArray.length < totalLength) {
    globalEventArray.push(DEFAULT_EVENT_TYPE);
  }
}

function generateMap() {
  globalSettings.eventResolved = true;
  // fillGlobalEventArray erster Wert = alle Navigation Nodes (-Anfang/Ende), zweiter Wert prozentual Skull
  fillGlobalEventArray(30, 30);
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
      type: DEFAULT_EVENT_TYPE,
      difficulty: 1,
      nextLocations: [],
      isFinalBoss: false,
    };
    tempMapState.locationStates[i] = buttonData;

    let parentRow = button.parentNode;
    let nextRow = parentRow.nextElementSibling;
    if (nextRow == null) {
      buttonData.isFinalBoss = true;

      if (globalSettings.currentAct === 1) {
        buttonData.difficulty = 10;
      } else {
        buttonData.difficulty = 20;
      }

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
  storeData("MapAct", globalSettings.currentAct);
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

function enterLocation(button) {
  let index = button.getAttribute("index");
  if (mapState.activeLocation == null && index != 0) {
    console.log("Bitte in Startgebiet beginnen");
    return;
  }

  let active;

  if (globalSettings.eventResolved === false) {
    if (index !== mapState.activeLocation) {
      console.error("Event not resolved");
      return;
    }
  } else if (mapState.activeLocation != null) {
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

  globalSettings.eventResolved = false;

  mapState.activeLocation = index;
  active = mapState.locationStates[mapState.activeLocation];
  mapState.wasFinalBoss = active.isFinalBoss;
  storeData("MapState", mapState);
  globalSettings.difficulty = active.difficulty;

  if (window.parent !== window) {
    window.parent.postMessage(
      { type: "updateDifficulty", difficulty: active.difficulty },
      "*"
    );
  }

  if (active.type == "questionmark") {
    triggerRandomEvent();
  } else if (active.type == "skull") window.location.href = "./Tutorial.html";
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
  } else if (!globalSettings.eventResolved) {
    nextRow = document.querySelector(
      `div:has(> [index="${mapState.activeLocation}"])`
    );

    let currentLocation = document.querySelector(
      `[index="${mapState.activeLocation}"]`
    );
    let index = [...nextRow.children].findIndex((e) => e == currentLocation);
    nextLocations.push(index);
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

function markCurrentLocation() {
  if (mapState && mapState.activeLocation != null) {
    let currentButton = document.querySelector(
      `.navigation[index="${mapState.activeLocation}"]`
    );
    if (currentButton) {
      currentButton.classList.add("current-location");
    }
  }
}

function disableInteractions() {
  const buttons = document.querySelectorAll(".navigation");
  buttons.forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    btn.style.cursor = "default";
  });
  document.getElementById("pause-menu-button").style.display = "none";
  document.getElementById("current-deck").style.display = "none";
}

function triggerRandomEvent() {
  const act1Events = [
    { type: "upgradeWeapon", action: showEvent },
    { type: "ambushGold", action: showEvent },
    { type: "hurtAnkle", action: showEvent },
    { type: "duplicateWeapon", action: showEvent },
    { type: "thorsHammer", action: showEvent },
    { type: "foundGold", action: showEvent },
    { type: "gambling", action: showEvent },
    { type: "rest", action: showEvent },
    { type: "lightning", action: showEvent },
    { type: "succubus", action: showEvent },
    { type: "stoned", action: showEvent },
    { type: "poisonWeapon", action: showEvent },
    { type: "weaponLifesteal", action: showEvent },
    { type: "bloodforge", action: showEvent },
    { type: "dieGambling", action: showEvent },
  ];

  const act2Events = [
    { type: "infernalIngot", action: showEvent },
    { type: "upgradeAll", action: showEvent },
    { type: "lowerEnergyCost", action: showEvent },
    { type: "goldenStatue", action: showEvent },
    { type: "healOrHp", action: showEvent },
    { type: "golemEncounter", action: showEvent },
    { type: "ancientWriting", action: showEvent },
    { type: "magicWand", action: showEvent },
    { type: "fallingStones", action: showEvent },
    { type: "offerWeapon", action: showEvent },
  ];

  const sharedEvents = [
    { type: "shopScouting", action: showEvent },
    { type: "eliteFight", action: startEliteFight },
    { type: "normalFight", action: startNormalFight },
    { type: "chest", action: openChest },
  ];

  let allEvents = [...sharedEvents];
  allEvents.push(
    ...(globalSettings.currentAct === 1 ? act1Events : act2Events)
  );

  if (player.deck.length > 2 && globalSettings.currentAct === 1) {
    allEvents.push({ type: "dropWeapon", action: showEvent });
  }

  if (
    player.health <= (player.maxHealth / 100) * 20 &&
    globalSettings.currentAct === 1
  ) {
    allEvents.push({ type: "fullHeal", action: showEvent });
  }

  if (globalSettings.playerGold >= 50 && globalSettings.currentAct === 1) {
    allEvents.push({ type: "dave", action: showEvent });
  }

  if (
    player.equippedRelics.includes("Contract with Dave") &&
    globalSettings.currentAct === 2
  ) {
    allEvents.push({ type: "reunionDave", action: showEvent });
  }

  if (globalSettings.playerGold >= 150 && globalSettings.currentAct === 2) {
    allEvents.push({ type: "zenRelic", action: showEvent });
  }

  let triggeredEvents =
    JSON.parse(localStorage.getItem("triggeredEvents")) || {};

  let eventAssignments =
    JSON.parse(localStorage.getItem("eventAssignments")) || {};

  let locationKey = mapState.activeLocation;

  if (eventAssignments[locationKey]) {
    let assignedEventType = eventAssignments[locationKey];
    let assignedEvent = allEvents.find((e) => e.type === assignedEventType);

    if (assignedEvent) {
      assignedEvent.action(assignedEvent.type);
      return;
    }
  }

  const availableEvents = allEvents.filter((event) => {
    return (
      !triggeredEvents[event.type] ||
      ["eliteFight", "normalFight", "chest"].includes(event.type)
    );
  });

  if (availableEvents.length > 0) {
    const randomEvent =
      availableEvents[Math.floor(Math.random() * availableEvents.length)];

    eventAssignments[locationKey] = randomEvent.type;
    localStorage.setItem("eventAssignments", JSON.stringify(eventAssignments));

    randomEvent.action(randomEvent.type);

    triggeredEvents[randomEvent.type] = true;

    localStorage.setItem("triggeredEvents", JSON.stringify(triggeredEvents));
  } else {
    console.log("No available events left to trigger!");
  }
}

function startEliteFight() {
  globalSettings.difficulty = globalSettings.currentAct === 2 ? 18 : 8;
  globalSettings.relicGroup = "elite";
  globalSettings.redirectToChest = true;
  window.location.href = "Tutorial.html";
}

function startNormalFight() {
  window.location.href = "./Tutorial.html";
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
  localStorage.removeItem("eventAssignments");

  localStorage.removeItem("shopWeapons");
  localStorage.removeItem("shopRelics");

  localStorage.removeItem("boughtShopWeapons");
  localStorage.removeItem("boughtShopRelics");

  localStorage.removeItem("selectedFightIndex");

  localStorage.setItem("weaponRemoved", "false");

  relicNames.forEach((relicName) => {
    localStorage.removeItem("relic_" + relicName);
  });

  if (player && player.equippedRelics) {
    player.equippedRelics = [];
  }

  globalSettings.relicGroup = "chest";
  globalSettings.redirectToChest = false;

  globalSettings.playerGold = 0;

  window.location.reload();
}
