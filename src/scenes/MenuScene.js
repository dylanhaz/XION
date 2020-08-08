import { Scene } from 'phaser';
import{ musicConfig } from '../config/musicConfig';
import logoImg from '../assets/img/XION-logo.png';
import background from '../assets/img/starfield_alpha.png';
import frame from '../assets/img/window_red2.png';
import startKey from '../assets/img/start.png';
import customizeShipKey from '../assets/img/customize-ship.png'

class MenuScene extends Scene {

    preload() {
        // Disable mouse rightclick
        this.input.mouse.disableContextMenu();
        // Hide Mouse
        //Hide mouse
        let canvas = this.sys.canvas;
        canvas.style.cursor = 'none';



        // Load XION logo
        this.load.image("logo", logoImg);
        // Load background image
        this.load.image('background', background);
        // Load window frame
        this.load.image('frame', frame);
        /**
         * Load menu buttons
         */
        this.load.image('start', startKey)
        this.load.image('customizeShip', customizeShipKey)
        // Load main menu background music
        this.load.audio('ambient_main', [__dirname + 'src/assets/sound/music/ambientmain_0.ogg']);
        }
        
    create() {
        /**
         * Init cursor keys (arrow keys for navigating menu)
         */
        this.cursors = this.input.keyboard.createCursorKeys();



        /**
         * Add background tile sprite
         */
        this.background = this.add.image(450, 450, 'background').setScale(0.5);
        // Add XION logo to screen
        this.logo = this.add.image(450, 150, "logo").setScale(0.7);
        // Add window frame
        // this.frame = this.add.image(0, 0, 'frame').setOrigin(0, 0);
        // Add menu keys
        this.startKey = this.add.image(450, 450, 'start').setScale(0.6);
        this.customizeShipKey = this.add.image(450, 550,'customizeShip')

        // Add and start background music
        this.menuMusic = this.sound.add('ambient_main', musicConfig);
        this.menuMusic.play();

    }

    update() {
        this.background.tilePositionY -= 0.1;
    }


}   

export default MenuScene;

