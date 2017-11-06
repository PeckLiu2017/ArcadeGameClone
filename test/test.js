window.Resources = {
  get: get,
  load: load,
  onReady: onReady,
};

var resourceCache = {};
var readyCallbacks = [];

let canvas = document.createElement('canvas'),
  ctx = canvas.getContext('2d');

canvas.width = 505;
canvas.height = 606;
document.body.appendChild(canvas);

// var img = new Image();
//
// img.onload = function () {
//   console.log('loaded image');
//   ctx.drawImage(img,0,0,canvas.width,canvas.height);
// }
//
// img.src = 'images/enemy-bug.png';
// ctx.fillRect(100,100,100,100);
// ctx.strokeRect(50,50,50,50);

function render() {
  /* 这个数组保存着游戏关卡的特有的行对应的图片相对路径。 */
  var rowImages = [
      'images/water-block.png', // 这一行是河。
      'images/stone-block.png', // 第一行石头
      'images/stone-block.png', // 第二行石头
      'images/stone-block.png', // 第三行石头
      'images/grass-block.png', // 第一行草地
      'images/grass-block.png' // 第二行草地
    ],
    numRows = 6,
    numCols = 5,
    row, col;

  /* 便利我们上面定义的行和列，用 rowImages 数组，在各自的各个位置绘制正确的图片 */
  for (row = 0; row < numRows; row++) {
    for (col = 0; col < numCols; col++) {
      // console.log(col * 101);
      // console.log(row * 83);
      /* 这个 canvas 上下文的 drawImage 函数需要三个参数，第一个是需要绘制的图片
       * 第二个和第三个分别是起始点的x和y坐标。我们用我们事先写好的资源管理工具来获取
       * 我们需要的图片，这样我们可以享受缓存图片的好处，因为我们会反复的用到这些图片
       */
      //  console.log(rowImages[row]);
      ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
    }
  }
  // 绘制敌人和玩家
  renderEntities();
}

/* 这个函数会在每个时间间隙被 render 函数调用。他的目的是分别调用你在 enemy 和 player
 * 对象中定义的 render 方法。
 */
function renderEntities() {
  /* 遍历在 allEnemies 数组中存放的作于对象然后调用你事先定义的 render 函数 */
  allEnemies.forEach(function(enemy) {
    enemy.render();
  });

  player.render();
}

/* 这个函数用来让开发者拿到他们已经加载的图片的引用。如果这个图片被缓存了，
 * 这个函数的作用和在那个 URL 上调用 load() 函数的作用一样。
 */

function get(url) {
  return resourceCache[url];
}

// 不用 function load(urlOrArr) 却在 window.Resources 中定义，会报 load 未定义错
function load(urlOrArray) {
  if (urlOrArray instanceof Array) {
    urlOrArray.forEach(function(url) {
      _load(url);
    })
  } else {
    _load(urlOrArray);
  }
}

function _load(url) {
  if (resourceCache[url]) {
    return resourceCache[url];
  } else {
    var img = new Image();
    // 程序到这里先不执行 img.onload,而是直接执行下面的
    img.onload = function() {
      /* 一旦我们的图片已经被加载了，就把它放进我们的缓存，然后我们在开发者试图
       * 在未来再次加载这个图片的时候我们就可以简单的返回即可。
       */
      //  console.log(img);
      resourceCache[url] = img;
      // 接下来要调用 drawImage 把图画出来
      // ctx.drawImage(resourceCache[url], this.x, this.y);
      /* 一旦我们的图片已经被加载和缓存，调用所有我们已经定义的回调函数。
       */
      if (isReady()) {
        readyCallbacks.forEach(function(func) {
          func();
        });
      }
    };
    /* 将一开始的缓存值设置成 false 。在图片的 onload 事件回调被调用的时候会
     * 改变这个值。最后，将图片的 src 属性值设置成传进来的 URl 。
     */
    resourceCache[url] = false;
    img.src = url;
  }
}

/* 这个函数是否检查所有被请求加载的图片都已经被加载了。
 */
function isReady() {
  var ready = true;
  for (var k in resourceCache) {
    // resourceCache.hasOwnProperty(k)使代码不要遍历原型,!resourceCache[k]表示图片没有加载
    if (resourceCache.hasOwnProperty(k) &&
      !resourceCache[k]) {
      ready = false;
    }
  }
  return ready;
}

/* 紧接着我们来加载我们知道的需要来绘制我们游戏关卡的图片。然后把 init 方法设置为回调函数。
 * 那么当这些图片都已经加载完毕的时候游戏就会开始。
 */
// 执行 load 函数
Resources.load([
  'images/stone-block.png',
  'images/water-block.png',
  'images/grass-block.png',
  'images/enemy-bug.png',
  'images/char-boy.png'
]);
Resources.onReady(init);

/* 这个函数会在被请求的函数都被加载了这个事件的回调函数栈里面增加一个函数。*/
function onReady(func) {
  readyCallbacks.push(func);
}

/* 这个函数调用一些初始化工作，特别是设置游戏必须的 lastTime 变量，这些工作只用
 * 做一次就够了
 */
function init() {
  reset();
  lastTime = Date.now();
  main();
}

