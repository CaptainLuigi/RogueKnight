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

showWeaponsBtn.addEventListener("click", () => {
  document.getElementById("firstPage").style.display = "none";
  document.getElementById("secondPage").style.display = "none";
  weaponsContainer.style.display = "flex";
  document.getElementById("weaponsPagination").style.display = "flex";
  backToSummaryBtn.style.display = "flex";
  currentRarityPage = 0;
  renderWeaponsByRarity(currentRarityPage);
  updatePaginationButtons();
});

nextBtn.addEventListener("click", () => {
  if (currentRarityPage < sortedRarities.length - 1) {
    currentRarityPage++;
    renderWeaponsByRarity(currentRarityPage);
    updatePaginationButtons();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentRarityPage > 0) {
    currentRarityPage--;
    renderWeaponsByRarity(currentRarityPage);
    updatePaginationButtons();
  }
});

function updatePaginationButtons() {
  const prevBtn = document.getElementById("prevWeaponPage");
  const nextBtn = document.getElementById("nextWeaponPage");

  if (currentRarityPage === 0) {
    prevBtn.style.display = "none";
  } else {
    prevBtn.style.display = "flex";
  }

  if (currentRarityPage >= sortedRarities.length - 1) {
    nextBtn.style.display = "none";
  } else {
    nextBtn.style.display = "flex";
  }
}

backToSummaryBtn.addEventListener("click", () => {
  weaponsContainer.style.display = "none";
  document.getElementById("weaponsPagination").style.display = "none";
  backToSummaryBtn.style.display = "none";

  document.getElementById("firstPage").style.display = "block";
  document.getElementById("secondPage").style.display = "flex";
});

const weaponInfoPage = document.getElementById("weaponInfoPage");
const weaponInfoName = document.getElementById("weaponName");
const weaponInfoImage = document.getElementById("weaponImage");
const weaponInfoTooltip = document.getElementById("weaponInfoTooltip");
const levelButtons = document.querySelectorAll("#weaponLevelButtons button");
const backToWeaponsBtn = document.getElementById("backToWeapons");

