import { gamePlay } from '../config/gameConfig';
export default class Enemy {

    /**
     * 
     * @param {string} type - Ship sprite key
     * @param {number} hitPoints - Ship hitpoints
     * @param {number} shootDelay - Delay between shots
     * @param {number} moveSpeed - Vertical ship speed
     * @param {object} bulletPositions Set x and y position of each bullet relative to ship's position written in an object with TWO ARRAYS, FIRST for x and SECOND for y. Example: {[0, 10][0, -15]} Will create a bullet at x + 0, y + 0, and another bullet at x + 10, y -15.
     * @param {string} bulletType - Bullet sprite key
     * @param {number} bulletSpeed -Vertical bullet speed, if bullet tracks player bulletSpeed will be used for that argument instead
     * @param {Enemy~requestCallback} bulletSound - The callback that handles playing the sound effect of the bullet shot 
     * @param {boolean} trackPlayer - Should the bullet be aimed at the players position
     * @param {ThisType} pointer - Set the value of 'this'
     */
    constructor(type, hitPoints, shootDelay, moveSpeed, bulletPositions, bulletType, bulletSpeed, bulletSound, trackPlayer, pointer) {
        this.type = type;
        this.hitPoints = hitPoints;
        this.shootDelay = shootDelay;
        this.moveSpeed = moveSpeed;
        /**
         * Settings for ship basic attack
         */
        this.bulletPositions = bulletPositions;
        this.bulletType = bulletType;
        this.bulletSpeed = bulletSpeed;
        this.bulletSound = bulletSound;
        this.trackPlayer = trackPlayer;
        /**
         * Set the pointer for 'this'
         */
        this.pointer = pointer;
    }


    /**
     * 
     * @param {number} xPosition - Starting x position
     * @param {number} delay - Set how long to wait before creating ship
     */
    //Create enemy ship
    createShip(xPosition, delay) {
        //First check if it is time to add the ship to the scene based on the delay
        if ((delay * 100) === gamePlay.globalTimer) {
             
            /**
             * if enemy ship is ready to be created then set the ship's settings and add it to the scene
             */
            
            // Add new ship to enemies group
            this.pointer.ship = this.pointer.enemies.create(xPosition, -100, this.type).setScale(0.8).setDepth(1);
            // Set ship's Settings
            this.pointer.ship.hitPoints = this.hitPoints;
            this.pointer.ship.shootDelay = this.shootDelay;
            this.pointer.ship.shootTimer = 0;
            this.pointer.ship.bulletPositions = this.bulletPositions;
            this.pointer.ship.bulletType = this.bulletType;
            this.pointer.ship.bulletSpeed = this.bulletSpeed;
            this.pointer.ship.bulletSound = this.bulletSound;
            this.pointer.ship.trackPlayer = this.trackPlayer;
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