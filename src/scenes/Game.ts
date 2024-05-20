import { Model } from "../api/Model";
import { dimensions } from "../dimensions";
import { Molecule, processMoleculeString } from "../reactor/Molecule";
import { Reactor } from "../reactor/Reactor";

export class Game extends Phaser.Scene {
  private reactor: Reactor;
  private model: Model;

  constructor() {
    super("Game");
  }

  init(data) {
    this.model = data.model;
  }

  create() {
    this.reactor = new Reactor(this, undefined, this.model, 900);

    this.physics.world.setBounds(
      0,
      0,
      dimensions.width - 600,
      dimensions.height,
    );

    const boundingBox = this.add
      .rectangle(dimensions.width - 600, 0, 600, dimensions.height, 0x1e1e2e)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0xcba6f7);
    const textBox = this.add
      .text(dimensions.width - 600 / 2, dimensions.height / 2, "New Molecule", {
        fontSize: 50,
        align: "center",
        backgroundColor: "#45475a",
        fixedWidth: 600 - 2,
      })
      .setOrigin(0.5, 0.5)
      .setStroke("#cba6f7", 2);
    textBox.setText("New Molecule");
    const thus = this;
    textBox.setInteractive().on("pointerdown", () => {
      textBox.text = "";
      this.rexUI.edit(textBox, {
        onClose: function (textObject) {
          const moleculeText = processMoleculeString(textObject.text).trim();
          thus.reactor.makeMolecule(
            moleculeText,
            (dimensions.width - 600) / 2,
            dimensions.height / 2,
          );
        },
      });
    });
  }
}
