import { GameConfig } from "../config/GameConfig";
import { Puppy } from "../entities/Puppy";

export class GardenScene extends Phaser.Scene {
    
    private puppyState!: any;
    private puppy!: Puppy;
    //private background!: Phaser.GameObjects.Image;
    private background!: Phaser.GameObjects.TileSprite;
    private houseContainer!: Phaser.GameObjects.Container;
    isScrolling: boolean;
    runDirection: number;
    runDuration: number;
    runTimer: number = 0;

    private readonly SCROLL_MAX: number = (GameConfig.WIDTH / 2) - 150;  // Limite destro (1 schermata a dx)
    private readonly SCROLL_MIN: number = ((GameConfig.BACKGROUND_WIDTH - (GameConfig.WIDTH / 2)) * -1) + 150; // Limite sinistro (1 schermata a sx)
  
    constructor() {
        super({ key: 'GardenScene' });

        this.isScrolling = true; // Abilita scroll in giardino (per ora sempre attivo, ma potremmo disabilitarlo in futuro)
        this.runDirection = Math.random() < 0.5 ? -1 : 1; // Direzione casuale all'ingresso
        this.runDuration = 2 + Math.random() * 4; // Durata corsa casuale tra 2 e 6 secondi
    }

    preload(): void {
        this.createAssets();
    }

    private createAssets(): void {
    
        const bgGraphics = this.add.graphics();
        bgGraphics.fillStyle(0xAADDFF, 1); // Azzurro (Cielo)
        bgGraphics.fillRect(0, 0, GameConfig.BACKGROUND_WIDTH, 800);
        bgGraphics.fillStyle(0x009900, 1); // Verde Scuro (erba)
        bgGraphics.fillRect(0, 700, GameConfig.BACKGROUND_WIDTH, 100);    
        bgGraphics.fillStyle(0x7B5522, 1); // Marrone (Tronchi alberi)
        bgGraphics.fillRect(500, 300, 100, 500);
        bgGraphics.fillRect(1500, 300, 100, 500);
        bgGraphics.fillRect(2500, 300, 100, 500);
        bgGraphics.fillRect(4500, 300, 100, 500);
        bgGraphics.fillRect(5500, 300, 100, 500);
        bgGraphics.fillStyle(0x66BB44, 1); // Verde Chiaro (chiome)
        bgGraphics.fillCircle(550, 150, 200);
        bgGraphics.fillCircle(1550, 150, 200);
        bgGraphics.fillCircle(2550, 150, 200);
        bgGraphics.fillCircle(4550, 150, 200);
        bgGraphics.fillCircle(5550, 150, 200);
        bgGraphics.generateTexture('garden-bg', GameConfig.BACKGROUND_WIDTH, 800);
        bgGraphics.destroy();

        const bgTileGraphics = this.add.graphics();
        bgTileGraphics.fillStyle(0xAADDFF, 1); // Azzurro (Cielo)
        bgTileGraphics.fillRect(0, 0, GameConfig.HEIGHT, GameConfig.HEIGHT);
        bgTileGraphics.fillStyle(0x009900, 1); // Verde Scuro (erba)
        bgTileGraphics.fillRect(0, 700, GameConfig.HEIGHT, 100);    
        bgTileGraphics.fillStyle(0x7B5522, 1); // Marrone (Tronchi alberi)
        bgTileGraphics.fillRect(500, 200, 100, 500);
        bgTileGraphics.fillStyle(0x66BB44, 1); // Verde Chiaro (chiome)
        bgTileGraphics.fillCircle(550, 150, 200);
        bgTileGraphics.generateTexture('garden-tile-bg', GameConfig.HEIGHT, GameConfig.HEIGHT);
        bgTileGraphics.destroy();

        const houseGraphics = this.add.graphics();
        houseGraphics.fillStyle(0xABA563, 1); // Beige (muro casa)
        houseGraphics.fillRect(0, 200, 600, 500);
        houseGraphics.fillStyle(0xFF4444, 1); // Rosso (Tetto)
        houseGraphics.fillTriangle(0, 200, 300, 0, 600, 200);
        houseGraphics.generateTexture('house', 600, 700);
        houseGraphics.destroy();
    
        const doorGraphics = this.add.graphics();
        doorGraphics.fillStyle(0x8B8533, 1); // Marrone (porta)
        doorGraphics.fillRect(0, 0, 200, 400);
        doorGraphics.fillStyle(0xFFD700, 1); // Oro (pomello)
        doorGraphics.fillCircle(160, 230, 8);
        doorGraphics.generateTexture('door2', 200, 400);
        doorGraphics.destroy();

        this.load.image('puppy-idle', 'assets/sprites/Capy/felice.png');
      }

