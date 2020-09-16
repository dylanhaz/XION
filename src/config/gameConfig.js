import Phaser from "phaser";
import MenuScene from "../scenes/MenuScene"
import Stage1Scene from "../scenes/Stage1Scene";

const musicConfig = {
  mute: false,
  volume: 0.4,
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
  rotateShotsX : 0,
  rotateShotsY : 0,
  bossOneTrackOffset : 0,
  globalTimer : 0,
  playerShootDelay : 20,
  playerShootCounter : 0,
  playerDamage : 20,
  playerSpray : 10,
  playerPoints : 0,
  playerHitPoints : 15,
  gameRunning : true
}

const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 900,
    height: 1000,
    scene: [MenuScene, Stage1Scene],
    autoCenter: true,
    physics: {
      default: "arcade",
      arcade: {
          debug: false,
          debugShowBody: true
      }
  }
  };

export { config, musicConfig, menuConfig, gamePlay };