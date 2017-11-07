/**
 *  @description
 *  这是一个敌人类
 *  @param {number} this.x 敌人的初始位置的横坐标
 *  @param {number} this.y 敌人的初始位置的纵坐标
 *  @param {number} this.speed 表示敌人在每一次动画间隙的移动距离，是个长度单位，但这里把它叫做速度
 *  @param {number} this.sprite 敌人的外观图片
 */
  let Enemy = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
  };

/**
 *  @description
 *  此为游戏必须的函数，用来更新敌人的位置
 *  @param {number} this.x 每次游戏画面重绘之后敌人位置的刷新
 *  @param {dt} 表示游戏画面重绘的时间间隙
 */
  Enemy.prototype.update = function(dt) {
    /** 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上都是以同样的速度运行的 */
    this.x += this.speed * dt;
    this.endlessEnemy();
  };

/**
 *  @description
 *  实时绘制游戏面板上敌人的位置
 *  @param {string} this.sprite 敌人的外观图片
 *  @param {number} this.x 文字初始显示位置的横坐标
 *  @param {number} this.y 文字初始显示位置的纵坐标
 */
  Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };

/**
 *  @description
 *  当敌人到达游戏画面的边界，就把它的横坐标调整到 -100 的位置，然后以同样的速度重复在 canvas 上的运动
 *  以造成无穷无尽敌人的视觉效果，其实来来回回只有三个敌人
 *  @param {number} this.x 敌人现在的横坐标
 */
  Enemy.prototype.endlessEnemy = function() {
    if (this.x > 400) {
      this.x = -100;
    }
  }

/**
 *  @description
 *  这是一个玩家类
 *  @param {number} x 玩家初始位置的横坐标
 *  @param {number} y 玩家初始位置的纵坐标
 *  @param {string} this.player 玩家的外观
 */
  let Player = function() {
    this.x = 302;
    this.y = 402;
    this.player = 'images/char-boy.png';
  }

/**
 *  @description
 *  实时绘制游戏面板上玩家的位置
 *  @param {string} this.player 玩家的外观
 *  @param {number} this.x 玩家的横坐标
 *  @param {number} this.y 玩家的纵坐标
 */
  Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.player), this.x, this.y)
  }

/**
 *  @description
 *  接受键盘输入，以控制玩家的上下左右移动
 *  @param {string} this.x 玩家的横坐标
 *  @param {string} this.y 玩家的纵坐标
 */
  Player.prototype.handleInput = function(opreation) {
    switch (opreation) {
      case 'left':
        this.x -= 100;
        break;
      case 'right':
        this.x += 100;
        break;
      case 'up':
        this.y -= 83;
        break;
      case 'down':
        this.y += 83;
        break;
    }
  }

/**
 *  @description
 *  当玩家被敌人碰撞之后这轮游戏失败，重新回到初始位置
 *  @param {number} this.x 玩家初始位置的横坐标
 *  @param {number} this.y 玩家初始位置的纵坐标
 */
  Player.prototype.reset = function() {
    this.x = 302;
    this.y = 402;
  }

/**
 *  @description
 *  实例化所有对象
 *  把所有敌人的对象都放进一个叫 allEnemies 的数组里面
 *  把玩家对象放进一个叫 player 的变量里面
 */
let enemyOne = new Enemy(0, 62, 90),
    enemyTwo = new Enemy(0, 62, 150),
    enemyThree = new Enemy(0, 228, 100),
    enemyFour = new Enemy(0, 228, 160),
    enemyFive = new Enemy(0, 311, 110),
    enemySix = new Enemy(0, 311, 170);
let player = new Player(),
    allEnemies = [enemyOne, enemyTwo, enemyThree, enemyFour, enemyFive, enemySix];

/**
 *  @description
 *  检查每一个敌人的位置和玩家的位置,如果坐标差在一定范围内，
 *  也即位置在同一范围内，视为敌人玩家相撞，用 reset 函数将玩家位置复位
 *  @param {string} enemy.x 敌人的横坐标
 *  @param {string} enemy.y 敌人的纵坐标
 *  @param {string} player.x 玩家的横坐标
 *  @param {string} player.y 玩家的纵坐标
 */
  function checkCollisions() {
    allEnemies.forEach(function(enemy) {
      if (Math.abs(enemy.x - player.x) < 90 && Math.abs(enemy.y - player.y) < 60) {
        reset();
      }
    })
  }

/**
 *  @description 检查玩家的移动范围是否超越边界，如果超越边界，就将位置调整
 */
  function checkMoveZone() {
    if (player.x < 0) {
      player.x = 2;
    }
    if (player.x > 402) {
      player.x = 402;
    }
    if (player.y < 0) {
      player.y = 0;
    }
    if (player.y > 402) {
      player.y = 402;
    }
  }

/**
 *  @description
 *  这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
 *  键盘事件是指操作玩家运动方向的上下左右四个方向键
 */
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
