import Phaser from "phaser";
import MenuScene from "../scenes/MenuScene"

const musicConfig = {
  mute: false,
  volume: 1,
  rate: 1,
  detune: 0,
  seek: 0,
  loop: true,
  delay: 0
}

const menuConfig = {
  selection : 0,
  maxMenuItems : 1 // 0 index based
}


const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 900,
    height: 1000,
    scene: MenuScene,
    autoCenter: true,
    physics: {
      default: "arcade",
      arcade: {
          debug: false
      }
  }
  };

export { config, musicConfig, menuConfig };