function showWeaponInfo(weapon) {
  weaponsContainer.style.display = "none";
  backToSummaryBtn.style.display = "none";
  prevBtn.style.display = "none";
  nextBtn.style.display = "none";
  weaponInfoPage.style.display = "flex";
  // next, prev button none, back to summary none

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

backToWeaponsBtn.onclick = () => {
  weaponInfoPage.style.display = "none";
  weaponsContainer.style.display = "flex";
  backToSummaryBtn.style.display = "flex";
  prevBtn.style.display = "flex";
  nextBtn.style.display = "flex";
};

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

const allEnemies = Object.values(enemyClassMapping)
  .map((EnemyClass) => new EnemyClass())
  .filter((e) => e.fightType);

const enemiesByAct = {};

allEnemies.forEach((e) => {
  const act = e.fightType.match(/\d$/)[0];
  if (!enemiesByAct[act]) enemiesByAct[act] = [];
  enemiesByAct[act].push(e);
});

Object.values(enemiesByAct).forEach((enemyArray) => {
  enemyArray.sort((a, b) => a.name.localeCompare(b.name));
});

const sortedActs = Object.keys(enemiesByAct).sort();

const showEnemiesBtn = document.getElementById("showEnemies");
const enemiesContainer = document.getElementById("enemiesContainer");
const enemiesPage = document.getElementById("enemiesPage");
const prevEnemyBtn = document.getElementById("prevEnemyPage");
const nextEnemyBtn = document.getElementById("nextEnemyPage");
const backToEnemySummaryBtn = document.getElementById("backToEnemySummary");

let currentActPage = 0;

function renderEnemiesByAct(actIndex) {
  enemiesPage.innerHTML = "";
  const act = sortedActs[actIndex];
  const enemiesOfAct = enemiesByAct[act];

  const leftEnemies = enemiesOfAct.slice(0, 9);
  const rightEnemies = enemiesOfAct.slice(9, 18);

  function createSide(enemiesSide) {
    const sideDiv = document.createElement("div");
    sideDiv.classList.add("sidePage");

    // Act label
    const actLabel = document.createElement("h1");
    actLabel.textContent = `Act: ${act}`;
    actLabel.style.textAlign = "center";
    sideDiv.appendChild(actLabel);

    // Grid for enemies
    const gridDiv = document.createElement("div");
    gridDiv.classList.add("enemyGrid");

    enemiesSide.forEach((enemy) => {
      const enemyDiv = document.createElement("div");
      enemyDiv.classList.add("enemyItem");

      const img = document.createElement("img");
      img.src = enemy.icon;
      img.alt = enemy.name;

      const nameP = document.createElement("p");
      nameP.textContent = enemy.name;

      enemyDiv.appendChild(img);
      enemyDiv.appendChild(nameP);

      enemyDiv.onclick = () => showEnemyInfo(enemy);
      gridDiv.appendChild(enemyDiv);
    });

    sideDiv.appendChild(gridDiv);
    return sideDiv;
  }

  enemiesPage.appendChild(createSide(leftEnemies));
  enemiesPage.appendChild(createSide(rightEnemies));
}

function updateEnemyPaginationButtons() {
  prevEnemyBtn.style.display = currentActPage === 0 ? "none" : "flex";
  nextEnemyBtn.style.display =
    currentActPage >= sortedActs.length - 1 ? "none" : "flex";
}

showEnemiesBtn.addEventListener("click", () => {
  document.getElementById("firstPage").style.display = "none";
  document.getElementById("secondPage").style.display = "none";
  enemiesContainer.style.display = "flex";
  document.getElementById("enemiesPagination").style.display = "flex";
  backToEnemySummaryBtn.style.display = "flex";

  currentActPage = 0;
  renderEnemiesByAct(currentActPage);
  updateEnemyPaginationButtons();
});

nextEnemyBtn.addEventListener("click", () => {
  if (currentActPage < sortedActs.length - 1) {
    currentActPage++;
    renderEnemiesByAct(currentActPage);
    updateEnemyPaginationButtons();
  }
});

prevEnemyBtn.addEventListener("click", () => {
  if (currentActPage > 0) {
    currentActPage--;
    renderEnemiesByAct(currentActPage);
    updateEnemyPaginationButtons();
  }
});

backToEnemySummaryBtn.addEventListener("click", () => {
  enemiesContainer.style.display = "none";
  document.getElementById("enemiesPagination").style.display = "none";
  backToEnemySummaryBtn.style.display = "none";

  document.getElementById("firstPage").style.display = "block";
  document.getElementById("secondPage").style.display = "flex";
});

const enemyInfoPage = document.getElementById("enemyInfoPage");
const enemyInfoName = document.getElementById("enemyName");
const enemyInfoImage = document.getElementById("enemyImage");
const enemyDescription = document.getElementById("enemyDescription");
const backToEnemiesBtn = document.getElementById("backToEnemies");

function showEnemyInfo(enemy) {
  enemiesContainer.style.display = "none";
  backToEnemySummaryBtn.style.display = "none";
  prevEnemyBtn.style.display = "none";
  nextEnemyBtn.style.display = "none";

  enemyInfoPage.style.display = "flex";

  enemyInfoName.textContent = enemy.name;
  enemyInfoImage.innerHTML = `<img src="${enemy.icon}"/>`;
  enemyDescription.textContent =
    enemy.description || "No description available";
}

backToEnemiesBtn.onclick = () => {
  enemyInfoPage.style.display = "none";
  enemiesContainer.style.display = "flex";
  backToEnemySummaryBtn.style.display = "flex";
  prevEnemyBtn.style.display = "flex";
  nextEnemyBtn.style.display = "flex";
};
