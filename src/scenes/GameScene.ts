import Phaser from 'phaser';
import { Puppy } from '../entities/Puppy';
import { GameConfig } from '../config/GameConfig';

/**
 * Scena principale del gioco - Ambiente "Casa"
 * v0.1: Sfondo scrollabile + cucciolo idle
 */
export class GameScene extends Phaser.Scene {
  private puppy!: Puppy;
  private background!: Phaser.GameObjects.TileSprite;
  
  // Stato scroll
  private isScrolling: boolean = false;
  private scrollDirection: number = 0; // -1 sinistra, 1 destra
  
  constructor() {
    super({ key: 'GameScene' });
  }

  /**
   * Preload assets
   */
  preload(): void {
    // Per v0.1 creiamo placeholder grafici semplici
    // Li sostituirai con i PNG di Lisa
    this.createPlaceholderAssets();
  }

  /**
   * Crea placeholder temporanei (per testare senza asset)
   */
  private createPlaceholderAssets(): void {
    // Sfondo casa (pattern ripetibile)
    const bgGraphics = this.add.graphics();
    bgGraphics.fillStyle(0xF5DEB3, 1); // Beige (muro casa)
    bgGraphics.fillRect(0, 0, 2100, 800);
    bgGraphics.fillStyle(0x8B4513, 1); // Marrone (pavimento)
    bgGraphics.fillRect(0, 700, 2100, 100);    
    bgGraphics.fillStyle(0x8B8533, 1); // Marrone (porta)
    bgGraphics.fillRect(300, 100, 300, 600);
    bgGraphics.generateTexture('background-casa', 2100, 800);
    bgGraphics.destroy();

    // Cucciolo idle (cerchio semplice per ora)
    const puppyGraphics = this.add.graphics();
    puppyGraphics.fillStyle(0xFFA500, 1); // Arancione
    puppyGraphics.fillCircle(50, 50, 40); // Corpo
    puppyGraphics.fillStyle(0x000000, 1); // Nero
    puppyGraphics.fillCircle(35, 35, 8); // Occhio sx
    puppyGraphics.fillCircle(65, 35, 8); // Occhio dx
    puppyGraphics.fillCircle(50, 55, 5); // Naso
    puppyGraphics.generateTexture('puppy-idle', 100, 100);
    puppyGraphics.destroy();
  }

  /**
   * Setup scena
   */
  create(): void {
    // Crea sfondo scrollabile (TileSprite per ripetizione infinita)
    this.background = this.add.tileSprite(
      GameConfig.WIDTH / 2,
      GameConfig.HEIGHT / 2,
      GameConfig.WIDTH * 3, // Largo 3x per scroll fluido
      GameConfig.HEIGHT,
      'background-casa'
    );

    // Crea cucciolo al centro
    this.puppy = new Puppy(
      this,
      GameConfig.PUPPY_X,
      GameConfig.PUPPY_Y
    );

    // Setup input touch/mouse
    this.setupInput();

    // Debug info
    this.add.text(10, 10, 'v0.1 - Tap sinistra/destra per muovere sfondo', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 5, y: 5 }
    });
  }

  /**
   * Setup controlli touch e mouse
   */
  private setupInput(): void {
    // Input pointer down (tap/click inizia)
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const centerX = GameConfig.WIDTH / 2;
      const tapX = pointer.x;
      
      // Zona dead centrale per evitare scroll accidentali
      if (Math.abs(tapX - centerX) < GameConfig.TAP_DEAD_ZONE) {
        return;
      }

      // Determina direzione
      if (tapX < centerX) {
        // Tap a sinistra → scroll verso sinistra (sfondo va a destra)
        this.scrollDirection = -1;
      } else {
        // Tap a destra → scroll verso destra (sfondo va a sinistra)
        this.scrollDirection = 1;
      }
      
      this.isScrolling = true;
    });

    // Input pointer up (tap/click finisce)
    this.input.on('pointerup', () => {
      this.isScrolling = false;
      this.scrollDirection = 0;
    });

    // Se pointer esce dallo schermo, ferma scroll
    this.input.on('pointerout', () => {
      this.isScrolling = false;
      this.scrollDirection = 0;
    });
  }

  /**
   * Update loop principale
   */
  update(time: number, delta: number): void {
    // Converti delta da millisecondi a secondi
    const deltaSeconds = delta / 1000;

    // Scroll sfondo se attivo
    if (this.isScrolling && this.scrollDirection !== 0) {
      const scrollAmount = GameConfig.BACKGROUND_SCROLL_SPEED * deltaSeconds * this.scrollDirection;
      this.background.tilePositionX += scrollAmount;
    }

    // Update cucciolo (per ora non fa nulla, ma struttura pronta)
    this.puppy.update(deltaSeconds);
  }
}
