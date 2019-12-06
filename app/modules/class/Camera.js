export class Camera {
	position;
	center;
	scale;

	constructor(position, center, scale) {
		this.position = position;
		this.center = center;
		this.scale = scale;
	}

	scaleScale(factor) {
		this.scale = this.scale * factor;
	}
}