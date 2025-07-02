function getAllGetters(instance) {
  const getters = {};

  // Get all properties in the prototype chain
  let proto = Object.getPrototypeOf(instance);

  while (proto) {
    // Get all property descriptors for this prototype level
    const descriptors = Object.getOwnPropertyDescriptors(proto);

    // Find all getter methods (i.e., those with 'get' in the descriptor)
    for (let key in descriptors) {
      if (descriptors[key].get) {
        let getter = descriptors[key].get;
        if (!(key in getters)) getters[key] = getter;
      }
    }

    // Move to the next prototype (in case the class extends another class)
    proto = Object.getPrototypeOf(proto);
  }

  delete getters["__proto__"];
  return getters;
}

document.addEventListener("DOMContentLoaded", () => {
  const pauseBtn = document.getElementById("pause-menu-button");
  const menu = document.getElementById("pause-menu");

  if (pauseBtn && menu) {
    pauseBtn.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
  }
});

function closePauseMenu() {
  document.getElementById("pause-menu").classList.add("hidden");
}

function saveAndExit() {
  player.savePlayerToStorage();
  window.location.href = "startscreen.html";
}

function deleteProgressAndExit(exit = true) {
  localStorage.removeItem("playerState");
  localStorage.removeItem("MapState");
  localStorage.removeItem("triggeredEvents");

  localStorage.removeItem("shopWeapons");
  localStorage.removeItem("shopRelics");

  localStorage.removeItem("boughtShopWeapons");
  localStorage.removeItem("boughtShopRelics");

  localStorage.removeItem("selectedFightIndex");

  localStorage.removeItem("selectedRelicName");

  localStorage.setItem("weaponRemoved", "false");

  for (let key of [...Object.keys(localStorage)]) {
    if (key.startsWith("relic_")) {
      localStorage.removeItem(key);
    }
  }

  globalSettings.relicGroup = "chest";
  globalSettings.redirectToChest = false;
  globalSettings.currentAct = 1;

  if (exit === true) {
    window.location.href = "startscreen.html";
  }
}
