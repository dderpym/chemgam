import { Scene } from "phaser";
import { Model } from "../api/Model";
import { Molecule } from "./Molecule";

export class Reactor {
  private scene: Scene;
  private molecules: Set<Molecule>;
  private body: Phaser.Physics.Arcade.Group;
  private velocityMag: number;
  private fontSize: number;
  private collisionCooldown: number;
  private onCooldown: boolean = false;

  constructor(
    scene: Scene,
    molecules: Set<Molecule> = new Set<Molecule>(),
    model: Model,
    velocityMag: number = 200,
    fontSize: number = 50,
    collisionCooldown = 4,
  ) {
    this.scene = scene;
    this.molecules = molecules;
    this.velocityMag = velocityMag;
    this.fontSize = fontSize;
    this.collisionCooldown = collisionCooldown;

    this.body = scene.physics.add.group([], {
      collideWorldBounds: true,
      bounceX: 1,
      bounceY: 1,
    });

    scene.physics.add.overlap(this.body, this.body, (a, b) => {
      if (this.onCooldown) return;

      //bodged solution
      //@ts-ignore
      const firstMolecule = a.getObject();
      //@ts-ignore
      const secondMolecule = b.getObject();

      firstMolecule.freeze();
      secondMolecule.freeze();

      model
        .run(
          firstMolecule.getMoleculeString() +
            " + " +
            secondMolecule.getMoleculeString(),
        )
        .then((value) => {
          //@ts-ignore
          const positionX = (a.x + b.x) / 2;
          //@ts-ignore
          const positionY = (a.y + b.y) / 2;

          const diffMolecules = value.text().trim().split(" + ");
          if (diffMolecules.length >= 10) {
            alert(
              "Generated too many molecules from that reaction. Aborting results.",
            );
          }

          let count = 0;
          diffMolecules.forEach((molecule) => {
            let lastCount = 1;
            let symbol: string = molecule;

            for (let i = 0; i < molecule.length; ++i) {
              const thingy = parseInt(molecule.charAt(i));

              if (isNaN(thingy)) {
                symbol = molecule.substring(i);
                break;
              } else {
                lastCount = thingy;
              }
            }

            for (let i = 0; i < lastCount; ++i) {
              const yOffset =
                this.fontSize * 2 * (count % 2 ? count / 2 : -count / 2);
              this.makeMolecule(symbol, positionX, positionY + yOffset);
              count++;
            }
          });

          firstMolecule.destroy();
          secondMolecule.destroy();
        });

      this.onCooldown = true;
      setTimeout(() => {
        this.onCooldown = false;
      }, this.collisionCooldown * 1000);
    });
  }

  setVelocityMag(mag: number) {
    this.velocityMag = mag;
  }

  yeetMolecule(molecule: Molecule) {
    this.molecules.delete(molecule);
    molecule.destroy();
  }

  makeMolecule(symbol: string, x: number, y: number) {
    const velX = Math.random();
    const velY = 1 - Math.pow(velX, 2);

    const molecule = new Molecule(
      this.scene,
      symbol,
      { x: velX * this.velocityMag, y: velY * this.velocityMag },
      { x: x, y: y },
      this.body,
      this.fontSize,
    );

    this.molecules.add(molecule);
  }
}
