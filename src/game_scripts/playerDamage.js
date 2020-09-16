import{ gamePlay, config } from '../config/gameConfig';
import { Actions } from 'phaser';

const loadPlayerDamageAnimations = (pointer) => {
    // Create bullet explosion animation
    pointer.anims.create({
        key: 'explosion6_anim',
        frames: pointer.anims.generateFrameNumbers('explosion6'),
        frameRate: 40,
        repeat: 0
    });
    pointer.anims.create({
        key: 'arkShotExplosion_anim',
        frames: pointer.anims.generateFrameNumbers('arkShotExplosion'),
        frameRate: 40,
        repeat: 0
    });
    pointer.anims.create({
        key: 'explosion3_anim',
        frames: pointer.anims.generateFrameNumbers('explosion3'),
        frameRate: 20,
        repeat: 0
    });
    pointer.anims.create({
        key: 'playerDeathExplosion_anim',
        frames: pointer.anims.generateFrameNumbers('playerDeathExplosion'),
        frameRate: 40,
        repeat: 0
    });
}

const initPlayerDamageCheck = (pointer) => {
    pointer.physics.add.overlap(pointer.player, pointer.enemyShots, (player, projectile)=>{

        
        // Check which type of projectile hit the player based on its texture key
        // Then create the correct explosion damage and apply the damage
        switch (projectile.texture.key) {
            case "basicShipLaser":
            case "basicShipLaser2":
                gamePlay.playerHitPoints -= 1;
                pointer.basicExplode = pointer.add.sprite(projectile.x, projectile.y + 40, 'explosion6');
                pointer.basicExplode.rotation = Math.random() * 20;
                pointer.basicExplode.setScale(1.75);
                pointer.basicExplode.setDepth(Math.round(Math.random() * 2));
                pointer.basicExplode.play('explosion6_anim');
                projectile.destroy();
                break;
            case "arkShot":
                gamePlay.playerHitPoints -= 1;
                pointer.arkShotExplode = pointer.add.sprite(projectile.x, projectile.y + 40, 'arkShotExplosion');

                if (!pointer.arkShotExplode.isPlaying) {
                    pointer.arkShotExplode.rotation = Math.random() * 20;
                    pointer.arkShotExplode.setScale(1.75);
                    pointer.arkShotExplode.setDepth(Math.round(Math.random() * 2));
                    pointer.arkShotExplode.play('arkShotExplosion_anim');
                }
                projectile.destroy();
                break;
            case "bossOneShot":
                gamePlay.playerHitPoints -= 1;
                pointer.bossShotExplode = pointer.add.sprite(projectile.x, projectile.y + 40, 'arkShotExplosion');

                if (!pointer.bossShotExplode.isPlaying) {
                    pointer.bossShotExplode.rotation = Math.random() * 20;
                    pointer.bossShotExplode.setScale(1.75);
                    pointer.bossShotExplode.setDepth(Math.round(Math.random() * 2));
                    pointer.bossShotExplode.play('arkShotExplosion_anim');
                }
                projectile.destroy();
                break;
            case "bossOneTrackshot":
                gamePlay.playerHitPoints -= 1;
                pointer.bossShotExplode = pointer.add.sprite(projectile.x, projectile.y + 40, 'arkShotExplosion');

                if (!pointer.bossShotExplode.isPlaying) {
                    pointer.bossShotExplode.rotation = Math.random() * 20;
                    pointer.bossShotExplode.setScale(1.75);
                    pointer.bossShotExplode.setDepth(Math.round(Math.random() * 2));
                    pointer.bossShotExplode.play('arkShotExplosion_anim');
                }
                projectile.destroy();
                break;
        
            default:

                break;
        }

        if(pointer.basicExplode) {
            pointer.basicExplode.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
                pointer.basicExplode.destroy();
            });
        }
        if(pointer.arkShotExplode) {
            pointer.arkShotExplode.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
                pointer.arkShotExplode.destroy();
            });
        }

        //Shake the Camera
        if (gamePlay.playerHitPoints > 0) {
            pointer.cameras.main.shake(50, 0.025);
        }
        
        
    },null, pointer);

}

const checkEnemyOffScreen = (pointer) => {
    Phaser.Actions.Call(pointer.enemies.getChildren(), (enemy) => {
        if(enemy.y > config.height) {
            // Damage Player
            gamePlay.playerHitPoints -= 1;
            // Create Explosion
            pointer.bottomExplosion = pointer.add.sprite(enemy.x, config.height- 20, 'explosion3').setScale(1.4);
            pointer.bottomExplosion.play('explosion3_anim');

            pointer.bottomExplosion.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
                pointer.bottomExplosion.destroy();
            });
            //Shake the Camera
            pointer.cameras.main.shake(200, 0.05);
            // Play explosion sound effect
            pointer.shipHitBottom = pointer.sound.add('shipHitBottom', {volume: 0.3});
            pointer.shipHitBottom.play();
            // Remove Ship
            enemy.destroy();
        }
    })
}

const checkIfPlayerAlive = (pointer) => {
    if (gamePlay.playerHitPoints <= 0 && gamePlay.gameRunning === true) {
        // Create Player Death Explosion
        pointer.playerDeathExplosion = pointer.add.sprite(pointer.player.x, pointer.player.y, 'playerDeathExplosion').setScale(2).setDepth(3);
        pointer.playerDeathExplosion.play('playerDeathExplosion_anim');
        pointer.playerDeathExplosion.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
            pointer.playerDeathExplosion.destroy();
        });
        if (!pointer.playerDebris) {
            pointer.playerDebris = pointer.physics.add.group();
        }
        // Create Player debris
        for (let i = 0; i < 60; i++) {
            let debris = pointer.playerDebris.create(pointer.player.x, pointer.player.y, 'point').setScale(1 + Math.random() * 1.3);
            debris.setVelocity((Math.random() * 600) - (Math.random() * 600), (Math.random() * 600) - (Math.random() * 600));
            // Set a timeout of 1 second before moving the points towards the player's position
            setTimeout(() => Phaser.Actions.Call(pointer.playerDebris.getChildren(), (debris)=> { debris.destroy();}), 10000);
        }
        // Shake the Game Screen
        pointer.cameras.main.shake(1000, 0.05);
        // Play explosion sound effect
        pointer.playerDeathSound = pointer.sound.add('playerDeath', {volume: 0.2});
        pointer.playerDeathSound.play();
        // Stop Main Music
        pointer.music.stop();
        // Destroy Player object
        pointer.player.destroy();
        // Display Game Over Text
        pointer.gameOver = pointer.add.bitmapText(config.width / 3, config.height / 2, 'pixelFont', `GAME OVER`, 100).setDepth(10);
        // Set Game running to false
        gamePlay.gameRunning = false;
    }
}



export { initPlayerDamageCheck, checkEnemyOffScreen, loadPlayerDamageAnimations, checkIfPlayerAlive };