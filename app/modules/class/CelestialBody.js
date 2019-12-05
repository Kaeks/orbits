import {MovingObject} from './MovingObject.js';

export class CelestialBody extends MovingObject {
	radius;

	constructor(position, mass, radius, startingVelocity) {
		super(position, mass, startingVelocity);
		this.radius = radius;
	}

	draw(context) {
		context.fillStyle = '#fff';
		context.beginPath();
		context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
		context.fill();
	}

}