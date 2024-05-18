/*
function setup() {
  //lets create a canvas of 400x400 pixels
  createCanvas(464, 650);
}
 
function draw() {
  //lets set the background to black
  background(0);
  //lets set the fill to white
  fill(0, 76, 158);
  //lets set the stroke to red
  stroke(0, 153, 153);
  //lets set the stroke weight to 5
  strokeWeight(50);
  //lets draw a rectangle at 200,200 with a width and height of 100
  rect(0, 0, 463, 650); //rect(x,y,width,height)

  //Code of background is below

  //Code of apple tree is below
  
}
*/


function setup() {
  createCanvas(464, 650);
  noLoop(); // Stops the draw function from continuously looping
}

  function draw() {  
  // Outer layer - light old green rectangle
  background(146, 157, 155); 
  noStroke();
  
  // Inner layer - dark blue with yellow grains and filamentous flocculent
  drawOilPainting(width, height); 

  // Draw the tree at the center bottom of the inner rectangle
  drawTree(230, 514, 100, 90);  // Adjust x, y to ensure the tree is entirely visible
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
    i % 3 ===0 ? stroke(255, 255, 255): stroke(220, 230, 219);   

    
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
 /*
 for (let i = 0; i < 1000; i++){
  fill(255, 255, 102); // Yellow grains color
 
    let x = random(10, w - 10); // Random x position within inner layer
    let y = random(10, h - 10); // Random y position within inner layer
    ellipse(x, y, 2, 2); // Draw a small ellipse to simulate grains
}
*/ 


function drawTree(x, y, size, angle) {
  if (size < 10) return; // Stop if the branch size is too small

  let newX = x - size * cos(radians(angle));
  let newY = y - size * sin(radians(angle));

  strokeWeight(map(size, 10, 80, 1, 8));
  stroke(85, 53, 10);
  line(x, y, newX, newY);

  drawTree(newX, newY, size * 0.7, angle - 55);
  drawTree(newX, newY, size * 0.7, angle + 55);

  if (size < 20) {
    fill(255, 0, 0);
    noStroke();
    ellipse(newX, newY, 10, 10);
  }
}