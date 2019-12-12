import {AppObject} from './AppObject.js';

export class Orbit extends AppObject {
	movingObject;
	radius;
	color;

	constructor(movingObject, radius, color = '#fff') {
		super (movingObject.position);
		this.movingObject = movingObject;
		this.radius = radius;
		this.color = color;
	}

	update(mouseData) {
		super.update(mouseData);
		this.position = this.movingObject.position;
	}

	draw(context, camera) {
		super.draw(context, camera);
		context.strokeStyle = this.color;
		context.beginPath();
		let realPosition = this.position.getCanvasPosition(camera);
		let adjustedRadius = this.radius / camera.scale;
		context.arc(realPosition.x, realPosition.y, adjustedRadius, 0, 2 * Math.PI);
		context.stroke();
	}
}