import Phaser from 'phaser';
import { Puppy } from '../entities/Puppy';
import { GameConfig } from '../config/GameConfig';

/**
 * Scena principale del gioco - Ambiente "Casa"
 * v0.1: Sfondo scrollabile + cucciolo idle
 */
export class GameScene extends Phaser.Scene {
  private puppy!: Puppy;
  private background!: Phaser.GameObjects.Image;
  private houseContainer!: Phaser.GameObjects.Container;
  
  // Stato scroll
  private isScrolling: boolean = false;
  private scrollDirection: number = 0; // -1 sinistra, 1 destra
  private operatingWindow = GameConfig.BACKGROUND_WIDTH - GameConfig.WIDTH;
  private readonly SCROLL_MAX: number = (GameConfig.WIDTH / 2) - 150;  // Limite destro (1 schermata a dx)
  private readonly SCROLL_MIN: number = ((GameConfig.BACKGROUND_WIDTH - (GameConfig.WIDTH / 2)) * -1) + 150; // Limite sinistro (1 schermata a sx)
  
  constructor() {
    super({ key: 'GameScene' });
  }

  /**
   * Preload assets
   */
  preload(): void {
    // this.createPlaceholderAssets();
    this.createCapyAssets();
  }

  private createCapyAssets(): void {

    const bgGraphics = this.add.graphics();
    bgGraphics.fillStyle(0xF5DEB3, 1); // Beige (muro casa)
    bgGraphics.fillRect(0, 0, GameConfig.BACKGROUND_WIDTH, 800);
    bgGraphics.fillStyle(0x8B4513, 1); // Marrone (pavimento)
    bgGraphics.fillRect(0, 700, GameConfig.BACKGROUND_WIDTH, 100);    
    bgGraphics.fillRect(0, 0, 50, 800);    // Muro sx
    bgGraphics.fillRect(GameConfig.BACKGROUND_WIDTH - 50, 0, 50, 800);    // Muro dx
    bgGraphics.fillStyle(0xCCCCFF, 1); // Azzurro (Finestre)
    bgGraphics.fillRect(200, 300, 500, 200);
    bgGraphics.fillRect(1200, 300, 500, 200);
    bgGraphics.fillRect(2200, 300, 500, 200);
    bgGraphics.fillRect(4200, 300, 500, 200);
    bgGraphics.fillRect(5200, 300, 500, 200);
    bgGraphics.generateTexture('background-casa', GameConfig.BACKGROUND_WIDTH, 800);
    bgGraphics.destroy();

    const doorGraphics = this.add.graphics();
    doorGraphics.fillStyle(0x8B8533, 1); // Marrone (porta)
    doorGraphics.fillRect(0, 0, 300, 600);
    doorGraphics.fillStyle(0xFFD700, 1); // Oro (pomello)
    doorGraphics.fillCircle(240, 380, 13);
    doorGraphics.generateTexture('door', 300, 600);
    doorGraphics.destroy();
    
    this.load.image('puppy-idle', 'assets/sprites/Capy/felice.png');
  }

  /**
   * Crea placeholder temporanei (per testare senza asset)
   */
  private createPlaceholderAssets(): void {
    // Sfondo casa 
    const bgGraphics = this.add.graphics();
    bgGraphics.fillStyle(0xF5DEB3, 1); // Beige (muro casa)
    bgGraphics.fillRect(0, 0, GameConfig.BACKGROUND_WIDTH, 800);
    bgGraphics.fillStyle(0x8B4513, 1); // Marrone (pavimento)
    bgGraphics.fillRect(0, 700, GameConfig.BACKGROUND_WIDTH, 100);    
    bgGraphics.fillRect(0, 0, 50, 800);    // Muro sx
    bgGraphics.fillRect(GameConfig.BACKGROUND_WIDTH - 50, 0, 50, 800);    // Muro dx
    bgGraphics.fillStyle(0xAACCFF, 1); // Azzurro (Finestre)
    bgGraphics.fillRect(500, 300, 500, 200);
    bgGraphics.fillRect(1500, 300, 500, 200);
    bgGraphics.fillRect(2500, 300, 500, 200);
    bgGraphics.fillRect(4500, 300, 500, 200);
    bgGraphics.fillRect(5500, 300, 500, 200);
    bgGraphics.generateTexture('background-casa', GameConfig.BACKGROUND_WIDTH, 800);
    bgGraphics.destroy();

    const doorGraphics = this.add.graphics();
    doorGraphics.fillStyle(0x8B8533, 1); // Marrone (porta)
    doorGraphics.fillRect(0, 0, 300, 800);
    doorGraphics.generateTexture('door', 300, 800);
    doorGraphics.destroy();

    // Cucciolo idle (cerchio semplice per ora)
    const puppyGraphics = this.add.graphics();
    puppyGraphics.fillStyle(0xFFA500, 1); // Arancione
    puppyGraphics.fillCircle(50, 50, 40); // Corpo
    puppyGraphics.fillCircle(20, 20, 14); // Ear sx
    puppyGraphics.fillCircle(80, 20, 14); // Ear dx
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
    // Crea sfondo scrollabile
    this.background = this.add.image(0, 0, 'background-casa');
    this.background.setOrigin(0, 0);

    // Porta per andare in giardino
    const door = this.add.sprite(4000, 400, 'door');
    door.setInteractive({ cursor: 'pointer' });
    door.on('pointerdown', () => {
      if(this.houseContainer.x > - 2800 || this.houseContainer.x < - 3100) {
        // Porta non cliccabile (il cucciolo deve essere vicino alla porta)
        return;
      }
      this.scene.start('GardenScene', 
        { puppyState: this.puppy.getState() }
      ); // Vai in giardino
    });

    // 3. Crea container che li contiene entrambi
    const houseContainer = this.add.container(GameConfig.BACKGROUND_WIDTH / -2 , 0);
    houseContainer.add([this.background, door]);
    
    // 4. Salva riferimento per scroll
    this.houseContainer = houseContainer;    

    // Crea cucciolo al centro
    this.puppy = new Puppy(
      this,
      GameConfig.PUPPY_X,
      GameConfig.PUPPY_Y
    );

    // Setup input touch/mouse
    this.setupInput();

    // Debug info
    this.add.text(10, 10, 'v0.2 - Tap sinistra/destra per muoverti, clicca la porta per andare in giardino', {
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
        this.scrollDirection = 1;
      } else {
        // Tap a destra → scroll verso destra (sfondo va a sinistra)
        this.scrollDirection = -1;
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

      // Calcola nuova posizione
      const newX = this.houseContainer.x + scrollAmount;
      
      // 🆕 Applica limiti (clamp)
      const minX = this.SCROLL_MIN;
      const maxX = this.SCROLL_MAX;

      console.log(`House Container X: ${this.houseContainer.x}, New X: ${newX}, Min X: ${minX}, Max X: ${maxX}`);
      
      this.houseContainer.x = Phaser.Math.Clamp(newX, minX, maxX);
      
      // 🆕 Optional: feedback quando colpisci il muro
      if (newX < minX || newX > maxX) {
        this.cameras.main.shake(50, 0.002);
      }
    }

    // Update cucciolo (per ora non fa nulla, ma struttura pronta)
    this.puppy.update(deltaSeconds);
  }
}
