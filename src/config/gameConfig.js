import Phaser from "phaser";
import MenuScene from "../scenes/MenuScene"
import Stage1Scene from "../scenes/Stage1Scene";

const musicConfig = {
  mute: false,
  volume: 0.5,
  rate: 1,
  detune: 0,
  seek: 0,
  loop: true,
  delay: 0
}

const menuConfig = {
  selection : 0,
  maxMenuItems : 1, // 0 index based
}

const gamePlay = {
  playerShootDelay : 60,
  playerShootCounter : 60
}

const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 900,
    height: 1000,
    scene: [Stage1Scene, MenuScene],
    autoCenter: true,
    physics: {
      default: "arcade",
      arcade: {
          debug: false
      }
  }
  };

export { config, musicConfig, menuConfig, gamePlay };