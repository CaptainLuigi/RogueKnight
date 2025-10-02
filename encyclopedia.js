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

function renderWeaponsPage(page) {
  weaponsPage.innerHTML = "";

  const start = page * itemsPerPage;
  const end = start + itemsPerPage;
  const pageWeapons = weapons.slice(start, end);

  // Split into two columns
  const half = Math.ceil(pageWeapons.length / 2);
  const leftColumn = pageWeapons.slice(0, half);
  const rightColumn = pageWeapons.slice(half);

  const leftDiv = document.createElement("div");
  leftDiv.classList.add("column");
  leftColumn.forEach((w) => {
    const weaponDiv = document.createElement("div");
    weaponDiv.classList.add("weaponItem");
    weaponDiv.innerHTML = `<img src="${w.sprite}"/><p>${w.name}</p>`;
    leftDiv.appendChild(weaponDiv);
  });

  const rightDiv = document.createElement("div");
  rightDiv.classList.add("column");
  rightColumn.forEach((w) => {
    const weaponDiv = document.createElement("div");
    weaponDiv.classList.add("weaponItem");
    weaponDiv.innerHTML = `<img src="${w.sprite}"/><p>${w.name}</p>`;
    rightDiv.appendChild(weaponDiv);
  });

  weaponsPage.appendChild(leftDiv);
  weaponsPage.appendChild(rightDiv);
}

function renderWeaponsByRarity(rarityIndex) {
  weaponsPage.innerHTML = "";
  const rarity = sortedRarities[rarityIndex];
  const weaponsOfRarity = weaponsByRarity[rarity];

  const leftWeapons = weaponsOfRarity.slice(0, 9);
  const rightWeapons = weaponsOfRarity.slice(9, 18);

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

  weaponsPage.appendChild(createSide(leftWeapons));
  weaponsPage.appendChild(createSide(rightWeapons));
}

let currentRarityPage = 0;
const backToSummaryBtn = document.getElementById("backToSummary");

function enterWeaponSection() {
  showBookSection(bookSections.weapon);

  sectionNextPage = nextWeaponPage;
  sectionPreviousPage = prevWeaponPage;
  renderWeaponsByRarity(currentRarityPage);
  updatePaginationButtons();
  adjustPageNavigationButtons();
}

function nextWeaponPage() {
  if (currentRarityPage < sortedRarities.length - 1) {
    currentRarityPage++;
    renderWeaponsByRarity(currentRarityPage);
    updatePaginationButtons();
  }
}

function prevWeaponPage() {
  if (currentRarityPage > 0) {
    currentRarityPage--;
    renderWeaponsByRarity(currentRarityPage);
    updatePaginationButtons();
  }
}

function updatePaginationButtons() {
  isFirstPage = currentRarityPage === 0;
  isLastPage = currentRarityPage >= sortedRarities.length - 1;
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
  allEnemies = Object.values(enemyClassMapping).filter((EnemyClass) => {
    const temp = new EnemyClass();
    return temp.fightType;
  });

  allEnemies.forEach((EnemyClass) => {
    const enemy = new EnemyClass();
    const fightType = enemy.fightType;
    if (!enemiesByFightType[fightType]) enemiesByFightType[fightType] = [];
    enemiesByFightType[fightType].push(EnemyClass);
  });

  // sort alphabetically inside each fightType group
  Object.values(enemiesByFightType).forEach((enemyArray) => {
    enemyArray.sort((A, B) => {
      const a = new A();
      const b = new B();
      return a.name.localeCompare(b.name);
    });
  });

  sortedFightTypes = Object.keys(enemiesByFightType).sort((a, b) => {
    const typeOrder = { normal: 0, elite: 1, event: 2, boss: 3 };
    const matchA = a.match(/([a-z]+)(\d+)/i);
    const matchB = b.match(/([a-z]+)(\d+)/i);
    const [typeA, numA] = matchA ? [matchA[1], parseInt(matchA[2])] : ["", 0];
    const [typeB, numB] = matchB ? [matchB[1], parseInt(matchB[2])] : ["", 0];
    return numA === numB ? typeOrder[typeA] - typeOrder[typeB] : numA - numB;
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
    label.textContent = fightType.tpUpperCase();
    label.style.textAlign = "center";
    sideDiv.appendChild(label);

    const gridDiv = document.createElement("div");
    gridDiv.classList.add("enemyGrid");

    enemiesSide.forEach((EnemyClass) => {
      const enemy = new EnemyClass();
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
  currentFightTypeIndex = 0;
  renderEnemiesByAct(currentFightTypeIndex);
  updateEnemyPaginationButtons();
  adjustPageNavigationButtons();
}

function nextEnemyPage() {
  if (currentFightTypeIndex < sortedFightTypes.length - 1) {
    currentFightTypeIndex++;
    renderEnemiesByAct(currentFightTypeIndex);
    updateEnemyPaginationButtons();
  }
}

function previousEnemyPage() {
  if (currentFightTypeIndex > 0) {
    currentFightTypeIndex--;
    renderEnemiesByAct(currentFightTypeIndex);
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
  enemyDescription.textContent =
    enemy.description || "No description available";
}
