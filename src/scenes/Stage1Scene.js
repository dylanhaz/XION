import { Scene } from 'phaser';
import player from '../assets/img/player/player.png';
import playerShot from '../assets/img/player/shoot.png'
import basicShip from '../assets/img/enemies/basic/basic_ship.png'
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

        this.displayLoading();

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

        // Create basic enemy
        this.createEnemyGroups();
        this.createEnemyShip('basicShip', 450, 60, 0);

    }

    update() {
        // Move stars in background
        this.moveStars();
        // Player Control
        this.updatePlayer();
        // Player Shooting timer delay
        this.playerShotTimer();
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

    // LOADING BAR
    displayLoading() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        // progressBox.fillRect(240, 270, 320, 50);
        progressBox.fillRect(292, 465, 320, 50);
        
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
                }

            });

        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });

        const assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);
        percentText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(300, 475, 300 * value, 30);
            percentText.setText(parseInt(value * 100) + '%');
            
        });
                    
        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });
         
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
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

    createEnemyGroups() {
        this.enemies = this.physics.add.group();
    }

    //Create Basic enemy
    createEnemyShip(type, x, shootDelay, moveSpeed) {
        // this.basicShip = this.physics.add.image(450, 200, 'basicShip').setScale(0.7);
        this.ship = this.enemies.create(x, 100, type).setScale(0.8);
        this.ship.shootDelay = shootDelay;
        this.ship.shootTimer = 0;

        Phaser.Actions.Call(this.enemies.getChildren(), (item) => {
            item.shootTimer = 60;
            if (item.shootTimer === item.shootDelay) {
                console.log('FIRE!');
                console.log(item.shootTimer);
            } else {
                console.log('No yet');
            }
            
        });
        
        this.ship.setVelocityY(moveSpeed);
        
        
    }

    
    initShooting() {
        // Player
        this.playerShots = this.physics.add.group();
        this.shoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.playerShootSoundEffect = this.sound.add('playerShootingSound', {volume: 0.2});

        //Basic Enemy
        this.basicShipShots = this.physics.add.group();
    }
    
    createShot() {
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
                
                this.createShot();
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

    moveEnemys() {
        Phaser.Actions.Call(this.enemiesBasic.getChildren(), (ship) => {
            
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