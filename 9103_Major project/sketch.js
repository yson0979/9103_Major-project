/*
function setup() {
  //lets create a canvas of 400x400 pixels
  createCanvas(450, 650);
  createCanvas(464, 650);
}
 
function draw() {
  //lets set the background to black
  background(0);
  //lets set the fill to white
  fill(0, 76, 153);
  fill(0, 76, 158);
  //lets set the stroke to red
  stroke(0, 153, 153);
  //lets set the stroke weight to 5
  strokeWeight(50);
  //lets draw a rectangle at 200,200 with a width and height of 100
  rect(0, 0, 450, 650); //rect(x,y,width,height)
  rect(0, 0, 463, 650); //rect(x,y,width,height)
  //Code of background is below
  //Code of apple tree is below
  
}
*/


function setup() {
  createCanvas(464, 650);

  // Outer layer - light old green rectangle
  background(146, 157, 155); 
  noStroke();

  // Inner layer - dark blue with yellow grains and filamentous flocculent
  drawOilPainting(width, height);

  // Draw the base rectangles
  stroke(0);
  strokeWeight(2);
  fill(46, 58, 73); // Dark slate color for base
  rect(20, 495, 424, 50);  // Large base rectangle
  rect(142, 485, 180, 10); // Small top rectangle, properly placed

  // Create branches and apples
  let branches = [
  new Branch(85, 40, 90, 135),
  new Branch(90, 135, 125, 132),
  new Branch(125, 132, 123, 265),
  new Branch(123, 265, 330, 265),
  new Branch(330, 265, 328, 110),
  new Branch(328, 110, 400, 125),
  new Branch(400, 125, 400, 100),
  new Branch(232, 255, 232, 195),
  new Branch(160, 195, 275, 195),
  new Branch(180, 195, 180, 170),
  new Branch(275, 195, 275, 170),
  new Branch(232, 255, 232, 485)
  ];

  // Apply patterns to branches
  branches.forEach(branch => {
    branch.addApples(2);  // Smaller number for clearer visualization
    branch.draw();
  });

  // Draw the bottom rectangle and add apples inside it
  drawBottomRectangle();
}


function drawOilPainting(w, h) {
  //TODO: Dark blue background

   fill(83, 96, 110);
  rect(18, 18, w - 36, h - 36); // Adjusted to leave a border



  // Draw the stripe texture
   noFill(); 
   // 
  for (let i = 0; i < 2600; i++) { 
    let storkeWeight = random(0.36, 0.08)
    i % 3 ===0 ? stroke(255, 255, 255): stroke(220, 230,219 );   


    strokeWeight(storkeWeight); 

    let x1 = random(36, w - 18); 
    let y1 = random(36, h - 18); 
    let x2 = x1 + random(-50, 50); // Adjusted x position for line endpoint with more variation
    let y2 = y1 + random(-50, 50); 
    let cp1x = random(x1+10, x1 - 10); // Control point 1 x-coordinate
    let cp1y = random(y1+10, y1 - 10); 
    let cp2x = random(x2 -10, x2+10); 
    let cp2y = random(y2 - 10, y2+5); 

    bezier(x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2); // Draw a curved line to simulate filamentous flocculent texture
}

 // Draw the dot texture 

 let xDot = 20; 
 let yDot = 20; 
 fill(46, 58, 73);
 noStroke();

 for (let i = 0; i < 78; i++){
     for(let j =0; j < 112; j++){
     ellipse(xDot + i*5.5, yDot + j*5.5, 2, 2)
   }
 }
}


class Branch {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.apples = [];
  }

  draw() {
    stroke(0);
    strokeWeight(2);
    line(this.x1, this.y1, this.x2, this.y2);
  }

  addApples(numApples) {
    let distance = dist(this.x1, this.y1, this.x2, this.y2);
    let spacing = distance / (numApples + 1);
    let currentPos = spacing;

    for (let i = 0; i < numApples; i++) {
      let appleDiameter = random(20, 55); // Random diameter for visual variety
      let x = lerp(this.x1, this.x2, currentPos / distance);
      let y = lerp(this.y1, this.y2, currentPos / distance);
      let apple = new Apple(appleDiameter);
      apple.setPosition(x, y);
      apple.draw();
      this.apples.push(apple);
      currentPos += spacing;
    }
  }
}

class Apple {
  constructor(diameter) {
    this.x = 0;
    this.y = 0;
    this.diameter = diameter;
    this.color1 = color(250, 55, 30);
    this.color2 = color(30, 255, 60);
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    let gradient = drawingContext.createLinearGradient(this.x, this.y, this.x, this.y + this.diameter);
    gradient.addColorStop(0.1, this.color1.toString());
    gradient.addColorStop(0.2, this.color2.toString());
    drawingContext.fillStyle = gradient;
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}

function drawBottomRectangle() {
  fill(46, 58, 73);  // Dark slate color for the rectangle
  stroke(0);
  strokeWeight(2);
  let rectX = 142, rectY = 485, rectW = 180, rectH = 70;
  rect(rectX, rectY, rectW, rectH);  // Draw the rectangle

  // Add apples inside the rectangle with random x positions
  let numApples = 5;  // Define a fixed number of apples
  for (let i = 0; i < numApples; i++) {
    let appleDiameter = random(15, 40);  // Set a fixed diameter for visibility
    let randomX = random(rectX + appleDiameter / 2, rectX + rectW - appleDiameter / 5);
    let appleY = rectY + rectH / 2; // Center the apple vertically in the rectangle
    let apple = new Apple(appleDiameter);
    apple.setPosition(randomX, appleY);
    apple.draw();
  }
}