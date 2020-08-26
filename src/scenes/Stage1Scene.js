import { Scene } from 'phaser';
import{ config, gamePlay } from '../config/gameConfig';
import{ musicConfig } from '../config/gameConfig';

/**
 * preloader imports
 */
import LoadingBar from '../preloader_scripts/LoadingBar';
import player from '../assets/img/player/player.png';
import playerShot from '../assets/img/player/shoot.png';
import basicShip from '../assets/img/enemies/basic/basic_ship.png';
import basicShipLaser from '../assets/img/enemies/basic/basic_ship_laser.png';
import star from '../assets/img/star.png';
import background from '../assets/img/starfield_alpha.png';
import explosion1 from '../assets/img/spritesheets/explosion-1.png';
import explosion2 from '../assets/img/spritesheets/explosion-2.png';
import point from '../assets/img/point.png';

/**
 * game_scripts
 */
import Background from '../game_scripts/Background';
import Player from '../game_scripts/Player';
import Enemy from '../game_scripts/CreateEnemy';
import { updateEnemyShots } from '../game_scripts/enemyShots';
import { initEnemyDamageCheck, movePoints, checkOverlapPoints } from '../game_scripts/enemyDamage';
//////////
/////////
////////
///////


class Stage1Scene extends Scene {
    constructor() {
        super('Stage1Scene');
    }

    preload() {
        // First load imported assets
        this.loadAssets();
        // Display loading progress
        this.loadCustomClasses();
        // Load preset enemies
        this.loadingBar.displayProgress();
        // Load imported classes first
        this.loadEnemies();
        // Hide mouse from UI
        this.hideMouse();
        
        
    }

    create() {
        // Add Background
        this.background.createBackground();


        //Player Ship
        this.player.createPlayer();

        // Start Music
        this.startMusic(false, "fight1");

        // Init misc sound effects
        this.initMiscSoundEffects();

        // Init cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();

        // Method for handling damage done to enemy ships
        initEnemyDamageCheck(this);
        // Event listener for updating score once point orbs reach player
        checkOverlapPoints(this, this.pointPickup);
        

        /**
         * Check if player is hit by an enemy attack
         */

        this.physics.add.overlap(this.player, this.enemyShots, ()=>{
            console.log('you got hit!');
        },null, this);
        
    }
    
    update() {
        // Move stars in background
        this.moveStars();
        // Player Control
        this.updatePlayer();

        // Player Shooting timer delay
        this.playerShotTimer();

        // Enemy Shooting timer delay
        updateEnemyShots(this);   

        // Remove offscreen items
        this.removeOffScreenItems();

        // Update global timer with game clock
        gamePlay.globalTimer ++;


        // Move points towards player
        movePoints(this);
        



        /**
         * Adding enemies to Scene
         */
        this.enemyBasic.createShip(225, 1);
        this.enemyBasic.createShip(450, 10);
        this.enemyBasic.createShip(675, 15);
        this.enemyBasic.createShip(200, 25);
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

    loadCustomClasses(){
        this.loadingBar = new LoadingBar(this);
        this.background = new Background(900, this);
        this.player = new Player(this);
    }
    //  Create enemy types here using the new Enemy class
    loadEnemies(){
        this.enemyBasic = new Enemy('basicShip', 300, 100, 80, 0, 0, 'basicShipLaser', 600, () => {
            this.basicShipLaserSound.play();
        }, this);




        //Create Enemy groups
        this.enemyBasic.initGroups();
    }

    

    // Hide mouse and disable right click
    hideMouse() {
        // Disable mouse rightclick
        this.input.mouse.disableContextMenu();
        // Hide Mouse
        let canvas = this.sys.canvas;
        canvas.style.cursor = 'none';
    }

    // Load game assets
    loadAssets() {
        // Load player images
        this.load.image("player", player);
        this.load.image("playerShot", playerShot);
        // Load enemy 1 images
        this.load.image('basicShip', basicShip);
        this.load.image('basicShipLaser', basicShipLaser);
        // Load point image
        this.load.image('point', point);
        // Load background image
        this.load.image('background', background);
        this.load.image("star", star);
        // Load spritesheets
        this.load.spritesheet('explosion1', explosion1, {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('explosion2', explosion2, {
            frameWidth: 64,
            frameHeight: 64
        });

        // LOAD AUDIO FILES HERE!
        this.load.audio('fight1', [__dirname + 'src/assets/sound/music/fight1.ogg']);
        this.load.audio('playerShootingSound', [__dirname + 'src/assets/sound/effects/sfx_wpn_laser7.ogg']);
        this.load.audio('playerShotExplosion', [__dirname + 'src/assets/sound/effects/player_shot_explosion.ogg']);
        this.load.audio('pointPickup', [__dirname + 'src/assets/sound/effects/point_pickup.ogg']);
        this.load.audio('basicShipLaser', [__dirname + 'src/assets/sound/effects/ship_1_laser.ogg']);
        
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

    initMiscSoundEffects() {
        this.pointPickup = this.sound.add('pointPickup', {volume: 0.3});
        this.basicShipLaserSound = this.sound.add('basicShipLaser', {volume: 0.3})
    }
    

    initShooting() {
        // Player
        this.playerShots = this.physics.add.group();
        this.shoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.playerShootSoundEffect = this.sound.add('playerShootingSound', {volume: 0.8});
        this.playerShotExplosion = this.sound.add('playerShotExplosion', {volume: 0.8});

        
    }
    
    createPlayerShot() {
        this.playerShots.create(this.player.x + 13, this.player.y - 33, 'playerShot');
        this.playerShootSoundEffect.play();
        this.playerShots.create(this.player.x - 13, this.player.y - 33, 'playerShot');
        setTimeout(()=> {
            if(this.shoot.isDown) {

                this.playerShots.create(this.player.x + 23, this.player.y - 33, 'playerShot');
                this.playerShootSoundEffect.play();
                this.playerShots.create(this.player.x - 23, this.player.y - 33, 'playerShot');
            }
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
            if (gamePlay.playerShootCounter === gamePlay.playerShootDelay) {
                //Shooting
                
                this.createPlayerShot();
                gamePlay.playerShootCounter = 0;
            }
        }

        Phaser.Actions.Call(this.playerShots.getChildren(), (shot) => {
            shot.setVelocityY(-1000);
            if(shot.y < -5) {
                shot.destroy();
            }
        });
    }

    playerShotTimer() {
        if(gamePlay.playerShootCounter < gamePlay.playerShootDelay) {
            gamePlay.playerShootCounter ++;
        }
    }

    removeOffScreenItems() {
        Phaser.Actions.Call(this.enemyShots.getChildren(), (shot) => {
            if(shot.y > config.height + 100) {
                shot.destroy();
                console.log('removed');
            }
        })
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