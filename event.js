let player = new Player("Knight", 100, 100, [], 3, 3);

player.loadPlayerFromStorage();

let sprite;
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("current-deck").addEventListener("click", () => {
    player.showDeck();
  });
  document.getElementById("close-deck-btn").addEventListener("click", () => {
    document.getElementById("weapon-deck-screen").classList.add("hidden");
  });
  let eventType = loadData("RandomEvent");

  document.getElementById(eventType).classList.remove("hidden");

  const goldDisplay = document.getElementById("playerGold");
  goldDisplay.textContent = "Gold: " + globalSettings.playerGold;
  sprite = document.querySelector(".sprite");

  resetToIdleAnimation();
});
