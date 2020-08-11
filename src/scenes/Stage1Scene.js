import { Scene } from 'phaser';
import player from '../assets/img/player/player.png';
import{ config } from '../config/gameConfig';
import star from '../assets/img/star.png';
import background from '../assets/img/starfield_alpha.png';
import MenuScene from '../scenes/MenuScene';
import{ musicConfig } from '../config/gameConfig';

class Stage1Scene extends Scene {
    constructor() {
        super('Stage1Scene');
    }

    preload() {


        // Disable mouse rightclick
        this.input.mouse.disableContextMenu();
        // Hide Mouse
        //Hide mouse
        let canvas = this.sys.canvas;
        canvas.style.cursor = 'none';





        this.load.image("player", player);
        // Load background image
        this.load.image('background', background);
        this.load.image("star", star);

        this.load.audio('fight1', [__dirname + 'src/assets/sound/music/fight1.ogg']);
        
    }

    create() {
        // Add Background
        this.createBackground();
        this.player = this.physics.add.image(450, 850, "player");
        this.player.setCollideWorldBounds(true);
        this.startMusic(true, "fight1");
        // this.initCursorKeys();
        this.cursors = this.input.keyboard.createCursorKeys();

    }

    update() {
        this.moveStars();

        if (this.cursors.left.isDown) {
            this.player.x -= 3;
        }

        if (this.cursors.right.isDown) {
            this.player.x += 3;
        }

        if (this.cursors.up.isDown) {
            this.player.y -= 3;
        }

        if (this.cursors.down.isDown) {
            console.log(this.cursors.down);
            this.player.y += 3;
        }

    }

    // initCursorKeys() {
    //     this.downArrow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    //     this.upArrow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    //     this.rightArrow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    //     this.leftArrow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    // }

    startMusic(play, key) {
        // Add and start background music
        this.menuMusic = this.sound.add(key, musicConfig);
        if(play) {
            this.menuMusic.play();
        }
    }

    moveStars() {
        /**
         * Check if stars are below screen and reset
         */
        Phaser.Actions.Call(this.stars.getChildren(), (item) => {
            if (item.y > config.height + 10) {
                item.y = -10;
                item.x = Math.random() * config.width;
            }
        });

        this.moveStars();
    }

    createBackground() {
        /**
          * Create a set number of stars and put them in random positions on the screen at different speeds according to size
         */
        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(0.5);

        this.stars = this.physics.add.group();

        for (var i = 0; i < 90; i++) {
            this.stars.create(0 + Math.random() * config.width, 0 + Math.random() * config.height, 'star');
        };

        Phaser.Actions.Call(this.stars.getChildren(), (item) => {
            item.setScale(Math.random());
            item.setVelocityY(Math.random() * ((item._scaleX) * 900));
            // console.log(item);
        });
    }

    moveStars() {
        /**
         * Check if stars are below screen and reset
         */
        Phaser.Actions.Call(this.stars.getChildren(), (item) => {
            if (item.y > config.height + 10) {
                item.y = -10;
                item.x = Math.random() * config.width;
            }
        });
    }
}

export default Stage1Scene;