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

        if (bulletPositions.delay){
            setTimeout(() => {
                pointer.shot = pointer.enemyShots.create(item.x + bulletPositions.x[i], item.y + bulletPositions.y[i], bulletType);
                if (bulletSoundCallback) {
                    bulletSoundCallback();
                }
                if (trackPlayer) {
                    pointer.physics.moveToObject(pointer.shot, pointer.player, bulletSpeed)
                } else {
                    pointer.shot.setVelocityY(bulletSpeed);
                }
            }, bulletPositions.delay[i])

        } else {
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



        // Special case hardcoded enemy shots
        if (item.texture.key === 'stageOneBoss') {
            const trackCreate = (xOff, yOff) => {
                pointer.trackshot = pointer.enemyShots.create(item.x + xOff, item.y + yOff, 'bossOneTrackshot');
                pointer.physics.moveToObject(pointer.trackshot, pointer.player, bulletSpeed * 1.5);
                pointer.trackshot.setDepth(4);
                gamePlay.bossOneTrackOffset = 0;
            }
            
            if (gamePlay.bossOneTrackOffset === 0.5) {
                trackCreate(32, -10);
                trackCreate(-32, -10);
            } else {
                gamePlay.bossOneTrackOffset += 0.5; 
            }
        }

        if (item.texture.key === 'basicShip') {
                pointer.rotateShot = pointer.enemyShots.create(item.x, item.y, 'basicShipLaser');
                pointer.rotateShot.setVelocityX(gamePlay.rotateShotsX);
                pointer.rotateShot.setVelocityY(200);
                pointer.rotateShot2 = pointer.enemyShots.create(item.x, item.y, 'basicShipLaser2');
                pointer.rotateShot2.setVelocityX(-gamePlay.rotateShotsX);
                pointer.rotateShot2.setVelocityY(200);
                pointer.rotateShot3 = pointer.enemyShots.create(item.x, item.y, 'basicShipLaser');
                pointer.rotateShot3.setVelocityX(gamePlay.rotateShotsX);
                pointer.rotateShot3.setVelocityY(-200);
                pointer.rotateShot4 = pointer.enemyShots.create(item.x, item.y, 'basicShipLaser2');
                pointer.rotateShot4.setVelocityX(-gamePlay.rotateShotsX);
                pointer.rotateShot4.setVelocityY(-200);
                pointer.rotateShot.setDepth(4);
                pointer.rotateShot2.setDepth(4);
                pointer.rotateShot3.setDepth(4);
                pointer.rotateShot4.setDepth(4);
        }
        
    }

}



// 





export { updateEnemyShots }