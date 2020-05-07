class Play extends Phaser.Scene {
  constructor() {
    super({ key: "Play", active: false });
  }

  init() {
    this.CONFIG = this.sys.game.CONFIG;

    this.DEPTH = {
      floor: 0,
      wall: 1,
      pickup: 2,
      monster: 3,
      player: 4,
      overlay: 5,
      ui: 6,
      menu: 7,
    };

    this.generator = new Generator(this);

    // Main flags
    this.allow_input = false;
    this.is_pause = false;
    this.is_gameover = false;

    // Controls
    this.is_holding = {
      left: false,
      right: false,
      direction: false,
    };

    // Camera
    this.cam_speed = {
      base: 1,
      current: 1,
      max: 1,
    };
  }

  create() {
    // create floor
    this.generator.setup();

    // player
    this.createPlayer();
    // Controls
    this.createControl();

    // Start the game
    this.allow_input = true;
    this.is_pause = false;
    this.is_gameover = false;
  }

  update() {
    //camera down
    this.updateCamera();
    //draw new floor tiles
    //delete passed floor
    this.generator.update();
    // Update player
    this.player.update(this.is_holding.direction);
  }

  //Camera
  updateCamera() {
    // scroll camera
    this.cameras.main.setScroll(
      0,
      this.cameras.main.scrollY + this.cam_speed.current
    );

    let centerY = this.cameras.main.scrollY + 0.5 * this.cameras.main.height;

    if (this.player.y >= centerY) {
      this.cameras.main.setScroll(
        0,
        this.player.y - 0.5 * this.cameras.main.height
      );
    }
  }

  setCamSpeed(speed) {
    this.cam_speed.base = speed;
    this.cam_speed.current = speed;
    this.cam_speed = Math.min(this.cam_speed.current, this.cam_speed.max);

    this.cam_speed.current = Math.max(this.cam_speed.current, 0);
  }

  createPlayer() {
    this.player = new Player(
      this,
      this.CONFIG.centerX,
      0.5 * this.CONFIG.tile,
      "spr-cat"
    );

    this.player.setDepth(this.DEPTH.player);

    this.player.startMoving();
  }

  // Controls =============================================

  createControl() {
    // Create zones for input
    let w = 0.45 * this.CONFIG.width;
    let h = this.CONFIG.height;

    this.zone_left = this.add.zone(0, 0, w, h);
    this.zone_left.setOrigin(0, 0);
    this.zone_left.setDepth(this.DEPTH.ui);
    this.zone_left.setScrollFactor(0);

    this.zone_right = this.add.zone(this.CONFIG.width, 0, w, h);
    this.zone_right.setOrigin(1, 0);
    this.zone_right.setDepth(this.DEPTH.ui);
    this.zone_right.setScrollFactor(0);

    // let debug = this.add.graphics({x: 0, y: 0});
    // debug.fillStyle('0x000000', 0.5)
    // debug.fillRect(0, 0, w, h);
    // debug.setScrollFactor(0);
    // debug.setDepth(this.DEPTH.ui)

    // add input callbacks
    this.zone_left.setInteractive();
    this.zone_left.on("pointerdown", this.holdLeft, this);
    this.zone_left.on("pointerup", this.releaseLeft, this);
    this.zone_left.on("pointerout", this.releaseLeft, this);

    this.zone_right.setInteractive();
    this.zone_right.on("pointerdown", this.holdRight, this);
    this.zone_right.on("pointerup", this.releaseRight, this);
    this.zone_right.on("pointerout", this.releaseRight, this);
  }

  holdLeft() {
    if (!this.allow_input) return;
    if (this.is_pause || this.is_gameover) return;

    this.is_holding.left = true;
    this.is_holding.direction = "left";
  }

  holdRight() {
    if (!this.allow_input) return;
    if (this.is_pause || this.is_gameover) return;

    this.is_holding.right = true;
    this.is_holding.direction = "right";
  }

  releaseLeft() {
    this.is_holding.left = false;

    if (this.is_holding.right) {
      this.is_holding.direction = "right";
    } else {
      this.is_holding.direction = false;
    }
  }

  releaseRight() {
    this.is_holding.right = false;

    if (this.is_holding.left) {
      this.is_holding.direction = "left";
    } else {
      this.is_holding.direction = false;
    }
  }
}
