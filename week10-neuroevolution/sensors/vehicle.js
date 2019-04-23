// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// The "Vehicle" class

class Vehicle {
  constructor(x, y) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(1, 0);
    this.position = createVector(x, y);
    this.r = 6;
    this.maxspeed = 2;
    this.maxforce = 0.1;

    this.sensors = [];
    for (let a = -0.5; a <= 0.5; a += 0.25) {
      this.sensors.push({
        offset: a,
        len: 150
      });
    }
  }

  // Method to update location
  update() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek(target) {
    var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force

    this.applyForce(steer);

    for (let sensor of this.sensors) {
      const a = p5.Vector.sub(target, this.position);
      const b = p5.Vector.fromAngle(sensor.offset + this.velocity.heading());
      const theta = p5.Vector.angleBetween(this.position, target);
      b.mult(a.mag() * cos(theta));
      const normal = p5.Vector.add(this.position, b);
      const d1 = p5.Vector.dist(normal, target);
      const d2 = p5.Vector.dist(target, this.position);
      if (d1 < 24 && d2 < sensor.len + 24) {
        sensor.highlight = true;
      } else {
        sensor.highlight = false;
      }
    }
  }

  display() {
    // Draw a triangle rotated in the direction of velocity
    var theta = this.velocity.heading();
    fill(255);
    stroke(255);
    strokeWeight(1);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    ellipse(0, 0, this.r);

    for (let sensor of this.sensors) {
      strokeWeight(2);
      if (sensor.highlight) {
        stroke(255, 0, 0);
      } else {
        stroke(255);
      }
      push();
      rotate(sensor.offset);
      line(0, 0, sensor.len, 0);
      pop();
    }
    pop();
  }
}
