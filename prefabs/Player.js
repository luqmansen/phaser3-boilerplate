class Player extends Entity {
  constructor(ctx, x, y, key) {
    super(ctx, x, y, key);


    // Movement
    this.speed = {
        base : 2,
        current : 2,
        max :6
    }
  }

  update(is_holding) {
    if (this.states.dead) return;

    // Save the current dirrecton
    this.setCurrentDirection(is_holding);

    if (this.states.walk) {
      this.updateSpriteDirection();
      this.moveSprite();
    }
  }

  startMoving(){
      this.setState('walk');
      this.startNewAnim('walk')
  }

  stopMoving(){
    this.setState('idle');
    this.startNewAnim('idle')
}
// MOVEMENT =====================================================

  moveSprite() {
    switch (this.direction.current) {
        case 'down':
            this.moveDown();
            break;
        case 'left':
            this.moveLeft();
            break;
        case 'right':
            this.moveRight();
            break;
    }
  }

  moveDown(){
      this.y += this.speed.current;
      this.handlerCollision('down')
      this.setSpritePos();
  }

  moveLeft(){
    this.x -= this.speed.current;

    this.setSpritePos();
    }

    moveRight(){
        this.x += this.speed.current;
  
        this.setSpritePos();
    }

    handlerCollision(direction)
    {

      let tile1;
      let tile2;
      let now;
      let corr;

      switch (direction)
      {
        case 'down':
          tile1 = this.getBottomLeftTile();
          tile2 = this.getBottomRightTile();
          now = this.helper.convertPxToTile(
            this.x, this.getBottomY(), this.TILE_SIZE
          );
          // correction tile if player is running into a wall
          corr = {
            x : this.x,
            y : this.helper.getTileCenter(
              now.tx, now.ty -1, this.TILE_SIZE
            ).y
          }
          break;
        case 'right':
          break;
        case 'left':
          break;
          
      }

      // check if player collides
      console.log(tile1)
      let is_tile1_wall = this.ctx.generator.checkTileBlocked(tile1)
      let is_tile2_wall = this.ctx.generator.checkTileBlocked(tile2)

      if (is_tile1_wall || is_tile2_wall)
      {
        this.x = corr.x
        this.y = corr.y
      }
    }


  // setters

  setCurrentDirection(is_holding) {
    if (is_holding) {
      this.direction.current = is_holding;
    } else {
      this.direction.current = "down";
    }
  }
}
