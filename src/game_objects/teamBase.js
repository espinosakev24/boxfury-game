const TEAM_COLOR = {
  1: 0x2191fb,
  2: 0xba274a,
};

class TeamBase extends Phaser.GameObjects.Rectangle {
  static RED_TEAM = 1;
  static BLUE_TEAM = 2;
  // TODO add a team enumerator

  constructor(gameState, x, y, width, height, team) {
    super(gameState.scene, x, y - height, width, height, TEAM_COLOR[team], 1.0);

    this.scene.add.existing(this);
    this.setOrigin(0, 0);
    this.team = team;
    this.score = 0;

    this.scene.physics.add.existing(this);
    this.body.setAllowGravity(false);

    this.scene.physics.add.overlap(this, gameState.player, () => {
      if (gameState.player.hasFlag && gameState.player.team === 1) {
        this.score += 1;
        gameState.putFlag(500, 100);
        gameState.player.hasFlag = false;
      }
    });
  }
}

export default TeamBase;
