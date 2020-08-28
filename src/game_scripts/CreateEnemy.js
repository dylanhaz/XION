import { gamePlay } from '../config/gameConfig';
export default class Enemy {
    constructor(type, hitPoints, shootDelay, moveSpeed, xOffset, yOffset, bulletType, bulletSpeed, bulletSound, pointer) {
        this.type = type;
        this.hitPoints = hitPoints;
        this.shootDelay = shootDelay;
        this.moveSpeed = moveSpeed;
        /**
         * Settings for ship basic attack
         */
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.bulletType = bulletType;
        this.bulletSpeed = bulletSpeed;
        this.bulletSound = bulletSound;
        /**
         * Set the pointer for 'this'
         */
        this.pointer = pointer;
    }

    //Create enemy ship
    createShip(xPosition, delay) {
        //First check if it is time to add the ship to the scene based on the delay
        if ((delay * 100) === gamePlay.globalTimer) {
             
            /**
             * if enemy ship is ready to be created then set the ship's settings and add it to the scene
             */
            
            // Add new ship to enemies group
            this.pointer.ship = this.pointer.enemies.create(xPosition, 600, this.type).setScale(0.8).setDepth(1);
            // Set ship's Settings
            this.pointer.ship.hitPoints = this.hitPoints;
            this.pointer.ship.shootDelay = this.shootDelay;
            this.pointer.ship.shootTimer = 0;
            this.pointer.ship.xOffset = this.xOffset;
            this.pointer.ship.yOffset = this.yOffset;
            this.pointer.ship.bulletType = this.bulletType;
            this.pointer.ship.bulletSpeed = this.bulletSpeed;
            this.pointer.ship.bulletSound = this.bulletSound;
            this.pointer.ship.setVelocityY(this.moveSpeed);

            }

       
        
    }

    initGroups() {
        if(!this.pointer.enemies) {
            this.pointer.enemies = this.pointer.physics.add.group();
        }
        /**
         * Check if enemyShots group exists, if not then create it
         */
        if (!this.pointer.enemyShots) {
            this.pointer.enemyShots = this.pointer.physics.add.group();
        }

        if (!this.pointer.points) {
            this.pointer.points = this.pointer.physics.add.group();
            this.pointer.points.enableBody = true;
        }
    }
    
}