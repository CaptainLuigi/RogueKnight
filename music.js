const SoundManager = {
  sounds: {
    enemyDeathSound: new Audio("Assets/Sound/little-whoosh-2-6301.mp3"),
    BattleMusic: new Audio("Assets/Sound/BattleMusic.wav"),
    SwordSlash: (() => {
      const audio = new Audio("Assets/Sound/swordSlashgreyfeather.wav");
      audio.volume = 0.075;
      return audio;
    })(),
    BowSound: (() => {
      const audio = new Audio("Assets/Sound/arrowSoundLiamG_SFX.wav");
      audio.volume = 0.075;
      return audio;
    })(),
    HealSound: (() => {
      const audio = new Audio("Assets/Sound/healSoundDrMinky.wav");
      audio.volume = 0.075;
      return audio;
    })(),
    ChargeSound: (() => {
      const audio = new Audio("Assets/Sound/chargeSamsterBirdies.ogg");
      audio.volume = 0.075;
      return audio;
    })(),
    BombSound: (() => {
      const audio = new Audio(
        "Assets/Sound/explosionAyaDrevis_soundreduced.ogg"
      );
      audio.volume = 0.075;
      return audio;
    })(),
    ShieldSound: (() => {
      const audio = new Audio("Assets/Sound/shieldingDiasyl2.ogg");
      audio.volume = 0.01;
      return audio;
    })(),
    PotionSound: (() => {
      const audio = new Audio("Assets/Sound/potionSoundqubodup.wav");
      audio.volume = 0.075;
      return audio;
    })(),
    EquipRelic: (() => {
      const audio = new Audio("Assets/Sound/equipRelicplasterbrain.flac");
      audio.volume = 0.075;
      return audio;
    })(),
    OpenChest: (() => {
      const audio = new Audio("Assets/Sound/openChestBeezleFM.wav");
      audio.volume = 0.2;
      return audio;
    })(),
    EnemyHeal: (() => {
      const audio = new Audio("Assets/Sound/enemyHealReincarnatedEchoes.wav");
      audio.volume = 0.075;
      return audio;
    })(),
    EnemyBuff: (() => {
      const audio = new Audio("Assets/Sound/enemyBuffLilMati.wav");
      audio.volume = 0.025;
      return audio;
    })(),
  },

  preloadAll() {
    for (const key in this.sounds) {
      const audio = this.sounds[key];
      audio.load();
    }
  },

  play(soundName) {
    console.log(`play() called for: ${soundName}`); // Log when play is called
    const sound = this.sounds[soundName];
    if (sound) {
      if (sound.readyState === 4) {
        // Check if the sound is fully loaded
        const playPromise = sound.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log(`✅ Sound "${soundName}" played successfully.`);
            })
            .catch((e) => {
              console.warn(`❌ Sound "${soundName}" failed to play:`, e);
            });
        } else {
          console.warn(
            `⚠️ Sound "${soundName}" play() returned undefined (possibly blocked).`
          );
        }
      } else {
        console.warn(`⚠️ Sound "${soundName}" is not ready to play.`);
      }
    } else {
      console.warn(`🔍 Sound "${soundName}" not found.`);
    }
  },

  playBattleMusic() {
    const battleMusic = this.sounds.BattleMusic;
    const clone = battleMusic.cloneNode();
    clone.volume = 0.075;
    clone.loop = true;

    clone.addEventListener("canplaythrough", () => {
      clone.play().catch((e) => {
        console.warn(`BattleMusic failed to play:`, e);
      });
    });
  },
};
window.SoundManager = SoundManager;
