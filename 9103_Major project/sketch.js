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
    branch.addApples(12);  // Smaller number for clearer visualization
    branch.draw();
  });

  // Draw the bottom rectangle and add apples inside it
  drawBottomRectangle();
}

function drawOilPainting(w, h) {
  fill(83, 96, 110);
  rect(18, 18, w - 36, h - 36); // Adjusted to leave a border

  noFill();
  for (let i = 0; i < 2600; i++) {
    let strokeWeightValue = random(0.36, 0.08);
    stroke(i % 3 === 0 ? 255 : 220, 230, 219);
    strokeWeight(strokeWeightValue);

    let x1 = random(36, w - 18); 
    let y1 = random(36, h - 18); 
    let x2 = x1 + random(-50, 50); 
    let y2 = y1 + random(-50, 50); 
    let cp1x = random(x1 + 10, x1 - 10); 
    let cp1y = random(y1 + 10, y1 - 10); 
    let cp2x = random(x2 - 10, x2 + 10); 
    let cp2y = random(y2 - 10, y2 + 5); 

    bezier(x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2); 
  }

  fill(46, 58, 73);
  noStroke();
  for (let i = 0; i < 78; i++) {
    for (let j = 0; j < 112; j++) {
      ellipse(20 + i * 5.5, 20 + j * 5.5, 2, 2);
    }
  }
}

// Defines the Branch class which manages the drawing of branches and apples on them
class Branch {
  // Constructor initializes a branch with its start and end coordinates
  constructor(x1, y1, x2, y2) {
    this.x1 = x1; // Starting x-coordinate
    this.y1 = y1; // Starting y-coordinate
    this.x2 = x2; // Ending x-coordinate
    this.y2 = y2; // Ending y-coordinate
    this.apples = []; // Array to hold Apple objects on this branch
  }

  // Draws the branch as a line from its start to end points
  draw() {
    stroke(0); // Set the line color to black
    strokeWeight(1); // Set the line thickness to 2 pixels
    line(this.x1, this.y1, this.x2, this.y2); // Draw the line representing the branch
  }

  // Adds a specified number of apples along the branch
  addApples(numApples) {
    // Calculate spacing between apples along the branch based on the number of apples
    let spacing = this.calculateSpacing(numApples);
    // Temporary variable for attempt count in positioning apples
    let attempts, maxAttempts = 100;

    for (let i = 0; i < numApples; i++) {
      // Randomly determine the diameter for each apple
      let appleDiameter = random(20, 85);
      let apple = new Apple(appleDiameter);
      attempts = 0; // Reset attempts for each apple

      // Position apples ensuring they do not overlap
      do {
        // Calculate parameter t for linear interpolation along the branch
        let t = (spacing * (i + 3)) / dist(this.x1, this.y1, this.x2, this.y2);
        // Set apple position using linear interpolation of branch coordinates
        apple.setPosition(lerp(this.x1, this.x2, t), lerp(this.y1, this.y2, t));

        // Limit the number of attempts to position each apple to prevent infinite loops
        if (attempts++ > maxAttempts) {
          break;
        }
      } while (this.apples.some(a => applesOverlap(a, apple))); // Check for overlapping apples

      // If positioned successfully, draw and store the apple
      if (attempts <= maxAttempts) {
        apple.draw();
        this.apples.push(apple);
      }
    }
  }

  // Calculates the distance-based spacing between apples on the branch
  calculateSpacing(numApples) {
    return dist(this.x1, this.y1, this.x2, this.y2) / (numApples + 1);
  }
}


// Defines a function to check if two apples overlap
function applesOverlap(apple1, apple2) {
  // Calculate the distance between the centers of two apples
  let distance = dist(apple1.x, apple1.y, apple2.x, apple2.y);
  // Return true if the distance is less than the sum of their radii (i.e., they overlap)
  return distance < (apple1.diameter / 2 + apple2.diameter / 2);
}

// Apple class defines the properties and methods for creating and drawing apples
class Apple {
  constructor(diameter) {
    this.x = 0;  // x-coordinate of the apple's center
    this.y = 0;  // y-coordinate of the apple's center
    this.diameter = diameter;  // Diameter of the apple
    this.color1 = color(191, 16, 41);  // Color gradient start - dark red
    this.color2 = color(5, 101, 23);  // Color gradient end - dark green
  }

  // Set the position of the apple
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  // Draw the apple with a gradient
  draw() {
    // Create a linear gradient for the apple's fill
    let gradient = drawingContext.createLinearGradient(this.x, this.y, this.x, this.y + this.diameter / 10);
    gradient.addColorStop(0.1, this.color1.toString());  // Start of gradient
    gradient.addColorStop(0.2, this.color2.toString());  // End of gradient
    drawingContext.fillStyle = gradient;
    // Draw the apple as an ellipse with the defined gradient
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}

// Function to draw and manage apples within the rectangle at the bottom of the canvas
function drawBottomRectangle() {
  fill(46, 58, 73);  // Set the fill color to dark slate for the rectangle
  stroke(0);  // Set the stroke color to black
  strokeWeight(2);  // Set the stroke thickness to 2
  let rectX = 142, rectY = 485, rectW = 180, rectH = 70;  // Dimensions and position of the rectangle
  rect(rectX, rectY, rectW, rectH);  // Draw the rectangle

  // Array to store apples to ensure they do not overlap
  let apples = [];
  // Attempt to place 5 apples within the rectangle
  for (let i = 0; i < 5; i++) {
    let appleDiameter = random(15, 70);  // Randomly determine the diameter of the apple
    let apple = new Apple(appleDiameter);  // Create a new Apple instance
    let attempts = 0, maxAttempts = 100;  // Limit the number of placement attempts to avoid infinite loops

    // Try to place the apple within the rectangle without overlapping with others
    do {
      let randomX = random(rectX + appleDiameter / 2, rectX + rectW - appleDiameter / 2);  // Random x position within the rectangle
      apple.setPosition(randomX, rectY + rectH / 2);  // Set the apple's position

      // Increment attempts and break if maximum attempts are reached
      if (attempts++ > maxAttempts) {
        break;
      }
    } while (apples.some(a => applesOverlap(a, apple)));  // Check if the newly placed apple overlaps with any existing ones

    // If the apple is successfully placed without overlapping, draw it and add it to the list
    if (attempts <= maxAttempts) {
      apple.draw();
      apples.push(apple);
    }
  }
}
