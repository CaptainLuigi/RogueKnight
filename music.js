const SoundManager = {
  sounds: {
    enemyDeathSound: new Audio("Assets/Sound/little-whoosh-2-6301.mp3"),
    BattleMusic: (() => {
      const audio = new Audio("Assets/Sound/BattleMusic.wav");
      audio.volume = 0.05;
      audio.dataset = { baseVolume: 0.05 };
      return audio;
    })(),

    SwordSlash: (() => {
      const audio = new Audio("Assets/Sound/swordSlashgreyfeather.wav");
      audio.volume = 0.075;
      audio.dataset = { baseVolume: 0.075 };
      return audio;
    })(),
    BowSound: (() => {
      const audio = new Audio("Assets/Sound/arrowSoundLiamG_SFX.wav");
      audio.volume = 0.075;
      audio.dataset = { baseVolume: 0.075 };
      return audio;
    })(),
    HealSound: (() => {
      const audio = new Audio("Assets/Sound/healSoundDrMinky.wav");
      audio.volume = 0.075;
      audio.dataset = { baseVolume: 0.075 };
      return audio;
    })(),
    ChargeSound: (() => {
      const audio = new Audio("Assets/Sound/chargeSamsterBirdies.ogg");
      audio.volume = 0.075;
      audio.dataset = { baseVolume: 0.075 };
      return audio;
    })(),
    BombSound: (() => {
      const audio = new Audio(
        "Assets/Sound/explosionAyaDrevis_soundreduced.ogg"
      );
      audio.volume = 0.075;
      audio.dataset = { baseVolume: 0.075 };
      return audio;
    })(),
    ShieldSound: (() => {
      const audio = new Audio("Assets/Sound/shieldingDiasyl2.ogg");
      audio.volume = 0.01;
      audio.dataset = { baseVolume: 0.01 };
      return audio;
    })(),
    PotionSound: (() => {
      const audio = new Audio("Assets/Sound/potionSoundqubodup.wav");
      audio.volume = 0.075;
      audio.dataset = { baseVolume: 0.075 };
      return audio;
    })(),
    EquipRelic: (() => {
      const audio = new Audio("Assets/Sound/equipRelicplasterbrain.flac");
      audio.volume = 0.075;
      audio.dataset = { baseVolume: 0.075 };
      return audio;
    })(),
    OpenChest: (() => {
      const audio = new Audio("Assets/Sound/openChestBeezleFM.wav");
      audio.volume = 0.2;
      audio.dataset = { baseVolume: 0.2 };
      return audio;
    })(),
    EnemyHeal: (() => {
      const audio = new Audio("Assets/Sound/enemyHealReincarnatedEchoes.wav");
      audio.volume = 0.075;
      audio.dataset = { baseVolume: 0.075 };
      return audio;
    })(),
    EnemyBuff: (() => {
      const audio = new Audio("Assets/Sound/enemyBuffLilMati.wav");
      audio.volume = 0.025;
      audio.dataset = { baseVolume: 0.025 };
      return audio;
    })(),
    LevelVictory: (() => {
      const audio = new Audio("Assets/Sound/levelVictoryUniversfield.mp3");
      audio.volume = 0.01;
      audio.dataset = { baseVolume: 0.01 };
      return audio;
    })(),
    Hurt: (() => {
      const audio = new Audio("Assets/Sound/hurtJofae.mp3");
      audio.volume = 0.075;
      audio.dataset = { baseVolume: 0.075 };
      return audio;
    })(),
    Lightning: (() => {
      const audio = new Audio("Assets/Sound/lightningegomassive.ogg");
      audio.volume = 0.075;
      audio.dataset = { baseVolume: 0.075 };
      return audio;
    })(),
    Thunder: (() => {
      const audio = new Audio("Assets/Sound/thunderLittlebrojay.wav");
      audio.volume = 0.075;
      audio.dataset = { baseVolume: 0.075 };
      return audio;
    })(),
    Stone: (() => {
      const audio = new Audio("Assets/Sound/stoneGlennM.wav");
      audio.volume = 1;
      audio.dataset = { baseVolume: 1 };
      return audio;
    })(),
    Purchase: (() => {
      const audio = new Audio("Assets/Sound/purchaserhodesmas.wav");
      audio.volume = 0.5;
      audio.dataset = { baseVolume: 0.5 };
      return audio;
    })(),
    Upgrade: (() => {
      const audio = new Audio("Assets/Sound/upgradejhyland.wav");
      audio.volume = 0.075;
      audio.dataset = { baseVolume: 0.075 };
      return audio;
    })(),
    Succubus: (() => {
      const audio = new Audio("Assets/Sound/succubusshadoWisp.wav");
      audio.volume = 1;
      audio.dataset = { baseVolume: 1 };
      return audio;
    })(),
    CoinFlip: (() => {
      const audio = new Audio("Assets/Sound/coinflipTheKnave.wav");
      audio.volume = 0.25;
      audio.dataset = { baseVolume: 0.25 };
      return audio;
    })(),
    Gremlin: (() => {
      const audio = new Audio("Assets/Sound/gremlinel_boss.wav");
      audio.volume = 0.25;
      audio.dataset = { baseVolume: 0.25 };
      return audio;
    })(),
    Acid: (() => {
      const audio = new Audio("Assets/Sound/acidspookymodern.wav");
      audio.volume = 0.075;
      audio.dataset = { baseVolume: 0.075 };
      return audio;
    })(),
    Dissolve: (() => {
      const audio = new Audio("Assets/Sound/dissolveplasterbrain.wav");
      audio.volume = 0.075;
      audio.dataset = { baseVolume: 0.075 };
      return audio;
    })(),
  },

  globalVolume: 0.5,

  currentBattleMusic: null,

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
      const baseVolume = sound.dataset?.baseVolume || 1;
      sound.volume = baseVolume * this.globalVolume;

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
    clone.volume = 0.05;
    clone.loop = true;

    this.currentBattleMusic = clone;

    clone.addEventListener("canplaythrough", () => {
      clone.play().catch((e) => {
        console.warn(`BattleMusic failed to play:`, e);
      });
    });
  },

  fadeOutBattleMusic(duration = 1000) {
    const music = this.currentBattleMusic;
    if (!music) return;

    const step = 50;
    const fadeSteps = duration / step;
    const initialVolume = music.volume;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      currentStep++;
      const newVolume = initialVolume * (1 - currentStep / fadeSteps);
      music.volume = Math.max(newVolume, 0);

      if (currentStep >= fadeSteps) {
        clearInterval(fadeInterval);
        music.pause();
        music.currentTime = 0;
        this.currentBattleMusic = null;
      }
    }, step);
  },

  setGlobalVolume(volume) {
    this.globalVolume = volume;
    localStorage.setItem("globalVolume", volume);

    for (const key in this.sounds) {
      const audio = this.sounds[key];

      const baseVolume = audio.dataset?.baseVolume || audio.volume || 0.5;
      audio.volume = baseVolume * volume;
    }

    if (this.currentBattleMusic) {
      this.currentBattleMusic.volume = volume;
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const savedVolume = parseFloat(localStorage.getItem("globalVolume"));
  const slider = document.getElementById("volume-slider");

  if (!isNaN(savedVolume)) {
    SoundManager.setGlobalVolume(savedVolume);
    if (slider) {
      slider.value = savedVolume;
    }
  }

  if (slider) {
    slider.addEventListener("input", (event) => {
      const rawValue = parseFloat(event.target.value);
      const scaledVolume = rawValue * rawValue * 0.3;
      SoundManager.setGlobalVolume(scaledVolume);
    });
  }
});

window.SoundManager = SoundManager;
