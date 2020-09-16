// import { Scene } from "phaser";
import star from '../assets/img/star.png';
import background from '../assets/img/starfield_alpha.png';
import{ config } from '../config/gameConfig';



export default class Background {
    /**
     * 
     * @param {Number} starSpeed 
     * @param {ThisType} pointer 
     */
    constructor(starSpeed, pointer) {
        this.starSpeed = starSpeed;
        this.pointer = pointer;
    }

    createBackground() {
        // Load background image
        this.pointer.load.image('background', background);
        this.pointer.load.image("star", star);
        /**
          * Create a set number of stars and put them in random positions on the screen at different speeds according to size
         */
        this.pointer.background = this.pointer.add.image(0, 0, 'background').setOrigin(0, 0).setScale(0.5);

        this.pointer.stars = this.pointer.physics.add.group();

        for (var i = 0; i < 90; i++) {
            this.pointer.stars.create(0 + Math.random() * config.width, 0 + Math.random() * config.height, 'star');
        };

        Phaser.Actions.Call(this.pointer.stars.getChildren(), (item) => {
            item.setScale(Math.random());
            item.setVelocityY(Math.random() * ((item._scaleX) * this.starSpeed));
            // console.log(item);
        });
    }

    
}