    create(): void {
        // Sfondo giardino
        this.background = this.add.tileSprite(0, 0, GameConfig.BACKGROUND_WIDTH, GameConfig.HEIGHT, 'garden-tile-bg');
        this.background.setOrigin(0, 0);

        const house = this.add.sprite(4000, 350, 'house');
        
        // Porta per tornare in casa
        const door2 = this.add.sprite(4000, 500, 'door2');
        door2.setInteractive({ cursor: 'pointer' });
        door2.on('pointerdown', () => {
            this.scene.start('GameScene'); // Torna in casa
        });

        // 3. Crea container che li contiene entrambi
        const houseContainer = this.add.container(GameConfig.BACKGROUND_WIDTH / -2 , 0);
        houseContainer.add([house, door2]);
        
        // 4. Salva riferimento per scroll
        this.houseContainer = houseContainer;    

        // Crea cucciolo al centro
        this.puppy = new Puppy(
            this,
            GameConfig.PUPPY_X,
            GameConfig.PUPPY_Y
        );
    }

    /**
   * 🆕 Cambia direzione random (con bias verso porta)
   */
    private changeDirection(): void {
        // 🎯 BIAS VERSO PORTA (se troppo lontano)
        const distanceFromDoor = this.background.tilePositionX;
        
        if (distanceFromDoor < -1000) {
        // Probabilità 80% di tornare verso porta (destra)
            this.runDirection = Math.random() < 0.8 ? 1 : -1;
            console.log("Go (mostly ) right");
        } else if (distanceFromDoor > 1000) {
        // Probabilità 80% di tornare verso porta (sinistra)
            this.runDirection = Math.random() < 0.8 ? -1 : 1;
            console.log("Go (mostly) left");
        } 
        else {
        // Movimento casuale normale
            this.runDirection = Math.random() < 0.5 ? -1 : 1;
        }
        
        // 🎨 Flip sprite in base a direzione
        //this.puppy.setFlipX(this.runDirection < 0);

        console.log(`🐕 Direzione: ${this.runDirection === 1 ? '→' : '←'} (distanza porta: ${distanceFromDoor.toFixed(0)}px)`);
    }

    /**
       * Update loop principale
       */
      update(time: number, delta: number): void {
        // Converti delta da millisecondi a secondi
        const deltaSeconds = delta / 1000;
    
        // Gestisci il timer di corsa
        this.runTimer += deltaSeconds;
        if (this.runTimer > this.runDuration) {
          this.changeDirection(); // Cambia direzione
          this.runTimer = 0;
          this.runDuration = 2 + Math.random() * 1; // Nuova durata casuale
        }
    
        // Scroll sfondo se attivo
        if (this.isScrolling && this.runDirection !== 0) {
          const movement = GameConfig.BACKGROUND_SCROLL_SPEED * deltaSeconds * this.runDirection * 1.33;
    
          // Calcola nuova posizione elementi        
          
          this.background.tilePositionX += movement;
          this.houseContainer.x -= movement * 1.1; // Scrolling più veloce per casa (parallax)
          
          //console.log(`Background X: ${this.background.tilePositionX}, House Container X: ${this.houseContainer.x}`);
          
          
        }
    
        // Update cucciolo (per ora non fa nulla, ma struttura pronta)
        this.puppy.update(deltaSeconds);
      }
}