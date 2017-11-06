window.Resources = {
    get: get,
    load: load
};

var resourceCache = {};

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
            'images/water-block.png',   // 这一行是河。
            'images/stone-block.png',   // 第一行石头
            'images/stone-block.png',   // 第二行石头
            'images/stone-block.png',   // 第三行石头
            'images/grass-block.png',   // 第一行草地
            'images/grass-block.png'    // 第二行草地
        ],
        numRows = 6,
        numCols = 5,
        row, col;

    /* 便利我们上面定义的行和列，用 rowImages 数组，在各自的各个位置绘制正确的图片 */
    for (row = 0; row < numRows; row++) {
        for (col = 0; col < numCols; col++) {
          console.log(col);
            /* 这个 canvas 上下文的 drawImage 函数需要三个参数，第一个是需要绘制的图片
             * 第二个和第三个分别是起始点的x和y坐标。我们用我们事先写好的资源管理工具来获取
             * 我们需要的图片，这样我们可以享受缓存图片的好处，因为我们会反复的用到这些图片
             */
            ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
        }
    }

    // renderEntities();
}

/* 这个函数用来让开发者拿到他们已经加载的图片的引用。如果这个图片被缓存了，
 * 这个函数的作用和在那个 URL 上调用 load() 函数的作用一样。
 */

function get(url) {
    return resourceCache[url];
}

// 不用 function load(urlOrArr) 却在 window.Resources 中定义，会报 load 未定义错
function load(urlOrArray) {
  if (urlOrArray instanceof Array ) {
    urlOrArray.forEach(function (url) {
      console.log(url);
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
        resourceCache[url] = img;
        // 接下来要调用 drawImage 把图画出来
        /* 一旦我们的图片已经被加载和缓存，调用所有我们已经定义的回调函数。
         */
        // if(isReady()) {
        //     readyCallbacks.forEach(function(func) { func(); });
        // }
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
    for(var k in resourceCache) {
      // resourceCache.hasOwnProperty(k)使代码不要遍历原型,!resourceCache[k]表示图片没有加载
        if(resourceCache.hasOwnProperty(k) &&
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
// Resources.onReady(init);

/* 这个函数调用一些初始化工作，特别是设置游戏必须的 lastTime 变量，这些工作只用
 * 做一次就够了
 */
function init() {
    // reset();
    lastTime = Date.now();
    main();
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
    // update(dt);
    render();

    /* 设置我们的 lastTime 变量，它会被用来决定 main 函数下次被调用的事件。 */
    lastTime = now;

    /* 在浏览准备好调用重绘下一个帧的时候，用浏览器的 requestAnimationFrame 函数
     * 来调用这个函数
     */
    // win.requestAnimationFrame(main);
}
