class Bullet extends Phaser.GameObjects.Arc {
  static RADIUS = 4;
  static COLOR = 0xff0000;

  constructor(scene, gameState, x, y, shootAngle, speed, playerDirection) {
    super(scene, x, y, Bullet.RADIUS, 0, 360, false, Bullet.COLOR, 1.0);
    this.scene.add.existing(this);
    this.setVisible(false);
    this.gameState = gameState;
    this.scene.physics.add.existing(this);
    this.body.setVelocity(
      Math.sin(shootAngle) * speed * playerDirection,
      Math.cos(shootAngle) * speed
    );
    this.arrow = this.scene.add.image(this.x, this.y, 'arrow');
    this.arrow.setOrigin(0.7, 0.5);
    this.arrow.setDepth(1);
    this.scene.physics.add.overlap(this, this.gameState.world_layer, (gameObjectA, gameObjectB) => {
      if (![ 17, 61, 106 ].includes(gameObjectB.index)){
        return;
      }
      if (this.scene){
        this.scene.time.addEvent({
          delay: 1000,
          callback: this.destroy_arrow,
          callbackScope: this,
          loop: false
      });
      }
      this.destroy();
    });
  }

  update(delta) { 
    this.arrow.x = this.x
    this.arrow.y = this.y
    if (this.body){
      this.arrow.setRotation(this.body.angle);
    }
  }
  destroy_arrow(){
    this.arrow.destroy();
  }
}

export default Bullet;
