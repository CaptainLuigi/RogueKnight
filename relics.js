class Relic {
  constructor(name, description, effect) {
    this.name = name;
    this.description = description;
    this.effect = effect;
  }

  apply(player) {
    this.effect(player);
  }
}

const GrindingMonstera = new Relic(
  "Grinding Monstera",
  "Gain 2 max HP after defeating an enemy",
  (player) => {
    player.onEnemyDeath = (enemy) => {
      player.setMaxHealth(player.getMaxHealth() + 2);
      player.setHealth(player.getHealth() + 2);
    };
  }
);

const BersekersCharm = new Relic(
  "Berserker's Charm",
  "All weapons gain +10 damage when below 50% max HP",
  (player) => {
    player.onTurnStart = () => {
      if (player.getHealth() < player.getMaxHealth() / 2) {
        player.weapon.forEach((weapon) => {
          weapon.damage += 10;
        });
      }
    };
  }
);
