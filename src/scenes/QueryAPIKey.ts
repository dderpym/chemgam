import { Model } from "../api/Model";
import { dimensions } from "../dimensions";

export let API_KEY: string;

export let model: Model;

export class KeyQuery extends Phaser.Scene {
  constructor() {
    super("KeyQuery");
  }

  preload() {}
  create() {
    const defaultText = "API Key from https://aistudio.google.com";

    const textBox = this.add
      .text(dimensions.width / 2, dimensions.height / 2, defaultText, {
        fixedWidth: 1920,
        fixedHeight: 50,
      })
      .setOrigin(0.5, 0.5)
      .setFontSize("50px")
      .setAlign("center")
      .setStroke("#cba6f7", 2);

    const thus = this;
    let doneso = false;

    textBox.setInteractive().on("pointerdown", () => {
      textBox.text = "";
      this.rexUI.edit(textBox, {
        onClose: function (textObject) {
          if (doneso) return;

          const api_key = textObject.text;
          textObject.text = defaultText;

          model = new Model(api_key);

          model
            .run("Na + Cl")
            .then((value) => {
              const text = value.text().trim();
              if (text == "NaCl") {
                thus.scene.start("Game", { model: model });
                doneso = true;
              } else {
                console.log(text);
                alert("Model returned faulty value. This problem is wacky.");
              }
            })
            .catch(() => alert("Bad api key"));
        },
      });
    });
  }
  update() {}
}
