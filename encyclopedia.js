const bookSections = {
  overview: "overview",
  weapon: "weapon",
  weaponInfo: "weaponInfo",
  enemy: "enemy",
  enemyInfo: "enemyInfo",
  relic: "relic",
  relicInfo: "relicInfo",
};

let sectionNextPage;
let sectionPreviousPage;
let isLastPage = false;
let isFirstPage = false;

function showBookSection(section) {
  sectionNextPage = null;
  sectionPreviousPage = null;
  isLastPage = false;
  isFirstPage = true;
  adjustPageNavigationButtons();
  for (let entry of Object.values(bookSections)) {
    document.body.classList.remove(entry);
  }
  document.body.classList.add(section);
}

function adjustPageNavigationButtons() {
  const prevBtn = document.getElementById("prevWeaponPage");
  const nextBtn = document.getElementById("nextWeaponPage");

  if (isFirstPage) {
    prevBtn.style.display = "none";
  } else {
    prevBtn.style.display = "flex";
  }

  if (isLastPage) {
    nextBtn.style.display = "none";
  } else {
    nextBtn.style.display = "flex";
  }
}

function goToNextPage() {
  sectionNextPage();
  adjustPageNavigationButtons();
}

function goToPreviousPage() {
  sectionPreviousPage();
  adjustPageNavigationButtons();
}

const weapons = Object.values(weaponClassMapping)
  .map((weaponClass) => new weaponClass())
  .filter((w) => w.rarity !== undefined && w.rarity !== null);

weapons.sort((a, b) => a.rarity - b.rarity);

const showWeaponsBtn = document.getElementById("showWeapons");
const weaponsContainer = document.getElementById("weaponsContainer");
const weaponsPage = document.getElementById("weaponsPage");
const prevBtn = document.getElementById("prevWeaponPage");
const nextBtn = document.getElementById("nextWeaponPage");
let weaponPages = [];
let currentWeaponPageIndex = 0;
const WEAPONS_PER_PAGE = 18;

const weaponsByRarity = {};

weapons.forEach((w) => {
  if (!weaponsByRarity[w.rarity]) weaponsByRarity[w.rarity] = [];
  weaponsByRarity[w.rarity].push(w);
});

Object.values(weaponsByRarity).forEach((weaponsArray) => {
  weaponsArray.sort((a, b) => a.name.localeCompare(b.name));
});

const sortedRarities = Object.keys(weaponsByRarity).sort((a, b) => a - b);

const itemsPerPage = 18;

function renderWeaponsByPage(index) {
  weaponsPage.innerHTML = "";

  const currentPage = weaponPages[index];
  const rarity = currentPage.rarity;
  const weaponsOfRarity = weaponsByRarity[rarity];

  const start = currentPage.startIndex;
  const end = start + WEAPONS_PER_PAGE;
  const weaponsToShow = weaponsOfRarity.slice(start, end);

  const leftWeapons = weaponsToShow.slice(0, 9);
  const rightWeapons = weaponsToShow.slice(9, 18);

  function createSide(weaponsSide) {
    const sideDiv = document.createElement("div");
    sideDiv.classList.add("sidePage");

    const rarityLabel = document.createElement("h1");
    rarityLabel.textContent = `Rarity: ${rarity}`;
    rarityLabel.style.textAlign = "center";
    sideDiv.appendChild(rarityLabel);

    const gridDiv = document.createElement("div");
    gridDiv.classList.add("weaponGrid");

    weaponsSide.forEach((w) => {
      const weaponDiv = document.createElement("div");
      weaponDiv.classList.add("weaponItem");
      weaponDiv.innerHTML = `<img src="${w.sprite}"/><p>${w.name}</p>`;
      weaponDiv.onclick = () => showWeaponInfo(w);
      gridDiv.appendChild(weaponDiv);
    });

    sideDiv.appendChild(gridDiv);
    return sideDiv;
  }

  if (leftWeapons.length > 0) weaponsPage.appendChild(createSide(leftWeapons));
  if (rightWeapons.length > 0)
    weaponsPage.appendChild(createSide(rightWeapons));

  updateWeaponPaginationButtons();
}

sortedRarities.forEach((rarity) => {
  const weaponsOfRarity = weaponsByRarity[rarity];
  const totalWeapons = weaponsOfRarity.length;
  const neededPages = Math.ceil(totalWeapons / WEAPONS_PER_PAGE);

  for (let i = 0; i < neededPages; i++) {
    weaponPages.push({ rarity, startIndex: i * WEAPONS_PER_PAGE });
  }
});

