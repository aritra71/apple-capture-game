import "./style.css";
import Phaser from "phaser";

const sizes = {
  width: 380,
  height: 604,
};

const speedDown = 500;
const touchPlayerSpeed = speedDown + 6000; // Adjust this value as needed for touch control speed

const gameStartDiv = document.querySelector("#gameStartDiv");
const gameStartBtn = document.querySelector("#gameStartBtn");
const gameEndDiv = document.querySelector("#gameEndDiv");
const gameWinLoseSpan = document.querySelector("#gameWinLoseSpan");
const gameEndScoreSpan = document.querySelector("#gameEndScoreSpan");
const restartBtn = document.querySelector("#restartBtn");

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.cursor;
    this.playerSpeed = speedDown + 50;
    this.target;
    this.points = 0;
    this.textScore;
    this.textTime;
    this.timedEvent;
    this.remainingTime;
    this.coinMusic;
    this.bgMusic;
    this.emitter;
  }

  preload() {
    this.load.image("bg", "/assets/bg1.png");
    this.load.image("basket", "/assets/boat.png");
    this.load.image("apple", "/assets/fish.png");
    this.load.image("money", "/assets/one.png");
    this.load.audio("coin", "/assets/coin.mp3");
    this.load.audio("bgMusic", "/assets/bgMusic.mp3");
  }

  create() {
    this.scene.pause("scene-game");

    this.coinMusic = this.sound.add("coin");
    this.bgMusic = this.sound.add("bgMusic");
    this.bgMusic.play();

    this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.player = this.physics.add
      .image(0, sizes.height - 100, "basket")
      .setOrigin(0, 0);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);
    this.player
      .setSize(this.player.width - this.player.width / 10, this.player.height / 10)
      .setOffset(this.player.width / 10, this.player.height - this.player.height / 10);

    this.target = this.physics.add.image(0, 0, "apple").setOrigin(0, 0);
    this.target.setMaxVelocity(0, speedDown);

    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this);

    this.cursor = this.input.keyboard.createCursorKeys();

    this.textScore = this.add.text(sizes.width - 120, 10, "Score:0", {
      font: "25px Arial",
      fill: "#ffe400",
    });
    this.textTime = this.add.text(10, 10, "Time: 00", {
      font: "25px Arial",
      fill: "#ffe400",
    });

    this.timedEvent = this.time.delayedCall(30000, this.gameOver, [], this); //made a change here

    this.emitter = this.add.particles(0, 0, "money", {
      speed: 100,
      gravityY: speedDown - 200,
      scale: 0.04,
      duration: 100,
      emitting: false,
    });
    this.emitter.startFollow(this.player, this.player.width / 2, this.player.height / 2, true);

    // Touch input handling
    this.input.on('pointerdown', (pointer) => {
      if (pointer.x < sizes.width / 2) {
        this.player.setVelocityX(-touchPlayerSpeed);
      } else {
        this.player.setVelocityX(touchPlayerSpeed);
      }
    });

    this.input.on('pointerup', () => {
      this.player.setVelocityX(0);
    });
  }

  update() {
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.textTime.setText(`Time: ${Math.round(this.remainingTime).toString()}`);

    if (this.target.y >= sizes.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX());
    }

    // Keyboard input handling
    if (this.cursor.left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (this.cursor.right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
  }

  getRandomX() {
    return Math.floor(Math.random() * 280);
  }

  targetHit() {
    this.coinMusic.play();
    this.emitter.start();
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++;
    this.textScore.setText(`Score: ${this.points}`);
  }

  gameOver() {
    this.sys.game.destroy(true);
    if (this.points >= 10) {
      gameEndScoreSpan.textContent = this.points;
      gameWinLoseSpan.textContent = "Win!";
    } else {
      gameEndScoreSpan.textContent = this.points;
      gameWinLoseSpan.textContent = "Lose!";
    }

    gameEndDiv.style.display = "flex";
  }

}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: true,
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);

gameStartBtn.addEventListener("click", () => {
  gameStartDiv.style.display = "none";
  game.scene.resume("scene-game");
});

// Add event listener for the restart button
// restartBtn.addEventListener("click", (event) => {
//   event.preventDefault();
//   game.scene.stop("scene-game");
//   game.scene.start("scene-game");
//   gameEndDiv.style.display = "none";
//   gameStartDiv.style.display = "flex";
// });

// Add event listener for the refresh button
refreshBtn.addEventListener("click", () => {
  location.reload(); // Reload the page
});


