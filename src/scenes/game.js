import Phaser from 'phaser';
import { Flag, Player, Block } from '../game_objects';
import { gameKeys } from '../utils';

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
    this.blocks = this.load_level();

    this.blockBodies = this.blocks.map((block) => {
      return this.physics.add.existing(block, true);
    });

    this.keys = {};
    this.graphics = this.add.graphics();

    this.cursor = this.input.keyboard.createCursorKeys();
    for (const key of gameKeys) {
      this.keys[key] = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes[key]
      );
    }
    this.flag = null;

    this.player = new Player(this, 200, 100);

    this.cameras.main.setBounds(0, 0, this.levelWidth * Block.SIZE, this.levelHeight * Block.SIZE);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setBackgroundColor('#87CEEB');
    this.cameras.main.setZoom(1);


    this.bullets = [];

    this.putFlag(200, 300);
  }

  putFlag(x, y) {
    this.flag = new Flag(this, x, y - 50);
    this.physics.add.existing(this.flag);
    this.physics.add.collider(this.flag, this.blockBodies);
  }

  update(time, delta) {
    this.player.update(delta, this.graphics);
    this.bullets.forEach((bullet) => bullet.update());
  }

  load_level() {
    const level_data = this.cache.text.get('level');
    const rows = level_data.trim().split('\n');
    const levelmap = rows.map((row) => row.split(''));
    const blocks = [];
    this.levelWidth = levelmap[0].length;
    this.levelHeight = levelmap.length;

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
