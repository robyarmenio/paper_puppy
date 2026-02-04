import { GameConfig } from "../config/GameConfig";
import { Puppy } from "../entities/Puppy";

export class GardenScene extends Phaser.Scene {
    
    private puppyState!: any;
    private puppy!: Puppy;
    private background!: Phaser.GameObjects.Image;
    private gardenContainer!: Phaser.GameObjects.Container;

    constructor() {
        super({ key: 'GardenScene' });
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
    
        const doorGraphics = this.add.graphics();
        doorGraphics.fillStyle(0x8B8533, 1); // Marrone (porta)
        doorGraphics.fillRect(0, 0, 300, 600);
        doorGraphics.generateTexture('door2', 300, 600);
        doorGraphics.destroy();

        this.load.image('puppy-idle', 'assets/sprites/Capy/felice.png');
      }

    create(): void {
        // Sfondo giardino
        this.background = this.add.image(0, 0,'garden-bg');
        this.background.setOrigin(0, 0);
        
        // Porta per tornare in casa
        const door2 = this.add.sprite(4000, 400, 'door2');
        door2.setInteractive({ cursor: 'pointer' });
        door2.on('pointerdown', () => {
            this.scene.start('GameScene'); // Torna in casa
        });

        // 3. Crea container che li contiene entrambi
        const gardenContainer = this.add.container(GameConfig.BACKGROUND_WIDTH / -2 , 0);
        gardenContainer.add([this.background, door2]);
        
        // 4. Salva riferimento per scroll
        this.gardenContainer = gardenContainer;    

        // Crea cucciolo al centro
        this.puppy = new Puppy(
            this,
            GameConfig.PUPPY_X,
            GameConfig.PUPPY_Y
        );
    }
}