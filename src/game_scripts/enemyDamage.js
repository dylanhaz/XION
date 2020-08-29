import{ gamePlay } from '../config/gameConfig';

const initEnemyDamageCheck = (pointer) => {
    /**
         * Check if player lazer hits an enemy
         */
        pointer.physics.add.overlap(pointer.playerShots, pointer.enemies, (projectile, enemy)=>{
            
            // Create bullet explosion animation
            pointer.anims.create({
                key: 'explosion1_anim',
                frames: pointer.anims.generateFrameNumbers('explosion1'),
                frameRate: 40,
                repeat: 0
            });
            // Create ship explosion animation
            pointer.anims.create({
                key: 'explosion2_anim',
                frames: pointer.anims.generateFrameNumbers('explosion2',),
                frameRate: 10,
                repeat: 0
            });
            // Create and place the explosion anim at a randome angle and size
            // Set depth to random number so explosions apear on top and below the enemy
            pointer.explode = pointer.add.sprite(projectile.x, projectile.y - 7, 'explosion1');
            pointer.explode.rotation = Math.random() * 20;
            pointer.explode.setScale(1 + (Math.random() * 2));
            pointer.explode.setDepth(Math.round(Math.random() * 2));
            pointer.explode.play("explosion1_anim");
            // remove explosion after finished playing
            pointer.explode.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
                pointer.explode.destroy();
            });
            
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
                // and play ship explosion animation and sound
                // First, check what type of enemy to match sound
                switch (enemy.texture.key) {
                    case "basicShip":
                        pointer.basicShipDeath.play()
                        break;
                
                    default:
                        break;
                }
                
                const explosion = []
                for (let i = 0; i < 4; i++) {
                    let shipExplode = pointer.add.sprite(enemy.x, enemy.y, 'explosion2');
                    explosion.push(shipExplode);
                }

                explosion.forEach((e, i) => {
                    e.rotation = Math.random() * 20;
                    e.setScale(1 + (Math.random() * 3));
                    e.play("explosion2_anim");
                    e.setDepth(Math.round(Math.random() * 2));
                    // remove explosion after finished playing
                    e.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
                        e.destroy();
                        explosion.shift();
                    });
                })
                
                // pointer.shipExplode.rotation = Math.random() * 20;
                // pointer.shipExplode.setScale(1 + (Math.random() * 2));
                // pointer.explode.setDepth(Math.round(Math.random() * 2));

                //Shake the Camera
                pointer.cameras.main.shake(150, 0.05);
                
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