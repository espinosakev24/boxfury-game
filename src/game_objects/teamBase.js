import Game from '../scenes/game';

const TEAM_COLOR = {
  1: 0x2191fb,
  2: 0xba274a,
};
const TEAM_COLOR_STR = {
  2: '#2191fb',
  1: '#ba274a',
};

class TeamBase extends Phaser.GameObjects.Rectangle {
  static BLUE_TEAM = 1;
  static RED_TEAM = 2;
  // TODO add a team enumerator

  constructor(gameState, x, y, width, height, team) {
    super(gameState.scene, x, y, width, height, TEAM_COLOR[team], 1.0);

    this.scene.add.existing(this);
    this.setOrigin(0, 0);
    this.team = team;
    this.score = 0;
    this.visible = false;
    this.scene.physics.add.existing(this);
    this.body.setAllowGravity(false);

    this.scene.physics.add.overlap(this, gameState.me, () => {
      if (gameState.me.team == this.team && gameState.me.hasFlag) {
        this.score += 1;
        this.scoreText.setText(`Team Score: ${this.score}`);
        gameState.putFlag(gameState.flagX, gameState.flagY);
        gameState.me.hasFlag = false;
      }
    });
    this.scoreText = this.scene.add.text(0, 0, 'Team Score: 0', { fontSize: '32px', fill: TEAM_COLOR_STR[team] });
  }

  update() {
    const { scene: { cameras }, team } = this;
    const { main } = cameras;
  
    if (team === TeamBase.RED_TEAM) {
      this.scoreText.x = main.scrollX + Game.WIDTH - 16 - this.scoreText.width;
      this.scoreText.y = main.scrollY + 16
    } else {
      this.scoreText.x = main.scrollX + 16;
      this.scoreText.y = main.scrollY + 16;
    }
  }
}

export default TeamBase;
