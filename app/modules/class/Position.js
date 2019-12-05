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

}
