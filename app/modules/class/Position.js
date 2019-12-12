export class Position {
	x;
	y;

	/**
	 * Constructor
	 * @param {Number} x
	 * @param {Number} y
	 */
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
	add(vector) {
		return new this.constructor(this.x + vector.x, this.y + vector.y);
	}
	scale(factor) {
		return new this.constructor(this.x * factor, this.y * factor);
	}

}
