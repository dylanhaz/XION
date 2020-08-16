import { Scene } from "phaser";
import{ gamePlay } from '../config/gameConfig';
import player from '../assets/img/player/player.png';

export default class Player {
    constructor(pointer) {
        this.pointer = pointer
    }

    playerControlls() {
        console.log('Update Player!');
    }

    createPlayer() {
        this.pointer.load.image("player", player);
        this.pointer.player = this.pointer.physics.add.image(450, 850, "player").setScale(0.7);
        this.pointer.player.setCollideWorldBounds(true);
        this.pointer.initShooting();
    }

    

}