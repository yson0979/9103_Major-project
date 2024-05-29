function setup() {
  createCanvas(464, 649);
  background(146, 157, 155); // Outer layer color
  noStroke();

  drawOilPainting(width, height); // Inner layer

  // Base rectangle
  stroke(0);
  strokeWeight(1);
  fill(95, 142, 105);
  rect(20, 495, 424, 50);
  
  // Create and draw branches with apples
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
  branches.forEach(branch => {
    branch.addApples(12);
    branch.draw();
  });

  drawBottomRectangle();
  drawApplesBelowY(600); // Draw apples below y = 400
}

// Function to randomly place apples below a certain y-axis value
function drawApplesBelowY(minY) {
  const numApples = floor(random(3, 5)); // Random number of apples, 3 to 5
  let apples = [];

  for (let i = 0; i < numApples; i++) {
    let appleDiameter = random(20, 85);
    let apple = new Apple(appleDiameter);
    let attempts = 0, maxAttempts = 100;

    do {
      let x = random(appleDiameter / 2, width - appleDiameter / 2);
      let y = random(minY, height - appleDiameter / 2);
      apple.setPosition(x, y);

      let overlapping = apples.some(a => dist(a.x, a.y, apple.x, apple.y) < (a.diameter / 2 + apple.diameter / 2));
      if (!overlapping) {
        apple.draw();
        apples.push(apple);
        break;
      }
      attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      console.log("Failed to place all apples without overlap");
    }
  }
}

function drawOilPainting(w, h) {
  fill(83, 96, 110);
  rect(18, 18, w - 36, h - 36);

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
    strokeWeight(2); // Set the line thickness to 2 pixels
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

  // Added method to get the average position and a representative diameter for shadow casting
  getShadowCastingProperties() {
    return {
      x: (this.x1 + this.x2) / 2,
      y: (this.y1 + this.y2) / 2,
      diameter: 10 // Assumed diameter value
    };
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
    this.color1 = color(251, 88, 87);  // Color gradient start - dark red
    this.color2 = color(135, 173, 128);  // Color gradient end - dark green
  }

  // Set the position of the apple
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  // Draw the apple with split colors
  draw() {
    // Decide the split direction
    if (random() < 0.5) {
      // Split horizontally
      fill(this.color1);
      arc(this.x, this.y, this.diameter, this.diameter, PI, TWO_PI);
      fill(this.color2);
      arc(this.x, this.y, this.diameter, this.diameter, 0, PI);
    } else {
      // Split vertically
      fill(this.color1);
      arc(this.x, this.y, this.diameter, this.diameter, -HALF_PI, HALF_PI);
      fill(this.color2);
      arc(this.x, this.y, this.diameter, this.diameter, HALF_PI, -HALF_PI);
    }
  }

}

// Function to draw and manage apples within the rectangle at the bottom of the canvas
function drawBottomRectangle() {
  fill(46, 58, 73);  // Set the fill color to dark slate for the rectangle
  stroke(0);  // Set the stroke color to black
  strokeWeight(1);  // Set the stroke thickness to 2
  let rectX = 120, rectY = 485, rectW = 220, rectH = 50;  // Dimensions and position of the rectangle
  fill(230, 197, 116)
  rect(rectX, rectY, rectW, rectH);  // Draw the rectangle

  // Array to store apples to ensure they do not overlap
  let apples = [];
  // Attempt to place 5 apples within the rectangle
  for (let i = 0; i < 10; i++) {
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