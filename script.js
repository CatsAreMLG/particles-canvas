const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables
const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};
const click = {
  cx: innerWidth / 2,
  cy: innerHeight / 2
};
let maxRadius = 30;
let minRadius = 5;
let maxDist = 80;
const gravity = 0.5;
const damping = 0.8;
const traction = 0.99;
const colors = ["#43676B", "#EE836F", "#00A3AF", "#DCD3B2", "#DCCB18"];
// Event Listeners
window.addEventListener("mousemove", e => {
  mouse.x = e.x;
  mouse.y = e.y;
});
window.addEventListener("click", e => {
  click.cx = e.x;
  click.cy = e.y;
  clickEvent(click.cx, click.cy);
});
window.addEventListener("resize", _ => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});
// Utility Functions
const randomIntFromRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = c => c[Math.round(Math.random() * c.length)];

// Code
//--------------------------------------------------------------------------------
// Objects
function Circle(x, y, dx, dy, radius, color) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.minRadius = radius;
  this.color = color;

  this.draw = _ => {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    c.fillStyle = color;
    c.fill();
    c.closePath();
  };
  this.drawLine = (a, b) => {
    c.beginPath();
    c.lineTo(a["x"], a["y"]);
    c.lineTo(b["x"], b["y"]);
    c.strokeStyle = color;
    c.stroke();
    c.closePath();
  };

  this.update = _ => {
    if (this.x >= innerWidth - this.radius) {
      // this.dx *= -damping;
      this.dx *= -1;
      this.x = innerWidth - this.radius;
    } else if (this.x <= 0 + this.radius) {
      // this.dx *= -damping;
      this.dx *= -1;
      this.x = this.radius;
    }
    if (this.y >= innerHeight - this.radius) {
      // this.dy *= -damping;
      this.dy *= -1;
      this.y = innerHeight - this.radius;
      // this.dx *= traction;
    } else if (this.y <= 0 + this.radius) {
      // this.dy *= -damping;
      this.dy *= -1;
      this.y = this.radius;
    }

    // this.dy += gravity;
    this.x += this.dx;
    this.y += this.dy;

    if (
      this.x - mouse.x <= maxDist &&
      this.x - mouse.x >= -maxDist &&
      this.y - mouse.y <= maxDist &&
      this.y - mouse.y >= -maxDist
    ) {
      this.drawLine(this, mouse);
    }

    this.draw();
  };
}

const clickEvent = (cx, cy) => {
  let radius = Math.random() * 10 + 5;
  let dx = Math.random() - 0.5;
  let dy = Math.random() - 0.5;
  // let dy = 0;
  let x = cx;
  let y = cy;
  circleArray.push(new Circle(x, y, dx, dy, radius, randomColor(colors)));
};

let circleArray = [];
const init = _ => {
  maxDist = 150;
  if (innerWidth < 800) {
    maxDist = 90;
  } else if (innerWidth < 1300) {
    maxDist = 120;
  }
  circleArray = [];
  for (let i = 0; i < innerWidth / 15 + 50; i++) {
    let radius = Math.random() * 10 + 5;
    let dx = Math.random() - 0.5;
    let dy = Math.random() - 0.5;
    // let dy = 0;
    let x = Math.random() * (innerWidth - radius * 2) + radius;
    let y = Math.random() * (innerHeight - radius * 2) + radius;
    circleArray.push(new Circle(x, y, dx, dy, radius, randomColor(colors)));
  }
};

//--------------------------------------------------------------------------------
// Animate

const animate = _ => {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  for (i in circleArray) {
    circleArray[i].update();
  }
  for (let j = 0; j < circleArray.length - 1; j++) {
    for (let i = 0; i < circleArray.length - 1; i++) {
      if (
        circleArray[j]["x"] - circleArray[i]["x"] <= maxDist &&
        circleArray[j]["x"] - circleArray[i]["x"] >= -maxDist &&
        circleArray[j]["y"] - circleArray[i]["y"] <= maxDist &&
        circleArray[j]["y"] - circleArray[i]["y"] >= -maxDist
      ) {
        circleArray[j].drawLine(circleArray[j], circleArray[i]);
      }
    }
  }
};
init();
animate();