let currentRarityPage = 0;
const backToSummaryBtn = document.getElementById("backToSummary");

function enterWeaponSection() {
  showBookSection(bookSections.weapon);

  sectionNextPage = nextWeaponPage;
  sectionPreviousPage = prevWeaponPage;

  renderWeaponsByPage(currentRarityPage);
  updateWeaponPaginationButtons();
  adjustPageNavigationButtons();
}

function updateWeaponPaginationButtons() {
  isFirstPage = currentWeaponPageIndex === 0;
  isLastPage = currentWeaponPageIndex >= weaponPages.length - 1;
}

function nextWeaponPage() {
  if (currentWeaponPageIndex < weaponPages.length - 1) {
    currentWeaponPageIndex++;
    renderWeaponsByPage(currentWeaponPageIndex);
    updateWeaponPaginationButtons();
  }
}

function prevWeaponPage() {
  if (currentWeaponPageIndex > 0) {
    currentWeaponPageIndex--;
    renderWeaponsByPage(currentWeaponPageIndex);
    updateWeaponPaginationButtons();
  }
}

backToSummaryBtn.addEventListener("click", () => {
  showBookSection(bookSections.overview);
});

const weaponInfoPage = document.getElementById("weaponInfoPage");
const weaponInfoName = document.getElementById("weaponName");
const weaponInfoImage = document.getElementById("weaponImage");
const weaponInfoTooltip = document.getElementById("weaponInfoTooltip");
const levelButtons = document.querySelectorAll("#weaponLevelButtons button");
const backToWeaponsBtn = document.getElementById("backToWeapons");

function showWeaponInfo(weapon) {
  showBookSection(bookSections.weaponInfo);
  displayWeaponLevel(weapon, 1);

  levelButtons.forEach((btn) => {
    btn.onclick = () => displayWeaponLevel(weapon, parseInt(btn.dataset.level));
  });
}

const dummyPlayer = {
  damageModifier: 0,
  strength: 0,
  weak: 0,
  damagePercentModifier: 0,
  critDamageModifier: 0,
  critDamagePercentModifier: 0,
  critChanceModifier: 0,
  poisonModifier: 0,
  lifestealModifier: 0,
  blockModifier: 0,
  energyModifier: 0,
  critsDisabled: false,
};

function displayWeaponLevel(weapon, level) {
  let weaponInfo = weapon.getWeaponInfo();
  while (weapon.level < level) weapon.upgrade();

  weaponInfoName.textContent = weapon.name;

  weaponInfoTooltip.style.display = "block";

  generateWeaponInfo(
    dummyPlayer,
    weapon,
    0,
    null,
    weaponInfoImage,
    weaponInfoTooltip,
    null,
    false,
    true
  );

  weapon.loadFromWeaponInfo(weaponInfo);
}

// Enemy logic

const dummyTemplate = document.createElement("div");
dummyTemplate.classList.add("sprite-enemie"); // match the expected root
dummyTemplate.innerHTML = `
  <div class="enemy-status-container">
    <div class="enemy-block hidden">0</div>
    <div class="poison-status-enemy hidden"></div>
    <div class="enemy-buff hidden"></div>
  </div>

  <div class="health-bar-container-enemy">
    <div class="health-bar-enemy" style="width: 100%; background-color: rgb(76, 175, 80);"></div>
    <span>0 / 0</span>
  </div>

  <img class="enemy-icon" src="" alt="">

  <div class="enemy-intent">
    <img src="">
  </div>
`;

Enemy.setTemplateNode(dummyTemplate);

let allEnemies = [];
const enemiesByFightType = {};
let sortedFightTypes = [];
let currentFightTypeIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  let activeAct = globalSettings.currentAct;
  globalSettings.currentAct = 1;
  allEnemies = Object.values(enemyClassMapping)
    .map((EnemyClass) => {
      return new EnemyClass();
    })
    .filter((enemyInstance) => {
      return enemyInstance.fightType;
    });
  globalSettings.currentAct = 2;
  let actTwoMimic = new Mimic();
  actTwoMimic.fightType = "Act 2 - event";
  allEnemies.push(actTwoMimic);
  let actTwoPot = new PotOfGold();
  actTwoPot.fightType = "Act 2 - normal";
  allEnemies.push(actTwoPot);
  globalSettings.currentAct = activeAct;

  allEnemies.forEach((enemy) => {
    const fightType = enemy.fightType;
    if (!enemiesByFightType[fightType]) enemiesByFightType[fightType] = [];
    enemiesByFightType[fightType].push(enemy);
  });

  // sort alphabetically inside each fightType group
  Object.values(enemiesByFightType).forEach((enemyArray) => {
    enemyArray.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  });

  sortedFightTypes = Object.keys(enemiesByFightType).sort((a, b) => {
    const typeOrder = { normal: 0, elite: 1, event: 2, boss: 3 };
    let regex = /(\w+( \d+)?)\W+(\w+)/i;
    const matchA = a.match(regex);
    const matchB = b.match(regex);
    const [actA, typeA] = matchA
      ? [matchA[1], matchA[3].toLowerCase()]
      : ["", ""];
    const [actB, typeB] = matchB
      ? [matchB[1], matchB[3].toLowerCase()]
      : ["", ""];
    return actA === actB
      ? typeOrder[typeA] - typeOrder[typeB]
      : actA.localeCompare(actB);
  });
});

