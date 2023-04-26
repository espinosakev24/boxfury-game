import Phaser from 'phaser';
import { Flag, Player } from '../game_objects';
import Assets from '../utils/assets';
import { gameKeys } from '../utils';

class Game extends Phaser.Scene {
  static WIDTH = 760;
  static HEIGHT = 640;

  constructor() {
    super('Box Fury');
  }

  preload() {
    Assets.loadAssets(this)
  }

  create() {

    this.keys = {};
    this.graphics = this.add.graphics();

    this.cursor = this.input.keyboard.createCursorKeys();
    for (const key of gameKeys) {
      this.keys[key] = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes[key]
      );
    }
    this.player = new Player(this, 200, 100);

    this.flag = null;
    this.map = this.make.tilemap({ key: 'map' });
    this.tileset = this.map.addTilesetImage('platform_tileset', 'tiles');
    this.layer = this.map.createLayer('Tile Layer 1', this.tileset, 0, 0);
    this.map.setCollision(1)
    this.physics.add.collider(this.player, this.layer);


    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setBackgroundColor('#333333');
    this.cameras.main.setZoom(1);


    this.bullets = [];

    this.putFlag(2300, 300);
  }

  putFlag(x, y) {
    this.flag = new Flag(this, x, y - 50);
    this.physics.add.existing(this.flag);
    this.physics.add.collider(this.flag, this.blocks);
  }

  update(time, delta) {
    this.player.update(delta, this.graphics);
    this.bullets.forEach((bullet) => bullet.update());
  }
}

export default Game;
