
let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

canvas.width = 505;
canvas.height = 606;
document.body.appendChild(canvas);

var img = new Image();

img.onload = function () {
  console.log('loaded image');
  ctx.drawImage(img,0,0,canvas.width,canvas.height);
}

img.src = 'images/enemy-bug.png';
