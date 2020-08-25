import{ gamePlay } from '../config/gameConfig';

const initEnemyDamageCheck = (pointer) => {
    /**
         * Check if player lazer hits an enemy
         */
        pointer.physics.add.overlap(pointer.playerShots, pointer.enemies, (projectile, enemy)=>{
            // Create and place the explosion anim at a randome angle and size
            // Set depth to random number so explosions apear on top and below the enemy
            pointer.explode = pointer.add.sprite(projectile.x, projectile.y - 7, 'explosion1');
            pointer.explode.rotation = Math.random() * 20;
            pointer.explode.setScale(1 + (Math.random() * 2));
            pointer.explode.setDepth(Math.round(Math.random() * 2));
            pointer.explode.play("explosion1_anim");
            
            // Play explosion sound
            pointer.playerShotExplosion.play();
            
            // Damage the hit enemy
            enemy.hitPoints -= gamePlay.playerDamage;
            // Check if the enemy has no more hitpoints
            if(enemy.hitPoints <= 0) {
                // If enemy is dead, create point orbs from enemy position sent outwards in random directions
                for (let i = 0; i < 30; i++) {
                    // Create points
                    let newPoint = pointer.points.create(enemy.x, enemy.y, 'point').setScale(1 + Math.random() * 2);
                    newPoint.moveToPlayer = false;
                    newPoint.setVelocity((Math.random() * 600) - (Math.random() * 600), (Math.random() * 600) - (Math.random() * 600));
                    // Set a timeout of 1 second before moving the points towards the player's position
                    setTimeout(() => newPoint.moveToPlayer = true, 1000);
                }
                // If enemy ship hitponts are <= 0, destroy it
                enemy.destroy();
            }
            // Destroy the player shot
            projectile.destroy();
            // console.log('hit enemy');
        },null, pointer);
}

// Move points towards the player's position
const movePoints = (pointer) => {
    Phaser.Actions.Call(pointer.points.getChildren(), (point) => {
        if (point.moveToPlayer === true) {
            pointer.physics.moveToObject(point, pointer.player, 1000);
        };
    });
}

// Check if points have reached the player
const checkOverlapPoints = (pointer, pickUpSound) => {
    pointer.physics.add.overlap(pointer.points, pointer.player, (player, point) =>{
        // Add 1 point to the score per point
        gamePlay.playerPoints++;
        // Remove point from scene and play pickup sound effect if it isn't playing already (to avoid overlapping sound effect)
        point.destroy();
        if (pickUpSound && !pickUpSound.isPlaying) pickUpSound.play();
    });
}

export { initEnemyDamageCheck, movePoints, checkOverlapPoints };