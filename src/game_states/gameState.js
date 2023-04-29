import BaseGameState from './baseGameState';
import { Flag, Player, TeamBase } from '../game_objects';
import { SocketHandler } from '../utils';

class GameState extends BaseGameState {
  static FLAG_OFFSET = 50;

  constructor(scene, map_key) {
    super(scene);
    this.me = new Player(this, 300, 100, Date.now());
    new SocketHandler(this);
    this.flag = null;
    this.players = []
    this.map = scene.make.tilemap({ key: map_key });
    
    this.tileset = this.map.addTilesetImage('scribble_spritesheet', 'scribble_spritesheet');
    this.world_layer = this.map.createLayer('world_layer', this.tileset, 0, 0); 
    this.decoration_layer = this.map.createLayer('decoration', this.tileset, 0, 0);
    this.map.setCollision([ 17, 61, 106 ], true, true, this.world_layer);
    this.scene.physics.add.collider(this.me, this.world_layer);
    
    this.scene.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.scene.cameras.main.startFollow(this.me);
    this.scene.cameras.main.setBackgroundColor('#333333');
    this.scene.cameras.main.setZoom(1);
    this.bullets = [];
    this.bases = []
    this.initLevel();
  }

  initLevel() {
    this.map.filterObjects('team_bases', (object) => {
        if (object.name == 'flag') {
            this.flagX = object.x;
            this.flagY = object.y;
            this.putFlag(object.x, object.y);
        }
        if (object.name == 'base_collider') {
            this.bases.push(new TeamBase(this,
                 object.x, object.y, object.width, object.height,
                  parseInt(object.properties[0].value)));
        }
    });
  }

  putFlag(x, y) {
    this.flag = new Flag(this.scene, x, y - GameState.FLAG_OFFSET);
    this.scene.physics.add.existing(this.flag);
    this.scene.physics.add.collider(this.flag, this.world_layer);
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
    this.bases.forEach((base) => {
        base.update();
    });
  }
}

export default GameState;
