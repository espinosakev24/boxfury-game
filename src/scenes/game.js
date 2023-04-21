import Phaser from 'phaser';
import { Flag, Player, Block } from '../game_objects';

class Game extends Phaser.Scene {
  static WIDTH = 760;
  static HEIGHT = 640;

  constructor() {
    super('Box Fury');
  }

  preload() {
    this.load.setBaseURL('http://localhost:8080/src');
    this.load.text('level', 'levels/level1.txt');
  }

  create() {
    this.cursor = this.input.keyboard.createCursorKeys();
    this.blocks = this.load_level();
    this.player = new Player(this, 200, 100);
    this.flag = new Flag(this, 200, 300);

    this.cameras.main.setBounds(0, 0, 3000, 3000);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    this.cameras.main.setZoom(1);

    const blockBodies = this.blocks.map((block) => {
      return this.physics.add.existing(block, true);
    });

    this.physics.add.existing(this.player);
    this.physics.add.existing(this.flag);

    // this.flag.body.allowGravity = false;

    this.physics.add.collider(this.player, blockBodies);
    this.physics.add.collider(this.flag, blockBodies);
    this.physics.add.overlap(this.player, this.flag, () => {
      if (this.cursor.down.isDown) {
        this.player.hasFlag = true;
      }
    });
    this.bullets = [];
  }
  update(time, delta) {
    this.player.update(delta);
    this.bullets.forEach((bullet) => bullet.update());
  }

  load_level() {
    const level_data = this.cache.text.get('level');
    const rows = level_data.trim().split('\n');
    const levelmap = rows.map((row) => row.split(''));
    const blocks = [];

    for (let i = 0; i < levelmap.length; i++) {
      for (let j = 0; j < levelmap[i].length; j++) {
        if (levelmap[i][j] === '1') {
          const block = new Block(this, j * Block.SIZE, i * Block.SIZE);
          blocks.push(block);
        }
      }
    }
    return blocks;
  }
}

export default Game;
