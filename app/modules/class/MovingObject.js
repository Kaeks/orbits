import {AppObject} from './AppObject.js';
import {Vector} from './Vector.js';

export class MovingObject extends AppObject {
	velocity;
	mass;

	constructor(position, mass, startingVelocity) {
		super(position);
		this.mass = mass;
		this.velocity = startingVelocity || new Vector(0, 0, this.position);
	}

	moveTo(position) {
		super.moveTo(position);
		this.velocity.start = position;
	}

	/**
	 * Applies a force to this object
	 * @param {Number} force
	 * @param {Vector} directionVector
	 */
	applyForce(force, directionVector) {
		let accelerationVector = directionVector.multiply(force / this.mass);
		this.applyAcceleration(accelerationVector)
	}

	applyAcceleration(vector) {
		this.velocity = this.velocity.add(vector);
		//console.log('Velocity is now x:' + this.velocity.x + ', y:' + this.velocity.y);
	}

	applyVelocity() {
		this.moveTo(this.position.add(this.velocity));
	}

	update(mouseData) {
		super.update(mouseData);
		this.applyVelocity();
	}

	draw(context, camera) {
		super.draw(context, camera);
		//this.velocity.multiply(10).draw(context, '#f00');
	}
}
