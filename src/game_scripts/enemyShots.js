/**
 * 
 * Check if it is time for an enemy to shoot based on its delay timer
 */
const updateEnemyShots = (pointer)=> {
    
    if (pointer.enemies) {
        Phaser.Actions.Call(pointer.enemies.getChildren(), (item) => {
            if(item.y > 0) {
                if (item.shootTimer === item.shootDelay) {
                    createEnemyShot(item, item.xOffset, item.yOffset, item.bulletType, item.bulletSpeed, item.bulletSound, pointer);
                    item.shootTimer = 0;
                } else {
                    item.shootTimer ++;
                }
            }
        });
    }
    
}


// Create the enemy laser based on set arguments for that enemy
const createEnemyShot = (item, xOffset, yOffset, bulletType, bulletSpeed, bulletSound, pointer) => {
    
    pointer.shot = pointer.enemyShots.create(item.x + xOffset, item.y + yOffset, bulletType);
    // this.shot.setDepth(-1);
    if(bulletSound) {
        bulletSound.play();
    }
    pointer.shot.setVelocityY(bulletSpeed);

}

export { updateEnemyShots }