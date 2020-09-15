import { Scene } from 'phaser';
import{ config, gamePlay } from '../config/gameConfig';
import{ musicConfig } from '../config/gameConfig';

/**
 * preloader imports
 */
import LoadingBar from '../preloader_scripts/LoadingBar';
import player from '../assets/img/player/player.png';
import playerShot from '../assets/img/player/shoot.png';
// Basic Ship
import basicShip from '../assets/img/enemies/basic/basic_ship.png';
import basicShipLaser from '../assets/img/enemies/basic/basic_ship_laser.png';
import basicShipLaser2 from '../assets/img/enemies/basic/basic_ship_laser2.png';
// Ark Shooter
import arkShooter from '../assets/img/enemies/ark-shooter/ark-shooter.png';
import arkShot from '../assets/img/enemies/ark-shooter/ark-shot.png';
// Stage 1 Boss
import stageOneBoss from '../assets/img/enemies/stage-1-boss/stage-1-boss-ship.png';
import bossOneShot from '../assets/img/enemies/stage-1-boss/boss-1-shot.png';
import bossOneTrackshot from '../assets/img/enemies/stage-1-boss/boss-1-trackshot.png';

import star from '../assets/img/star.png';
import background from '../assets/img/starfield_alpha.png';
import explosion1 from '../assets/img/spritesheets/explosion-1.png';
import explosion2 from '../assets/img/spritesheets/explosion-2.png';
import explosion3 from '../assets/img/spritesheets/explosion-3.png';
import arkShotExplosion from '../assets/img/spritesheets/ark-shot-explosion.png';
import playerDeathExplosion from '../assets/img/spritesheets/player-death-explosion.png';
import explosion6 from '../assets/img/spritesheets/explosion-6.png';
import point from '../assets/img/point.png';
import pixelFont from '../assets/font/font.png';
import pixelFontXML from '../assets/font/font.xml';

/**
 * game_scripts
 */
