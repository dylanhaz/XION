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
import Enemy from '../game_scripts/CreateEnemy';
import { createEnemyShot, updateEnemyShots } from '../game_scripts/enemyShots'
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

        this.anims.create({
            key: 'explosion1_anim',
            frames: this.anims.generateFrameNumbers('explosion1'),
            frameRate: 20,
            repeat: 0
        })

        // Start Music
        this.startMusic(false, "fight1");

        // Init cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();

        // Testing new Enemy Class
        


        

        // this.createEnemyShip('basicShip', 300, 250, 150, 20, 0, 0, 'basicShipLaser', 600, false)();

        /**
         * Check if player lazer hits an enemy
         */
        /////
        ////
        ///
        this.physics.add.overlap(this.playerShots, this.enemies, (projectile, enemy)=>{
            // Create and place the explosion anim at a randome angle and size
            this.explode = this.add.sprite(projectile.x, projectile.y - 7, 'explosion1');
            this.explode.rotation = Math.random() * 20;
            this.explode.setScale(1 + (Math.random() * 2));
            this.explode.setDepth(2);
            this.explode.play("explosion1_anim");
            

                this.playerShotExplosion.play();
            
            // Damage the hit enemy
            enemy.hitPoints -= gamePlay.playerDamage;
            // Check if the enemy has no more hitpoints
            if(enemy.hitPoints <= 0) {
                // If enemy ship hitponts are <= 0, destroy it
                enemy.destroy();
            }
            // Destroy the player shot
            projectile.destroy();
            // console.log('hit enemy');
        },null, this);

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
        this.enemyBasic = new Enemy('basicShip', 300, 300, 80, 0, 0, 'basicShipLaser', 600, false, this);
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
        this.load.audio('playerShotExplosion', [__dirname + 'src/assets/sound/effects/player_shot_explosion.ogg'])
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