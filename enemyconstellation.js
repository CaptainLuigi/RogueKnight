const enemyConstellationTemplates = [
  {
    difficultyFrom: 0,
    difficultyTo: 0,
    enemies: [TrainingDummy, TrainingDummy],
  },

  {
    difficultyFrom: 1,
    difficultyTo: 2,
    enemies: [Snail, Snail, Snail, { enemy: PotOfGold, chance: 0.1 }],
  },
  {
    difficultyFrom: 1,
    difficultyTo: 3,
    enemies: [Snail, Mantis, Mantis, { enemy: PotOfGold, chance: 0.1 }],
  },
  {
    difficultyFrom: 3,
    difficultyTo: 3,
    enemies: [
      Scorpion,
      Scorpion,
      Scorpion,
      Scorpion,
      { enemy: PotOfGold, chance: 0.1 },
    ],
  },
  {
    difficultyFrom: 2,
    difficultyTo: 3,
    enemies: [
      Shroom,
      Shroom,
      Shroom,
      SadShroom,
      { enemy: PotOfGold, chance: 0.1 },
    ],
  },
  {
    difficultyFrom: 3,
    difficultyTo: 4,
    enemies: [Gnome, Gnome, Gnome, Druid, { enemy: PotOfGold, chance: 0.1 }],
  },
  {
    difficultyFrom: 3,
    difficultyTo: 4,
    enemies: [
      BitingPlant,
      BitingPlant,
      BitingPlant,
      { enemy: PotOfGold, chance: 0.1 },
    ],
  },
  {
    difficultyFrom: 8,
    difficultyTo: 8,
    enemies: [Hornet, Hornet, Hornet, Hornet],
  },
  {
    difficultyFrom: 8,
    difficultyTo: 8,
    enemies: [Amalgam, CrystalMage, Druid, Cleric],
  },
  {
    difficultyFrom: 8,
    difficultyTo: 8,
    enemies: [SlimeHive, TreeSlime, TreeSlime, TreeSlime, TreeSlime, TreeSlime],
  },
  {
    difficultyFrom: 8,
    difficultyTo: 8,
    enemies: [Druid, Cleric, CrystalMage, MasterMage],
  },
  {
    difficultyFrom: 8,
    difficultyTo: 8,
    enemies: [Skeleton, Necromancer, MasterMage],
  },
  {
    difficultyFrom: 9,
    difficultyTo: 9,
    enemies: [Succubus],
  },
  {
    difficultyFrom: 10,
    difficultyTo: 10,
    enemies: [MinionKnight, MasterMage, EvilKnight],
  },
  {
    difficultyFrom: 10,
    difficultyTo: 10,
    enemies: [BossBear],
  },
  {
    difficultyFrom: 11,
    difficultyTo: 12,
    enemies: [
      Centepede,
      Centepede,
      Centepede,
      Centepede,
      { enemy: PotOfGold, chance: 0.1 },
    ],
  },
  {
    difficultyFrom: 11,
    difficultyTo: 13,
    enemies: [FireLizard, FireLizard, { enemy: PotOfGold, chance: 0.1 }],
  },
  {
    difficultyFrom: 12,
    difficultyTo: 14,
    enemies: [Bat, Bat, Bat, Bat, Bat],
  },
  {
    difficultyFrom: 11,
    difficultyTo: 14,
    enemies: [Rat, Imp, FatImp, HappyImp, { enemy: PotOfGold, chance: 0.1 }],
  },
  {
    difficultyFrom: 11,
    difficultyTo: 14,
    enemies: [
      BigCopperCloud,
      BigCopperCloud,
      BigCopperCloud,
      { enemy: PotOfGold, chance: 0.1 },
    ],
  },
  {
    difficultyFrom: 13,
    difficultyTo: 14,
    enemies: [
      HappyImp,
      HappyImp,
      HappyImp,
      HappyImp,
      { enemy: PotOfGold, chance: 0.1 },
    ],
  },
  {
    difficultyFrom: 17,
    difficultyTo: 17,
    enemies: [FatImp, Imp, Imp, Imp, Imp],
  },
  {
    difficultyFrom: 17,
    difficultyTo: 18,
    enemies: [BigGolem],
  },
  {
    difficultyFrom: 19,
    difficultyTo: 19,
    enemies: [AncientClock],
  },
  {
    difficultyFrom: 20,
    difficultyTo: 20,
    enemies: [Spider, Spider, Spider, SpiderBoss],
  },
  {
    difficultyFrom: 20,
    difficultyTo: 20,
    enemies: [Rat, Rat, RatKing, Rat],
  },
  {
    difficultyFrom: 100,
    difficultyTo: 100,
    enemies: [Mimic],
  },
];
