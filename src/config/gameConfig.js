import Phaser from "phaser";
import MenuScene from "../scenes/MenuScene"

const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 900,
    height: 900,
    scene: MenuScene,
    autoCenter: true,
  };

export { config };