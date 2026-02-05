import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';
import { GameConfig } from './config/GameConfig';
import { GardenScene } from './scenes/GardenScene';

/**
 * Configurazione Phaser
 */
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // WebGL con fallback Canvas
  parent: 'game-container',
  width: GameConfig.WIDTH,
  height: GameConfig.HEIGHT,
  backgroundColor: '#87CEEB', // Azzurro cielo
  
  // Scaling per mobile
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  // Scene del gioco
  scene: [GameScene, GardenScene],

  // Physics non necessaria per v0.1 (aggiungeremo se serve)
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 }, // No gravity per ora
      debug: false // Metti true per vedere hitbox
    }
  }
};

// Avvia il gioco
const game = new Phaser.Game(config);

// Esponi globalmente per debug (opzionale)
if (import.meta.env.DEV) {
  (window as any).game = game;
  console.log('🐶 Tamagotchi v0.2 avviato!');
  console.log('📱 Tap sinistra/destra per muoversi, clicca la porta per andare in giardino');
}
