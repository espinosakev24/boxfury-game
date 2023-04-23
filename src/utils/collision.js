export const checkOverlap = (bodyA, bodyB) => {
    var boundsA = bodyA.getBounds();
    var boundsB = bodyB.getBounds();

    return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
  }