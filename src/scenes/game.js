import Phaser from 'phaser';
import Player from '../game_objects/player';
import Block from '../game_objects/block';

class Game extends Phaser.Scene {  
  static WIDTH = 760;
  static HEIGHT = 640;

  constructor() {
    super("Box Fury");
  }

  preload() {
    this.load.setBaseURL('http://localhost:8080/src');
    this.load.text('level', 'levels/level1.txt');
  }

  create() {
    this.cursor = this.input.keyboard.createCursorKeys();
    this.player = new Player(this, 200, 100);
    this.blocks = this.load_level()

    const blockBodies = this.blocks.map(block => {
      return this.physics.add.existing(block, true);
    });
  
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, blockBodies);
    this.bullets = [];
  }
  update() {
    this.player.update();
    this.bullets.forEach(bullet => bullet.update());
  }

  load_level() {
    const level_data = this.cache.text.get('level');
    const rows = level_data.trim().split('\n');
    const levelmap = rows.map(row => row.split(''));
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