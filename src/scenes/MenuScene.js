import { Scene } from 'phaser';
import{ musicConfig, config } from '../config/gameConfig';
import { menuConfig } from '../config/gameConfig';
import logoImg from '../assets/img/XION-logo.png';
import star from '../assets/img/star.png';
import background from '../assets/img/starfield_alpha.png';
import frame from '../assets/img/window_red2.png';
import startKey from '../assets/img/start.png';
import start_selectedKey from '../assets/img/start_selected.png'
import customizeShipKey from '../assets/img/customize-ship.png';
import customizeShipKey_selected from '../assets/img/customize-ship_selected.png';


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
        // Load star img
        this.load.image("star", star);
        // Load background image
        this.load.image('background', background);
        // Load window frame
        this.load.image('frame', frame);
        /**
         * Load menu buttons
         */
        this.load.image('start', startKey);
        this.load.image('start_selected', start_selectedKey);
        this.load.image('customizeShip', customizeShipKey);
        this.load.image('customizeShip_selected', customizeShipKey_selected);
        
        // Load main menu background music
        this.load.audio('ambient_main', [__dirname + 'src/assets/sound/music/ambientmain_0.ogg']);

        // Load sound effects
        this.load.audio('menuClick', __dirname + 'src/assets/sound/effects/menu_selection_click.ogg');
        }

        
    create() {
        
        /**
         * Init cursor keys (arrow keys for navigating menu)
         */
        this.downArrow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.upArrow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        /**
         * Add Arrow key sounds
         */
        this.menuClick = this.sound.add('menuClick');

        /**
         * Arrow Key Event listeners
        */

        this.downArrow.on('down', () => {
            // Number of selectable items on main menu. 0 index based)
            if(menuConfig.selection < menuConfig.maxMenuItems)  {
                menuConfig.selection ++;
            } else {
                menuConfig.selection = 0;
            }
            // Change selected item
            this.highlightSelected(menuConfig.selection);
        });
        this.upArrow.on('down', () => {
            if(menuConfig.selection > 0)  {
                menuConfig.selection --;
            } else {
                menuConfig.selection = menuConfig.maxMenuItems;
            }
            // Change selected item
            this.highlightSelected(menuConfig.selection);
        });



        /**
         * Add background
         * Create a set number of stars and put them in random positions on the screen at different speeds according to size
         */
        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(0.5);

        this.stars = this.physics.add.group();

        for (var i = 0; i < 100; i++) {
            this.stars.create(0 + Math.random() * config.width, 0 + Math.random() * config.height, 'star');
        };

        Phaser.Actions.Call(this.stars.getChildren(), (item) => {
            item.setScale(Math.random());
            item.setVelocityY(Math.random() * ((item._scaleX) * 10));
            // console.log(item);
        });
        // this.star.push(this.starArr)

        // Add XION logo to screen
        this.logo = this.add.image(450, 150, "logo").setScale(0.7);
        // Add window frame
        // this.frame = this.add.image(0, 0, 'frame').setOrigin(0, 0);
        // Add menu keys
        this.startKey = this.add.image(450, 450, 'start').setScale(0.6);
        this.startKey.setTexture('start_selected'); // Set Start as selected option
        this.customizeShipKey = this.add.image(450, 550,'customizeShip')

        // Add and start background music
        this.menuMusic = this.sound.add('ambient_main', musicConfig);
        this.menuMusic.play();

    }

    update() {
        this.background.tilePositionY -= 1;
        /**
         * Check if stars are below screen and reset
         */
        Phaser.Actions.Call(this.stars.getChildren(), (item) => {
            if (item.y > config.height + 10) {
                item.y = -10;
                item.x = Math.random() * config.width;
                console.log('Off Page');
            }
        });
    }

    resetMenuSelections() {
        this.startKey.setTexture('start');
        this.customizeShipKey.setTexture('customizeShip');

    }

    highlightSelected(selection) {
        // Reset selection colors
        this.resetMenuSelections();
        this.menuClick.play();
        if (selection === 0) {
            this.startKey.setTexture('start_selected');
        } else if (selection === 1) {
            this.customizeShipKey.setTexture('customizeShip_selected')
        }
    }


}   

export default MenuScene;

