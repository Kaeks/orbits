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

	/**
	 * Gets the end position of the vector
	 * @returns {Position}
	 */
	getEnd() {
		return new Position(this.start.x + this.x, this.start.y + this.y);
	}

	/**
	 * Gets the length of the vector
	 * @returns {Number}
	 */
	getLength() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	/**
	 * Multiplies the vector
	 * @param {Number} factor
	 * @returns {Vector}
	 */
	multiply(factor) {
		return new Vector(this.x * factor, this.y * factor, this.start);
	}

	/**
	 * Gets the normalized vector (length 1);
	 * @returns {Vector}
	 */
	normalize() {
		return this.multiply(1 / this.getLength())
	}

	/**
	 * Adds another vector and combines them
	 * @param {Vector} vector
	 * @returns {Vector}
	 */
	add(vector) {
		return new Vector(this.x + vector.x, this.y + vector.y, this.start);
	}
}
