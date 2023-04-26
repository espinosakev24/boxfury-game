class TeamBase extends Phaser.GameObjects.Rectangle{
    static SIZE = 256;
    static RED_TEAM = 1;
    static BLUE_TEAM = 2;
    // TODO add a team enumerator

    constructor(game, x, y, team) {
        super(game, x, y, TeamBase.SIZE, TeamBase.SIZE, 0xffffff, 1.0);
        this.team = team;
        this.score = 0;
    }
}

export default TeamBase;