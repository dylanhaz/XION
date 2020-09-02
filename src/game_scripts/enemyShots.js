import{ gamePlay, config } from '../config/gameConfig';
 //Check if it is time for an enemy to shoot based on its delay timer
 
const updateEnemyShots = (pointer)=> {
    
    if (pointer.enemies && gamePlay.playerHitPoints > 0) {
        Phaser.Actions.Call(pointer.enemies.getChildren(), (item) => {
            if(item.y > -300) {
                if (item.shootTimer === item.shootDelay) {
                    
                    createEnemyShot(item, item.bulletPositions, item.bulletType, item.bulletSpeed, item.bulletSound, item.trackPlayer, pointer);
                    item.shootTimer = 0;
                } else {
                    item.shootTimer ++;
                }
            }
        });
    }
    
}



// Create the enemy laser based on set arguments for that enemy
const createEnemyShot = (item, bulletPositions, bulletType, bulletSpeed, bulletSoundCallback, trackPlayer, pointer) => {
    // console.log(bulletPositions);
    for (let i = 0; i < bulletPositions.x.length; i++) {

        pointer.shot = pointer.enemyShots.create(item.x + bulletPositions.x[i], item.y + bulletPositions.y[i], bulletType);
        if (bulletSoundCallback) {
            bulletSoundCallback();
        }
        if (trackPlayer) {
            pointer.physics.moveToObject(pointer.shot, pointer.player, bulletSpeed)
        } else {
            pointer.shot.setVelocityY(bulletSpeed);
        }
    }

}



// 





export { updateEnemyShots }