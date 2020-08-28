import{ gamePlay, config } from '../config/gameConfig';

const loadPlayerDamageAnimations = (pointer) => {
    // Create bullet explosion animation
    pointer.anims.create({
        key: 'explosion6_anim',
        frames: pointer.anims.generateFrameNumbers('explosion6'),
        frameRate: 40,
        repeat: 0
    });
    pointer.anims.create({
        key: 'explosion3_anim',
        frames: pointer.anims.generateFrameNumbers('explosion3'),
        frameRate: 20,
        repeat: 0
    });
}

const initPlayerDamageCheck = (pointer) => {
    pointer.physics.add.overlap(pointer.player, pointer.enemyShots, (player, projectile)=>{

        
        
        switch (projectile.texture.key) {
            case "basicShipLaser":
                gamePlay.playerHitPoints -= 1;
                pointer.basicExplode = pointer.add.sprite(projectile.x, projectile.y + 40, 'explosion6');
                pointer.basicExplode.rotation = Math.random() * 20;
                pointer.basicExplode.setScale(1.75);
                pointer.basicExplode.setDepth(Math.round(Math.random() * 2));
                pointer.basicExplode.play('explosion6_anim');
                projectile.destroy();
                break;
        
            default:
                break;
        }

        pointer.basicExplode.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
            pointer.basicExplode.destroy();
        });
        
        
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
            // Remove Ship
            enemy.destroy();
        }
    })
}



export { initPlayerDamageCheck, checkEnemyOffScreen, loadPlayerDamageAnimations };