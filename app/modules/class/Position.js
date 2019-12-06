import {Vector} from './Vector.js';

export class Position {
	x;
	y;

	/**
	 * Constructor
	 * @param {Number} x
	 * @param {Number} y
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(vector) {
		return new Position(this.x + vector.x, this.y + vector.y);
	}

	scale(factor) {
		return new Position(this.x * factor, this.y * factor);
	}

	getRealPosition(camera) {
		let scale = camera.scale;
		let position = camera.position.scale(1 / scale);
		let center = camera.center;

		return this.scale(1 / scale).add(
			new Vector(position.x, position.y).multiply(-1)
		).add(new Vector(center.x, center.y));
	}

}
