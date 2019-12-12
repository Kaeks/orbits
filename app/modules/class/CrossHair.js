import {StaticScreenObject} from './StaticScreenObject.js';

export class CrossHair extends StaticScreenObject {
	color;
	camera;

	constructor(camera, color = '#fff') {
		super(camera.center);
		this.color = color;
	}

	update(mouseData) {
		super.update(mouseData);
	}

	draw(context, camera) {
		super.draw(context, camera);
		context.strokeStyle = this.color;
		context.moveTo(this.position.x - 5, this.position.y);
		context.lineTo(this.position.x + 5, this.position.y);
		context.moveTo(this.position.x, this.position.y - 5);
		context.lineTo(this.position.x, this.position.y + 5);
		context.stroke();
	}
}