import { Vector } from "matter";
import { Scene } from "phaser";

const subscriptTable: { [num: string]: string } = {
  ["0"]: "₀",
  ["1"]: "₁",
  ["2"]: "₂",
  ["3"]: "₃",
  ["4"]: "₄",
  ["5"]: "₅",
  ["6"]: "₆",
  ["7"]: "₇",
  ["8"]: "₈",
  ["9"]: "₉",
};

export function processMoleculeString(molecule: string) {
  let processed = "";

  let subscript = false;
  for (let i = 0; i < molecule.length; ++i) {
    const char = molecule.charAt(i);

    if (subscript) {
      if (subscriptTable[char]) {
        processed += subscriptTable[char];
        continue;
      } else {
        subscript = false;
      }
    }

    if (char == "_") {
      subscript = true;
      continue;
    }
    processed += char;
  }

  return processed;
}

export class Molecule {
  private unprocessedMolecule: string;
  private text: Phaser.GameObjects.Text;
  private body: Phaser.Physics.Arcade.Body;

  constructor(
    scene: Scene,
    molecule: string,
    initialVelocity: Vector = { x: 100, y: 100 },
    initialLocation: Vector = { x: 0, y: 0 },
    physicsGroup: Phaser.Physics.Arcade.Group,
    fontSize: number = 50,
  ) {
    this.unprocessedMolecule = molecule;
    const processedMolecule = processMoleculeString(molecule);

    this.text = scene.add
      .text(initialLocation.x, initialLocation.y, processedMolecule, {
        backgroundColor: "#45475a",
      })
      .setOrigin(0, 0)
      .setFontSize(fontSize);

    physicsGroup.add(this.text);
    if (
      !this.text.body ||
      !(this.text.body instanceof Phaser.Physics.Arcade.Body)
    )
      throw new Error("Physics body not created for molecule");

    this.body = this.text.body;

    this.body
      .setVelocity(initialVelocity.x, initialVelocity.y)
      .setCollideWorldBounds(true)
      .setBounce(1, 1);
    this.body.onWorldBounds = true;
    this.body.onOverlap = true;

    //@ts-ignore
    this.text.getObject = () => {
      return this;
    };
  }

  getMoleculeString() {
    return this.unprocessedMolecule;
  }

  destroy() {
    this.text.destroy();
  }

  freeze() {
    this.body.destroy();
  }
}
