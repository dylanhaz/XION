import { Scene } from 'phaser';
import{ config, gamePlay } from '../config/gameConfig';
import{ musicConfig } from '../config/gameConfig';

/**
 * preloader imports
 */
import LoadingBar from '../preloader_scripts/LoadingBar'
import player from '../assets/img/player/player.png';
import playerShot from '../assets/img/player/shoot.png'
import basicShip from '../assets/img/enemies/basic/basic_ship.png'
import basicShipLaser from '../assets/img/enemies/basic/basic_ship_laser.png'
import star from '../assets/img/star.png';
import background from '../assets/img/starfield_alpha.png';
import explosion1 from '../assets/img/spritesheets/explosion-1.png';

/**
 * game_scripts
 */
import Background from '../game_scripts/Background';
import Player from '../game_scripts/Player';
//////////
/////////
////////
///////


class Stage1Scene extends Scene {
    constructor() {
        super('Stage1Scene');
    }

    preload() {
        this.loadCustomClasses();
        
        this.loadingBar.displayProgress();

        this.hideMouse();

        this.loadAssets();
        
        
    }

    create() {
        // Add Background
        this.background.createBackground();


        //Player Ship
        this.player.createPlayer();

        // Start Music
        this.startMusic(false, "fight1");

        // Init cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();

        // Create basic enemy
        this.createEnemyGroups();
        this.createEnemyShip('basicShip', 450, 300, 0, 0, 0, 'basicShipLaser', 600, false);
        this.createEnemyShip('basicShip', 250, 150, 0, 0, 0, 'basicShipLaser', 600, false);


        this.physics.add.overlap(this.playerShots, this.enemies, ()=>{
            console.log('hit enemy');
        },null, this);

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
        this.updateEnemyShots();

        // Remove offscreen items
        this.removeOffScreenItems();
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

    

    // Hide mouse and disable right click
    hideMouse() {
        // Disable mouse rightclick
        this.input.mouse.disableContextMenu();
        // Hide Mouse
        //Hide mouse
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
        // Load background image
        this.load.image('background', background);
        this.load.image("star", star);
        // Load spritesheets
        this.load.spritesheet('explosion1', explosion1, {
            frameWidth: 32,
            frameHeight: 32
        });
        // Load audio
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


    createEnemyGroups() {
        this.enemies = this.physics.add.group();
    }

    //Create Basic enemy
    createEnemyShip(type, x, shootDelay, moveSpeed, xOffset, yOffset, bulletType, bulletSpeed, bulletSound) {
        // this.basicShip = this.physics.add.image(450, 200, 'basicShip').setScale(0.7);
        this.ship = this.enemies.create(x, 300, type).setScale(0.8).setDepth(1);
        this.ship.shootDelay = shootDelay;
        this.ship.shootTimer = 0;
        this.ship.xOffset = xOffset;
        this.ship.yOffset = yOffset;
        this.ship.bulletType = bulletType;
        this.ship.bulletSpeed = bulletSpeed;
        this.ship.bulletSound = bulletSound;

        
        
        this.ship.setVelocityY(moveSpeed);
    }

    updateEnemyShots() {
        Phaser.Actions.Call(this.enemies.getChildren(), (item) => {
            if(item.y > 0) {
                if (item.shootTimer === item.shootDelay) {
                    this.createEnemyShot(item, item.xOffset, item.yOffset, item.bulletType, item.bulletSpeed, item.bulletSound);
                    item.shootTimer = 0;
                } else {
                    item.shootTimer ++;
                }
            }
            
            
        });
    }

    createEnemyShot(item, xOffset, yOffset, bulletType, bulletSpeed, bulletSound) {
        this.shot = this.enemyShots.create(item.x + xOffset, item.y + yOffset, bulletType);
        // this.shot.setDepth(-1);
        if(bulletSound) {
            bulletSound.play();
        }
        this.shot.setVelocityY(bulletSpeed);

    }

    
    initShooting() {
        // Player
        this.playerShots = this.physics.add.group();
        this.shoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.playerShootSoundEffect = this.sound.add('playerShootingSound', {volume: 0.2});

        //Basic Enemy
        this.enemyShots = this.physics.add.group();
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