import {Position} from './Position.js';

export class Vector {
	start;
	x;
	y;

	constructor(x, y, start = new Position(0,0)) {
		this.x = x;
		this.y = y;
		this.start = start;
	}

	getEnd() {
		return new Position(this.start.x + this.x, this.start.y + this.y);
	}

	getLength() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	multiply(factor) {
		return new Vector(this.x * factor, this.y * factor, this.start);
	}

	normalize() {
		return this.multiply(1 / this.getLength())
	}

	add(vector) {
		return new Vector(this.x + vector.x, this.y + vector.y, this.start);
	}

	draw(context, color) {
		context.strokeStyle = color;
		context.beginPath();
		context.moveTo(this.start.x, this.start.y);
		let end = this.getEnd();
		context.lineTo(end.x, end.y);
		context.stroke();
	}
}
