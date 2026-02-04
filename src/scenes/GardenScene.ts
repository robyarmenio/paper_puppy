import { GameConfig } from "../config/GameConfig";
import { Puppy } from "../entities/Puppy";

export class GardenScene extends Phaser.Scene {
    
    private puppy!: Puppy;
    private background!: Phaser.GameObjects.Image;

    constructor() {
        super({ key: 'GardenScene' });
    }

    preload(): void {
        const bgGraphics = this.add.graphics();
        bgGraphics.fillStyle(0x228B22, 1);
    }

    private createAssets(): void {
    
        const bgGraphics = this.add.graphics();
        bgGraphics.fillStyle(0xAADDFF, 1); // Azzurro (Cielo)
        bgGraphics.fillRect(0, 0, GameConfig.BACKGROUND_WIDTH, 800);
        bgGraphics.fillStyle(0x009900, 1); // Verde Scuro (erba)
        bgGraphics.fillRect(0, 700, GameConfig.BACKGROUND_WIDTH, 100);    
        bgGraphics.fillStyle(0x7B5522, 1); // Marrone (Tronchi alberi)
        bgGraphics.fillRect(200, 300, 100, 500);
        bgGraphics.fillRect(1200, 300, 100, 500);
        bgGraphics.fillRect(2200, 300, 100, 500);
        bgGraphics.fillRect(4200, 300, 100, 500);
        bgGraphics.fillRect(5200, 300, 100, 500);
        bgGraphics.fillStyle(0x66BB44, 1); // Verde Chiaro (chiome)
        bgGraphics.fillCircle(250, 150, 200);
        bgGraphics.fillCircle(150, 150, 200);
        bgGraphics.fillCircle(2250, 150, 200);
        bgGraphics.fillCircle(4250, 150, 200);
        bgGraphics.fillCircle(5250, 150, 200);
        bgGraphics.destroy();
    
        const doorGraphics = this.add.graphics();
        doorGraphics.fillStyle(0x8B8533, 1); // Marrone (porta)
        doorGraphics.fillRect(0, 0, 300, 600);
        doorGraphics.generateTexture('door', 300, 600);

        this.load.image('puppy-idle', 'assets/sprites/Capy/felice.png');
      }

    create(): void {
        // Sfondo giardino
        this.background = this.add.image(
            GameConfig.WIDTH / 2, 
            GameConfig.HEIGHT / 2, 
            'garden-bg'
        );
        this.background.setOrigin(0.5, 0.5);
        
        // Porta per tornare in casa
        const door = this.add.sprite(100, 300, 'door');
        door.setInteractive({ cursor: 'pointer' });
        door.on('pointerdown', () => {
            this.scene.start('GameScene'); // Torna in casa
        });
    }
}