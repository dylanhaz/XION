import player from '../assets/img/player/player.png';

export default class Player {
    constructor(pointer) {
        this.pointer = pointer
    }

    createPlayer() {
        this.pointer.load.image("player", player);
        this.pointer.player = this.pointer.physics.add.image(450, 850, "player").setScale(0.5);
        this.pointer.player.setCollideWorldBounds(true);
        this.pointer.initShooting();
    }
 
    

}