function renderEnemiesByFightType(index) {
  enemiesPage.innerHTML = "";
  const fightType = sortedFightTypes[index];
  const enemiesList = enemiesByFightType[fightType] || [];

  const leftEnemies = enemiesList.slice(0, 9);
  const rightEnemies = enemiesList.slice(9, 18);

  function createSide(enemiesSide) {
    const sideDiv = document.createElement("div");
    sideDiv.classList.add("sidePage");

    const label = document.createElement("h1");
    label.textContent = fightType.toUpperCase();
    label.style.textAlign = "center";
    sideDiv.appendChild(label);

    const gridDiv = document.createElement("div");
    gridDiv.classList.add("enemyGrid");

    enemiesSide.forEach((enemy) => {
      const enemyDiv = document.createElement("div");
      enemyDiv.classList.add("enemyItem");

      const img = document.createElement("img");
      img.src = enemy.icon;
      img.classList.add("encyclopedia-enemy-icon");
      enemyDiv.appendChild(img);

      const nameP = document.createElement("p");
      nameP.textContent = enemy.name;
      enemyDiv.appendChild(nameP);

      enemyDiv.onclick = () => showEnemyInfo(enemy);

      gridDiv.appendChild(enemyDiv);
    });

    sideDiv.appendChild(gridDiv);
    return sideDiv;
  }

  if (leftEnemies.length > 0) enemiesPage.appendChild(createSide(leftEnemies));
  if (rightEnemies.length > 0)
    enemiesPage.appendChild(createSide(rightEnemies));
}

function updateEnemyPaginationButtons() {
  isFirstPage = currentFightTypeIndex === 0;
  isLastPage = currentFightTypeIndex >= sortedFightTypes.length - 1;
}

function enterEnemySection() {
  showBookSection(bookSections.enemy);

  sectionNextPage = nextEnemyPage;
  sectionPreviousPage = previousEnemyPage;
  renderEnemiesByFightType(currentFightTypeIndex);
  updateEnemyPaginationButtons();
  adjustPageNavigationButtons();
}

function nextEnemyPage() {
  if (currentFightTypeIndex < sortedFightTypes.length - 1) {
    currentFightTypeIndex++;
    renderEnemiesByFightType(currentFightTypeIndex);
    updateEnemyPaginationButtons();
  }
}

function previousEnemyPage() {
  if (currentFightTypeIndex > 0) {
    currentFightTypeIndex--;
    renderEnemiesByFightType(currentFightTypeIndex);
    updateEnemyPaginationButtons();
  }
}

const enemyInfoPage = document.getElementById("enemyInfoPage");
const enemyInfoName = document.getElementById("enemyName");
const enemyInfoImage = document.getElementById("enemyImage");
const enemyDescription = document.getElementById("enemyDescription");
const backToEnemiesBtn = document.getElementById("backToEnemies");

function showEnemyInfo(enemy) {
  showBookSection(bookSections.enemyInfo);

  enemyInfoName.textContent = enemy.name;
  enemyInfoImage.innerHTML = `<img src="${enemy.icon}"/>`;
  enemyDescription.innerHTML = enemy.description || "No description available";
}

// relic logic

const relicsPage = document.getElementById("relicsPage");
const relicInfoPage = document.getElementById("relicInfoPage");
const relicInfoName = document.getElementById("relicName");
const relicInfoImage = document.getElementById("relicImage");
const relicDescription = document.getElementById("relicDescription");
const backToRelicsBtn = document.getElementById("backToRelics");
const showRelicsBtn = document.getElementById("showRelics");

