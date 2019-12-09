import {Vector} from './Vector.js';

export class Camera {
	position;
	center;
	scale;
	minScale;
	maxScale;

	constructor(position, center, scale, minScale, maxScale) {
		this.position = position;
		this.center = center;
		this.scale = scale;
		this.minScale = minScale;
		this.maxScale = maxScale
	}

	move(x, y) {
		this.position = this.position.add(new Vector(x * this.scale, y * this.scale));
	}

	scaleScale(factor) {
		let newScale = this.scale * factor;
		if (newScale < this.maxScale && newScale > this.minScale) {
			this.scale = newScale;
		}
	}
}