import Background from '../game_scripts/Background';
import Player from '../game_scripts/Player';
import Enemy from '../game_scripts/CreateEnemy';
import { updateEnemyShots } from '../game_scripts/enemyShots';
import { initEnemyDamageCheck, movePoints, checkOverlapPoints } from '../game_scripts/enemyDamage';
import { initPlayerDamageCheck, checkEnemyOffScreen, loadPlayerDamageAnimations, checkIfPlayerAlive} from '../game_scripts/playerDamage';
import { typewriteBitmapText } from "../game_scripts/typewriter";
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
        // Load custom font
        this.load.bitmapFont('pixelFont', pixelFont, pixelFontXML);
        
    }

    create() {
        // FOR DEVELOPMENT TESTING ONLY
        const testing = true;
        if (testing) {
            gamePlay.playerShootDelay = 20;
            gamePlay.playerSpray = 10;
            gamePlay.playerHitPoints = 99999999;
        }


      


        // Add Background
        this.background.createBackground();


        //Player Ship
        this.player.createPlayer();

        // Start Music
        this.startMusic(true, "fight1");

        // Init misc sound effects
        this.initMiscSoundEffects();

        // Init cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();

        // Method for handling damage done to enemy ships
        initEnemyDamageCheck(this);
        // Event listener for updating score once point orbs reach player
        checkOverlapPoints(this, this.pointPickup);
        // Method for handling damage done to player
        initPlayerDamageCheck(this);
        // Load explosions related to damaging player
        loadPlayerDamageAnimations(this);

        //Display Scoring
        this.scoreLabel = this.add.bitmapText(20, 5, 'pixelFont', `SCORE ${gamePlay.playerPoints}`, 50).setDepth(10);
        //Display Ship Health
        this.shipHealth = this.add.bitmapText(config.width - 130, 5, 'pixelFont', `HP ${gamePlay.playerHitPoints}`, 50).setDepth(10);

        // Init bitmapText field
        this.bitmapLabel = this.add.bitmapText(350, 450, 'pixelFont', '', 70).setMaxWidth(300);

        // Set bitmap text listeners
        typewriteBitmapText('STAGE 1', 0, this); 
        typewriteBitmapText('STAGE 2', 35, this); 
        typewriteBitmapText('BOSS FIGHT!', 65, this); 


        // Sets the collision box sizes for game objects
        this.setCollisionBoxes();
        

        
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

        // Damage Player if Enemy Reaches Bottom
        checkEnemyOffScreen(this);

        // Update Player Score
        this.scoreLabel.text = `SCORE ${gamePlay.playerPoints}`;
        // Update Player HP
        if (gamePlay.playerHitPoints > -1 ) {
            this.shipHealth.text = `HP ${gamePlay.playerHitPoints}`;
        }

        // Check if player is still alive
        checkIfPlayerAlive(this);



        // Update X and Y positions for shot patterns
        gamePlay.rotateShotsX ++;
        gamePlay.rotateShotsY --;
        if (gamePlay.rotateShotsX > 200) {
            gamePlay.rotateShotsX = -200
        }
        if (gamePlay.rotateShotsY < -450) {
            gamePlay.rotateShotsY = 450
        }

        // console.log(gamePlay.rotateShotsX);
        // console.log(`${gamePlay.rotateShotsX} ||||| ${gamePlay.rotateShotsY}`);
        

        
        


        // Level Creation
        if (gamePlay.playerHitPoints > 0) {
            
            this.enemyBasic.createShip(225, 10);
            this.enemyBasic.createShip(675, 10);
            this.enemyBasic.createShip(225, 25);
            this.enemyBasic.createShip(450, 25);
            this.enemyBasic.createShip(675, 25);
               
            this.arkShooterEnemy.createShip(450, 45);
            this.arkShooterEnemy.createShip(225, 45);
            
            this.stageOneBossEnemy.createShip(225, 75);
            this.stageOneBossEnemy.createShip(625, 75);
            this.stageOneBossEnemy.createShip(450, 85);
        }
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
    //  shotPositions is writen as an object with 2 arrays
    //  first one is for x, seconds is for y 
    // Example
    // {
    //     x: [10, 20, 30, 40],
    //     y: [5, 10, 15, 20]
    // }
    loadEnemies(){
        const enemyBasicShotPositions = {
            x: [0],
            y: [0]
        }

        const arkShooterShotPositions = {
            x: [11, -11, 97, -97, 116, -116],
            y: [80, 80, 0, 0, 0, 0],
            delay: [0, 0, 100, 100, 300, 300]
        }

        const stageOneBossShotPositions = {
            x: [7, -7, 13, -13, 41, -41],
            y: [0, 0, 0, 0, 0, 0],
            delay: [0, 0, 0, 0, 1345, 1345]
        }

        this.enemyBasic = new Enemy('basicShip', 3000, 75, 30, enemyBasicShotPositions, 'basicShipLaser', 600, () => {
            if (!this.basicShipLaserSound.isPlaying) {
                this.basicShipLaserSound.play();
            }
        }, false, this);

        this.arkShooterEnemy = new Enemy('arkShooter', 5000, 100, 70, arkShooterShotPositions, 'arkShot', 900, () => {
            if (!this.arkShotSound.isPlaying) {
                this.arkShotSound.play();
            }
        }, false, this);

        this.stageOneBossEnemy = new Enemy('stageOneBoss', 20000, 200, 30, stageOneBossShotPositions, 'bossOneShot', 200, false, false, this);


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
        // Load basic enemy images
        this.load.image('basicShip', basicShip);
        this.load.image('basicShipLaser', basicShipLaser);
        this.load.image('basicShipLaser2', basicShipLaser2);
        // Load ark shooter images
        this.load.image('arkShooter', arkShooter);
        this.load.image('arkShot', arkShot);
        // Load stage 1 boss images
        this.load.image('stageOneBoss', stageOneBoss);
        this.load.image('bossOneShot', bossOneShot);
        this.load.image('bossOneTrackshot', bossOneTrackshot);
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
        this.load.spritesheet('explosion3', explosion3, {
            frameWidth: 128,
            frameHeight: 80
        });
        this.load.spritesheet('arkShotExplosion', arkShotExplosion, {
            frameWidth: 48,
            frameHeight: 48
        });
        this.load.spritesheet('playerDeathExplosion', playerDeathExplosion, {
            frameWidth: 92,
            frameHeight: 91
        });
        this.load.spritesheet('explosion6', explosion6, {
            frameWidth: 48,
            frameHeight: 48
        });

        // LOAD AUDIO FILES HERE!
        this.load.audio('fight1', [__dirname + 'src/assets/sound/music/fight1.ogg']);
        this.load.audio('playerShootingSound', [__dirname + 'src/assets/sound/effects/sfx_wpn_laser7.ogg']);
        this.load.audio('playerShotExplosion', [__dirname + 'src/assets/sound/effects/player_shot_explosion.ogg']);
        this.load.audio('pointPickup', [__dirname + 'src/assets/sound/effects/point_pickup.ogg']);
        this.load.audio('basicShipLaser', [__dirname + 'src/assets/sound/effects/ship_1_laser.ogg']);
        this.load.audio('basicShipDeath', [__dirname + 'src/assets/sound/effects/ship_1_death.ogg']);
        this.load.audio('arkShot', [__dirname + 'src/assets/sound/effects/ark_shot.ogg']);
        this.load.audio('playerDeath', [__dirname + 'src/assets/sound/effects/player_death.ogg']);
        this.load.audio('shipHitBottom', [__dirname + 'src/assets/sound/effects/ship_hit_bottom.ogg']);
        this.load.audio('typewriter', [__dirname + 'src/assets/sound/effects/typewriter.ogg']);
        
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
        this.basicShipLaserSound = this.sound.add('basicShipLaser', {volume: 0.1});
        this.arkShotSound = this.sound.add('arkShot', {volume: 0.2});
        this.basicShipDeath = this.sound.add('basicShipDeath', {volume: 0.4});
    }
    

    initShooting() {
        // Player
        this.playerShots = this.physics.add.group();
        this.shoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.playerShootSoundEffect = this.sound.add('playerShootingSound', {volume: 0.2});
        this.playerShotExplosion = this.sound.add('playerShotExplosion', {volume: 0.2});

        
    }
    
    createPlayerShot() {
        const gun1 = this.player.x + 13;
        const gun2 = this.player.x - 13;
        const gun3 = this.player.x + 23;
        const gun4 = this.player.x - 23;
        const gunYPosition = this.player.y - 33;
        if (gamePlay.gameRunning === true) {
            this.playerShots.create(gun1, gunYPosition, 'playerShot');
            this.playerShootSoundEffect.play();
            this.playerShots.create(gun2, gunYPosition, 'playerShot');
            // Set spray bullets for first guns
            for (let i = 0; i < gamePlay.playerSpray; i++) {
                setTimeout(() => {
                    this.playerShots.create(gun1, gunYPosition, 'playerShot').setVelocityX(30 * (i + 1) + (Math.random() * 10));
                    this.playerShots.create(gun2, gunYPosition, 'playerShot').setVelocityX(-30 * (i + 1) + (Math.random() * 10));
                }, 10 * i)
                
            }
            setTimeout(()=> {
                if(this.shoot.isDown) {
    
                    this.playerShots.create(gun3, gunYPosition, 'playerShot');
                    this.playerShootSoundEffect.play();
                    this.playerShots.create(gun4, gunYPosition, 'playerShot');
    
                    // Set spray bullets for 2nd guns
                    for (let i = 0; i < gamePlay.playerSpray; i++) {
                        setTimeout(() => {
                            this.playerShots.create(gun3, gunYPosition, 'playerShot').setVelocityX(30 * (i + 1) + (Math.random() * 10));
                            this.playerShots.create(gun4, gunYPosition, 'playerShot').setVelocityX(-30 * (i + 1) + (Math.random() * 10));
                        }, 10 * i)
                    }
                }
            }, gamePlay.playerShootDelay * 3);
        }
        
        
    }

    

    // Set object collision boxes
    setCollisionBoxes() {
        this.defineBoxSize(this.player, 50);
    }

    defineBoxSize(object, boxOffset) {
        object.setSize(object.frame.width - boxOffset, object.frame.height - boxOffset, false).setOffset(boxOffset / 2, boxOffset / 2)
    }

    startMusic(play, key) {
        // Add and start background music
        this.music = this.sound.add(key, musicConfig);
        if(play) {
            this.music.play();
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

        this.player.x = this.input.x;
        this.player.y = this.input.y;    

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