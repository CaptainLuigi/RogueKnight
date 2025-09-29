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
  weaponInfoPage.style.display = "flex";

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
};
