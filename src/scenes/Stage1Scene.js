import { Scene } from 'phaser';
import player from '../assets/img/player/player.png';
import playerShot from '../assets/img/player/shoot.png'
import{ config, gamePlay } from '../config/gameConfig';
import star from '../assets/img/star.png';
import background from '../assets/img/starfield_alpha.png';
import MenuScene from '../scenes/MenuScene';
import{ musicConfig } from '../config/gameConfig';

class Stage1Scene extends Scene {
    constructor() {
        super('Stage1Scene');
    }

    preload() {

        this.hideMouse();

        this.loadAssets();
        
        
    }

    create() {
        // Add Background
        this.createBackground();


        //Player Ship
        this.createPlayer();

        // Start Music
        this.startMusic(false, "fight1");

        // Init cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();

    }

    update() {
        // Move stars in background
        this.moveStars();
        // Player Control
        this.updatePlayer();


        

    }

    
    //////////
    //////////
    //////////
    /**
     * Preload Methods
     * 
     * 
     * 
     */

    hideMouse() {
        // Disable mouse rightclick
        this.input.mouse.disableContextMenu();
        // Hide Mouse
        //Hide mouse
        let canvas = this.sys.canvas;
        canvas.style.cursor = 'none';
    }

    loadAssets() {
        this.load.image("player", player);
        this.load.image("playerShot", playerShot);
        // Load background image
        this.load.image('background', background);
        this.load.image("star", star);

        this.load.audio('fight1', [__dirname + 'src/assets/sound/music/fight1.ogg']);
        this.load.audio('playerShootingSound', [__dirname + 'src/assets/sound/effects/sfx_wpn_laser7.ogg']);
    }
    //////////
    //////////
    //////////

    /**
     * Create Methods
     * 
     * 
     * 
     */



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

    

    createPlayer() {
        this.player = this.physics.add.image(450, 850, "player").setScale(0.7);
        this.player.setCollideWorldBounds(true);
        this.initShooting();
    }

    
    initShooting() {
        this.playerShots = this.physics.add.group();
        this.shoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.playerShootSoundEffect = this.sound.add('playerShootingSound', {volume: 0.2});
    }
    
    createShot() {
        this.playerShots.create(this.player.x + 13, this.player.y - 33, 'playerShot');
        this.playerShootSoundEffect.play();
        this.playerShots.create(this.player.x - 13, this.player.y - 33, 'playerShot');
        setTimeout(()=> {
            this.playerShots.create(this.player.x + 23, this.player.y - 33, 'playerShot');
            this.playerShootSoundEffect.play();
            this.playerShots.create(this.player.x - 23, this.player.y - 33, 'playerShot');
        }, gamePlay.playerShootDelay * 3);
        
        
    }

    startMusic(play, key) {
        // Add and start background music
        this.menuMusic = this.sound.add(key, musicConfig);
        if(play) {
            this.menuMusic.play();
        }
    }
    //////////
    //////////
    //////////
    /**
     * Update Methods
     * 
     * 
     * 
     */
    

    updatePlayer() {

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
            this.player.y += 3;
        }

        if (this.shoot.isDown) {
            if (gamePlay.playerShootDelay > 60) {
                //Shooting
                
                this.createShot();
                gamePlay.playerShootDelay = 0;
            } else {
                gamePlay.playerShootDelay ++;
            }
        }

        Phaser.Actions.Call(this.playerShots.getChildren(), (shot) => {
            shot.setVelocityY(-1000);
            if(shot.y < -5) {
                shot.destroy();
            }
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