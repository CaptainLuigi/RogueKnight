const events = [
  "elite",
  "elite",
  "elite",
  "elite",
  "elite",
  "shop",
  "shop",
  "shop",
  "shop",
  "shop",
  "questionmark",
  "questionmark",
  "questionmark",
  "questionmark",
  "questionmark",
  "questionmark",
  "questionmark",
  "skull",
  "skull",
  "skull",
  "skull",
  "skull",
  "skull",
  "skull",
  "skull",
  "skull",
  "skull",
];

const skullDifficulty = [1, 1, 1, 2, 2, 2, 3, 3, 3, 3];

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and script is running!");

  // Now try to find the navigation buttons
  const navigationButtons = document.querySelectorAll(".navigation");
  console.log("Found navigation buttons:", navigationButtons.length);

  if (navigationButtons.length > 0) {
    setSkullforFirstButton(navigationButtons);

    assignRandomEvents(navigationButtons); // Pass the buttons to the function
  } else {
    console.log("No navigation buttons found!");
  }
});

function setSkullforFirstButton(navigationButtons) {
  const firstButton = navigationButtons[0];
  if (firstButton) {
    firstButton.innerHTML = '<img src="Assets/skull.png" alt="Skull" />';
  }
}

function assignRandomEvents(navigationButtons) {
  console.log("assignRandomEvents function called!");
  navigationButtons.forEach((button, index) => {
    if (button.id === "bossfight") return;
    if (index === 0) return;

    button.innerHTML = "";

    // Randomly select an event
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    console.log(`Random event selected: ${randomEvent}`);

    let imageTag = "";

    // Assign images based on the randomly selected event
    if (randomEvent === "elite") {
      imageTag = '<img src="Assets/eliteSkullred.png" alt="Elite" />';
    } else if (randomEvent === "shop") {
      imageTag = '<img src="Assets/shopicon.png" alt="Shop" />';
    } else if (randomEvent === "questionmark") {
      imageTag = '<img src="Assets/questionmark.png" alt="Questionmark" />';
    } else if (randomEvent === "skull") {
      imageTag = '<img src="Assets/skull.png" alt="Skull" />';
    }

    button.innerHTML = imageTag;
  });
}

function getSkullDifficulty(index) {
  const difficultyIndex = Math.min(index, skullDifficulty.length - 1);
  return skullDifficulty[difficultyIndex];
}

function triggerFight(difficulty) {
  console.log(`A fight is triggered with difficulty: $ {difficulty}`);
}
