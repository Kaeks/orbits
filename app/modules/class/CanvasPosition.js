import {Position} from './Position.js';
import {Vector} from './Vector.js';
import {ViewPosition} from './ViewPosition.js';

export class CanvasPosition extends Position {

	constructor(x, y) {
		super(x, y);
	}

	add(vector) {
		return super.add(vector);
	}

	/**
	 * Gets the {ViewPosition}
	 * @param {Camera} camera
	 * @returns {ViewPosition}
	 */
	getViewPosition(camera) {
		let cameraPosition = camera.position;
		let cameraCenter = camera.center;

		let position = this
			.add(new Vector(cameraCenter.x, cameraCenter.y).multiply(-1))
			.scale(camera.scale)
			.add(new Vector(cameraPosition.x, cameraPosition.y));

		return Object.assign(new ViewPosition(), position);
	}

}