import Phaser from "phaser";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import { dimensions } from "./dimensions";
import { Game } from "./scenes/Game";
import { KeyQuery } from "./scenes/QueryAPIKey";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  backgroundColor: "#1e1e2e",
  // Allows Phaser canvas to be responsive to browser sizing
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: dimensions.width,
    height: dimensions.height,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
    },
  },
  dom: {
    createContainer: true,
  },
  plugins: {
    scene: [
      {
        key: "rexUI",
        plugin: RexUIPlugin,
        mapping: "rexUI",
      },
    ],
  },
  scene: [KeyQuery, Game],
};

export default new Phaser.Game(config);
