import BaseGameState from './baseGameState';
import { Flag, Player } from '../game_objects';

class GameState extends BaseGameState {
  static FLAG_OFFSET = 50;

  constructor(scene, map_key) {
    super(scene);
    this.player = new Player(this, 200, 100);
    this.flag = null;

    this.map = scene.make.tilemap({ key: map_key });
    this.tileset = this.map.addTilesetImage('platform_tileset', 'tiles');
    this.layer = this.map.createLayer('Tile Layer 1', this.tileset, 0, 0);
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
    this.bullets = [];

    this.putFlag(300, 100);
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
