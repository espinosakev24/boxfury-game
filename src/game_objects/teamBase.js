class TeamBase extends Phaser.GameObjects.Rectangle {
  static RED_TEAM = 1;
  static BLUE_TEAM = 2;
  // TODO add a team enumerator

  constructor(scene, x, y, width, height, team) {
    super(scene, x, y - height, width, height, 0xffffff, 1.0);

    this.scene.add.existing(this);
    this.setOrigin(0, 0);
    this.team = team;
    this.score = 0;
  }
}

export default TeamBase;