let relicsByGroup = {};
let sortedRelicGroups = [];
let currentRelicGroupIndex = 0;
let currentRelicGroupPage = 0;
const RELICS_PER_PAGE = 18;
let relicPages = [];

// --- build relic groups ---
Object.values(relicList).forEach((relic) => {
  let group = relic.relicGroup?.toLowerCase() || "misc";

  // Handle custom/unknown relic groups
  if (!["chest", "elite", "event", "boss", "curse", "misc"].includes(group)) {
    // Add all unique/unrecognized relics to event group
    group = "event";
  }

  if (!relicsByGroup[group]) relicsByGroup[group] = [];
  relicsByGroup[group].push(relic);
});

// sort alphabetically within each group
Object.values(relicsByGroup).forEach((relicArray) => {
  relicArray.sort((a, b) => a.name.localeCompare(b.name));
});

// order groups in a consistent way
sortedRelicGroups = ["chest", "elite", "event", "boss", "curse", "misc"].filter(
  (g) => relicsByGroup[g]
);

sortedRelicGroups.forEach((relicGroup) => {
  let numberRelicsPerGroup = relicsByGroup[relicGroup].length;
  let neededPages = numberRelicsPerGroup / RELICS_PER_PAGE;
  for (let i = 0; i < neededPages; i++) {
    relicPages.push({ group: relicGroup, startIndex: i * RELICS_PER_PAGE });
  }
});

function renderRelicsByGroup(index) {
  relicsPage.innerHTML = "";
  let currentPage = relicPages[index];
  const group = currentPage.group;
  const relicsList = relicsByGroup[group] || [];

  const start = currentPage.startIndex;
  const end = start + RELICS_PER_PAGE;
  const relicsPageItems = relicsList.slice(start, end);

  const leftRelics = relicsPageItems.slice(0, 9);
  const rightRelics = relicsPageItems.slice(9, 18);

  function createSide(relicsSide) {
    const sideDiv = document.createElement("div");
    sideDiv.classList.add("sidePage");

    const label = document.createElement("h1");
    label.textContent = group.toUpperCase();
    label.style.textAlign = "center";
    sideDiv.appendChild(label);

    const gridDiv = document.createElement("div");
    gridDiv.classList.add("relicGrid");

    relicsSide.forEach((relic) => {
      const relicDiv = document.createElement("div");
      relicDiv.classList.add("relicItem");

      const img = document.createElement("img");
      img.src = relic.icon;
      img.classList.add("encyclopedia-relic-icon");
      relicDiv.appendChild(img);

      const nameP = document.createElement("p");
      nameP.textContent = relic.name;
      relicDiv.appendChild(nameP);

      relicDiv.onclick = () => showRelicInfo(relic);

      gridDiv.appendChild(relicDiv);
    });

    sideDiv.appendChild(gridDiv);
    return sideDiv;
  }

  if (leftRelics.length > 0) relicsPage.appendChild(createSide(leftRelics));
  if (rightRelics.length > 0) relicsPage.appendChild(createSide(rightRelics));

  updateRelicPaginationButtons();
}

function updateRelicPaginationButtons() {
  isFirstPage = currentRelicGroupIndex === 0;
  isLastPage = currentRelicGroupIndex >= relicPages.length - 1;
}

function enterRelicSection() {
  showBookSection(bookSections.relic);

  sectionNextPage = nextRelicPage;
  sectionPreviousPage = previousRelicPage;

  renderRelicsByGroup(currentRelicGroupIndex);
  updateRelicPaginationButtons();
  adjustPageNavigationButtons();
}

function nextRelicPage() {
  if (currentRelicGroupIndex < relicPages.length - 1) {
    currentRelicGroupIndex++;
    renderRelicsByGroup(currentRelicGroupIndex);
    updateRelicPaginationButtons();
  }
}

function previousRelicPage() {
  if (currentRelicGroupIndex > 0) {
    currentRelicGroupIndex--;
    renderRelicsByGroup(currentRelicGroupIndex);
    updateRelicPaginationButtons();
  }
}

function showRelicInfo(relic) {
  showBookSection(bookSections.relicInfo);

  relicInfoName.textContent = relic.name;
  relicInfoImage.innerHTML = `<img src="${relic.icon}" />`;
  relicDescription.innerHTML =
    relic.relicDescription || "No description available.";

  const relicInfoTextDiv = document.getElementById("relicInfoText");
  relicInfoTextDiv.innerHTML = relic.relicInfoText || "";
}

// wire up the relic button
showRelicsBtn.addEventListener("click", enterRelicSection);
backToRelicsBtn.addEventListener("click", enterRelicSection);
