import {MovingObject} from './MovingObject.js';

export class CelestialBody extends MovingObject {
	radius;

	constructor(position, mass, radius, velocity, color = '#fff') {
		super(position, mass, velocity);
		this.radius = radius;
		this.color = color;
	}

	draw(context, camera) {
		super.draw(context, camera);
		let realPosition = this.position.getRealPosition(camera);
		context.fillStyle = this.color;
		context.beginPath();
		let adjustedRadius = this.radius / camera.scale;
		let radius = adjustedRadius > 1 ? adjustedRadius : 1;
		context.arc(realPosition.x, realPosition.y, radius, 0, 2 * Math.PI);
		context.fill();
	}

}