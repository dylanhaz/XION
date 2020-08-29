import{ gamePlay, config } from '../config/gameConfig';
 //Check if it is time for an enemy to shoot based on its delay timer
 
const updateEnemyShots = (pointer)=> {
    
    if (pointer.enemies && gamePlay.playerHitPoints > 0) {
        Phaser.Actions.Call(pointer.enemies.getChildren(), (item) => {
            if(item.y > -300) {
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
const createEnemyShot = (item, xOffset, yOffset, bulletType, bulletSpeed, bulletSoundCallback, pointer) => {
    
    pointer.shot = pointer.enemyShots.create(item.x + xOffset, item.y + yOffset, bulletType);
    if (bulletSoundCallback) {
        bulletSoundCallback();
    }
    
    
    // console.log(item);
    // this.shot.setDepth(-1);
    // if(bulletSound) {
    //     // console.log(bulletSound);
    //     pointer.bulletSound.play();
    // }
    pointer.shot.setVelocityY(bulletSpeed);

}

export { updateEnemyShots }