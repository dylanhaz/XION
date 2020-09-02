import{ gamePlay, config } from '../config/gameConfig';
 //Check if it is time for an enemy to shoot based on its delay timer
 
const updateEnemyShots = (pointer)=> {
    
    if (pointer.enemies && gamePlay.playerHitPoints > 0) {
        Phaser.Actions.Call(pointer.enemies.getChildren(), (item) => {
            if(item.y > -300) {
                if (item.shootTimer === item.shootDelay) {
                    
                    createEnemyShot(item, item.bulletPositions, item.bulletType, item.bulletSpeed, item.bulletSound, pointer);
                    item.shootTimer = 0;
                } else {
                    item.shootTimer ++;
                }
            }
        });
    }
    
}


// const shotPositions = {
    //     x: [10, 20, 30, 40],
    //     y: [5, 10, 15, 20]
    // }
    
    // for (let i = 0; i < shotPositions.x.length; i++) {
        
    //     console.log(`Position X: ${shotPositions.x[i]}`);
    //     console.log(`Position Y: ${shotPositions.y[i]}`);
        
    // }

// Create the enemy laser based on set arguments for that enemy
const createEnemyShot = (item, bulletPositions, bulletType, bulletSpeed, bulletSoundCallback, pointer) => {
    // console.log(bulletPositions);
    for (let i = 0; i < bulletPositions.x.length; i++) {

        pointer.shot = pointer.enemyShots.create(item.x + bulletPositions.x[i], item.y + bulletPositions.y[i], bulletType);
        if (bulletSoundCallback) {
            bulletSoundCallback();
        }
        pointer.shot.setVelocityY(bulletSpeed);
    }

}



// 





export { updateEnemyShots }