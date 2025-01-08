document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  Enemy.initialize();
  enemies.push(
    new Enemy("Shroom", 250, 15, "Assets/Transperent/Icon1.png"),
    new Shroom(),
    new Enemy("Troll", 750, 50, "Assets/Transperent/Icon3.png"),
    new Enemy("Troll", 750, 50, "Assets/Transperent/Icon4.png"),
    new Enemy("Troll", 750, 5, "Assets/Transperent/Icon5.png")
  );
  // Add the event listener to the "End Turn" button
  document.getElementById("end-turn-btn").addEventListener("click", endTurn);
});

const enemies = [];

let isPlayerTurn = true; // Flag to track if it's the player's turn

// Function to disable weapons during the enemy's turn
function disableWeapons() {
  const weaponButtons = document.querySelectorAll(".weapon-button");
  weaponButtons.forEach((button) => {
    button.disabled = true; // Disable the weapon buttons
  });
}

// Function to enable weapons after the player’s turn is back
function enableWeapons() {
  const weaponButtons = document.querySelectorAll(".weapon-button");
  weaponButtons.forEach((button) => {
    button.disabled = false; // Enable the weapon buttons
  });
}

// Function to handle the "End Turn" button click
function endTurn() {
  console.log("End turn clicked!");

  // Step 1: Disable the weapons so the player can't attack during the enemy's turn
  disableWeapons();

  isPlayerTurn = false;

  // Step 2: Add a delay before the enemy attacks
  setTimeout(() => {
    // Trigger the enemy's attack (deal damage to the player)
    enemies[0].attack(player); // Call the attack function in the enemy.js file

    // Step 3: Update the player's health bar to reflect the damage
    updateHealthBar(player); // Make sure you update the health bar after damage

    // Step 4: Refill the player's energy
    refillEnergy();

    // Step 5: Update the energy display to show refilled energy
    updateEnergyDisplay();

    // Step 6: Display "Your Turn Again" message
    displayTurnMessage("Your Turn Again!");

    // Step 7: Enable the weapons again for the player's next turn
    setTimeout(() => {
      isPlayerTurn = true;
      enableWeapons(); // Enable the weapons after the delay
    }, 2000); // Enable after 2 seconds (can adjust based on animation time)
  }, 1500); // Add a 1.5-second delay before the enemy attacks (adjust the delay as needed)
}

// Function to refill the player's energy (e.g., set to full energy)
function refillEnergy() {
  player.energy = 3; // Set the energy back to the maximum value
}

// Update the player's energy display
function updateEnergyDisplay() {
  const energyText = document.getElementById("energy-text");
  const energyCircle = document.getElementById("energy-circle");

  // Update the energy text
  energyText.textContent = `${player.energy}`;

  // Update the background color based on energy level
  if (player.energy > 2) {
    energyCircle.style.backgroundColor = "#4caf50"; // Green if energy is full
  } else if (player.energy > 1) {
    energyCircle.style.backgroundColor = "#ff9800"; // Orange if energy is medium
  } else {
    energyCircle.style.backgroundColor = "#f44336"; // Red if energy is low
  }
}

// Function to display the "Your Turn Again" message
function displayTurnMessage(message) {
  const turnMessage = document.getElementById("turn-message");

  if (!turnMessage) {
    console.error("Turn message element not found!");
    return;
  }

  console.log("Displaying turn message:", message);
  turnMessage.textContent = message;
  turnMessage.style.display = "block"; // Show the message

  // Hide the message after 2 seconds (you can adjust this delay)
  setTimeout(() => {
    turnMessage.style.display = "none"; // Hide the message
  }, 2000);
}
