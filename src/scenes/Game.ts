import { Model } from "../api/Model";
import { dimensions } from "../dimensions";
import { processMoleculeString } from "../reactor/Molecule";
import { Reactor } from "../reactor/Reactor";
import Slider from "phaser3-rex-plugins/plugins/slider.js";

const velocityScaler = 1800;
export class Game extends Phaser.Scene {
  private reactor?: Reactor;
  private model?: Model;

  constructor() {
    super("Game");
  }

  init(data: any) {
    this.model = data?.model;
  }

  create() {
    if (!this.model) throw new Error("Model not passed to game object");
    this.reactor = new Reactor(
      this,
      undefined,
      this.model,
      velocityScaler * 0.5,
    );

    this.physics.world.setBounds(
      0,
      0,
      dimensions.width - 600,
      dimensions.height,
    );

    this.add
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
      // @ts-ignore
      this.rexUI.edit(textBox, {
        onClose: function (textObject: Phaser.GameObjects.Text) {
          const moleculeText = processMoleculeString(textObject.text).trim();
          if (!thus.reactor) return;
          thus.reactor.makeMolecule(
            moleculeText,
            (dimensions.width - 600) / 2,
            dimensions.height / 2,
          );
        },
      });
    });

    const slider = new Slider(
      this.add
        .rectangle(
          dimensions.width - 600 / 2,
          dimensions.height / 10,
          50,
          150,
          0x45475a,
        )
        .setOrigin(0.5, 0.5)
        .setDepth(1),
      {},
    )
      .setEnable(true)
      .setEndPoints(
        dimensions.width - 600 + 50,
        dimensions.height / 10,
        dimensions.width - 50,
        dimensions.height / 10,
      )
      .setValue(0.5);
    this.add
      .line(
        0,
        0,
        dimensions.width - 600 + 50,
        dimensions.height / 10,
        dimensions.width - 50,
        dimensions.height / 10,
        0x11111b,
      )
      .setOrigin(0, 0)
      .setLineWidth(20);

    slider.on("valuechange", function (newValue: number) {
      if (newValue <= 0.01) thus.reactor?.setVelocityMag(0.01 * velocityScaler);
      //0 K not possible!!
      else thus.reactor?.setVelocityMag(newValue * velocityScaler);
    });
  }
}