/* 这个函数现在没干任何事，但是这会是一个好地方让你来处理游戏重置的逻辑。可能是一个
 * 从新开始游戏的按钮，也可以是一个游戏结束的画面，或者其它类似的设计。它只会被 init()
 * 函数调用一次。
 */
function reset() {
    player.reset();
}


/* 这个函数是整个游戏的主入口，负责适当的调用 update / render 函数 */
function main() {
  /* 如果你想要更平滑的动画过度就需要获取时间间隙。因为每个人的电脑处理指令的
   * 速度是不一样的，我们需要一个对每个人都一样的常数（而不管他们的电脑有多快）
   * 就问你屌不屌！
   */
  var now = Date.now(),
    dt = (now - lastTime) / 1000.0;

  /* 调用我们的 update / render 函数， 传递事件间隙给 update 函数因为这样
   * 可以使动画更加顺畅。
   */
  // 这里是先调整位置然后再重新 render 绘图
  update(dt);
  // 绘制草地石路和河流
  render();
  // console.log('111');
  // e1 = new Enemy(0,62,Math.random()*200);
  // e2 = new Enemy(0,145,Math.random()*200);
  // e3 = new Enemy(0,228,Math.random()*200);
  // allEnemies = [e1,e2,e3];
  /* 设置我们的 lastTime 变量，它会被用来决定 main 函数下次被调用的事件。 */
  lastTime = now;

  /* 在浏览准备好调用重绘下一个帧的时候，用浏览器的 requestAnimationFrame 函数
   * 来调用这个函数
   */
  // 这个函数不停地重新绘制页面
  window.requestAnimationFrame(main);
}

/* 这个函数被 main 函数（我们的游戏主循环）调用，它本身调用所有的需要更新游戏角色
 * 数据的函数，取决于你怎样实现碰撞检测（意思是如何检测两个角色占据了同一个位置，
 * 比如你的角色死的时候），你可能需要在这里调用一个额外的函数。现在我们已经把这里
 * 注释了，你可以在这里实现，也可以在 app.js 对应的角色类里面实现。
 */
function update(dt) {
  updateEntities(dt);
  checkCollisions();
  checkMoveZone();
  checkGameWin();
}

function checkCollisions() {
  allEnemies.forEach(function (enemy) {
    // console.log(enemy.x);
    // console.log(player.x);
    if(Math.abs(enemy.x - player.x) < 90 && Math.abs(enemy.y - player.y) < 60){
      // 碰撞后游戏重新开始
      // console.log('1111');
      reset();
    }
  })
}

function checkMoveZone() {
  if (player.x < 0) {
    player.x = 2;
    player.y = 402;
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

function checkGameWin() {
  if (player.y < 62) {
    setTimeout(function () {
      console.log('win');
      reset();
    },1000)
  }
}

/* 这个函数会遍历在 app.js 定义的存放所有敌人实例的数组，并且调用他们的 update()
 * 函数，然后，它会调用玩家对象的 update 方法，最后这个函数被 update 函数调用。
 * 这些更新函数应该只聚焦于更新和对象相关的数据/属性。把重绘的工作交给 render 函数。
 */
function updateEntities(dt) {
  // 绘制出敌人
  allEnemies.forEach(function(enemy) {
    enemy.update(dt);
  });
  // player.update();
}


// 这是我们的玩家要躲避的敌人
let Enemy = function(x,y,speed) {
  // 要应用到每个敌人的实例的变量写在这里
  // 我们已经提供了一个来帮助你实现更多
  this.x = x;
  this.y = y;
  this.speed = speed;
  // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
  this.sprite = 'images/enemy-bug.png';
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
  // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
  // 都是以同样的速度运行的
  // console.log(this);
  this.x += this.speed * dt;
  // this.render();
  this.endlessEnemy();
  return this.x;
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
  // console.log('1111');
  // console.log(Resources.get(this.sprite));
  // console.log(this.x);
  // this.x += 10;
  // this.y += 0;
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.endlessEnemy = function () {
  if (this.x > 400) {
    this.x = -100;
  }
}

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
let Player = function () {
  this.x = 302;
  this.y = 402;
  this.player = 'images/char-boy.png';
}

Player.prototype.update = function () {

}

Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.player),this.x,this.y)
}

Player.prototype.handleInput = function (opreation) {
  if (opreation == 'left') {
    this.x -= 100;
  } else if (opreation == 'right') {
    this.x += 100;
  } else if (opreation == 'up') {
    this.y -= 83;
  } else if (opreation == 'down') {
    this.y += 83;
  }
}

Player.prototype.reset = function () {
  this.x = 302;
  this.y = 402;
  // ctx.drawImage(Resources.get(this.player),302,402);
}


// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
// let e1 = new Enemy(0,62,Math.random()*200);
// let e2 = new Enemy(0,145,Math.random()*200);
// let e3 = new Enemy(0,228,Math.random()*200);
let e1 = new Enemy(0,62,150),
    e2 = new Enemy(0,145,250),
    e3 = new Enemy(0,228,200),
    player = new Player();
// console.log(e1);
allEnemies = [e1,e2,e3];


// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  // console.log(allowedKeys[e.keyCode]);
  player.handleInput(allowedKeys[e.keyCode] || allowedKeys[e.which]);
});
