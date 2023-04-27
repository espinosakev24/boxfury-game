import BaseGameState from './baseGameState';
import { Flag, Player, TeamBase } from '../game_objects';

class GameState extends BaseGameState {
  static FLAG_OFFSET = 50;

  constructor(scene, map_key) {
    super(scene);

    this.player = new Player(this, 200, 100);
    this.flag = null;

    this.map = scene.make.tilemap({ key: map_key });

    this.tileset = this.map.addTilesetImage('platform_tileset', 'tiles');

    this.layer = this.map.createLayer('Tile Layer 1', this.tileset, 0, 0);
    this.baseLayer = this.map.getObjectLayer('Base1', this.castleTileset, 0, 0);

    this.map.setCollision(1);
    this.scene.physics.add.collider(this.player, this.layer);
    this.scene.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.scene.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.scene.cameras.main.setBackgroundColor('#333333');
    this.scene.cameras.main.setZoom(1);

    const spriteGroup = this.map.createFromObjects('Bases', 1, {
      key: 'castle_tiles',
    });

    this.scene.add.group(spriteGroup);

    this.bullets = [];

    this.bases = [];

    this.putFlag(500, 100);

    this.initBases();
  }

  initBases() {
    console.log();

    this.baseLayer.objects
      .filter((base) => base.name === 'Collider1' || base.name === 'Collider2')
      .forEach(({ x, y, width, height, ...props }, idx) => {
        this.bases.push(
          new TeamBase(this, x, y + height, width, height, idx + 1)
        );
      });
  }

  putFlag(x, y) {
    this.flag = new Flag(this.scene, x, y - GameState.FLAG_OFFSET);
    this.scene.physics.add.existing(this.flag);
    this.scene.physics.add.collider(this.flag, this.layer);
  }

  update(time, delta) {
    this.player.update(delta, this.graphics);
    this.bullets.forEach((bullet) => bullet.update());
  }
}

export default GameState;
