import Phaser from 'phaser';

/**
 * Classe che rappresenta il cucciolo
 * v0.1: solo sprite statico in idle, nessuna animazione ancora
 */
export class Puppy {
  private sprite: Phaser.GameObjects.Sprite;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    
    // Crea sprite (per ora placeholder, sostituirai con disegno di Lisa)
    this.sprite = scene.add.sprite(x, y, 'puppy-idle');
    this.sprite.setScale(2); // Ingrandisci placeholder
  }

  /**
   * Ottieni riferimento allo sprite (utile per debug)
   */
  getSprite(): Phaser.GameObjects.Sprite {
    return this.sprite;
  }

  /**
   * Update chiamato ogni frame (per ora vuoto, ma preparato per v0.2+)
   */
  update(deltaTime: number): void {
    // v0.1: nessuna logica ancora
    // v0.2: qui aggiungeremo animazioni corsa
  }

  /**
   * Distruggi cucciolo (cleanup)
   */
  destroy(): void {
    this.sprite.destroy();
  }
}
