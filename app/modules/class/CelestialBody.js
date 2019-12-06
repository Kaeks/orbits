import {MovingObject} from './MovingObject.js';

export class CelestialBody extends MovingObject {
	radius;

	constructor(position, mass, radius, startingVelocity) {
		super(position, mass, startingVelocity);
		this.radius = radius;
	}

	draw(context, camera) {
		super.draw(context, camera);
		let realPosition = this.position.getRealPosition(camera);
		context.fillStyle = '#fff';
		context.beginPath();
		let adjustedRadius = this.radius / camera.scale;
		let radius = adjustedRadius > 1 ? adjustedRadius : 1;
		context.arc(realPosition.x, realPosition.y, radius, 0, 2 * Math.PI);
		context.fill();
	}

}