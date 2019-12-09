import {StaticScreenObject} from './StaticScreenObject';

export class Meter extends StaticScreenObject {
	value;
	minValue;
	maxValue;
	width;
	height;
	vertical;
	flipped;

	constructor(position, width, height, min, max, vertical = false, flipped = false, value = min) {
		super(position);
		this.width = width;
		this.height = height;
		this.minValue = min;
		this.maxValue = max;
		this.value = value;
		this.vertical = vertical;
		this.flipped = flipped;
	}

	update(mouseData) {
		super.update(mouseData);
	}

	draw(context, cameraPosition) {
		super.draw(context, cameraPosition);
		context.fillStyle = '#fff';
		context.strokeStyle = '#f00';
		context.beginPath();
		context.moveTo(this.position.x, this.position.y);
		context.lineTo(this.position.x, this.position.y + this.height);
		context.lineTo(this.position.x + this.width, this.position.y + this.height);
		context.lineTo(this.position.x + this.width, this.position.y);
		context.closePath();
		context.fill();
	}
}