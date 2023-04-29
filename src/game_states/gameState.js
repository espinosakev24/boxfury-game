import BaseGameState from './baseGameState';
import { Flag, Player, TeamBase } from '../game_objects';
import { SocketHandler } from '../utils';

class GameState extends BaseGameState {
  static FLAG_OFFSET = 50;

  constructor(scene, map_key) {
    super(scene);

    this.flag = null;

    this.map = scene.make.tilemap({ key: map_key });

    this.tileset = this.map.addTilesetImage(
      'scribble_spritesheet',
      'scribble_spritesheet'
    );
    this.world_layer = this.map.createLayer('world_layer', this.tileset, 0, 0);
    this.decoration_layer = this.map.createLayer(
      'decoration',
      this.tileset,
      0,
      0
    );
    this.map.setCollision([17, 61, 106], true, false, this.world_layer);
    this.scene.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.scene.cameras.main.setBackgroundColor('#333333');
    this.scene.cameras.main.setZoom(1);
    this.bullets = [];

    this.players = [];

    this.me = new Player(this, 600, 300, Date.now());

    this.scene.physics.add.collider(this.me, this.world_layer);
    this.scene.cameras.main.startFollow(this.me, true, 0.08, 0.08);

    new SocketHandler(this);

    this.putFlag(500, 100);
  }

  initBases() {
    // this.baseLayer.objects
    //   .filter((base) => base.name === 'Collider1' || base.name === 'Collider2')
    //   .forEach(({ x, y, width, height, ...props }, idx) => {
    //     this.bases.push(
    //       new TeamBase(this, x, y + height, width, height, idx + 1)
    //     );
    //   });
  }

  putFlag(x, y) {
    this.flag = new Flag(this.scene, x, y - GameState.FLAG_OFFSET);
    this.scene.physics.add.existing(this.flag);
    this.scene.physics.add.collider(this.flag, this.layer);
  }

  update(time, delta) {
    this.me.update(delta);

    for (const p of this.players) {
      p.update(delta);
    }

    this.bullets.forEach((bullet) => {
      bullet.update(delta);
      if (!bullet.arrow.active) {
        bullet.arrow.destroy();
        this.bullets.splice(this.bullets.indexOf(bullet), 1);
      }
    });
  }
}

export default GameState;
